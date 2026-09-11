const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const furnitureRoutes = require('./routes/furnitureRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/furniture', furnitureRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '3D Furniture Visualization API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
