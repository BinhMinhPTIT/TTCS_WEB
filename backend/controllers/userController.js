import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if the user is not exist
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const token = createToken(user._id);
    res.json({ success: true, message: "User credentials are correct", token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // checking for user if already registered
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }
    // validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please Enter a valid Email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message:
          "Password Length must be greater than or equal to 8 characters",
      });
    }

    // Hasing User Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({
      success: true,
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token: token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for password change
const changePassword = async (req, res) => {
  try {
    const { email, password, reenterpassword } = req.body;

    // check if the user is not exist
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const isMatched = await bcrypt.compare(password, user.password);

    if (password !== reenterpassword) {
      return res.json({
        success: false,
        message: "Two Password must be same.",
      });
    }

    if (isMatched) {
      return res.json({
        success: false,
        message: "New password should not be same as current password.",
      });
    }

    // Hasing User Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(reenterpassword, salt);

    // Updating user password
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getProfileInfo = async (req, res) => {
  try {
    const userId = req.body.userId; // Get userId from req.body as set by authUser middleware

    if (!userId) {
      return res.json({
        success: false,
        message: "User ID is missing. Authorization failed.",
      });
    }

    const user = await userModel.findById(userId).select("-password"); // Exclude password from the response

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
        dateOfBirth: user.dateOfBirth,
      },
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { phone, address, profileImage, dateOfBirth, cartData, wishlist } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = { ...user.address, ...address };
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (cartData !== undefined) user.cartData = cartData;
    if (wishlist !== undefined) user.wishlist = wishlist;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage,
        dateOfBirth: user.dateOfBirth,
        cartData: user.cartData,
        wishlist: user.wishlist,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


export { loginUser, registerUser, adminLogin, changePassword, getProfileInfo, updateProfile };
