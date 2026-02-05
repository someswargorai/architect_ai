import { redis } from "./rateLimit";

export async function getCache(key: string) {
  return redis.get(key);
}

export async function setCache<T>(key: string, value: T, ttlSecond = 60) {
  redis.set(key, value, { ex: ttlSecond });
}
