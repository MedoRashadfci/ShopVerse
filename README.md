# ShopVerse V2 - Premium E-Commerce Application

A complete, production-ready, and premium Real-World E-Commerce application with Authentication & Authorization. Built with the latest modern web technologies.

## 🚀 Features

- **User Authentication & Authorization**: JWT-based login, registration, and role-based access control (Admin vs User).
- **Product Management (CRUD)**: Admins can create, read, update, and delete products with image upload functionality.
- **Advanced Query/Filtration**: Filter products by category, search by title, price range, and sorting. Includes server-side pagination.
- **Shopping Cart**: Fully functional cart with persistent state.
- **Order Management**: Users can place orders and view their order history. Admins can view all orders and update statuses.
- **Responsive & Premium UI**: Built with Next.js App Router, Tailwind CSS, and Shadcn UI components.
- **SEO Optimized**: Dynamic metadata generation and Server Components for optimal performance.

## 🛠️ Tech Stack

### Backend
- **Node.js & Express.js**: RESTful API architecture.
- **MongoDB & Mongoose**: Database and object data modeling.
- **JWT**: Secure authentication.
- **Multer & Cloudinary**: Image uploading and cloud storage.
- **Security**: Helmet, express-mongo-sanitize, express-rate-limit, cors.
- **express-validator**: Robust API endpoint validation.

### Frontend
- **Next.js 14 (App Router)**: React framework with Server Components and Server Actions.
- **TypeScript**: Static typing for robust code.
- **Tailwind CSS**: Utility-first styling.
- **Shadcn UI**: Beautifully designed, accessible, and customizable components.
- **Axios**: HTTP client with interceptors.
- **Context API**: State management for Auth and Cart.

## 📋 Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas URL)
- Cloudinary Account (for image uploads)

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd ShopVerse-V2
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory based on `.env.example`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:3000
```
Start the backend server:
```bash
npm run dev
```

Seed catalog data and default admin (`admin@shopverse.com` / `admin123` unless overridden in `.env`):
```bash
npm run seed
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
Start the frontend development server:
```bash
npm run dev
```

## 📚 Full Project Documentation

See **[PROJECT_GUIDE.md](./PROJECT_GUIDE.md)** for a file-by-file explanation of the entire codebase (English, with code snippets).

## 📬 Postman Collection

Import `ShopVerse-V2.postman_collection.json` into Postman or Thunder Client.

1. Start the backend (`npm run dev` in `backend`).
2. Run **Auth → Login** (saves the JWT to the `token` variable automatically).
3. Set `productId`, `categoryId`, and `orderId` from API responses when testing update/delete routes.

## 📖 API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Authenticate user & get token |
| POST | `/forgot-password` | Public | Request password reset (dev: returns `resetUrl`) |
| PUT | `/reset-password/:token` | Public | Set new password with reset token |
| GET | `/profile` | Private | Get logged-in user profile |

### Users (`/api/users`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Admin | List all users (no passwords) |

### Products (`/api/products`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all products (with filters, sort, pagination) |
| GET | `/:id` | Public | Get single product by ID |
| POST | `/` | Admin | Create a new product (requires image upload) |
| PUT | `/:id` | Admin | Update a product |
| DELETE | `/:id` | Admin | Delete a product |

#### Product Filters Example:
`/api/products?category=electronics&price[gte]=100&price[lte]=1000&search=laptop&sort=-price&page=1&limit=12`

### Categories (`/api/categories`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all categories |
| POST | `/` | Admin | Create a new category |
| PUT | `/:id` | Admin | Update a category |
| DELETE | `/:id` | Admin | Delete a category |

### Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Private | Create a new order |
| GET | `/my-orders` | Private | Get logged-in user's orders |
| GET | `/` | Admin | Get all orders in the system |
| PATCH | `/:id/status` | Admin | Update order status |

## 🛡️ License
This project is licensed under the MIT License.
