"use client";

import { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart, isCartOpen, setIsCartOpen } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setIsCartOpen(false);
      router.push("/login?redirect=/cart"); // simple redirect, in real app you might want better handling
      return;
    }

    setIsCheckingOut(true);
    try {
      // Create order
      const orderData = {
        products: cartItems.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          street: "123 Main St", // Dummy data for now
          city: "Tech City",
          country: "Digital Country",
          zipCode: "10001"
        },
        totalAmount: totalPrice
      };

      const res = await api.post("/orders", orderData);
      if (res.data.success) {
        clearCart();
        setIsCartOpen(false);
        router.push("/orders");
      }
    } catch (error) {
      console.error("Checkout failed", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 z-[101] w-full md:w-[400px] bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col border-l border-transparent dark:border-slate-800 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Cart</h2>
            <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 text-xs font-bold px-2 py-0.5 rounded-full ml-2">
              {cartItems.length}
            </span>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your cart is empty</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Looks like you haven't added anything yet.</p>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.product} className="flex gap-4">
                  <div className="relative w-20 h-24 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-100 dark:border-slate-700 overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.jpg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 pr-4">{item.title}</h4>
                        <button 
                          onClick={() => removeFromCart(item.product)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-indigo-600 dark:text-indigo-400 font-bold mt-1">{formatPrice(item.price)}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800">
                        <button 
                          onClick={() => updateQuantity(item.product, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 disabled:opacity-50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product, Math.min(item.stock, item.quantity + 1))}
                          disabled={item.quantity >= item.stock}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 disabled:opacity-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Checkout */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Subtotal</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">{formatPrice(totalPrice)}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Shipping and taxes calculated at checkout.</p>
            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
            >
              {isCheckingOut ? (
                "Processing..."
              ) : (
                <>
                  Checkout <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
