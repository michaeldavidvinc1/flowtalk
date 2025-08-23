import express from "express";
import {userRouter} from "./users.route";
import {AuthController} from "../controller/auth.controller";
import {AuthService} from "../services/auth.service";
import {UserRepository} from "../repository/user.repository";
import {TokenService} from "../services/token.service";
import rateLimiter from "../../middleware/rate.limiter";
import {RedisService} from "../services/redis.service";

export const authRouter = express.Router();

const userRepository = new UserRepository();
const tokenService = new TokenService()
const redisService = new RedisService()
const authService = new AuthService(userRepository, tokenService, redisService)
const authController = new AuthController(authService)

authRouter.post("/login", rateLimiter, authController.login);
authRouter.post("/register", rateLimiter, authController.register);
// authRouter.post("/refresh-token", rateLimiter, authController.refreshToken);