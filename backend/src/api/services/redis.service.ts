import {getRedisClient} from "../../config/redis";
import {TokenType} from "@prisma/client";
import {logger} from "../../config/logger";

export class RedisService {

    async saveToken(userId: string, token: string, expiresIn: Date, typeToken: TokenType) {
        try {
            const client = await getRedisClient();
            const ttl = Math.floor((expiresIn.getTime() - Date.now()) / 1000);
            console.log(ttl, "ttl")
            if (ttl <= 0) {
                throw new Error(`TTL expired for ${typeToken} token user ${userId}`);
            }

            const key = `jwt:${userId}:${typeToken}`;

            const payload = JSON.stringify({
                token,
                typeToken,
                expiresAt: expiresIn.getTime(),
            });

            await client.setEx(key, ttl, payload);

            logger.info("%s token saved for user %s with TTL %ds", typeToken, userId, ttl);
        } catch (err) {
            logger.error("Failed to save %s token for user %s: %o", typeToken, userId, err);
            throw err;
        }
    }

    async isTokenValid(userId: string, token: string, typeToken: TokenType){
        const client = await getRedisClient();
        const stored = await client.get(`jwt:${userId}:${typeToken}`);
        if (!stored) return false;

        const parsed = JSON.parse(stored) as { token: string; typeToken: TokenType; expiresAt: number };
        return parsed.token === token;
    }

    async deleteToken(userId: string, typeToken: TokenType) {
        try {
            const client = await getRedisClient();
            const result = await client.del(`jwt:${userId}:${typeToken}`);

            if (result > 0) {
                logger.info("%s token deleted for user %s", typeToken, userId);
            } else {
                logger.warn("No %s token found to delete for user %s", typeToken, userId);
            }
        } catch (err) {
            logger.error("Failed to delete %s token for user %s: %o", typeToken, userId, err);
            throw err;
        }
    }
}