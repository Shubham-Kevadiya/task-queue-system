import { Queue } from "bullmq";

const taskQueue = new Queue("task-queue");

export const producer = async (obj) => {
  const res = await taskQueue.add("task", {
    text: obj.text,
    operation: obj.operation,
  });

  console.log("Task added to Queue", res.id);
  return res.id;
};

export const getJob = async (jobId) => {
  const res = await taskQueue.getJob(jobId);
  return res;
};

export const getJobStatus = async (jobId) => {
  const job = await taskQueue.getJob(jobId);
  let res = await job.getState();
  if (res == "completed") {
    res = {
      status: res,
      result: { uppercase: job.data.uppercase, reverse: job.data.reverse },
    };
  }
  return res;
};
