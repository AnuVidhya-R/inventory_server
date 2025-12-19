import express from "express";
import cors from "cors";

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

console.log('Starting minimal test server...');

app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Test server working!' });
});

app.post('/inventix/login', (req, res) => {
  console.log('Login route hit with body:', req.body);
  res.json({ message: 'Login endpoint working', data: req.body });
});

app.listen(PORT, () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
});