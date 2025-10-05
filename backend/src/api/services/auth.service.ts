import ApiError from "../../utils/apiError";
import { AuthValidation } from "../../validation/auth.validation";
import { Validation } from "../../validation/validation";
import { TokenService } from "./token.service";
import bcrypt from "bcryptjs";
import {AuthResponse, ILoginRequest, IRegisterRequest} from "../../interface/auth.interface";
import {HTTP_CONFLICT, HTTP_FORBIDDEN, HTTP_NOT_FOUND, HTTP_UNAUTHORIZED} from "../../constant/data";
import {UserRepositoryImpl} from "../repository/impl/user.repository.impl";
import moment from "moment";
import {RedisService} from "./redis.service";
import {TokenType} from "@prisma/client";

export class AuthService {

    constructor(
        private userRepository: UserRepositoryImpl,
        private tokenService: TokenService,
        private redisService: RedisService
    ) {}

    async login(req: ILoginRequest): Promise<AuthResponse> {
        const loginRequest = Validation.validate(AuthValidation.LOGIN, req);

        const user = await this.userRepository.getUserByEmail(loginRequest.email);

        if (!user) {
            throw new ApiError(HTTP_FORBIDDEN, "Incorrect email or password");
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

        if (!isPasswordValid) {
            throw new ApiError(HTTP_FORBIDDEN, "Incorrect email or password");
        }

        const tokenAccess = await this.tokenService.generateAccessToken(user.id);

        const tokenRefresh = await this.tokenService.generateRefreshToken(user.id);

        await this.redisService.saveToken(
            user.id,
            tokenAccess.token,
            tokenAccess.expires,
            TokenType.ACCESS
        );

        await this.redisService.saveToken(
            user.id,
            tokenRefresh.token,
            tokenRefresh.expires,
            TokenType.REFRESH
        );

        return {
            user,
            tokens: {
                access: tokenAccess,
                refresh: tokenRefresh,
            }
        };
    }

    async register(req: IRegisterRequest): Promise<AuthResponse> {
        const registerRequest = Validation.validate(AuthValidation.REGISTER, req);

        const checkUser = await this.userRepository.getUserByEmail(registerRequest.email);

        if (checkUser) {
            throw new ApiError(HTTP_CONFLICT, "Email already exists!");
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10);
        registerRequest.avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(registerRequest.name)}&background=random`;

        const user = await this.userRepository.createUser(registerRequest);

        const tokenAccess = await this.tokenService.generateAccessToken(user.id);
        const tokenRefresh = await this.tokenService.generateRefreshToken(user.id);

        await this.redisService.saveToken(
            user.id,
            tokenAccess.token,
            tokenAccess.expires,
            TokenType.ACCESS
        );

        await this.redisService.saveToken(
            user.id,
            tokenRefresh.token,
            tokenRefresh.expires,
            TokenType.REFRESH
        );

        return {
            user,
            tokens: {
                access: tokenAccess,
                refresh: tokenRefresh,
            }
        };
    }

    async refreshToken(userId: string, refreshToken: string): Promise<AuthResponse> {

        const checkUser = await this.userRepository.getUserById(userId);

        if(!checkUser){
            throw new ApiError(HTTP_NOT_FOUND, "User not found");
        }

        const checkToken = await this.redisService.isTokenValid(userId, refreshToken, TokenType.REFRESH);

        if(!checkToken){
            throw new ApiError(HTTP_NOT_FOUND, "Token not found");
        }

        await this.redisService.deleteToken(userId, TokenType.REFRESH);
        await this.redisService.deleteToken(userId, TokenType.ACCESS);

        const tokenAccess = await this.tokenService.generateAccessToken(userId);
        const tokenRefresh = await this.tokenService.generateRefreshToken(userId);

        return {
            user: {
                id: checkUser.id,
                name: checkUser.name,
                email: checkUser.email,
            },
            tokens: {
                access: tokenAccess,
                refresh: tokenRefresh,
            }
        };

    }

}
