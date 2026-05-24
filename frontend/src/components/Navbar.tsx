"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, User, Menu, Search, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Prevent hydration mismatch for theme toggle
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await api.get(`/products?search=${encodeURIComponent(searchQuery)}&limit=5`);
        if (res.data.success) {
          setSuggestions(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch suggestions", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      setIsMobileMenuOpen(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="font-bold text-xl hidden sm:inline-block text-slate-900 dark:text-white">ShopVerse</span>
        </Link>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full h-9 pl-9 pr-4 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all dark:text-slate-200"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
          </form>

          {/* Desktop Search Suggestions */}
          {showSuggestions && searchQuery.trim() !== "" && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-100 dark:border-slate-700 z-50 overflow-hidden">
              {isSearching ? (
                <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 text-center">Searching...</div>
              ) : suggestions.length > 0 ? (
                <ul>
                  {suggestions.map((product) => (
                    <li key={product._id}>
                      <button
                        onClick={() => {
                          setShowSuggestions(false);
                          setSearchQuery("");
                          router.push(`/products/${product._id}`);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-3 transition-colors"
                      >
                        <div className="w-8 h-8 relative rounded overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                          {product.image ? (
                            <img src={product.image} alt={product.title} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full bg-slate-200 dark:bg-slate-600"></div>
                          )}
                        </div>
                        <div className="flex-1 truncate">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{product.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">${product.price.toFixed(2)}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                  <li>
                    <button 
                      onClick={handleSearchSubmit}
                      className="w-full text-center px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 border-t border-slate-100 dark:border-slate-700"
                    >
                      View all results
                    </button>
                  </li>
                </ul>
              ) : (
                <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 text-center">No products found</div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link href="/products" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hidden sm:block">
            Products
          </Link>
          
          {isAuthenticated && (
            <Link href="/orders" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hidden sm:block">
              Orders
            </Link>
          )}

          {/* Cart Icon */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-semibold text-sm border border-indigo-200 dark:border-indigo-800">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </button>

              {/* Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 border border-slate-100 dark:border-slate-700 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <Link 
                    href="/profile" 
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  {user?.role === 'admin' && (
                    <Link 
                      href="/admin" 
                      className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  
                  {/* Theme Toggle */}
                  <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700 mt-1 flex items-center justify-between">
                    <span className="text-sm text-slate-700 dark:text-slate-200">Theme</span>
                    <button
                      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                      className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors w-8 h-8 flex items-center justify-center"
                    >
                      {mounted ? (
                        resolvedTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 border-t border-slate-100 dark:border-slate-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-4">
              <button
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-9 h-9 flex items-center justify-center"
              >
                {mounted ? (
                  resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />
                ) : (
                  <div className="w-5 h-5" />
                )}
              </button>
              <Link href="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Log in
              </Link>
              <Link href="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="sm:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-4 shadow-lg transition-colors duration-300">
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full h-9 pl-9 pr-4 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:text-slate-200 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          
          {/* Mobile Search Suggestions (inline) */}
          {searchQuery.trim() !== "" && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-md border border-slate-100 dark:border-slate-700 overflow-hidden mb-4">
              {isSearching ? (
                <div className="px-4 py-3 text-sm text-slate-500 text-center">Searching...</div>
              ) : suggestions.length > 0 ? (
                <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                  {suggestions.map((product) => (
                    <li key={product._id}>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setIsMobileMenuOpen(false);
                          router.push(`/products/${product._id}`);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3"
                      >
                        <div className="w-8 h-8 relative rounded overflow-hidden bg-slate-200 dark:bg-slate-600 flex-shrink-0">
                          {product.image && <img src={product.image} alt={product.title} className="object-cover w-full h-full" />}
                        </div>
                        <div className="flex-1 truncate">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{product.title}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                  <li>
                    <button 
                      onClick={handleSearchSubmit}
                      className="w-full text-center px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium bg-slate-100/50 dark:bg-slate-700/30"
                    >
                      View all results
                    </button>
                  </li>
                </ul>
              ) : (
                <div className="px-4 py-3 text-sm text-slate-500 text-center">No products found</div>
              )}
            </div>
          )}

          <Link href="/products" className="block text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400">Products</Link>
          {isAuthenticated ? (
            <>
              <Link href="/orders" className="block text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400">Orders</Link>
              {user?.role === 'admin' && (
                <Link href="/admin" className="block text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400">Admin Dashboard</Link>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <Link href="/login" className="block text-sm font-medium text-slate-700 dark:text-slate-200 text-center py-2 border border-slate-200 dark:border-slate-700 rounded-md">Log in</Link>
              <Link href="/register" className="block text-sm font-medium text-white bg-indigo-600 text-center py-2 rounded-md">Sign up</Link>
            </div>
          )}
          
          {/* Mobile Theme Toggle */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Appearance</span>
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors w-9 h-9 flex items-center justify-center"
            >
              {mounted ? (
                resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />
              ) : (
                <div className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
