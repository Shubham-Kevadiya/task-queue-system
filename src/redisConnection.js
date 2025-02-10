import { Redis } from "ioredis";

const redisConfig = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  maxRetriesPerRequest: null,
};

export const redisConnection = new Redis(redisConfig);
