import Joi from "joi";

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

    return res.status(200).json();
  } catch (error) {
    console.log("error", "error in create task", error);
    return res.status(500).json({
      message: "Something happened wrong try again after sometime.",
      error: _get(error, "message"),
    });
  }
};
