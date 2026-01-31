import express from "express";
import {
  register,
  login,
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct
} from "../Controller/controller.js";

const router = express.Router();

/* AUTH */
router.post("/register", register);
router.post("/login", login);

/* PRODUCTS */
router.get("/products", getProducts);
router.post("/products", addProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

/* ORDERS */
router.get("/orders", async (req, res) => {
  try {
    const { Order } = await import("../Model/model.js");
    const orders = await Order.find({});
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/orders", async (req, res) => {
  try {
    const { Order } = await import("../Model/model.js");
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/orders/:id", async (req, res) => {
  try {
    const { Order } = await import("../Model/model.js");
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/orders/:id", async (req, res) => {
  try {
    const { Order } = await import("../Model/model.js");
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* TEST */
router.get("/users", async (req, res) => {
  const { User } = await import("../Model/model.js");
  const users = await User.find({});
  res.json(users);
});

export default router;