const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a product title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a product description'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a product price'],
    min: [0, 'Price must be positive'],
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Please assign a category to the product'],
  },
  image: {
    type: String, // Cloudinary URL
    required: [true, 'Please add an image URL'],
  },
  stock: {
    type: Number,
    required: [true, 'Please specify the stock amount'],
    default: 0,
    min: [0, 'Stock cannot be negative'],
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Create text indexes for search functionality
productSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
