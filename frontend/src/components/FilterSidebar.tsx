"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [categories, setCategories] = useState<Category[]>([]);
  
  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "";
  const minPrice = searchParams.get("price[gte]") || "";
  const maxPrice = searchParams.get("price[lte]") || "";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset to page 1 when filtering
    params.set("page", "1");
    
    router.push(`/products?${params.toString()}`);
  };

  const handlePriceChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const min = formData.get("minPrice") as string;
    const max = formData.get("maxPrice") as string;

    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set("price[gte]", min);
    else params.delete("price[gte]");
    
    if (max) params.set("price[lte]", max);
    else params.delete("price[lte]");

    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/products");
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Filters</h2>
        {(currentCategory || currentSort || minPrice || maxPrice) && (
          <button 
            onClick={clearFilters}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Sort */}
      <div className="mb-8">
        <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-3 text-sm uppercase tracking-wider">Sort By</h3>
        <select
          className="w-full border border-slate-200 dark:border-slate-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          value={currentSort}
          onChange={(e) => handleFilterChange("sort", e.target.value)}
        >
          <option value="">Newest First</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="-createdAt">Newest Arrivals</option>
        </select>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-3 text-sm uppercase tracking-wider">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              className="text-indigo-600 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600"
              checked={currentCategory === ""}
              onChange={() => handleFilterChange("category", "")}
            />
            <span className="text-sm text-slate-600 dark:text-slate-300">All Categories</span>
          </label>
          
          {categories.map((cat) => (
            <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                className="text-indigo-600 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600"
                checked={currentCategory === cat.slug}
                onChange={() => handleFilterChange("category", cat.slug)}
              />
              <span className="text-sm text-slate-600 dark:text-slate-300">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-3 text-sm uppercase tracking-wider">Price Range</h3>
        <form onSubmit={handlePriceChange} className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              defaultValue={minPrice}
              className="w-full border border-slate-200 dark:border-slate-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
            <span className="text-slate-400 dark:text-slate-500">-</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              defaultValue={maxPrice}
              className="w-full border border-slate-200 dark:border-slate-600 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 py-2 rounded-md text-sm font-semibold transition-colors"
          >
            Apply Price Filter
          </button>
        </form>
      </div>
    </div>
  );
}
