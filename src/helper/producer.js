import { Queue, QueueEvents } from "bullmq";
import { redisConnection } from "../redisConnection.js";

const taskQueue = new Queue("task-queue", {
  defaultJobOptions: {
    attempts: 2,
  },
  connection: redisConnection,
});
const errorQueue = new Queue("error-queue", {
  defaultJobOptions: {
    attempts: 1,
  },
  connection: redisConnection,
});
const taskQueueEvent = new QueueEvents("task-queue");
const errorQueueEvent = new QueueEvents("error-queue");

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

export const errorQueueProducer = async (obj) => {
  try {
    const res = await errorQueue.add("error", {
      text: obj.text,
      operation: obj.operation,
    });

    console.log("Task added to Error Queue", res.id);
    return res.id;
  } catch (error) {
    console.log("error from error queue", error);
  }
};

taskQueueEvent.on("failed", async (job, val) => {
  console.log("Error from task queue", { job, val });
});
errorQueueEvent.on("failed", async (job, val) => {
  console.log("error from error queue", { job, val });
});

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
