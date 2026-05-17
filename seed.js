require('dns').setServers(['8.8.8.8', '8.8.4.4']); //---added
require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

async function seedData() {

  await mongoose.connect(process.env.MONGO_URI);

  // Clear existing data
  await User.deleteMany();
  await Product.deleteMany();
  await Order.deleteMany();

  // Create users
  const user = await User.create({
    name: "Test User",
    email: "test@test.com"
  });

  // Create products
  const product1 = await Product.create({
    name: "Laptop",
    price: 50000,
    createdBy: user._id
  });

  const product2 = await Product.create({
    name: "Phone",
    price: 20000,
    createdBy: user._id
  });

  // Create order
  await Order.create({
    user: user._id,
    products: [product1._id, product2._id],
    totalAmount: 70000
  });

  console.log("Database seeded!");
  process.exit();
}

seedData();