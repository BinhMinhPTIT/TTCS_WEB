import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  changePassword,
  getProfileInfo,
  updateProfile,
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

// Public Routes
userRouter.post("/register", registerUser); // User registration
userRouter.post("/login", loginUser); // User login
userRouter.post("/admin", adminLogin); // Admin login
userRouter.post("/forgot", changePassword); // Password change

// Protected Routes
userRouter.get("/profile", authUser, getProfileInfo); // Get user profile
userRouter.put("/profile", authUser, updateProfile); // Update user profile

export default userRouter;
