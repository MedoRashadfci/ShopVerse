"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { Loader2, Package } from "lucide-react";
import toast from "react-hot-toast";

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
  user?: { name: string; email: string };
  products: OrderItem[];
}

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/orders");
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status });
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status } : o))
        );
        toast.success("Order status updated");
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400";
      case "processing":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400";
      case "shipped":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400";
      case "delivered":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
      default:
        return "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300";
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Orders Management</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          View all customer orders and update their status.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center mt-8">
          <Package className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No orders yet.</p>
        </div>
      ) : (
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="px-6 py-4 font-medium">Order</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Items</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4 font-mono text-sm text-slate-900 dark:text-white">
                      #{order._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {order.user?.name || "—"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {order.user?.email || "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {order.products.length} item(s)
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs font-bold uppercase rounded-lg border-0 px-3 py-2 cursor-pointer focus:ring-2 focus:ring-indigo-500 ${getStatusColor(order.status)}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
