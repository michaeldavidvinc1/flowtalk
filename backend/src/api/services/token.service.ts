import moment from "moment";
import jwt, {JwtPayload} from "jsonwebtoken";
import config from "../../config/config";
import {GenerateToken, TokenResponse} from "../../interface/tokenInterface";
import {TokenType} from "@prisma/client";

export class TokenService {

  async generateToken({ userId, expires, type, secret }: GenerateToken): Promise<string> {
    const payload: JwtPayload = {
      sub: userId,
      iat: moment().unix(),
      exp: Math.floor(expires.getTime() / 1000),
      type,
    };
    return jwt.sign(payload, secret);
  }


  async generateAccessToken(userId: string): Promise<TokenResponse> {
    const accessTokenExpire = moment().add(config.jwt_expire, "days");
    const accessToken = await this.generateToken({
      userId,
      expires: accessTokenExpire.toDate(),
      type: TokenType.ACCESS,
      secret: config.jwt_secret,
    });

    return {
      token: accessToken, expires: accessTokenExpire.toDate()
    };
  }

  async generateRefreshToken(userId: string): Promise<TokenResponse> {
    const refreshTokenExpires = moment().add(config.jwt_refresh_expire, "days");
    const refreshToken = await this.generateToken({
      userId,
      expires: refreshTokenExpires.toDate(),
      type: TokenType.REFRESH,
      secret: config.jwt_secret,
    });

    return {
      token: refreshToken, expires: refreshTokenExpires.toDate()
    }
  }
}
