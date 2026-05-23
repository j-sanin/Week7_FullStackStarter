const express = require("express");
const router = express.Router();
const User = require("../models/User");
const cache = require("../utils/cache");

// CREATE
router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    cache.del("users"); // invalidate cache when new user is added
    return res.status(201).json(user);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// READ ALL (with caching)
router.get("/", async (req, res) => {
  try {
    const cachedData = cache.get("users");
    if (cachedData) {
      return res.json({
        source: "cache",
        data: cachedData
      });
    }

    const users = await User.find().select('name email role').sort({ createdAt: -1 }).lean();    cache.set("users", users);
    return res.json({
      source: "database",
      data: users
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    cache.del("users"); // invalidate cache when user is updated
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    cache.del("users"); // invalidate cache when user is deleted
    return res.json({ message: "User deleted" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;