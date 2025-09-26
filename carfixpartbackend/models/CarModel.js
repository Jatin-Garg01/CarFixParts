const mongoose = require('mongoose');

const carModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CarCompany',
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  variant: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for company and name
carModelSchema.index({ company: 1, name: 1, year: 1 });

module.exports = mongoose.model('CarModel', carModelSchema);
