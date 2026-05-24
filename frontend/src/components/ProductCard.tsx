"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
  category: { name: string; slug: string };
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product details
    addToCart({
      product: product._id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
      stock: product.stock,
    });
    toast.success("Added to cart");
  };

  return (
    <Link href={`/products/${product._id}`} className="group block">
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-[4/5] bg-slate-100 dark:bg-slate-900 overflow-hidden">
          <Image
            src={product.image || "/placeholder.jpg"}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm">
            {product.category?.name || "Uncategorized"}
          </div>

          {/* Out of Stock Overlay */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 flex items-center justify-center">
              <span className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-md font-bold text-sm tracking-widest uppercase">
                Sold Out
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2 min-h-[3rem]">
            {product.title}
          </h3>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {formatPrice(product.price)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white dark:hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-slate-100 dark:disabled:hover:bg-slate-700 disabled:hover:text-slate-700 dark:disabled:hover:text-slate-300"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
