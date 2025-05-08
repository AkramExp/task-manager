import { Router } from "express";
import {
  getAllUsers,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
} from "../controllers/user.controller.js";
import verifyUser from "../middlewares/verifyUser.js";

const userRouter = Router();

userRouter.get("/current", verifyUser, getCurrentUser);

userRouter.get("/list-all", getAllUsers);

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.post("/logout", logoutUser);

userRouter.put("/update-profile", verifyUser, updateProfile);

export default userRouter;
