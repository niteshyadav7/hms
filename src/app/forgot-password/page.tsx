"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(data.message || "Password reset instructions have been sent to your email.");
        toast.success("Password reset instructions sent!");
      } else {
        setErrorMsg(data.error || "Failed to process request");
        toast.error(data.error || "Failed to process request");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf7ff] flex flex-col justify-center items-center py-12 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-[#cbc4d2]/40 rounded-2xl p-8 shadow-[0px_0.6rem_2.4rem_rgba(79,55,138,0.08)] space-y-6">
        {/* Header Branding */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 no-underline group mb-1"
            title="Lumina Grand Home"
          >
            <img
              src="/logo.png"
              alt="Lumina Grand Logo"
              className="w-12 h-12 object-cover rounded-full shadow-md transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-extrabold text-2xl tracking-tight text-[#4f378a] leading-none -mt-0.5">
              LR
            </span>
          </Link>
          <h2 className="text-xl font-bold text-[#1d1b20]">Reset Your Password</h2>
          <p className="text-xs text-gray-500 text-center">
            Enter your registered email address and we'll send you password recovery instructions.
          </p>
        </div>

        {message && (
          <div className="bg-green-50 text-green-800 border border-green-200 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{message}</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3.5 rounded-xl text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#494551] block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#f8f2fa] border border-[#cbc4d2] rounded-xl pl-10 pr-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#4f378a]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4f378a] hover:bg-[#3d2a6c] text-white py-3.5 rounded-xl text-sm font-bold shadow-md transition-all border-none cursor-pointer disabled:opacity-60"
          >
            {loading ? "Sending Link..." : "Send Reset Link"}
          </button>
        </form>

        <div className="pt-2 text-center border-t border-[#cbc4d2]/30">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4f378a] hover:underline no-underline"
          >
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
