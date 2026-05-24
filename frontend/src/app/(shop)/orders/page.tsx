"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { Loader2, Package } from "lucide-react";
import Image from "next/image";

interface OrderItem {
  product: {
    _id: string;
    title: string;
    image: string;
    price: number;
  };
  quantity: number;
  price: number;
  _id: string;
}

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  products: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my-orders");
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing": return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped": return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered": return "bg-green-100 text-green-800 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-12 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">My Orders</h1>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-12 text-center transition-colors">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
                <Package className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No orders yet</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">When you place an order, it will appear here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Order Header */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Order ID</p>
                      <p className="font-mono text-sm font-semibold text-slate-900 dark:text-white">#{order._id.substring(order._id.length - 8)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Date</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total</p>
                      <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{formatPrice(order.totalAmount)}</p>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Items in this order</h3>
                    <div className="space-y-4">
                      {order.products.map((item) => (
                        <div key={item._id} className="flex items-center gap-4">
                          <div className="relative w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-md border border-slate-100 dark:border-slate-600 overflow-hidden flex-shrink-0">
                            {item.product?.image ? (
                              <Image 
                                src={item.product.image} 
                                alt={item.product.title} 
                                fill 
                                className="object-cover" 
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                                <Package className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                              {item.product?.title || "Product no longer available"}
                            </h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              Qty: {item.quantity} × {formatPrice(item.price)}
                            </p>
                          </div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">
                            {formatPrice(item.quantity * item.price)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
