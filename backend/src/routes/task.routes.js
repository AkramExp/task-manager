import { Router } from "express";
import verifyUser from "../middlewares/verifyUser.js";
import {
  createTask,
  deleteTask,
  getAssignedTask,
  getUserTasks,
  updateTask,
} from "../controllers/task.controller.js";

const taskRouter = Router();

taskRouter.get("/created", verifyUser, getUserTasks);

taskRouter.get("/assigned", verifyUser, getAssignedTask);

taskRouter.post("/create", verifyUser, createTask);

taskRouter.put("/update/:taskId", verifyUser, updateTask);

taskRouter.delete("/delete/:taskId", verifyUser, deleteTask);

export default taskRouter;
