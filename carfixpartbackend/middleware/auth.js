const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

// Verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        shopkeeperProfile: {
          select: { shopName: true, address: true, city: true, state: true, pincode: true }
        }
      }
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Check if user is admin
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Check if user is shopkeeper
const shopkeeperAuth = (req, res, next) => {
  if (req.user.role !== 'shopkeeper') {
    return res.status(403).json({ message: 'Access denied. Shopkeeper only.' });
  }
  
  if (req.user.status !== 'approved') {
    return res.status(403).json({ message: 'Account not approved yet.' });
  }
  
  next();
};

// Check if user is customer
const customerAuth = (req, res, next) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({ message: 'Access denied. Customer only.' });
  }
  next();
};

module.exports = {
  auth,
  adminAuth,
  shopkeeperAuth,
  customerAuth
};
