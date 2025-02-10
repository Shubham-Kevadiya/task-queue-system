import { getJobStatus, producer } from "../helper/producer.js";

export const createTask = async (req, res) => {
  try {
    const payloadValue = req.payloadValue;
    const jobId = await producer(payloadValue);

    return res.status(200).json({ jobId });
  } catch (error) {
    console.log("error", "error in create task", error);
    return res.status(500).json({
      message: "Something happened wrong try again after sometime.",
      error: _get(error, "message"),
    });
  }
};

export const getTaskStatus = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const status = await getJobStatus(jobId);
    return res.status(200).json({ status });
  } catch (error) {
    console.log("error", "error in get task status", error);
    return res.status(500).json({
      message: "Something happened wrong try again after sometime.",
      error: _get(error, "message"),
    });
  }
};
