import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    phone: { type: String, default: "" },
    address: { 
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      zipCode: { type: String, default: "" }
    },
    dateOfBirth: { type: Date },
    profileImage: { type: String, default: "" },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
    lastLogin: { type: Date },
  },
  { 
    minimize: false,
    timestamps: true
  }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
