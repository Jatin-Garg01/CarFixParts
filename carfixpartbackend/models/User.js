const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'shopkeeper', 'customer'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: function() {
      return this.role === 'shopkeeper' ? 'pending' : 'approved';
    }
  },
  shopDetails: {
    shopName: {
      type: String,
      required: function() { return this.role === 'shopkeeper'; }
    },
    address: {
      type: String,
      required: function() { return this.role === 'shopkeeper'; }
    },
    city: {
      type: String,
      required: function() { return this.role === 'shopkeeper'; }
    },
    state: {
      type: String,
      required: function() { return this.role === 'shopkeeper'; }
    },
    pincode: {
      type: String,
      required: function() { return this.role === 'shopkeeper'; }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
