import { Queue } from "bullmq";

const taskQueue = new Queue("task-queue");

export const producer = async (obj) => {
  const res = await taskQueue.add("task", {
    text: "obj.text",
    operation: "obj.operation",
    // text: obj.text,
    // operation: obj.operation,
  });

  console.log("Task added to Queue", res.id);
  return res.id;
};
