import ApiError from "../../utils/apiError";
import { AuthValidation } from "../../validation/auth.validation";
import { Validation } from "../../validation/validation";
import { TokenService } from "./token.service";
import {AuthResponse, ILoginRequest, IRegisterRequest} from "../../interface/auth.interface";
import {HTTP_CONFLICT, HTTP_FORBIDDEN, HTTP_NOT_FOUND} from "../../constant/data";
import {UserRepositoryImpl} from "../repository/impl/user.repository.impl";
import {RedisService} from "./redis.service";
import {TokenType} from "@prisma/client";
import {UserEntity} from "../../entity/user.entity";
import {logger} from "../../config/logger";

export class AuthService {

    constructor(
        private userRepository: UserRepositoryImpl,
        private tokenService: TokenService,
        private redisService: RedisService,
        private userEntity: UserEntity
    ) {}

    async login(req: ILoginRequest): Promise<AuthResponse> {
        logger.info(`[AuthService] Login Start`);
        const loginRequest = Validation.validate(AuthValidation.LOGIN, req);

        const user = await this.userRepository.getUserByEmail(loginRequest.email);

        if (!user) {
            throw new ApiError(HTTP_FORBIDDEN, "Incorrect email or password");
        }

        const isPasswordValid = this.userEntity.verifyPassword(loginRequest.password);

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
        logger.info(`[AuthService] Login End`);
        return {
            user,
            tokens: {
                access: tokenAccess,
                refresh: tokenRefresh,
            }
        };
    }

    async register(req: IRegisterRequest): Promise<AuthResponse> {
        logger.info(`[AuthService] Register Start`);
        const registerRequest = Validation.validate(AuthValidation.REGISTER, req);

        const checkUser = await this.userRepository.getUserByEmail(registerRequest.email);

        if (checkUser) {
            throw new ApiError(HTTP_CONFLICT, "Email already exists!");
        }

        registerRequest.password = await this.userEntity.hashPassword(registerRequest.password);
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

        logger.info(`[AuthService] Register End`);
        return {
            user,
            tokens: {
                access: tokenAccess,
                refresh: tokenRefresh,
            }
        };
    }

    async refreshToken(userId: string, refreshToken: string): Promise<AuthResponse> {
        logger.info(`[AuthService] Refresh Token Start`);
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

        logger.info(`[AuthService] Refresh Token End`);
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
