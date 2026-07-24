"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import { toast } from "react-hot-toast";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems = [
    { href: "/admin/dashboard", label: "Overview", icon: "dashboard" },
    { href: "/admin/bookings", label: "Bookings", icon: "calendar_month" },
    { href: "/admin/rooms", label: "Rooms", icon: "bed" },
    { href: "/admin/guests", label: "Guests", icon: "group" },
    { href: "/admin/dashboard#financials", label: "Financials", icon: "payments" },
  ];

  const handleConfirmLogout = async () => {
    try {
      await fetch("/api/auth/me", { method: "POST" });
      await fetch("/api/auth/login", { method: "DELETE" });
    } catch (err) {
      console.error("Logout error:", err);
    }
    dispatch(logout());
    setShowLogoutModal(false);
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[#f8f2fa] border-r border-[#cbc4d2]/40 flex flex-col p-6 z-40 justify-between">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2">
            <img
              src="/logo.png"
              alt="Lumina Grand Admin Logo"
              className="w-10 h-10 object-cover rounded-full shadow-md"
            />
            <div>
              <h1 className="text-xl font-extrabold text-[#4f378a] tracking-tight leading-none">LR</h1>
              <p className="text-xs text-[#494551] opacity-80 font-semibold mt-1">Admin Console</p>
            </div>
          </div>

          {/* Navigation Links in consistent order */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isOverviewActive = item.href === "/admin/dashboard" && pathname === "/admin/dashboard";
              const isBookingsActive = item.href === "/admin/bookings" && pathname === "/admin/bookings";
              const isRoomsActive = item.href === "/admin/rooms" && pathname === "/admin/rooms";
              const isGuestsActive = item.href === "/admin/guests" && pathname === "/admin/guests";
              
              const active = isOverviewActive || isBookingsActive || isRoomsActive || isGuestsActive;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all no-underline ${
                    active
                      ? "bg-[#4f378a] text-white shadow-sm"
                      : "text-[#494551] hover:bg-[#e6e0e9] hover:text-[#4f378a]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Button, Bottom Link & Logout */}
        <div className="space-y-3 pt-4 border-t border-[#cbc4d2]/30">
          <Link
            href="/admin/bookings"
            className="w-full bg-[#4f378a] hover:bg-[#3d2a6c] text-white py-3 rounded-xl font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 no-underline"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Quick Check-in</span>
          </Link>

          <div className="flex items-center justify-between px-1">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs font-semibold text-[#494551] hover:text-[#4f378a] no-underline"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              <span>Website</span>
            </Link>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800 transition-colors border-none bg-transparent cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal Overlay */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-[#cbc4d2]/40 rounded-2xl p-6 max-w-sm w-full aura-shadow space-y-5 text-center relative animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">logout</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1d1b20]">Confirm Sign Out</h3>
              <p className="text-xs text-[#494551] mt-1 font-medium leading-relaxed">
                Are you sure you want to log out of your Lumina Grand account?
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-[#f8f2fa] hover:bg-[#e6e0e9] text-[#1d1b20] py-2.5 rounded-xl text-xs font-semibold transition-all border-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-semibold transition-all border-none cursor-pointer shadow-md"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
