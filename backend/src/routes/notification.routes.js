import { Router } from "express";
import {
  createNotification,
  getNotifications,
  updateNotification,
} from "../controllers/notification.controller.js";
import verifyUser from "../middlewares/verifyUser.js";

const notificationRouter = Router();

notificationRouter.get("/user-all", verifyUser, getNotifications);

notificationRouter.post("/create", createNotification);

notificationRouter.put("/update/:notificationId", updateNotification);

export default notificationRouter;
