// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

router.post('/register', [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
body('password')
  .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  .matches(/[A-Z]/).withMessage('Password must include at least one uppercase letter')
  .matches(/[0-9]/).withMessage('Password must include at least one number')
], register);

router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').not().isEmpty().withMessage('Password is required')
], login);

router.get('/admin', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin access granted' });
});

router.get('/profile', protect, (req, res) => {
  res.json({ message: 'Welcome to your profile!', user: req.user });
});

module.exports = router;