import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// Global variables
const currency = "usd";
const deliveryCharge = 10;

// Gateway Initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing Order using COD Method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const orderData = {
      userId,
      items,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
      address,
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing Order using Stripe Method
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
      address,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({
      success: true,
      session_url: session.url,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Verify Stripe
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// All Orders Data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User Orders Data for Frontend
const usersOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update Order Status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });

    if (status === 'Delivered') {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
    }

    res.json({ success: true, message: "Order Status updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getRevenueByMonth = async (req, res) => {
  try {
    const { year } = req.query;
    const selectedYear = parseInt(year) || new Date().getFullYear();

    const startDate = new Date(selectedYear, 0, 1).getTime();
    const endDate = new Date(selectedYear, 11, 31, 23, 59, 59, 999).getTime();

    const revenue = await orderModel.aggregate([
      {
        $match: {
          payment: true,
          date: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $project: {
          month: {
            $month: {
              $toDate: "$date"
            }
          },
          amount: 1
        }
      },
      {
        $group: {
          _id: "$month",
          totalRevenue: { $sum: "$amount" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const formattedRevenue = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      totalRevenue: revenue.find(r => r._id === index + 1)?.totalRevenue || 0
    }));

    res.status(200).json({
      success: true,
      data: formattedRevenue
    });
  } catch (error) {
    console.error("Revenue aggregation error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching revenue data",
      error: error.message
    });
  }
};

const getOrderByUser = async (req, res) => {
  try {
    const userId = req.body.userId;
    const orders = await orderModel.find({ userId });

    res.json({ success: true, orders });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

export {
  placeOrder,
  placeOrderStripe,
  allOrders,
  usersOrders,
  updateStatus,
  verifyStripe,
  getRevenueByMonth,
  getOrderByUser
};
