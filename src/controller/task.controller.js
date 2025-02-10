import Joi from "joi";
import { getJobStatus, producer } from "../helper/producer.js";

export const createTaskSchema = Joi.object({
  text: Joi.string().required(),
  operation: Joi.string().valid("uppercase", "reverse").required(),
});

export const createTask = async (req, res) => {
  try {
    const payloadValue = await createTaskSchema
      .validateAsync(req.body)
      .then((value) => {
        return value;
      })
      .catch((e) => {
        console.log(e);
        if (isError(e)) {
          res.status(422).json(e);
        } else {
          res.status(422).json({ message: e.message });
        }
      });
    if (!payloadValue) {
      return;
    }

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
