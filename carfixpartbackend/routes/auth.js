const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/register
// @desc    Register user (shopkeeper/customer)
// @access  Public
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('role').isIn(['shopkeeper', 'customer']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, role, shopDetails } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const status = role === 'shopkeeper' ? 'pending' : 'approved';

    let user;
    if (role === 'shopkeeper' && shopDetails) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashed,
          phone,
          role: 'shopkeeper',
          status: status,
          shopkeeperProfile: {
            create: {
              shopName: shopDetails.shopName,
              address: shopDetails.address,
              city: shopDetails.city,
              state: shopDetails.state,
              pincode: shopDetails.pincode,
            }
          }
        },
        select: {
          id: true, name: true, email: true, phone: true, role: true, status: true,
          shopkeeperProfile: { select: { shopName: true, address: true, city: true, state: true, pincode: true } }
        }
      });
    } else {
      user = await prisma.user.create({
        data: { name, email, password: hashed, phone, role: 'customer', status },
        select: { id: true, name: true, email: true, phone: true, role: true, status: true }
      });
    }

    const token = generateToken(user.id);

    res.status(201).json({
      message: role === 'shopkeeper' 
        ? 'Registration successful! Your account is pending approval.' 
        : 'Registration successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        shopDetails: user.shopkeeperProfile || undefined
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email }, include: { shopkeeperProfile: true } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if shopkeeper is approved
    if (user.role === 'shopkeeper' && user.status !== 'approved') {
      return res.status(403).json({ 
        message: user.status === 'pending' 
          ? 'Your account is pending approval' 
          : 'Your account has been rejected'
      });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        shopDetails: user.shopkeeperProfile || undefined
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        status: req.user.status,
        shopDetails: req.user.shopkeeperProfile || undefined
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
