"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import PaymentReceiptModal from "@/components/PaymentReceiptModal";

interface Room {
  id: string;
  roomNumber: string;
  roomType: {
    name: string;
    description: string;
    basePrice: number;
    capacity: number;
    images?: string;
  };
}

interface PaymentConfig {
  card_enabled: boolean;
  upi_enabled: boolean;
  netbanking_enabled: boolean;
  pay_at_hotel_enabled: boolean;
  gst_rate: number;
  resort_fee: number;
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

  // Live Admin Dynamic Payment Gateway Configuration
  const [config, setConfig] = useState<PaymentConfig>({
    card_enabled: true,
    upi_enabled: true,
    netbanking_enabled: true,
    pay_at_hotel_enabled: true,
    gst_rate: 18,
    resort_fee: 180,
  });

  const [paymentType, setPaymentType] = useState<"card" | "upi" | "netbanking" | "hotel">("card");

  // Form State
  const [firstName, setFirstName] = useState("Julian");
  const [lastName, setLastName] = useState("Sterling");
  const [email, setEmail] = useState("j.sterling@lumina-voyage.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [specialRequests, setSpecialRequests] = useState("");

  // Payment Form Details
  const [cardholderName, setCardholderName] = useState("Julian Sterling");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8821");
  const [expiryDate, setExpiryDate] = useState("12 / 28");
  const [cvv, setCvv] = useState("•••");

  const [upiId, setUpiId] = useState("julian@upi");
  const [selectedBank, setSelectedBank] = useState("HDFC");

  // Receipt Modal State
  const [receiptData, setReceiptData] = useState<any>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    // 1. Fetch dynamic payment settings from Admin API
    fetch("/api/admin/payment-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setConfig(data.data);
          // Default payment type to first enabled option
          if (data.data.card_enabled) setPaymentType("card");
          else if (data.data.upi_enabled) setPaymentType("upi");
          else if (data.data.netbanking_enabled) setPaymentType("netbanking");
          else setPaymentType("hotel");
        }
      });

    // 2. Fetch logged in user details
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.user) {
          const parts = (data.data.user.name || "Julian Sterling").split(" ");
          setFirstName(parts[0] || "Julian");
          setLastName(parts.slice(1).join(" ") || "Sterling");
          setEmail(data.data.user.email || "j.sterling@lumina-voyage.com");
          if (data.data.user.phone) setPhone(data.data.user.phone);
        }
      });

    // 3. Fetch room details
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

  // Calculate nights & dynamic tax pricing breakdown
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
  const gstAmount = Number((baseRoomTotal * (config.gst_rate / 100)).toFixed(2));
  const resortFee = config.resort_fee;
  const grandTotal = baseRoomTotal + gstAmount + resortFee;

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const fullName = `${firstName} ${lastName}`.trim();
    const methodEnum =
      paymentType === "card"
        ? "ONLINE"
        : paymentType === "upi"
        ? "UPI"
        : paymentType === "netbanking"
        ? "NETBANKING"
        : "PAY_AT_HOTEL";

    try {
      // 1. Create Booking in DB
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
          paymentMethod: methodEnum,
          specialRequests,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to complete booking reservation");
      }

      const createdBooking = data.data;

      // 2. Process Financial Payment Transaction Event
      const txRes = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: createdBooking.id,
          bookingNumber: createdBooking.bookingNumber,
          guestName: fullName,
          guestEmail: email,
          amount: grandTotal,
          method: methodEnum,
          transactionId: methodEnum === "PAY_AT_HOTEL" ? null : `TXN-${Date.now()}`,
        }),
      });

      const txJson = await txRes.json();

      // Show Payment Receipt Modal
      setReceiptData({
        bookingNumber: createdBooking.bookingNumber,
        roomName: room ? room.roomType.name : "Grand Ocean Suite",
        checkIn,
        checkOut,
        guestName: fullName,
        guestEmail: email,
        paymentMethod: methodEnum,
        baseAmount: baseRoomTotal,
        gstRate: config.gst_rate,
        resortFee: config.resort_fee,
        totalAmount: grandTotal,
        transactionId: txJson.data?.transactionId,
      });

      setShowReceiptModal(true);
      toast.success("🎉 Payment authorized & reservation confirmed!");
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
        {/* Left Column: Guest Info & Dynamic Payment Options */}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#494551] px-1">First Name</label>
                  <input
                    className="w-full bg-[#ffffff] border border-[#cbc4d2] rounded-lg p-3.5 text-sm focus:border-[#4f378a] focus:ring-2 focus:ring-[#4f378a]/20 outline-none transition-all"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#494551] px-1">Last Name</label>
                  <input
                    className="w-full bg-[#ffffff] border border-[#cbc4d2] rounded-lg p-3.5 text-sm focus:border-[#4f378a] focus:ring-2 focus:ring-[#4f378a]/20 outline-none transition-all"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#494551] px-1">Email Address</label>
                  <input
                    className="w-full bg-[#ffffff] border border-[#cbc4d2] rounded-lg p-3.5 text-sm focus:border-[#4f378a] focus:ring-2 focus:ring-[#4f378a]/20 outline-none transition-all"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#494551] px-1">Phone Number</label>
                  <input
                    className="w-full bg-[#ffffff] border border-[#cbc4d2] rounded-lg p-3.5 text-sm focus:border-[#4f378a] focus:ring-2 focus:ring-[#4f378a]/20 outline-none transition-all"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#494551] px-1">Special Requests (Optional)</label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. High floor, quiet room, late check-in..."
                  className="w-full bg-[#ffffff] border border-[#cbc4d2] rounded-lg p-3.5 text-sm focus:border-[#4f378a] focus:ring-2 focus:ring-[#4f378a]/20 outline-none transition-all"
                />
              </div>
            </div>
          </section>

          {/* Step 2: Dynamic Payment Methods */}
          <section className="pt-6 border-t border-[#cbc4d2]/30 space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-8 rounded-full bg-[#e9ddff] text-[#22005d] flex items-center justify-center font-bold text-sm">
                2
              </span>
              <h2 className="text-1xl md:text-xl font-bold text-[#1d1b20]">Payment Method</h2>
            </div>

            {/* Dynamic Gateway Selector Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {config.card_enabled && (
                <button
                  type="button"
                  onClick={() => setPaymentType("card")}
                  className={`p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentType === "card"
                      ? "bg-[#4f378a] text-white border-[#4f378a] shadow-md"
                      : "bg-[#f8f5fa] text-[#1d1b20] border-[#cbc4d2]/40 hover:bg-[#e9ddff]/40"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">credit_card</span>
                  <span>Credit/Debit Card</span>
                </button>
              )}

              {config.upi_enabled && (
                <button
                  type="button"
                  onClick={() => setPaymentType("upi")}
                  className={`p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentType === "upi"
                      ? "bg-[#4f378a] text-white border-[#4f378a] shadow-md"
                      : "bg-[#f8f5fa] text-[#1d1b20] border-[#cbc4d2]/40 hover:bg-[#e9ddff]/40"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
                  <span>UPI / QR Code</span>
                </button>
              )}

              {config.netbanking_enabled && (
                <button
                  type="button"
                  onClick={() => setPaymentType("netbanking")}
                  className={`p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentType === "netbanking"
                      ? "bg-[#4f378a] text-[#ffffff] border-[#4f378a] shadow-md"
                      : "bg-[#f8f5fa] text-[#1d1b20] border-[#cbc4d2]/40 hover:bg-[#e9ddff]/40"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">account_balance</span>
                  <span>NetBanking</span>
                </button>
              )}

              {config.pay_at_hotel_enabled && (
                <button
                  type="button"
                  onClick={() => setPaymentType("hotel")}
                  className={`p-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentType === "hotel"
                      ? "bg-[#4f378a] text-white border-[#4f378a] shadow-md"
                      : "bg-[#f8f5fa] text-[#1d1b20] border-[#cbc4d2]/40 hover:bg-[#e9ddff]/40"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">payments</span>
                  <span>Pay at Resort</span>
                </button>
              )}
            </div>

            {/* Form Panels per Payment Type */}
            {paymentType === "card" && (
              <div className="space-y-4 bg-[#f8f5fa] p-5 rounded-2xl border border-[#cbc4d2]/40">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#494551]">Cardholder Name</label>
                  <input
                    className="w-full bg-[#ffffff] border border-[#cbc4d2] rounded-lg p-3 text-xs outline-none focus:border-[#4f378a]"
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#494551]">Card Number</label>
                  <input
                    className="w-full bg-[#ffffff] border border-[#cbc4d2] rounded-lg p-3 text-xs outline-none focus:border-[#4f378a]"
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#494551]">Expiry Date</label>
                    <input
                      className="w-full bg-[#ffffff] border border-[#cbc4d2] rounded-lg p-3 text-xs outline-none focus:border-[#4f378a]"
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#494551]">CVV</label>
                    <input
                      className="w-full bg-[#ffffff] border border-[#cbc4d2] rounded-lg p-3 text-xs outline-none focus:border-[#4f378a]"
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentType === "upi" && (
              <div className="space-y-4 bg-[#f8f5fa] p-5 rounded-2xl border border-[#cbc4d2]/40 text-center">
                <span className="text-xs font-bold text-[#4f378a] block uppercase tracking-wider">
                  Instant Scan & Pay (GPay / PhonePe / Paytm)
                </span>
                <div className="w-36 h-36 bg-white p-2 border border-gray-300 rounded-xl mx-auto flex items-center justify-center shadow-sm">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=lumina@icici&pn=LuminaGrandResorts"
                    alt="UPI QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="max-w-xs mx-auto space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 block">Or Enter VPA / UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-white border border-[#cbc4d2] rounded-lg p-2 text-xs text-center outline-none focus:border-[#4f378a]"
                  />
                </div>
              </div>
            )}

            {paymentType === "netbanking" && (
              <div className="space-y-4 bg-[#f8f5fa] p-5 rounded-2xl border border-[#cbc4d2]/40">
                <label className="text-xs font-bold text-[#494551]">Select NetBanking Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full bg-white border border-[#cbc4d2] rounded-xl p-3 text-xs font-bold outline-none text-[#1d1b20]"
                >
                  <option value="HDFC">HDFC Bank</option>
                  <option value="ICICI">ICICI Bank</option>
                  <option value="SBI">State Bank of India (SBI)</option>
                  <option value="AXIS">Axis Bank</option>
                  <option value="KOTAK">Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {paymentType === "hotel" && (
              <div className="py-6 text-center bg-[#f8f2fa] rounded-2xl border border-dashed border-[#cbc4d2] p-4">
                <span className="material-symbols-outlined text-3xl text-[#4f378a] mb-1">
                  payments
                </span>
                <p className="text-xs text-[#494551] font-semibold max-w-xs mx-auto">
                  Zero prepayment required now. You can settle your stay balance via cash or credit card at check-in.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Dynamic Price Breakdown & Order Summary */}
        <aside className="lg:col-span-5 sticky top-24">
          <div className="glass-card aura-shadow p-6 rounded-2xl border border-white/60 overflow-hidden bg-white/80 backdrop-blur-xl space-y-6">
            <div className="h-48 -mx-6 -mt-6 relative overflow-hidden">
              <img
                className="w-full h-full object-cover"
                alt="Grand Ocean Suite"
                src={
                  (() => {
                    if (!room?.roomType?.images) return "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85";
                    const imgs = room.roomType.images as any;
                    if (Array.isArray(imgs)) return imgs[0] || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85";
                    if (typeof imgs === "string") {
                      if (imgs.startsWith("[")) {
                        try { return JSON.parse(imgs)[0] || imgs; } catch (e) { return imgs; }
                      }
                      return imgs;
                    }
                    return "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85";
                  })()
                }
              />
              <div className="absolute top-4 right-4">
                <span className="bg-[#4f378a]/90 backdrop-blur-md text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold">
                  PREMIUM SELECT
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#1d1b20]">
                {room ? room.roomType.name : "Grand Ocean Suite"}
              </h3>
              <div className="flex items-center gap-2 text-[#494551] mt-1 text-xs font-medium">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                <span>
                  {checkIn} — {checkOut} ({nights} Nights)
                </span>
              </div>
            </div>

            {/* Dynamic Price Breakdown */}
            <div className="space-y-3 text-xs text-[#494551] border-t border-[#cbc4d2]/30 pt-4">
              <div className="flex justify-between items-center">
                <span>
                  {room ? room.roomType.name : "Suite"} (₹{roomPricePerNight} x {nights} nights)
                </span>
                <span className="font-semibold text-[#1d1b20]">
                  ₹{baseRoomTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>GST Tax ({config.gst_rate}%)</span>
                <span className="font-semibold text-[#1d1b20]">
                  ₹{gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Resort Service Fee</span>
                <span className="font-semibold text-[#1d1b20]">
                  ₹{resortFee.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Grand Total Divider */}
            <div className="border-t border-[#cbc4d2]/40 pt-4">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-black text-[#494551] block uppercase tracking-widest">
                    Total Amount
                  </span>
                  <span className="text-3xl font-black text-[#4f378a]">
                    ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block uppercase">Currency</span>
                  <span className="text-xs font-black">INR (₹)</span>
                </div>
              </div>
            </div>

            {/* Complete Reservation CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#4f378a] hover:bg-[#3d2a6c] text-white py-4 rounded-xl text-base font-black shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60 border-none"
            >
              <span>{submitting ? "Authorizing Payment..." : "Complete Booking ➔"}</span>
            </button>
          </div>
        </aside>
      </form>

      {/* Payment Receipt Modal */}
      {receiptData && (
        <PaymentReceiptModal
          isOpen={showReceiptModal}
          onClose={() => {
            setShowReceiptModal(false);
            router.push("/guest/dashboard?success=1");
          }}
          bookingNumber={receiptData.bookingNumber}
          roomName={receiptData.roomName}
          checkIn={receiptData.checkIn}
          checkOut={receiptData.checkOut}
          guestName={receiptData.guestName}
          guestEmail={receiptData.guestEmail}
          paymentMethod={receiptData.paymentMethod}
          baseAmount={receiptData.baseAmount}
          gstRate={receiptData.gstRate}
          resortFee={receiptData.resortFee}
          totalAmount={receiptData.totalAmount}
          transactionId={receiptData.transactionId}
        />
      )}
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
