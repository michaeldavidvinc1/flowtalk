import {createClient} from "redis";
import config from "./config";

let redisClient: ReturnType<typeof createClient> | null = null;

export const getRedisClient = async () => {
    if (!redisClient) {
        redisClient = createClient({
            url: config.redis_url,
        });

        redisClient.on("error", (err) => console.error("❌ Redis Client Error", err));

        await redisClient.connect();
        console.log("✅ Connected to Redis Cloud");
    }
    return redisClient;
};