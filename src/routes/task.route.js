import express from "express";
import { createTask } from "../controller/task.controller.js";
const taskRoute = express.Router();

taskRoute.post("/", createTask);

export default taskRoute;
