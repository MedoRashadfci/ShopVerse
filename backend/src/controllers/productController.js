const Product = require('../models/Product');
const { cloudinary } = require('../utils/cloudinary');
const streamifier = require('streamifier');

// @desc    Get all products with advanced filtering, sorting, pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { category, search, sort, page = 1, limit = 12 } = req.query;
    let query = {};

    // 1. Search by title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // 2. Filter by Category
    if (category) {
      // Assuming category slug or ID is passed
      const Category = require('../models/Category');
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      } else {
        query.category = null; // Ensure no products are returned if category is invalid
      }
    }

    // 3. Price filtering (gte, lte)
    if (req.query.price) {
      query.price = {};
      if (req.query.price.gte) query.price.$gte = Number(req.query.price.gte);
      if (req.query.price.lte) query.price.$lte = Number(req.query.price.lte);
    }

    // Initialize Mongoose query
    let mongooseQuery = Product.find(query).populate('category', 'name slug');

    // 4. Sorting
    if (sort) {
      // sort=price or sort=-price
      const sortBy = sort.split(',').join(' ');
      mongooseQuery = mongooseQuery.sort(sortBy);
    } else {
      mongooseQuery = mongooseQuery.sort('-createdAt'); // Default sort by newest
    }

    // 5. Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;

    mongooseQuery = mongooseQuery.skip(startIndex).limit(limitNum);

    // Execute query
    const products = await mongooseQuery;
    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      count: products.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      { folder: 'ecommerce-v2/products' },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    // Upload image to cloudinary
    const result = await uploadToCloudinary(req.file.buffer);
    
    const { title, description, price, category, stock } = req.body;

    const product = await Product.create({
      title,
      description,
      price,
      category,
      stock,
      image: result.secure_url,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, message: 'Product created successfully', data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updates = {};
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.description !== undefined) updates.description = req.body.description;
    if (req.body.price !== undefined) updates.price = Number(req.body.price);
    if (req.body.category !== undefined) updates.category = req.body.category;
    if (req.body.stock !== undefined) updates.stock = Number(req.body.stock);

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      updates.image = result.secure_url;
    }

    product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    res.json({ success: true, message: 'Product updated successfully', data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
