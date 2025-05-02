import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import verifyUser from "../middlewares/verifyUser.js";

const userRouter = Router();

userRouter.get("/current", verifyUser, getCurrentUser);

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.post("/logout", logoutUser);

export default userRouter;
