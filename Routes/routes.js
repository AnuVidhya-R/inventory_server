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
router.post("/products", addProduct);
router.get("/products", getProducts);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

/* TEST */
router.get("/users", async (req, res) => {
  const { User } = await import("../Model/model.js");
  const users = await User.find({});
  res.json(users);
});

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

/* ORDERS */
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

/* PRODUCTS */
router.get("/products", async (req, res) => {
  try {
    const { Product } = await import("../Model/model.js");
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/products", async (req, res) => {
  try {
    const { Product } = await import("../Model/model.js");
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/products/:id", async (req, res) => {
  try {
    const { Product } = await import("../Model/model.js");
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
