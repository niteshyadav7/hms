"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCurrentUser, logout } from "@/redux/slices/authSlice";
import { toast } from "react-hot-toast";

export function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Auto-sync authenticated user session on mount
  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user]);

  // Hide Navbar on Auth and Admin Console Pages
  if (
    pathname === "/login" ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

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

  const handleScrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    if (pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);
    }
  };

  const isRoomsActive = pathname.startsWith("/rooms");
  const isGuestActive = pathname.startsWith("/guest");

  return (
    <>
      <header className="bg-[#fdf7ff]/80 dark:bg-[#1d1b20]/80 backdrop-blur-xl sticky top-0 w-full shadow-[0px_0.6rem_2.4rem_rgba(0,0,0,0.06)] z-50 border-b border-[#cbc4d2]/30">
        <nav className="relative flex justify-between items-center w-full px-6 md:px-12 py-3.5 max-w-[1280px] mx-auto">
          {/* Left: Circular Brand Logo + LR Text */}
          <Link
            href="/"
            className="flex items-center gap-2.5 no-underline group"
            title="Lumina Grand Home"
          >
            <img
              src="/logo.png"
              alt="Lumina Grand Logo"
              className="w-10 h-10 object-cover rounded-full shadow-md transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-extrabold text-xl tracking-tight text-[#4f378a] dark:text-[#e9ddff] leading-none -mt-0.5">
              LR
            </span>
          </Link>

          {/* Center: Nav Links with Hover Underline */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link
              href="/rooms"
              className={`text-sm py-1 no-underline transition-all duration-200 border-b-2 ${
                isRoomsActive
                  ? "text-[#4f378a] font-bold border-[#4f378a]"
                  : "text-[#494551] font-medium border-transparent hover:text-[#4f378a] hover:border-[#4f378a]"
              }`}
            >
              Rooms
            </Link>

            <a
              href="/"
              onClick={(e) => handleScrollToSection(e, "amenities")}
              className="text-sm py-1 no-underline transition-all duration-200 border-b-2 text-[#494551] font-medium border-transparent hover:text-[#4f378a] hover:border-[#4f378a] cursor-pointer"
            >
              Amenities
            </a>

            {user?.role === "ADMIN" ? (
              <Link
                href="/admin/dashboard"
                className="text-[#4f378a] font-bold text-sm py-1 no-underline border-b-2 border-transparent hover:border-[#4f378a] transition-all duration-200"
              >
                Admin Desk
              </Link>
            ) : (
              <Link
                href="/guest/dashboard"
                className={`text-sm py-1 no-underline transition-all duration-200 border-b-2 ${
                  isGuestActive
                    ? "text-[#4f378a] font-bold border-[#4f378a]"
                    : "text-[#494551] font-medium border-transparent hover:text-[#4f378a] hover:border-[#4f378a]"
                }`}
              >
                Guest Portal
              </Link>
            )}
          </div>

          {/* Right Actions: User Account & Book Now */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={user.role === "ADMIN" ? "/admin/dashboard" : "/guest/dashboard"}
                  className="text-xs font-semibold text-[#1d1b20] hover:text-[#4f378a] no-underline"
                >
                  {user.name}
                </Link>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="p-2 rounded-full hover:bg-red-50 text-red-600 transition-all cursor-pointer border-none bg-transparent flex items-center justify-center"
                  title="Logout"
                >
                  <span className="material-symbols-outlined text-red-600 text-xl">logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 rounded-full hover:bg-[#4f378a]/10 transition-all flex items-center justify-center no-underline"
                title="User Account"
              >
                <span className="material-symbols-outlined text-[#4f378a] text-2xl">
                  account_circle
                </span>
              </Link>
            )}

            <Link
              href="/rooms"
              className="hidden md:block bg-[#4f378a] text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:bg-[#3d2a6c] transition-all cursor-pointer no-underline active:scale-95"
            >
              Book Now
            </Link>
          </div>
        </nav>
      </header>

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

export default Navbar;
