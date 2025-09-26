const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  condition: {
    type: String,
    enum: ['new', 'used', 'refurbished'],
    required: true
  },
  availability: {
    type: String,
    enum: ['available', 'sold', 'reserved'],
    default: 'available'
  },
  images: [{
    type: String
  }],
  carCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CarCompany',
    required: true
  },
  carModel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CarModel',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PartCategory',
    required: true
  },
  shopkeeper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  warranty: {
    type: String,
    default: ''
  },
  location: {
    city: String,
    state: String,
    pincode: String
  },
  contactInfo: {
    phone: String,
    email: String
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

// Indexes for better search performance
partSchema.index({ carCompany: 1, carModel: 1, category: 1 });
partSchema.index({ shopkeeper: 1 });
partSchema.index({ availability: 1 });
partSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Part', partSchema);
