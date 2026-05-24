"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { User, Mail, Shield, Package, LogOut, Edit2, Check, X, Lock } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "@/lib/api";

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSubmit: any = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.password) {
        dataToSubmit.password = formData.password;
      }

      const res = await api.put("/auth/profile", dataToSubmit);
      if (res.data.success) {
        toast.success("Profile updated successfully!");
        updateUser(res.data.data);
        setIsEditing(false);
        setFormData({ ...formData, password: "" });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-12 transition-colors duration-300">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">My Profile</h1>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
            {/* Header / Avatar */}
            <div className="bg-indigo-600 px-8 py-12 text-center relative">
              <div className="absolute top-4 right-4">
                <button 
                  onClick={logout}
                  className="flex items-center gap-2 text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
              <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-4xl font-bold mx-auto mb-4 border-4 border-indigo-200 dark:border-indigo-400 shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
              <p className="text-indigo-100 mt-1 flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                {user?.role === 'admin' ? 'Administrator' : 'Customer'}
              </p>
            </div>

            {/* User Details */}
            <div className="p-8">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-700 pb-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Account Information</h3>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({ name: user?.name || "", email: user?.email || "", password: "" });
                    }}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>
              
              {!isEditing ? (
                <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Full Name</p>
                    <p className="text-slate-900 dark:text-white font-semibold">{user?.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Email Address</p>
                    <p className="text-slate-900 dark:text-white font-semibold">{user?.email}</p>
                  </div>
                </div>
                </div>
              ) : (
                <form onSubmit={handleUpdate} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10 w-full rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="h-5 w-5" />
                      </div>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10 w-full rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password (optional)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="h-5 w-5" />
                      </div>
                      <input
                        type="password"
                        placeholder="Leave blank to keep current"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10 w-full rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm shadow-indigo-200 dark:shadow-none disabled:opacity-70"
                    >
                      {loading ? (
                        "Saving..."
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-10 flex gap-4 flex-col sm:flex-row">
                <Link 
                  href="/orders"
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 py-3 rounded-xl font-semibold transition-colors"
                >
                  <Package className="w-5 h-5" />
                  View My Orders
                </Link>
                {user?.role === 'admin' && (
                  <Link 
                    href="/admin"
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-900/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-400 py-3 rounded-xl font-semibold transition-colors"
                  >
                    <Shield className="w-5 h-5" />
                    Admin Panel
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
