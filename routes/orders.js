const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Get all orders with populated data
router.get("/", async (req, res) => {
  const orders = await Order.find()
    .populate("user")
    .populate("products");

  res.json(orders);
});

module.exports = router;