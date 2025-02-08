import { Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
  maxRetriesPerRequest: null,
});

export const worker = new Worker(
  "task-queue",
  async (job) => {
    return new Promise((res, rej) => {
      setTimeout(async () => {
        let text = job.data.text;
        await job.updateData({
          ...job.data,
          uppercase: text.toUpperCase(),
          reverse: text.split("").reverse().join(""),
        });
        console.log(job.data);
        res();
      }, 5000);
    });
  },
  { connection }
);
