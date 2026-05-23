const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const NodeCache = require('node-cache');

// Cache expires in 30 seconds (Lab Challenge requirement)
const productCache = new NodeCache({ stdTTL: 30 });

// Create product
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    productCache.del("products"); // invalidate cache when new product is added
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all products (with caching + optimized)
router.get("/", async (req, res) => {
  try {
    const cachedData = productCache.get("products");
    if (cachedData) {
      return res.json({
        source: "cache",
        data: cachedData
      });
    }

    const products = await Product.find().select('name price').lean();
    productCache.set("products", products);
    res.json({
      source: "database",
      data: products
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;