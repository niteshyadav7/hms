"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import { toast } from "react-hot-toast";
import RoomServiceModal from "@/components/RoomServiceModal";
import DigitalKeyModal from "@/components/DigitalKeyModal";
import SpaBookingModal from "@/components/SpaBookingModal";
import ResortMapModal from "@/components/ResortMapModal";
import GuestReviewModal from "@/components/GuestReviewModal";

interface Booking {
  id: string;
  roomName: string;
  location: string;
  dates: string;
  nights: string;
  status: "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED";
  total: number;
  image: string;
}

export default function GuestPortalPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<"ALL" | "UPCOMING" | "PAST">("ALL");

  // Interactive Modals State
  const [showRoomServiceModal, setShowRoomServiceModal] = useState(false);
  const [showDigitalKeyModal, setShowDigitalKeyModal] = useState(false);
  const [showSpaModal, setShowSpaModal] = useState(false);
  const [showResortMapModal, setShowResortMapModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const loadGuestData = () => {
    setLoading(true);
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.user) {
          setUser(data.data.user);
          return fetch(`/api/bookings?userId=${data.data.user.id}`);
        } else {
          router.push("/login");
          return null;
        }
      })
      .then((res) => res?.json())
      .then((data) => {
        if (!data) return;
        if (data.success && Array.isArray(data.data)) {
          const mapped = data.data.map((b: any) => ({
            id: b.id,
            roomName: b.room?.type?.name || b.roomType || "Luxury Suite",
            location: "Lumina Grand Resorts",
            dates: `${new Date(b.checkInDate || b.checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(b.checkOutDate || b.checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
            nights: `${Math.max(1, Math.ceil((new Date(b.checkOutDate || b.checkOut).getTime() - new Date(b.checkInDate || b.checkIn).getTime()) / (1000 * 60 * 60 * 24)))} Nights`,
            status: b.status || "CONFIRMED",
            total: b.totalPrice || 0,
            image:
              b.room?.image ||
              "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85",
          }));
          setBookings(mapped);
        }
      })
      .catch((err) => {
        console.error("Guest dashboard error:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadGuestData();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/me", { method: "POST" });
      await fetch("/api/auth/login", { method: "DELETE" });
    } catch (err) {
      console.error("Logout error:", err);
    }
    dispatch(logout());
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  };

  const handleCancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Booking cancelled successfully.");
        loadGuestData();
      } else {
        toast.error(data.error || "Failed to cancel booking");
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterTab === "UPCOMING") return b.status === "CONFIRMED" || b.status === "CHECKED_IN";
    if (filterTab === "PAST") return b.status === "CHECKED_OUT" || b.status === "CANCELLED";
    return true;
  });

  const upcomingStay = bookings.find((b) => b.status === "CONFIRMED" || b.status === "CHECKED_IN");
  const points = user?.points ?? (bookings.length * 500);

  if (loading || !user) {
    return null;
  }

  return (
    <main className="max-w-[1280px] mx-auto px-4 md:px-12 py-10 text-[#1d1b20]">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <span className="text-[#4f378a] font-semibold text-xs tracking-widest uppercase block mb-1">
            Member Overview
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1d1b20]">
            Welcome back, {user?.name || "Guest"}
          </h1>
          <p className="text-[#494551] text-sm mt-1">
            Manage your upcoming stays and relive past memories at Lumina Grand.
          </p>
        </div>

        {/* 2 Floating KPI Cards */}
        <div className="flex gap-4">
          <Link
            href="/guest/rewards"
            className="glass-panel aura-shadow rounded-xl p-4 flex flex-col min-w-[160px] bg-white/70 backdrop-blur-xl border border-white/50 no-underline hover:border-[#4f378a]/40 transition-all group"
          >
            <span className="text-xs text-[#494551] font-medium group-hover:text-[#4f378a]">Lumina Points ➔</span>
            <span className="text-2xl font-bold text-[#4f378a] mt-1">{points.toLocaleString()}</span>
          </Link>

          <div className="glass-panel aura-shadow rounded-xl p-4 flex flex-col min-w-[160px] bg-white/70 backdrop-blur-xl border border-white/50">
            <span className="text-xs text-[#494551] font-medium">Next Stay</span>
            <span className="text-sm font-bold text-[#1d1b20] mt-1 line-clamp-1">
              {upcomingStay ? upcomingStay.roomName : "No Active Stay"}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Bookings Table Container */}
        <div className="md:col-span-12 glass-panel aura-shadow rounded-2xl overflow-hidden border border-white/60 bg-white/70 backdrop-blur-xl">
          <div className="p-6 border-b border-[#cbc4d2]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#f8f2fa]/50">
            <h2 className="text-xl font-bold text-[#1d1b20]">Your Bookings</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterTab("ALL")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer border-none transition-all ${
                  filterTab === "ALL"
                    ? "bg-[#6750a4] text-white"
                    : "bg-transparent text-[#494551] hover:bg-[#e6e0e9]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterTab("UPCOMING")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer border-none transition-all ${
                  filterTab === "UPCOMING"
                    ? "bg-[#6750a4] text-white"
                    : "bg-transparent text-[#494551] hover:bg-[#e6e0e9]"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilterTab("PAST")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer border-none transition-all ${
                  filterTab === "PAST"
                    ? "bg-[#6750a4] text-white"
                    : "bg-transparent text-[#494551] hover:bg-[#e6e0e9]"
                }`}
              >
                Past
              </button>
            </div>
          </div>

          <div className="w-full overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[#494551] text-xs font-semibold uppercase tracking-wider border-b border-[#cbc4d2]/20">
                  <th className="px-6 py-4">Destination / Room</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#cbc4d2]/10 text-sm">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      <p className="text-sm font-medium">No bookings found for your account yet.</p>
                      <Link
                        href="/rooms"
                        className="mt-3 inline-block bg-[#4f378a] text-white px-5 py-2 rounded-lg text-xs font-semibold hover:bg-[#3d2a6c] transition-all no-underline"
                      >
                        Explore Rooms & Book Now
                      </Link>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-white/40 transition-transform duration-300 hover:translate-x-1"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-xl bg-cover bg-center flex-shrink-0"
                          style={{ backgroundImage: `url('${b.image}')` }}
                        />
                        <div>
                          <div className="font-bold text-[#1d1b20]">{b.roomName}</div>
                          <div className="text-xs text-[#494551]">{b.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-medium text-[#1d1b20]">{b.dates}</span>
                        <span className="text-xs text-[#494551]">{b.nights}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {b.status === "CONFIRMED" && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#e8f5e9] text-[#2e7d32] border border-[#2e7d32]/20">
                          Confirmed
                        </span>
                      )}
                      {b.status === "CHECKED_IN" && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#e3f2fd] text-[#1565c0] border border-[#1565c0]/20">
                          Checked-In
                        </span>
                      )}
                      {b.status === "CHECKED_OUT" && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#e6e0e9] text-[#494551] border border-[#cbc4d2]/30">
                          Completed
                        </span>
                      )}
                      {b.status === "CANCELLED" && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/20">
                          Cancelled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 font-bold text-[#1d1b20]">
                      ₹{b.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-5 text-right">
                      {b.status === "CONFIRMED" && (
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="text-red-600 font-semibold text-xs hover:underline cursor-pointer border-none bg-transparent"
                        >
                          Cancel Booking
                        </button>
                      )}
                      {b.status === "CHECKED_IN" && (
                        <button
                          onClick={() => setShowDigitalKeyModal(true)}
                          className="text-[#4f378a] font-semibold text-xs border border-[#4f378a]/30 px-3.5 py-1.5 rounded-lg hover:bg-[#4f378a]/5 transition-all cursor-pointer bg-transparent"
                        >
                          View Key & Controls
                        </button>
                      )}
                      {b.status === "CHECKED_OUT" && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setShowReviewModal(true)}
                            className="text-[#4f378a] font-semibold text-xs border border-[#4f378a]/30 px-3 py-1.5 rounded-lg hover:bg-[#4f378a]/5 transition-all cursor-pointer bg-transparent"
                          >
                            Review Stay
                          </button>
                          <Link
                            href="/rooms"
                            className="bg-[#4f378a] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#3d2a6c] transition-all no-underline inline-block"
                          >
                            Book Again
                          </Link>
                        </div>
                      )}
                      {b.status === "CANCELLED" && (
                        <button
                          onClick={() => toast.success(`Booking Ref #${b.id.slice(-6).toUpperCase()}`)}
                          className="text-[#494551] font-semibold text-xs hover:text-[#4f378a] cursor-pointer border-none bg-transparent"
                        >
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-[#f8f2fa]/30 text-center border-t border-[#cbc4d2]/20">
            <button
              onClick={() => alert("Downloading PDF Stay History Statement...")}
              className="text-[#4f378a] font-semibold text-xs hover:underline cursor-pointer border-none bg-transparent"
            >
              Download Stay History (PDF)
            </button>
          </div>
        </div>

        {/* Promotion / Loyalty Card */}
        <div className="md:col-span-8 relative overflow-hidden glass-panel aura-shadow rounded-2xl p-8 min-h-[300px] flex flex-col justify-end">
          <div className="absolute inset-0 z-0">
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4f378a]/90 via-[#4f378a]/30 to-transparent" />
          </div>
          <div className="relative z-10 text-white space-y-3">
            <span className="bg-[#ffdf93] text-[#594400] px-3 py-1 rounded-full text-xs font-bold inline-block">
              Exclusive Offer
            </span>
            <h3 className="text-2xl md:text-3xl font-bold leading-tight">
              Upgrade your upcoming Maldives stay
            </h3>
            <p className="text-sm opacity-90 max-w-md">
              Redeem 5,000 points for an Ocean View upgrade and early check-in privileges.
            </p>
            <button
              onClick={() => alert("Offer Redeemed! 5,000 points applied.")}
              className="mt-2 bg-white text-[#4f378a] font-bold text-xs px-6 py-3 rounded-lg hover:bg-gray-100 active:scale-95 transition-all cursor-pointer border-none shadow-md"
            >
              Claim Upgrade
            </button>
          </div>
        </div>

        {/* Quick Support Sidebar */}
        <div className="md:col-span-4 glass-panel aura-shadow rounded-2xl p-6 flex flex-col gap-4 bg-white/70 backdrop-blur-xl border border-white/60">
          <h3 className="text-lg font-bold text-[#1d1b20]">Guest Support & Amenities</h3>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setShowResortMapModal(true)}
              className="flex items-center gap-4 p-3.5 rounded-xl bg-[#ece6ee]/50 hover:bg-[#e9ddff] transition-all text-left border-none cursor-pointer group"
            >
              <span className="material-symbols-outlined p-2 bg-white rounded-full text-[#4f378a] shadow-sm group-hover:bg-[#e9ddff]">
                map
              </span>
              <div>
                <span className="block font-bold text-xs text-[#1d1b20]">Interactive Island Map</span>
                <span className="text-[11px] text-gray-500">Explore overwater bungalows & spots</span>
              </div>
            </button>

            <button
              onClick={() => setShowDigitalKeyModal(true)}
              className="flex items-center gap-4 p-3.5 rounded-xl bg-[#ece6ee]/50 hover:bg-[#e9ddff] transition-all text-left border-none cursor-pointer group"
            >
              <span className="material-symbols-outlined p-2 bg-white rounded-full text-[#4f378a] shadow-sm group-hover:bg-[#e9ddff]">
                key
              </span>
              <div>
                <span className="block font-bold text-xs text-[#1d1b20]">Digital Suite Key</span>
                <span className="text-[11px] text-gray-500">NFC door & room lighting/temp</span>
              </div>
            </button>

            <button
              onClick={() => setShowRoomServiceModal(true)}
              className="flex items-center gap-4 p-3.5 rounded-xl bg-[#ece6ee]/50 hover:bg-[#e9ddff] transition-all text-left border-none cursor-pointer group"
            >
              <span className="material-symbols-outlined p-2 bg-white rounded-full text-[#4f378a] shadow-sm group-hover:bg-[#e9ddff]">
                restaurant
              </span>
              <div>
                <span className="block font-bold text-xs text-[#1d1b20]">In-Room Gourmet Dining</span>
                <span className="text-[11px] text-gray-500">Order breakfast, steak & cocktails</span>
              </div>
            </button>

            <button
              onClick={() => setShowSpaModal(true)}
              className="flex items-center gap-4 p-3.5 rounded-xl bg-[#ece6ee]/50 hover:bg-[#e9ddff] transition-all text-left border-none cursor-pointer group"
            >
              <span className="material-symbols-outlined p-2 bg-[#4f378a] text-amber-300 rounded-full shadow-sm">
                spa
              </span>
              <div>
                <span className="block font-bold text-xs text-[#1d1b20]">Wellness & Spa</span>
                <span className="text-[11px] text-gray-500">Reserve massage & hydrotherapy</span>
              </div>
            </button>
          </div>

          <div className="mt-auto pt-4 border-t border-[#cbc4d2]/20">
            <p className="text-[11px] text-[#494551] italic">
              Need help? Call our 24/7 priority member line at +1 (800) LUMINA-G
            </p>
          </div>
        </div>
      </div>

      {/* Render Modals */}
      <RoomServiceModal
        isOpen={showRoomServiceModal}
        onClose={() => setShowRoomServiceModal(false)}
      />
      <DigitalKeyModal
        isOpen={showDigitalKeyModal}
        onClose={() => setShowDigitalKeyModal(false)}
      />
      <SpaBookingModal
        isOpen={showSpaModal}
        onClose={() => setShowSpaModal(false)}
      />
      <ResortMapModal
        isOpen={showResortMapModal}
        onClose={() => setShowResortMapModal(false)}
      />
      <GuestReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
      />
    </main>
  );
}
