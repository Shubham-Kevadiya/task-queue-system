import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
// import apiRoute from "./routes/api.route.js";
import userRoute from "./routes/user.route.js";
import { connectToDatabase } from "./config/dbConnection.js";
import otpRoute from "./routes/otp.route.js";

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use("/api", apiRoute);
app.use("/user", userRoute);
app.use("/otp", otpRoute);

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
});
