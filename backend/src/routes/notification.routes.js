import { Router } from "express";
import {
  createNotification,
  deleteNotification,
  getNotifications,
  updateNotification,
} from "../controllers/notification.controller.js";
import verifyUser from "../middlewares/verifyUser.js";

const notificationRouter = Router();

notificationRouter.get("/user-all", verifyUser, getNotifications);

notificationRouter.post("/create", createNotification);

notificationRouter.put("/update/:notificationId", updateNotification);

notificationRouter.delete("/delete/:notificationId", deleteNotification);

export default notificationRouter;
