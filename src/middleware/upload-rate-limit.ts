import { NextFunction, Request, Response } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import redisClient from "../redis";

// 1 req per minute
const limiterPerMinute = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'upload_minute',
    points: 1,
    duration: 60,
});

// 10 reqs per hour
const limiterPerHour = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'upload_hour',
    points: 10,
    duration: 60 * 60,
});

// 100 reqs per day
const limiterPerDay = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'upload_day',
    points: 100,
    duration: 60 * 60 * 24,
});

// 200 reqs per week
const limiterPerWeek = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'upload_week',
    points: 200,
    duration: 60 * 60 * 24 * 7,
});

export default async function uploadRateLimit(req: Request, res: Response, next: NextFunction) {
    try {
        const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";

        await Promise.all([
            limiterPerMinute.consume(ip),
            limiterPerHour.consume(ip),
            limiterPerDay.consume(ip),
            limiterPerWeek.consume(ip),
        ]);
        next();
    } catch (rejRes) {
        res.status(429).json({ error: "RATE LIMITED" });
    }
}