"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.put(`/auth/reset-password/${token}`, { password });
      if (res.data.success) {
        setSuccess(res.data.message);
        setTimeout(() => router.push("/login"), 2500);
      }
    } catch (err: unknown) {
      const apiMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string; errors?: { message: string }[] } } })
              .response?.data?.message ||
            (err as { response?: { data?: { errors?: { message: string }[] } } }).response?.data
              ?.errors?.[0]?.message
          : undefined;
      setError(apiMessage || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-red-600 dark:text-red-400 text-sm">
          This reset link is invalid or missing.
        </p>
        <Link
          href="/forgot-password"
          className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm mb-4">
          {error}
        </div>
      )}

      {success ? (
        <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/50 text-green-700 dark:text-green-400 px-4 py-3 rounded-md text-sm">
          {success}
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Redirecting to sign in...</p>
        </div>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="password">
              New password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-indigo-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="confirm">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              required
              minLength={6}
              className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-indigo-500 sm:text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset password"}
          </button>
        </form>
      )}

      <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
        <Link href="/login" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
          Back to sign in
        </Link>
      </p>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div>
          <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-slate-900 dark:text-white">
            Set new password
          </h2>
        </div>
        <Suspense
          fallback={
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
