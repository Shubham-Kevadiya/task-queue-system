import express from "express";
import { createTask, getTaskStatus } from "../controller/task.controller.js";
const taskRoute = express.Router();

taskRoute.post("/", createTask);
taskRoute.get("/:jobId", getTaskStatus);

export default taskRoute;
