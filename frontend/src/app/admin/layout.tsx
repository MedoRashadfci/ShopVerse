"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { LayoutDashboard, Package, ShoppingCart, Users, Tags } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Tags },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Users", href: "/admin/users", icon: Users },
  ];

  return (
    <ProtectedRoute adminOnly>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 dark:bg-slate-950 border-r border-slate-800 dark:border-slate-800 text-white flex-shrink-0 hidden md:flex flex-col transition-colors duration-300">
          <div className="p-6">
            <h2 className="text-lg font-bold tracking-wider text-indigo-400 uppercase">Admin Panel</h2>
          </div>
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-indigo-600 text-white" 
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
