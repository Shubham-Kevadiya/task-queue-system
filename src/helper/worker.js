import { Worker } from "bullmq";

let failedTask = [];
export const worker = new Worker(
  "task-queue",
  async (job) => {
    try {
      return new Promise((res, rej) => {
        setTimeout(async () => {
          let text = job.data.text;
          // text = [];
          await job.updateData({
            ...job.data,
            uppercase: text.toUpperCase(),
            reverse: text.split("").reverse().join(""),
          });
          res();
        }, 5000);
      });
    } catch (error) {
      console.log(error);
    }
  },
  {
    connection: {
      password: process.env.REDIS_PASSWORD,
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
    },
  }
);

worker.on("failed", async (job, error) => {
  try {
    failedTask.push({
      data: job.data,
      jobId: job.id,
      failedReason: job.failedReason,
    });

    console.log(`Task Queue job with jobId ${job.id} failed. Error:`, error);
  } catch (error) {
    console.log("Error from Task Queue failed status", error);
  }
});
