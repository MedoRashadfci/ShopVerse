import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, ShieldCheck, CreditCard } from "lucide-react";
import FloatingTechBackground from "@/components/FloatingTechBackground";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white overflow-hidden min-h-[80vh] flex items-center transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-slate-100/50 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 z-0 transition-colors duration-300"></div>
        <FloatingTechBackground />
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Premium Tech for <span className="text-indigo-600 dark:text-indigo-400">Modern Life</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-xl">
              Discover our curated collection of premium electronics. Unbeatable quality, exceptional design, and state-of-the-art performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/products" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-md font-semibold text-center transition-colors flex items-center justify-center gap-2"
              >
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Free Shipping</h3>
              <p className="text-slate-600 dark:text-slate-400">On all orders over $100. Fast and secure delivery to your doorstep.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">1 Year Warranty</h3>
              <p className="text-slate-600 dark:text-slate-400">Full protection on all electronic devices. We stand by our quality.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Secure Payment</h3>
              <p className="text-slate-600 dark:text-slate-400">100% secure payment processing with industry standard encryption.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Ready to upgrade your gear?</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">Join thousands of satisfied customers who trust ShopVerse for their premium electronic needs.</p>
          <Link 
            href="/products" 
            className="inline-block bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white px-8 py-3 rounded-md font-semibold transition-colors"
          >
            Explore Catalog
          </Link>
        </div>
      </section>
    </div>
  );
}
