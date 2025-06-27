import redisClient from ".";

export async function incrementStat(key: string) {
    await redisClient.incr(key);
}

export async function incrementStatFloat(key: string, value: number) {
    await redisClient.incrbyfloat(key, value);
}

export async function incrementStatWithExpiry(key: string, expirySeconds: number) {
    const current = await redisClient.incr(key);
    if (current === 1) {
        await redisClient.expire(key, expirySeconds);
    }
    return current;
}

export async function incrementStatFloatWithExpiry(key: string, value: number, expirySeconds: number) {
    const currentStr = await redisClient.incrbyfloat(key, value);
    const current = parseFloat(currentStr);

    if (current === value) {
        await redisClient.expire(key, expirySeconds);
    }
    return current;
}