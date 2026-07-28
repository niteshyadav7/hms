"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface Room {
  id: string;
  roomNumber: string;
  roomType: {
    name: string;
    description: string;
    basePrice: number;
    capacity: number;
  };
}

function CheckoutFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomId = searchParams.get("roomId") || "";
  const checkIn = searchParams.get("checkIn") || "2024-10-24";
  const checkOut = searchParams.get("checkOut") || "2024-10-28";
  const guests = parseInt(searchParams.get("guests") || "2");

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [paymentType, setPaymentType] = useState<"cc" | "pp">("cc");

  // Form State
  const [firstName, setFirstName] = useState("Julian");
  const [lastName, setLastName] = useState("Sterling");
  const [email, setEmail] = useState("j.sterling@lumina-voyage.com");
  const [phone, setPhone] = useState("+1 (555) 000-0000");
  const [specialRequests, setSpecialRequests] = useState("");

  // Payment Form State
  const [cardholderName, setCardholderName] = useState("Julian Sterling");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8821");
  const [expiryDate, setExpiryDate] = useState("12 / 28");
  const [cvv, setCvv] = useState("•••");

  useEffect(() => {
    // Auto populate logged in user details if available
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.user) {
          const parts = (data.data.user.name || "Julian Sterling").split(" ");
          setFirstName(parts[0] || "Julian");
          setLastName(parts.slice(1).join(" ") || "Sterling");
          setEmail(data.data.user.email || "j.sterling@lumina-voyage.com");
          setPhone(data.data.user.phone || "+1 (555) 000-0000");
        }
      });

    // Fetch room details
    if (roomId) {
      fetch(`/api/rooms`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            const found = data.data.find((r: Room) => r.id === roomId);
            if (found) setRoom(found);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [roomId]);

  // Calculate nights & pricing breakdown
  const nights =
    checkIn && checkOut
      ? Math.max(
          1,
          Math.ceil(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              (1000 * 3600 * 24)
          )
        )
      : 4;

  const roomPricePerNight = room ? room.roomType.basePrice : 800;
  const baseRoomTotal = roomPricePerNight * nights;
  const resortFee = 180.0;
  const transferService = 75.0;
  const taxes = Number((baseRoomTotal * 0.12).toFixed(2));
  const grandTotal = baseRoomTotal + resortFee + transferService + taxes;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const fullName = `${firstName} ${lastName}`.trim();

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: roomId || "mock-room-id",
          checkIn,
          checkOut,
          guestsCount: guests,
          guestName: fullName,
          guestEmail: email,
          guestPhone: phone,
          paymentMethod: paymentType === "cc" ? "ONLINE" : "PAY_AT_HOTEL",
          specialRequests,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to complete booking reservation");
      }

      toast.success("Reservation confirmed successfully!");
      // Redirect to Guest Portal Dashboard
      router.push("/guest/dashboard?success=1");
    } catch (err: any) {
      setErrorMsg(err.message);
      toast.error(err.message || "Failed to complete reservation");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-[1280px] mx-auto px-4 md:px-12 py-12 text-[#1d1b20]">
      {/* Return Link */}
      <Link
        href="/rooms"
        className="mb-10 inline-flex items-center gap-2 text-[#494551] hover:text-[#4f378a] transition-colors group no-underline"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        <span className="text-sm font-semibold">Return to Selection</span>
      </Link>

      <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Guest Info & Payment */}
        <div className="lg:col-span-7 space-y-12">
          {/* Header */}
          <section>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[#1d1b20]">
              Complete Your Booking
            </h1>
            <p className="text-[#494551] mb-8 text-sm">
              Please provide your details below to secure your luxury experience.
            </p>

            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Step 1: Guest Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-8 rounded-full bg-[#e9ddff] text-[#22005d] flex items-center justify-center font-bold text-sm">
                  1
                </span>
                <h2 className="text-xl font-bold text-[#1d1b20]">Guest Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#494551] px-1">First Name</label>
                  <input
                    className="w-full bg-[#ffffff] border border-[#cbc4d2] rounded-lg p-3.5 text-sm focus:border-[#4f378a] focus:ring-2 focus:ring-[#4f378a]/20 outline-none transition-all"
                    placeholder="Julian"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#494551] px-1">Last Name</label>
                  <input
                    className="w-full bg-[#ffffff] border border-[#cbc4d2] rounded-lg p-3.5 text-sm focus:border-[#4f378a] focus:ring-2 focus:ring-[#4f378a]/20 outline-none transition-all"
                    placeholder="Sterling"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#494551] px-1">Email Address</label>
                <input
                  className="w-full bg-[#ffffff] border border-[#cbc4d2] rounded-lg p-3.5 text-sm focus:border-[#4f378a] focus:ring-2 focus:ring-[#4f378a]/20 outline-none transition-all"
                  placeholder="j.sterling@lumina-voyage.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#494551] px-1">Phone Number</label>
                <input
                  className="w-full bg-[#ffffff] border border-[#cbc4d2] rounded-lg p-3.5 text-sm focus:border-[#4f378a] focus:ring-2 focus:ring-[#4f378a]/20 outline-none transition-all"
                  placeholder="+1 (555) 000-0000"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#494551] px-1">
                  Special Requests (Optional)
                </label>
                <textarea
                  className="w-full bg-[#ffffff] border border-[#cbc4d2] rounded-lg p-3.5 text-sm focus:border-[#4f378a] focus:ring-2 focus:ring-[#4f378a]/20 outline-none transition-all resize-none"
                  placeholder="Dietary requirements, pillow preference, etc."
                  rows={3}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                />
              </div>
            </div>
          </section>

          <hr className="border-[#cbc4d2]/30" />

          {/* Step 2: Payment Method */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-8 rounded-full bg-[#e9ddff] text-[#22005d] flex items-center justify-center font-bold text-sm">
                2
              </span>
              <h2 className="text-xl font-bold text-[#1d1b20]">Payment Method</h2>
            </div>

            {/* Payment Toggle Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                type="button"
                onClick={() => setPaymentType("cc")}
                className={`flex items-center justify-center gap-3 p-4 border-2 rounded-lg transition-all duration-300 cursor-pointer ${
                  paymentType === "cc"
                    ? "border-[#4f378a] bg-[#4f378a]/5 text-[#4f378a] font-bold"
                    : "border-[#cbc4d2] text-[#494551] hover:border-[#4f378a]/50"
                }`}
              >
                <span className="material-symbols-outlined text-[#4f378a]">credit_card</span>
                <span className="text-sm">Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType("pp")}
                className={`flex items-center justify-center gap-3 p-4 border-2 rounded-lg transition-all duration-300 cursor-pointer ${
                  paymentType === "pp"
                    ? "border-[#4f378a] bg-[#4f378a]/5 text-[#4f378a] font-bold"
                    : "border-[#cbc4d2] text-[#494551] hover:border-[#4f378a]/50"
                }`}
              >
                <span className="material-symbols-outlined text-[#494551]">account_balance_wallet</span>
                <span className="text-sm">PayPal</span>
              </button>
            </div>

            {/* Credit Card Form */}
            {paymentType === "cc" ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#494551] px-1">Cardholder Name</label>
                  <input
                    className="w-full bg-[#ffffff] border border-[#cbc4d2] rounded-lg p-3.5 text-sm focus:border-[#4f378a] focus:ring-2 focus:ring-[#4f378a]/20 outline-none transition-all"
                    placeholder="Julian Sterling"
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                  />
                </div>

                <div className="space-y-2 relative">
                  <label className="text-xs font-semibold text-[#494551] px-1">Card Number</label>
                  <input
                    className="w-full bg-[#ffffff] border border-[#cbc4d2] rounded-lg p-3.5 text-sm focus:border-[#4f378a] focus:ring-2 focus:ring-[#4f378a]/20 outline-none transition-all"
                    placeholder="0000 0000 0000 0000"
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                  <div className="absolute right-4 bottom-3.5 flex gap-2">
                    <span className="material-symbols-outlined text-gray-400">payments</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#494551] px-1">Expiry Date</label>
                    <input
                      className="w-full bg-[#ffffff] border border-[#cbc4d2] rounded-lg p-3.5 text-sm focus:border-[#4f378a] focus:ring-2 focus:ring-[#4f378a]/20 outline-none transition-all"
                      placeholder="MM / YY"
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#494551] px-1">CVV</label>
                    <input
                      className="w-full bg-[#ffffff] border border-[#cbc4d2] rounded-lg p-3.5 text-sm focus:border-[#4f378a] focus:ring-2 focus:ring-[#4f378a]/20 outline-none transition-all"
                      placeholder="•••"
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center bg-[#f8f2fa] rounded-xl border border-dashed border-[#cbc4d2]">
                <span className="material-symbols-outlined text-4xl text-[#494551] mb-2">
                  account_balance_wallet
                </span>
                <p className="text-sm text-[#494551] max-w-sm mx-auto">
                  You will be redirected to PayPal's secure portal to authorize the transaction.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Order Summary (Sticky) */}
        <aside className="lg:col-span-5 sticky top-24">
          <div className="glass-card aura-shadow p-6 rounded-2xl border border-white/60 overflow-hidden bg-white/70 backdrop-blur-xl">
            <div className="h-48 -mx-6 -mt-6 mb-6 relative overflow-hidden">
              <img
                className="w-full h-full object-cover"
                alt="Grand Ocean Suite"
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-[#4f378a]/90 backdrop-blur-md text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold">
                  PREMIUM SELECT
                </span>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-1 text-[#1d1b20]">
              {room ? room.roomType.name : "Grand Ocean Suite"}
            </h3>
            <div className="flex items-center gap-2 text-[#494551] mb-6 text-sm">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <span>
                {checkIn} — {checkOut} ({nights} Nights)
              </span>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between items-center text-[#494551]">
                <span>
                  {room ? room.roomType.name : "Grand Ocean Suite"} (x{nights} nights)
                </span>
                <span className="font-semibold text-[#1d1b20]">₹{baseRoomTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[#494551]">
                <span>Resort Services & Amenities</span>
                <span className="font-semibold text-[#1d1b20]">₹{resortFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[#494551]">
                <span>Luxury Transfer Service</span>
                <span className="font-semibold text-[#1d1b20]">₹{transferService.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[#494551]">
                <div className="flex items-center gap-1">
                  <span>Taxes & Surcharges</span>
                  <span className="material-symbols-outlined text-[14px] cursor-help">info</span>
                </div>
                <span className="font-semibold text-[#1d1b20]">₹{taxes.toFixed(2)}</span>
              </div>
            </div>

            {/* Total Amount Divider */}
            <div className="border-t border-[#cbc4d2]/40 pt-4 mb-6">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[11px] font-semibold text-[#494551] block uppercase tracking-wider">
                    Total Amount
                  </span>
                  <span className="text-3xl font-bold text-[#4f378a]">
                    ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#494551] block uppercase">Currency</span>
                  <span className="text-sm font-bold">INR</span>
                </div>
              </div>
            </div>

            {/* Complete Booking CTA Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#4f378a] hover:bg-[#3d2a6c] text-white py-4 rounded-xl text-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60 border-none"
            >
              <span>{submitting ? "Securing Reservation..." : "Complete Booking"}</span>
              <span className="material-symbols-outlined">lock</span>
            </button>

            <p className="text-xs text-[#494551] text-center mt-4 flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">shield</span>
              <span>Secure SSL encrypted checkout</span>
            </p>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 grid grid-cols-3 gap-4 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 text-[#494551]">
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="material-symbols-outlined">verified_user</span>
              <span className="text-[10px] uppercase font-bold tracking-wider">Verified</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="material-symbols-outlined">star</span>
              <span className="text-[10px] uppercase font-bold tracking-wider">5-Star Stay</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="material-symbols-outlined">event_available</span>
              <span className="text-[10px] uppercase font-bold tracking-wider">Free Cancel</span>
            </div>
          </div>
        </aside>
      </form>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#4f378a]">Loading Checkout...</div>}>
      <CheckoutFormContent />
    </Suspense>
  );
}
