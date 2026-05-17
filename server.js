require('dns').setServers(['8.8.8.8', '8.8.4.4']); //added
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const usersRouter = require("./routes/users");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const { setServers } = require("dns");   //added

const app = express();

// Body parsers (required so req.body will not be undefined)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api/users", usersRouter);
app.use("/api/products", productRoutes);   
app.use("/api/orders", orderRoutes);   

// Test route
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.get("/", (req, res) => {
  res.send("Server is running");
});

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