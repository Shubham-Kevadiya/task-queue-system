// import { Worker } from "bullmq";
// import { redisConnection } from "../redisConnection.js";

// let failedTask = [];
// export const worker = new Worker(
//   "task-queue",
//   async (job) => {
//     try {
//       return new Promise((res, rej) => {
//         setTimeout(async () => {
//           let text = job.data.text;
//           // text = [];
//           await job.updateData({
//             ...job.data,
//             uppercase: text.toUpperCase(),
//             reverse: text.split("").reverse().join(""),
//           });
//           console.log(job.data, job.id);
//           res();
//         }, 5000);
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   },
//   { connection: redisConnection }
// );

// worker.on("failed", async (job, error) => {
//   try {
//     failedTask.push({
//       data: job.data,
//       jobId: job.id,
//       failedReason: job.failedReason,
//     });
//     console.log({ failedTask });
//     console.log(`Task Queue job with jobId ${job.id} failed. Error:`, error);
//   } catch (error) {
//     console.log("Error from Task Queue failed status", error);
//   }
// });
