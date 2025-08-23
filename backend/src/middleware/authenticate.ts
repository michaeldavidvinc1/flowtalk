import {NextFunction, Request, Response} from "express";
import ApiError from "../utils/apiError";
import {HTTP_NOT_FOUND, HTTP_UNAUTHORIZED} from "../constant/data";
import jwt, {JwtPayload} from "jsonwebtoken";
import config from "../config/config";
import {TokenType} from "@prisma/client";
import {UserRepository} from "../api/repository/user.repository";
import {logger} from "../config/logger";
import {RedisService} from "../api/services/redis.service";

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const redisService = new RedisService();
    const userRepository = new UserRepository();

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) {
        return next(new ApiError(HTTP_NOT_FOUND, "Access token missing!"));
    }

    try {
        // verifikasi signature & expired date JWT
        const decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload;

        // cek apakah token ini ada di Redis & masih valid
        const isValid = await redisService.isTokenValid(decoded.userId, token, TokenType.ACCESS);
        if (!isValid) {
            return next(new ApiError(HTTP_NOT_FOUND, "Invalid or revoked access token!"));
        }

        // pastikan user masih ada di DB
        const user = await userRepository.getUserById(decoded.userId);
        if (!user) {
            await redisService.deleteToken(decoded.userId, TokenType.ACCESS);
            return next(new ApiError(HTTP_NOT_FOUND, "User not found!"));
        }

        // simpan user ke request biar bisa dipakai di controller
        (req as any).user = user;

        return next();
    } catch (error: any) {
        if (error instanceof jwt.TokenExpiredError) {
            logger.warn("Expired access token attempt: %s", token);
            return next(new ApiError(HTTP_UNAUTHORIZED, "Access token expired!"));
        }

        if (error instanceof jwt.JsonWebTokenError) {
            logger.warn("Invalid access token attempt: %s", token);
            return next(new ApiError(HTTP_UNAUTHORIZED, "Invalid access token!"));
        }

        logger.error("Authentication failed: %o", error);
        return next(new ApiError(HTTP_UNAUTHORIZED, "Unauthorized access!"));
    }
};

export default authenticate;