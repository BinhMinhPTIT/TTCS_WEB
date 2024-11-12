import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  changePassword,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/forgot", changePassword);
// userRouter.post("/profile/:id", getProfileInfo);

export default userRouter;
