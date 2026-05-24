"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface AddToCartButtonProps {
  product: any;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleIncrease = () => setQuantity((prev) => Math.min(product.stock, prev + 1));

  const handleAdd = () => {
    addToCart({
      product: product._id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity,
      stock: product.stock,
    });
    toast.success(`${quantity} ${product.title} added to cart`);
  };

  if (product.stock <= 0) {
    return (
      <button 
        disabled
        className="w-full bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold py-4 rounded-xl cursor-not-allowed uppercase tracking-wider text-sm transition-colors"
      >
        Currently Unavailable
      </button>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Quantity Selector */}
      <div className="flex items-center justify-between border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 w-full sm:w-32 h-14 bg-white dark:bg-slate-800 transition-colors">
        <button 
          onClick={handleDecrease}
          disabled={quantity <= 1}
          className="p-1 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-50 transition-colors"
        >
          <Minus className="w-5 h-5" />
        </button>
        <span className="font-semibold text-slate-900 dark:text-white">{quantity}</span>
        <button 
          onClick={handleIncrease}
          disabled={quantity >= product.stock}
          className="p-1 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-50 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Add Button */}
      <button 
        onClick={handleAdd}
        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl h-14 flex items-center justify-center gap-2 transition-colors shadow-sm shadow-indigo-200 dark:shadow-none"
      >
        <ShoppingCart className="w-5 h-5" />
        <span>Add to Cart</span>
      </button>
    </div>
  );
}
