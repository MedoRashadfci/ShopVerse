"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setResetUrl("");
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      if (res.data.success) {
        setMessage(res.data.message);
        if (res.data.resetUrl) {
          setResetUrl(res.data.resetUrl);
        }
      }
    } catch (err: unknown) {
      const apiMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string; errors?: { message: string }[] } } })
              .response?.data?.message ||
            (err as { response?: { data?: { errors?: { message: string }[] } } }).response?.data
              ?.errors?.[0]?.message
          : undefined;
      setError(apiMessage || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetPath = resetUrl
    ? resetUrl.replace(/^https?:\/\/[^/]+/, "")
    : "";

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div>
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-slate-900 dark:text-white">
            Forgot password
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Enter your email. If the account exists, you&apos;ll get reset instructions.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {message ? (
          <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/50 text-green-700 dark:text-green-400 px-4 py-3 rounded-md text-sm">
            {message}
            {resetPath && (
              <p className="mt-3">
                <Link
                  href={resetPath}
                  className="font-medium text-indigo-600 dark:text-indigo-400 underline"
                >
                  Open reset page (development)
                </Link>
              </p>
            )}
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                htmlFor="email"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send reset link"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          <Link
            href="/login"
            className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
