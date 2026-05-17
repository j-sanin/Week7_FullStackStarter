const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Create product
router.post("/", async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});

// Get all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

module.exports = router;