"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCurrentUser, logout } from "@/redux/slices/authSlice";
import { toast } from "react-hot-toast";
import AiModeDrawer from "@/components/AiModeDrawer";
import { useNotifications } from "@/components/NotificationProvider";

export function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  const { notifications, unreadCount, markAllAsRead, clearNotification } = useNotifications();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAiMode, setShowAiMode] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Auto-sync authenticated user session on mount
  useEffect(() => {
    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, user]);

  // Click outside to close notification & user dropdown menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    setShowUserMenu(false);
    toast.success("Signed out successfully");
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

  return (
    <>
      <header className="bg-white/95 dark:bg-[#1d1b20]/95 backdrop-blur-2xl sticky top-0 w-full shadow-[0px_4px_24px_rgba(79,55,138,0.08)] z-50 border-b border-[#cbc4d2]/40">
        <nav className="flex justify-between items-center w-full px-4 md:px-8 py-3 max-w-[1340px] mx-auto gap-4">
          {/* Left: Brand Logo & Title */}
          <Link
            href="/"
            className="flex items-center gap-2.5 no-underline group flex-shrink-0"
            title="Lumina Grand Home"
          >
            <img
              src="/logo.png"
              alt="Lumina Grand Logo"
              className="w-9 h-9 object-cover rounded-full shadow-md transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-[#755b00] to-[#48645d] bg-clip-text text-transparent leading-none">
              Lumina Grand
            </span>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/rooms"
              className={`text-xs font-bold py-1 no-underline transition-all duration-200 border-b-2 ${isRoomsActive
                  ? "text-[#755b00] border-[#755b00]"
                  : "text-[#4d4635] border-transparent hover:text-[#755b00]"
                }`}
            >
              Rooms & Suites
            </Link>

            <button
              onClick={(e) => handleScrollToSection(e, "amenities")}
              className="text-xs font-bold text-[#4d4635] hover:text-[#755b00] transition-colors border-none bg-transparent cursor-pointer"
            >
              Amenities
            </button>

            <button
              onClick={(e) => handleScrollToSection(e, "weddings")}
              className="text-xs font-bold text-[#4d4635] hover:text-[#755b00] transition-colors border-none bg-transparent cursor-pointer"
            >
              Weddings & Events
            </button>
          </div>

          {/* Right Action Controls: AI Mode -> Notifications -> Rightmost User Profile Dropdown */}
          <div className="flex items-center gap-3 flex-shrink-0 relative">
            {/* AI Mode Trigger Button */}
            <button
              onClick={() => setShowAiMode(true)}
              className="bg-gradient-to-r from-[#755b00] to-[#c9a227] hover:from-[#584400] hover:to-[#755b00] text-white px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95 whitespace-nowrap border-none"
              title="Launch Conversational AI Mode"
            >
              <span className="material-symbols-outlined text-sm text-[#ffe08e]">auto_awesome</span>
              <span>✨ AI Mode</span>
            </button>

            {/* Real-Time Push Notification Bell Button with Click-Outside Ref */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2 rounded-xl hover:bg-[#f8f2fa] text-[#4f378a] border border-[#cbc4d2]/30 bg-white transition-all cursor-pointer relative flex items-center justify-center shadow-2xs"
                title="Notifications"
              >
                <span className="material-symbols-outlined text-xl">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Menu */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1d1b20] border border-[#cbc4d2]/40 rounded-2xl shadow-2xl p-4 z-50 text-left space-y-3 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex justify-between items-center border-b border-[#cbc4d2]/30 pb-2">
                    <h4 className="text-xs font-extrabold text-[#1d1b20] dark:text-white flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#4f378a]">notifications_active</span>
                      Live Alerts ({notifications.length})
                    </h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] font-bold text-[#4f378a] hover:underline border-none bg-transparent cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border text-xs relative ${n.read
                            ? "bg-[#f8f2fa]/50 dark:bg-[#25222a] border-[#cbc4d2]/20 text-gray-600 dark:text-gray-300"
                            : "bg-[#e9ddff]/40 dark:bg-[#4f378a]/30 border-[#4f378a]/30 font-semibold text-[#1d1b20] dark:text-white"
                          }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-extrabold text-[11px] block">{n.title}</span>
                          <button
                            onClick={() => clearNotification(n.id)}
                            className="text-gray-400 hover:text-red-500 border-none bg-transparent cursor-pointer p-0 ml-1"
                          >
                            <span className="material-symbols-outlined text-xs">close</span>
                          </button>
                        </div>
                        <p className="text-[10px] opacity-90 mt-1 leading-relaxed">{n.message}</p>
                        <span className="text-[9px] opacity-60 block mt-1">{n.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Rightmost Corner: User Account Dropdown Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="bg-[#f6f3f2] dark:bg-[#25222a] hover:bg-[#ffe08e]/40 text-[#755b00] dark:text-[#ffe08e] px-3.5 py-2 rounded-full border border-[#d1c5af]/50 shadow-xs flex items-center gap-2 text-xs font-bold transition-all cursor-pointer active:scale-95"
                  title="Account Menu"
                >
                  <span className="material-symbols-outlined text-base">account_circle</span>
                  <span>{user.name}</span>
                  <span className="material-symbols-outlined text-xs transition-transform duration-200">
                    keyboard_arrow_down
                  </span>
                </button>

                {/* Luxury Profile Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1d1b20] border border-[#d1c5af]/50 rounded-2xl shadow-2xl p-4 z-50 text-left space-y-3 animate-in fade-in zoom-in-95 duration-150">
                    <div className="border-b border-[#cbc4d2]/30 pb-3">
                      <div className="font-extrabold text-xs text-[#1b1c1c] dark:text-white leading-tight">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-[#7f7663] truncate mt-0.5">{user.email}</div>
                      <span className="inline-block mt-1.5 bg-[#ffe08e]/40 text-[#755b00] text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#c9a227]/40">
                        Gold VIP Member
                      </span>
                    </div>

                    <div className="space-y-1">
                      <Link
                        href={user.role === "ADMIN" ? "/admin/dashboard" : "/guest/dashboard"}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-[#1b1c1c] dark:text-gray-200 hover:bg-[#f6f3f2] dark:hover:bg-[#25222a] no-underline transition-all"
                      >
                        <span className="material-symbols-outlined text-base text-[#755b00]">dashboard</span>
                        <span>My Dashboard & Stays</span>
                      </Link>

                      <Link
                        href="/guest/rewards"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-[#f8f2fa] dark:hover:bg-[#25222a] no-underline transition-all"
                      >
                        <span className="material-symbols-outlined text-base text-amber-500">stars</span>
                        <span>Rewards & Loyalty Points</span>
                      </Link>
                    </div>

                    <div className="border-t border-[#cbc4d2]/30 pt-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setShowLogoutModal(true);
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all border-none bg-transparent cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base text-red-600">logout</span>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-[#f8f2fa] dark:bg-[#25222a] hover:bg-[#e9ddff] text-[#4f378a] px-3.5 py-2 rounded-xl text-xs font-bold transition-all border border-[#cbc4d2]/40 flex items-center gap-1.5 no-underline shadow-2xs"
                title="Sign In to Guest Account"
              >
                <span className="material-symbols-outlined text-base">account_circle</span>
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </nav>
      </header>

      <AiModeDrawer isOpen={showAiMode} onClose={() => setShowAiMode(false)} />

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-[#cbc4d2]/40 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-5 text-center relative animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">logout</span>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#1d1b20]">Confirm Sign Out</h3>
              <p className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">
                Are you sure you want to log out of your Lumina Grand account?
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-[#f8f2fa] hover:bg-[#e6e0e9] text-[#1d1b20] py-2.5 rounded-xl text-xs font-bold transition-all border-none cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all border-none cursor-pointer shadow-md"
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
