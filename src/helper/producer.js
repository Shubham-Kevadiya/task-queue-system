import { Queue } from "bullmq";
import dotenv from "dotenv";

dotenv.config();

// const taskQueue = new Queue("task-queue", {
//   defaultJobOptions: {
//     attempts: 2,
//   },
//   connection: {
//     password: process.env.REDIS_PASSWORD,
//     port: process.env.REDIS_PORT,
//     host: process.env.REDIS_HOST,
//   },
// });
const taskQueue = new Queue("task-queue", {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
});

export const producer = async (obj) => {
  try {
    const res = await taskQueue.add("task", {
      text: obj.text,
      operation: obj.operation,
    });

    console.log("Task added to Queue", res.id);
    return res.id;
  } catch (error) {
    console.log("error from taskQueue", error);
  }
};

export const getJob = async (jobId) => {
  try {
    const res = await taskQueue.getJob(jobId);
    return res;
  } catch (error) {
    console.log("error from getJob", error);
    return error;
  }
};

export const getJobStatus = async (jobId) => {
  try {
    const job = await taskQueue.getJob(jobId);
    let res = await job.getState();
    if (res == "completed") {
      res = {
        status: res,
        result: { uppercase: job.data.uppercase, reverse: job.data.reverse },
      };
    }
    return res;
  } catch (error) {
    console.log("Error from getJobStatus", error);
    return error;
  }
};
