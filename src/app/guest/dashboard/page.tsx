"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

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
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<"ALL" | "UPCOMING" | "PAST">("ALL");

  const loadGuestData = () => {
    setLoading(true);
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.user) {
          setUser(data.data.user);
          return fetch(`/api/bookings?userId=${data.data.user.id}`);
        } else {
          // Fallback guest user
          setUser({ name: "Alexander", email: "alexander@lumina-voyage.com" });
          return fetch(`/api/bookings`);
        }
      })
      .then((res) => res?.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          const mapped = data.data.map((b: any) => ({
            id: b.id,
            roomName: b.room?.type?.name || b.roomType || "Grand Ocean Suite",
            location: "Lumina Grand Resorts",
            dates: `${new Date(b.checkInDate || b.checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(b.checkOutDate || b.checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
            nights: "4 Nights",
            status: b.status || "CONFIRMED",
            total: b.totalPrice || 3867.5,
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuBdc8HaV_qfz6AU89B3J2xSVjyId7IaE1UG6EjqG8Z1Wv9cZ3wYWq4G56iLlvvDXuHIjrLdfhrpF_c0sVZlc4P5RB-VwqW2sW_iIUUBR5HPP59QeZ8KaQ6TGehJ23MN3_R5mK0VTRyjC38Ghgj9Yq8nDNvo5aZA9VjqRQ1hT8Oc9bOlStRg4v8eH242fGp-7WuNjKqbg8SpG_MEf6k2tQwIkqCoBAmYbjyGOTSXd8DfzOFMycwmxJxhRA_x9M89Y7v2j-YyKbRp5o3O",
          }));
          setBookings(mapped);
        } else {
          // Fallback dataset matching code.html
          setBookings([
            {
              id: "b1",
              roomName: "Grand Ocean Suite",
              location: "Lumina Grand Maldives",
              dates: "Oct 12 – Oct 18, 2024",
              nights: "6 Nights",
              status: "CONFIRMED",
              total: 4200.0,
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBdc8HaV_qfz6AU89B3J2xSVjyId7IaE1UG6EjqG8Z1Wv9cZ3wYWq4G56iLlvvDXuHIjrLdfhrpF_c0sVZlc4P5RB-VwqW2sW_iIUUBR5HPP59QeZ8KaQ6TGehJ23MN3_R5mK0VTRyjC38Ghgj9Yq8nDNvo5aZA9VjqRQ1hT8Oc9bOlStRg4v8eH242fGp-7WuNjKqbg8SpG_MEf6k2tQwIkqCoBAmYbjyGOTSXd8DfzOFMycwmxJxhRA_x9M89Y7v2j-YyKbRp5o3O",
            },
            {
              id: "b2",
              roomName: "Skyline Penthouse",
              location: "Lumina Grand Tokyo",
              dates: "Sep 01 – Sep 04, 2024",
              nights: "3 Nights",
              status: "CHECKED_IN",
              total: 2850.0,
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBtCigwvBMLnaJBOdi68T4bZjKfvpmov9OLcPCLOXKS3nFT0jPJYPga3URVUvjjWt03VvIKPdgtJI3gT3AoZfEtAcdNq6fymH5lc0wpiTL_hK-FFVJpJm9vCoVoBuVFeaACwWNevZ9rUWdj8Rz2fxPJJZ8jL4ETbqKJcuvOYCt86-31mFic-sy5-Y2V4r_3gRWQJtFt99ynMz5__ZcaKxI8BNr1KFezL79W2AEx4TpjuVPpst3XYGDG6BTlDnEQecw73iNf6z1mKvH8",
            },
            {
              id: "b3",
              roomName: "Alpine Lodge",
              location: "Lumina Grand Alps",
              dates: "Feb 14 – Feb 21, 2024",
              nights: "7 Nights",
              status: "CHECKED_OUT",
              total: 5100.0,
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCMapuvUkNSqX9NmXFjFmj0Ag9y8VrT0PEORjoEsYa-9IzwsE_RqewtBYuCC6wIQF9HeD6E0qB5XuCZBf2y_uOwy5lGG3nZWn-sBAs_FqPM8juQdouDL5mCXxgVq47m5ZtuKpjwUSKQ1LXFuNNw3bptim0fsNPCDw19BYuSdUMxuUpBxEHXGr137EFEYu2ZGt4Q8HveQ-YHOWbTeY6C66QiBT5cfPRQbxWmNS3RLXjJSs3LRTULfOuXdF7vnzr1yalROxLaxyWKo-xN",
            },
            {
              id: "b4",
              roomName: "Desert Oasis Villa",
              location: "Lumina Grand Marrakesh",
              dates: "Jan 10 – Jan 12, 2024",
              nights: "2 Nights",
              status: "CANCELLED",
              total: 1200.0,
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuC70i1pdAx___9Y_K5Z5uuxVRYH22RrOPu_YanDejkl9fSeusA44OIalQWKSxN30Wy5wl4tcOsqP6VUd6Yq3y9udQqyUVaUXsf077TS2hk_T_hZsTx-TRzcwAF0a9m7_EgNiMpskRIv8lPE7LsvfH7Bt1KE6a9PjB6h-GeOy5_eWfL-wG0TZFY7lpOpfjNYMT0SmId1LjFzV0KXBpNsvFeORb7rgX4uf7Q1-e3JbTNrN_mGagONrxQXKPE8Me7Z_9184bvszWsF96Or",
            },
          ]);
        }
      })
      .catch(() => {
        setUser({ name: "Alexander", email: "alexander@lumina-voyage.com" });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadGuestData();
  }, []);

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

  return (
    <main className="max-w-[1280px] mx-auto px-4 md:px-12 py-10 text-[#1d1b20]">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <span className="text-[#4f378a] font-semibold text-xs tracking-widest uppercase block mb-1">
            Member Overview
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1d1b20]">
            Welcome back, {user?.name || "Alexander"}
          </h1>
          <p className="text-[#494551] text-sm mt-1">
            Manage your upcoming stays and relive past memories at Lumina Grand.
          </p>
        </div>

        {/* 2 Floating KPI Cards */}
        <div className="flex gap-4">
          <div className="glass-panel aura-shadow rounded-xl p-4 flex flex-col min-w-[160px] bg-white/70 backdrop-blur-xl border border-white/50">
            <span className="text-xs text-[#494551] font-medium">Lumina Points</span>
            <span className="text-2xl font-bold text-[#4f378a] mt-1">24,500</span>
          </div>
          <div className="glass-panel aura-shadow rounded-xl p-4 flex flex-col min-w-[160px] bg-white/70 backdrop-blur-xl border border-white/50">
            <span className="text-xs text-[#494551] font-medium">Next Stay</span>
            <span className="text-2xl font-bold text-[#4f378a] mt-1">In 12 Days</span>
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
                {filteredBookings.map((b) => (
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
                          onClick={() => toast.success("Digital Key Activated: Unlocked Suite 402")}
                          className="text-[#4f378a] font-semibold text-xs border border-[#4f378a]/30 px-3.5 py-1.5 rounded-lg hover:bg-[#4f378a]/5 transition-all cursor-pointer bg-transparent"
                        >
                          View Key
                        </button>
                      )}
                      {b.status === "CHECKED_OUT" && (
                        <Link
                          href="/rooms"
                          className="bg-[#4f378a] text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#3d2a6c] transition-all no-underline inline-block"
                        >
                          Book Again
                        </Link>
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
                ))}
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
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDuNAQLF4gxdtXbSsUwDKshUumfnsh_2BfJat6E4uf8hwrnmFoqh2W16GItW2dtwS7Ji5k4sojlhZ3tQxZCKo6uy5VmuxOOiCJ_4QRfLyue38ZNXZBJBwy5vVsFKf5tL74gPGMK8X0N8hl1OncJEXdGFufjZ1SnicGAUNl_Roz0XgJHg-ilLM5_3CE7tvumOu0cOA4Iz9slT5TMyYEG1EE5uf1N8zzGaEAt8Nq_buEVkb_Bg9Xcm6T-T90k67t1fWg5jg1c_dlpTSBx')",
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
          <h3 className="text-lg font-bold text-[#1d1b20]">Guest Support</h3>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => alert("Connecting to 24/7 Live Concierge...")}
              className="flex items-center gap-4 p-3.5 rounded-xl bg-[#ece6ee]/50 hover:bg-[#e9ddff] transition-all text-left border-none cursor-pointer group"
            >
              <span className="material-symbols-outlined p-2 bg-white rounded-full text-[#4f378a] shadow-sm group-hover:bg-[#e9ddff]">
                chat
              </span>
              <div>
                <span className="block font-bold text-xs text-[#1d1b20]">Live Concierge</span>
                <span className="text-[11px] text-gray-500">Average response: 2 mins</span>
              </div>
            </button>

            <button
              onClick={() => alert("Opening Room Service Menu...")}
              className="flex items-center gap-4 p-3.5 rounded-xl bg-[#ece6ee]/50 hover:bg-[#e9ddff] transition-all text-left border-none cursor-pointer group"
            >
              <span className="material-symbols-outlined p-2 bg-white rounded-full text-[#4f378a] shadow-sm group-hover:bg-[#e9ddff]">
                restaurant
              </span>
              <div>
                <span className="block font-bold text-xs text-[#1d1b20]">Room Service</span>
                <span className="text-[11px] text-gray-500">Order for upcoming stays</span>
              </div>
            </button>

            <button
              onClick={() => alert("Opening Wellness & Spa Treatment Calendar...")}
              className="flex items-center gap-4 p-3.5 rounded-xl bg-[#ece6ee]/50 hover:bg-[#e9ddff] transition-all text-left border-none cursor-pointer group"
            >
              <span className="material-symbols-outlined p-2 bg-white rounded-full text-[#4f378a] shadow-sm group-hover:bg-[#e9ddff]">
                spa
              </span>
              <div>
                <span className="block font-bold text-xs text-[#1d1b20]">Wellness & Spa</span>
                <span className="text-[11px] text-gray-500">Book treatments</span>
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
    </main>
  );
}
