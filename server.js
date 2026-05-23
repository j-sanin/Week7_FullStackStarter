require('dns').setServers(['8.8.8.8', '8.8.4.4']);
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { logger } = require('./middleware/logger');
require("dotenv").config();

const usersRouter = require("./routes/users");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const authRoutes = require("./routes/authRoutes");
const { setServers } = require("dns");

const app = express();

// Security
//app.use(helmet({
 // contentSecurityPolicy: false
//}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger (after body parsers)
app.use(logger);

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: 'Too many requests, try again later'
});
app.use('/api/auth/login', limiter);

// Lab Challenge routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/status", (req, res) => {
  res.json({
    status: "online",
    message: "System is running",
    timestamp: new Date()
  });
});

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/users", usersRouter);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Mongo connect + start server
async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Startup error:", err.message);
    process.exit(1);
  }
}

start();