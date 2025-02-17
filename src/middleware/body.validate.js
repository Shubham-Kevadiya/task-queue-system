import Joi from "joi";

const createTaskSchema = Joi.object({
  text: Joi.string().required(),
  operation: Joi.string().valid("uppercase", "reverse").required(),
});

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  age: Joi.string().required(),
});

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const sendOTPOfGASchema = Joi.object({
  userId: Joi.string().required(),
  token: Joi.string().required(),
});

const verifyOTPOfGASchema = Joi.object({
  otp: Joi.string().required(),
});

const generateOTPSchema = Joi.object({
  userId: Joi.string().required(),
});

const verifyOTPSchema = Joi.object({
  otp: Joi.string().required(),
  userId: Joi.string().required(),
});

const vaidateSchema = async (validateSchema, body) => {
  const payloadValue = await validateSchema
    .validateAsync(body)
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
  return payloadValue;
};

export const createTaskValidation = async (req, res, next) => {
  try {
    const payloadValue = await vaidateSchema(createTaskSchema, req.body);
    req.payloadValue = payloadValue;
    next();
  } catch (error) {
    console.log("error", "error in validate create task", error);
    return res.status(500).json({
      message: "Something happened wrong try again after sometime.",
      error,
    });
  }
};

export const registerValidation = async (req, res, next) => {
  try {
    const payloadValue = await vaidateSchema(registerSchema, req.body);
    req.payloadValue = payloadValue;
    next();
  } catch (error) {
    console.log("error", "error in validate register", error);
    return res.status(500).json({
      message: "Something happened wrong try again after sometime.",
      error,
    });
  }
};

export const loginValidation = async (req, res, next) => {
  try {
    const payloadValue = await vaidateSchema(loginSchema, req.body);
    req.payloadValue = payloadValue;
    next();
  } catch (error) {
    console.log("error", "error in validate login", error);
    return res.status(500).json({
      message: "Something happened wrong try again after sometime.",
      error,
    });
  }
};

export const sendOTPOfGAValidation = async (req, res, next) => {
  try {
    const payloadValue = await vaidateSchema(sendOTPOfGASchema, req.body);
    req.payloadValue = payloadValue;
    next();
  } catch (error) {
    console.log("error", "error in validate send OTP of GA", error);
    return res.status(500).json({
      message: "Something happened wrong try again after sometime.",
      error,
    });
  }
};

export const verifyOTPOfGAValidation = async (req, res, next) => {
  try {
    const payloadValue = await vaidateSchema(verifyOTPOfGASchema, req.body);
    req.payloadValue = payloadValue;
    next();
  } catch (error) {
    console.log("error", "error in validate verify OTP of GA", error);
    return res.status(500).json({
      message: "Something happened wrong try again after sometime.",
      error,
    });
  }
};

export const generateOTPValidation = async (req, res, next) => {
  try {
    const payloadValue = await vaidateSchema(generateOTPSchema, req.body);
    req.payloadValue = payloadValue;
    next();
  } catch (error) {
    console.log("error", "error in validate generate OTP", error);
    return res.status(500).json({
      message: "Something happened wrong try again after sometime.",
      error,
    });
  }
};

export const verifyOTPValidation = async (req, res, next) => {
  try {
    const payloadValue = await vaidateSchema(verifyOTPSchema, req.body);
    req.payloadValue = payloadValue;
    next();
  } catch (error) {
    console.log("error", "error in validate verify OTP", error);
    return res.status(500).json({
      message: "Something happened wrong try again after sometime.",
      error,
    });
  }
};
