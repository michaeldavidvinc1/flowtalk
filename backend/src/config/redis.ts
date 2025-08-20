import {createClient} from "redis";
import config from "./config";

const redisClient = createClient({
    url: config.redis_url
})

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
    await redisClient.connect();
    console.log("✅ Connected to Redis Cloud");
})();

export default redisClient;