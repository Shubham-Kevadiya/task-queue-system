import express from "express";
import taskRoute from "./task.route.js";

const apiRoute = express.Router();

apiRoute.use("/tasks", taskRoute);

export default apiRoute;
