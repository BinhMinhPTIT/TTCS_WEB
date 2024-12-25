import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  // placeOrderRazorpay,
  allOrders,
  usersOrders,
  updateStatus,
  verifyStripe,
  // verifyRazorpay,
  getRevenueByMonth
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Addmin Features
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// Payment Features
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
// orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

// User Features
orderRouter.post("/userorders", authUser, usersOrders);

// Verify Payment
orderRouter.post("/verifyStripe", authUser, verifyStripe);
// orderRouter.post("/verifyRazorpay", authUser, verifyRazorpay);

orderRouter.get("/revenue-by-month", getRevenueByMonth);

// orderRouter.get("/order-detail", adminAuth, getOrderByUser);

export default orderRouter;
