import { createClient } from "redis";

const redisConfig = {
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
  },
};

const queueConfig = {
  password: process.env.REDIS_PASSWORD,
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
};

// export const redisConnection = async () => {
const redisClient = createClient(redisConfig);

redisClient.on("connect", () => {
  console.log("Redis server connected");
});

redisClient.on("error", (err) => {
  console.log(err);
});

await redisClient.connect();
// };

export default { redisClient, queueConfig };
