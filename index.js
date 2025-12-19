import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Db/db.js";
import routes from "./Routes/routes.js";

dotenv.config();
console.log('Starting server...');
console.log('MongoDB URL:', process.env.MONGODB_URL);
console.log('Port:', process.env.PORT);

connectDB();

// Create admin user if not exists
const createAdminUser = async () => {
  try {
    const { User } = await import('./Model/model.js');
    const bcrypt = await import('bcryptjs');
    
    // First, let's see what admin users exist
    const existingAdmins = await User.find({ role: 'admin' });
    console.log('Existing admin users:', existingAdmins.map(u => ({ name: u.name, email: u.email, username: u.username })));
    
    // Check if our specific admin exists
    const ourAdmin = await User.findOne({ email: 'Meena@inventix.com' });
    
    if (!ourAdmin) {
      // Delete any existing admin users first
      await User.deleteMany({ role: 'admin' });
      console.log('✅ Cleared existing admin users');
      
      const hashedPassword = await bcrypt.default.hash('inventix2510', 10);
      await User.create({
        name: 'Meena',
        email: 'Meena@inventix.com',
        username: 'Meena@inventix.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin user created: Meena@inventix.com / inventix2510');
    } else {
      console.log('✅ Admin user Meena@inventix.com already exists');
    }
  } catch (error) {
    console.log('❌ Error creating admin user:', error);
  }
};

// Create admin after database connection
setTimeout(createAdminUser, 3000);

const cors = require("cors");

app.use(cors({
  origin: "https://inventixx.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE"], // include DELETE here
}));


app.use(cors());
app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Test database endpoints
app.get('/inventix/test-products', async (req, res) => {
  try {
    const { Product } = await import('./Model/model.js');
    const products = await Product.find({});
    res.json({ count: products.length, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/inventix/test-orders', async (req, res) => {
  try {
    const { Order } = await import('./Model/model.js');
    const orders = await Order.find({});
    res.json({ count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/inventix/test-admin', async (req, res) => {
  try {
    const { User } = await import('./Model/model.js');
    const admin = await User.findOne({ role: 'admin' });
    res.json({ adminExists: !!admin, admin: admin ? { name: admin.name, email: admin.email, username: admin.username, role: admin.role } : null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use("/inventix", routes);

app.listen(process.env.PORT, () => {
  console.log(`✅ Server is running on http://localhost:${process.env.PORT}`);
  console.log(`✅ API endpoints available at http://localhost:${process.env.PORT}/inventix`);
  console.log(`✅ Admin Login: Meena@inventix.com / inventix2510`);
});