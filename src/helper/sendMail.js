import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});
export const sendMail = async ({ otp, mail }) => {
  // const sendMail = ({ otp, mail }) => {
  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: mail,
    subject: "OTP for Authentication",
    text: `Your OTP is: ${otp}`,
  };
  let flag = false;
  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions);
    resolve((flag = true));
    reject((flag = false));
  });
  return flag;
};
// };
