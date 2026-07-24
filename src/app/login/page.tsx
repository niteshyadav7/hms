"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Phone, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [socialNotice, setSocialNotice] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"GUEST" | "ADMIN">("GUEST");

  const handleSocialLogin = (provider: string) => {
    toast.success(`${provider} OAuth Sign-In connected! Logging in...`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegister
      ? { name, email, password, phone, role }
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed");
      }

      const isApproved = data.data.isApproved ?? true;

      if (isRegister && role === "ADMIN" && !isApproved) {
        toast.success("Staff Account Registered! Pending Admin approval.");
        setIsRegister(false);
        setErrorMsg("Your Hotel Staff account is pending Admin approval. You will be able to log in once an administrator approves your account.");
        return;
      }

      toast.success(isRegister ? "Account created successfully!" : "Logged in successfully!");

      const userRole = data.data.role || data.data.user?.role;
      if (userRole === "ADMIN") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/guest/dashboard";
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf7ff] flex flex-col justify-center items-center py-12 px-4">
      {/* Container */}
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

          </Link>
          <h2 className="text-xl font-bold text-[#1d1b20]">
            {isRegister ? "Create Luxury Account" : "Welcome Back"}
          </h2>
          <p className="text-xs text-gray-500">
            {isRegister
              ? "Register to unlock exclusive guest perks & instant reservations"
              : "Sign in to access your guest portal or concierge desk"}
          </p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Social Coming Soon Notice */}
        {socialNotice && (
          <div className="bg-[#e9ddff] border border-[#6750a4] text-[#4f378a] p-3 rounded-xl text-xs font-semibold text-center animate-bounce">
            {socialNotice}
          </div>
        )}

        {/* Social Login Section */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleSocialLogin("Google")}
            className="w-full py-2.5 px-4 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-sm font-semibold text-gray-700 flex items-center justify-center gap-3 shadow-sm hover:shadow transition-all cursor-pointer"
          >
            {/* Google Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continue with Google
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin("Apple")}
              className="py-2.5 px-4 bg-black text-white hover:bg-gray-900 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {/* Apple Icon */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.16-1.9-14.49-6.1-3.12-2.58-7.06-7.23-11.84-13.95-6.66-9.36-11.97-19.8-15.93-31.33-3.96-11.53-5.94-22.37-5.94-32.53 0-14.18 3.57-26.04 10.72-35.58 7.15-9.54 16.27-14.4 27.36-14.58 4.67 0 9.87 1.25 15.6 3.75 5.73 2.5 9.8 3.82 12.22 3.96 2.1.13 6.34-1.25 12.71-4.14 6.37-2.89 11.83-4.22 16.39-3.99 12.19.63 21.94 5.21 29.26 13.74-10.84 6.55-16.14 15.65-15.9 27.3.26 9.17 3.84 16.85 10.74 23.03 6.9 6.18 15.17 9.82 24.81 10.92-2.31 6.84-5.36 13.62-9.15 20.34zM119.22 31.09c0-7.39 2.72-14.48 8.16-21.28 5.44-6.8 12.44-11.02 21.01-12.67.13 1.05.2 2.05.2 3 0 7.26-2.74 14.44-8.23 21.54-5.49 7.1-12.48 11.39-20.97 12.87-.07-.92-.17-2.08-.17-3.46z" />
              </svg>
              Apple
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("Microsoft")}
              className="py-2.5 px-4 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              {/* Microsoft Icon */}
              <svg className="w-4 h-4" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
              Microsoft
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-3 text-xs text-gray-400 font-medium absolute">or continue with email</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f378a] focus:border-[#4f378a] outline-none transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f378a] focus:border-[#4f378a] outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-gray-700">Password</label>
              {!isRegister && (
                <Link href="/forgot-password" className="text-xs text-[#4f378a] hover:underline font-semibold">
                  Forgot Password?
                </Link>
              )}
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f378a] focus:border-[#4f378a] outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f378a] focus:border-[#4f378a] outline-none transition-all"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Account Role</label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4f378a] focus:border-[#4f378a] outline-none transition-all bg-white"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                >
                  <option value="GUEST">Guest User</option>
                  <option value="ADMIN">Hotel Staff / Receptionist</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#4f378a] hover:bg-[#3d2a6c] text-white rounded-xl text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
          >
            {loading ? "Authenticating..." : isRegister ? "Create Luxury Account" : "Sign In"}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="text-center text-xs text-gray-600 pt-2">
          {isRegister ? "Already have an account? " : "Don't have an account yet? "}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg("");
            }}
            className="text-[#4f378a] hover:underline font-bold bg-transparent border-none cursor-pointer"
          >
            {isRegister ? "Sign In" : "Register Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
