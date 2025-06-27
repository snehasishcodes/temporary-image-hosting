import Redis from "ioredis";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") dotenv.config();

const redisClient = new Redis({
    host: process.env.UPSTASH_REDIS_HOST,
    port: Number(process.env.UPSTASH_REDIS_PORT),
    password: process.env.UPSTASH_REDIS_PASSWORD,
    tls: {}, // TLS enabled - empty object only.
});

export default redisClient;