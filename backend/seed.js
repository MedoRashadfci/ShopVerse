const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./src/models/Category');
const Product = require('./src/models/Product');
const User = require('./src/models/User');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const images = {
  laptops: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1531297172867-2140134bc579?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600&auto=format&fit=crop'
  ],
  smartphones: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=600&auto=format&fit=crop'
  ],
  accessories: [
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1615526653331-a83d73507119?q=80&w=600&auto=format&fit=crop'
  ],
  audio: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?q=80&w=600&auto=format&fit=crop'
  ],
  gaming: [
    'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=600&auto=format&fit=crop'
  ]
};

const seedData = async () => {
  await connectDB();

  try {
    // Default admin (password hashed via User model pre-save)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@shopverse.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    let admin = await User.findOne({ email: adminEmail });
    if (admin) {
      admin.password = adminPassword;
      admin.role = 'admin';
      admin.name = admin.name || 'ShopVerse Admin';
      await admin.save();
    } else {
      admin = await User.create({
        name: 'ShopVerse Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
    }
    console.log(`Admin ready: ${admin.email} / ${adminPassword}`);

    // Clear existing catalog data
    await Product.deleteMany();
    await Category.deleteMany();
    console.log('Existing products and categories deleted.');

    // Create Categories
    const categoriesData = [
      { name: 'Laptops', slug: 'laptops' },
      { name: 'Smartphones', slug: 'smartphones' },
      { name: 'Accessories', slug: 'accessories' },
      { name: 'Audio', slug: 'audio' },
      { name: 'Gaming', slug: 'gaming' },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    console.log('Categories seeded.');

    // Tech Product Names
    const techAdjectives = ['Pro', 'Max', 'Ultra', 'Lite', 'Plus', 'Elite', 'Gaming', 'Wireless', 'Smart'];
    
    const productsData = [];

    for (let i = 1; i <= 50; i++) {
      const categoryObj = createdCategories[Math.floor(Math.random() * createdCategories.length)];
      const categorySlug = categoryObj.slug;
      
      const adj = techAdjectives[Math.floor(Math.random() * techAdjectives.length)];
      const title = `Premium ${categoryObj.name.slice(0,-1)} ${adj} ${Math.floor(Math.random() * 900) + 100}`;
      
      const categoryImages = images[categorySlug];
      const randomImage = categoryImages[Math.floor(Math.random() * categoryImages.length)];

      productsData.push({
        title,
        description: `Experience the next level of performance with the ${title}. This premium product is crafted with precision and state-of-the-art technology to ensure you get the best out of your daily tasks.`,
        price: Math.floor(Math.random() * 1900) + 99, 
        category: categoryObj._id,
        stock: Math.floor(Math.random() * 50) + 0, 
        image: randomImage,
      });
    }

    await Product.insertMany(productsData);
    console.log('50 Realistic Products seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
