import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import apiRoute from "./routes/api.route.js";
import userRoute from "./routes/user.route.js";
import { connectToDatabase } from "./config/dbConnection.js";
import otpRoute from "./routes/otp.route.js";
import session from "express-session";
import { RedisStore } from "connect-redis";
// import { redisConnection } from "./config/redisConnection.js";
import redisConnection from "./config/redisConnection.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    store: new RedisStore({ client: redisConnection.redisClient }),
    secret: process.env.REDIS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);

app.use("/api", apiRoute);
app.use("/user", userRoute);
app.use("/otp", otpRoute);

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
});
