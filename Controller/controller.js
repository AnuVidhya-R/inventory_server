import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, Product } from "../Model/model.js";

/* REGISTER */
export const register = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      username,
      password: hashed
    });
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* LOGIN */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Raw request body:', req.body);
    console.log('Username length:', username ? username.length : 'undefined');
    console.log('Username as JSON:', JSON.stringify(username));
    
    // Trim whitespace from username
    const cleanUsername = username ? username.trim() : '';
    console.log('Clean username:', cleanUsername);
    
    // Try to find by username first, then by email if username not found
    let user = await User.findOne({ username: cleanUsername });
    console.log('User found by username:', user ? 'Yes' : 'No');
    
    if (!user) {
      user = await User.findOne({ email: cleanUsername });
      console.log('User found by email:', user ? 'Yes' : 'No');
    }

    if (!user) {
      console.log('No user found for:', cleanUsername);
      // Let's also check what users exist
      const allUsers = await User.find({});
      console.log('All users in DB:', allUsers.map(u => ({ email: u.email, username: u.username, role: u.role })));
      return res.status(400).json({ message: "User not found. Please register first." });
    }

    console.log('Found user:', { name: user.name, email: user.email, role: user.role });
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
    console.log('Login successful for user with role:', user.role);
    res.json({ message: "Login successful", token, role: user.role, user: { name: user.name, username: user.username || user.email } });
  } catch (error) {
    console.log('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

/* ADD PRODUCT */
export const addProduct = async (req, res) => {
  try {
    console.log('Adding product with data:', req.body);
    const product = await Product.create(req.body);
    console.log('Product created:', product);
    res.json(product);
  } catch (error) {
    console.log('Error adding product:', error);
    res.status(500).json({ message: error.message });
  }
};

/* GET PRODUCTS */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE PRODUCT */
export const updateProduct = async (req, res) => {
  try {
    console.log('Updating product with ID:', req.params.id);
    console.log('Update data:', req.body);
    
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    console.log('Product updated successfully:', updated);
    res.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: error.message });
  }
};

/* DELETE PRODUCT */
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: error.message });
  }
};
