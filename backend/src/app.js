const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { configureCloudinary } = require('./utils/cloudinary');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Configure Cloudinary
configureCloudinary();

const app = express();

// Security Middlewares
app.use(helmet()); // Secure HTTP headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(mongoSanitize()); // Prevent NoSQL Injection

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome route
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome to the Premium E-Commerce API' });
});

// Rate limit auth routes (login, register, forgot password)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
});

// Import Routes
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
