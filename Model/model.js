import mongoose from "mongoose";

/* USER */
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  password: String,
  role: { type: String, default: "user" }
});

/* PRODUCT */
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  stock: Number,
  price: Number,
  minLevel: { type: Number, default: 10 },
  image: String
});

/* ORDER */
const orderSchema = new mongoose.Schema({
  orderId: String,
  customerName: String,
  productName: String,
  quantity: Number,
  price: Number,
  total: Number,
  status: { type: String, default: "Processing" },
  date: String,
  estimatedDelivery: String
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
export const Product = mongoose.model("Product", productSchema);
export const Order = mongoose.model("Order", orderSchema);
