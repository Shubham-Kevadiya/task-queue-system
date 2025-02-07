import { Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
  maxRetriesPerRequest: null,
});

export const worker = new Worker(
  "task-queue",
  async (job) => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        let text = job.data.text
        let operation = job.data.operation
      }, 5000);
    });
  },
  { connection }
);
