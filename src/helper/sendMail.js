import nodemailer from "nodemailer";

export const sendMail = async ({ otp, mail }) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: mail,
    subject: "OTP for Authentication",
    text: `Your OTP is: ${otp}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      flag = false;
      console.error("Error sending OTP via email:", error);
      return error;
    } else {
      flag = true;
      console.log("OTP sent via email:", info.response);
    }
  });
};
