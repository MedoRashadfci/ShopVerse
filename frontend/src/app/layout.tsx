import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopVerse | Premium E-Commerce",
  description: "A premium e-commerce shopping experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50 transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthProvider>
          <CartProvider>
            <Toaster position="bottom-right" />
            <Navbar />
            <CartDrawer />
            <main className="min-h-[calc(100vh-64px)]">{children}</main>
          </CartProvider>
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
