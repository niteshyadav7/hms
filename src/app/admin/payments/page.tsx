"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface PaymentConfig {
  card_enabled: boolean;
  upi_enabled: boolean;
  netbanking_enabled: boolean;
  pay_at_hotel_enabled: boolean;
  gst_rate: number;
  resort_fee: number;
}

interface PaymentTransaction {
  id: string;
  bookingId: string;
  bookingNumber: string;
  guestName: string;
  guestEmail: string;
  amount: number;
  method: "ONLINE" | "UPI" | "NETBANKING" | "PAY_AT_HOTEL";
  status: "PAID" | "PENDING" | "REFUNDED";
  transactionId?: string;
  createdAt: string;
}

export default function AdminPaymentsPage() {
  const [activeTab, setActiveTab] = useState<"SETTINGS" | "TRANSACTIONS">("SETTINGS");
  const [loading, setLoading] = useState(true);

  // Settings State
  const [config, setConfig] = useState<PaymentConfig>({
    card_enabled: true,
    upi_enabled: true,
    netbanking_enabled: true,
    pay_at_hotel_enabled: true,
    gst_rate: 18,
    resort_fee: 180,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // Transactions Ledger State
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [metrics, setMetrics] = useState({
    totalPaid: 0,
    totalPending: 0,
    totalRefunded: 0,
    totalTransactions: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [refundingId, setRefundingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch dynamic settings
      const settingsRes = await fetch("/api/admin/payment-settings");
      const settingsJson = await settingsRes.json();
      if (settingsJson.success) {
        setConfig(settingsJson.data);
      }

      // Fetch payment ledger
      const paymentsRes = await fetch("/api/payments");
      const paymentsJson = await paymentsRes.json();
      if (paymentsJson.success) {
        setPayments(paymentsJson.data.payments);
        setMetrics(paymentsJson.data.metrics);
      }
    } catch (err) {
      console.error("Error loading payment data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/payment-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(json.message || "Gateway settings updated!");
      } else {
        toast.error(json.error || "Failed to update settings.");
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleProcessRefund = async (id: string, bookingNumber: string, amount: number) => {
    if (!confirm(`Are you sure you want to issue a full refund of ₹${amount.toLocaleString()} for Booking #${bookingNumber}?`)) {
      return;
    }

    setRefundingId(id);
    try {
      const res = await fetch(`/api/payments/${id}/refund`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Admin authorized refund" }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success(`Refund authorized for transaction #${id}!`);
        loadData();
      } else {
        toast.error(json.error || "Refund failed.");
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setRefundingId(null);
    }
  };

  const filteredPayments = payments.filter((p) => {
    if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.guestName.toLowerCase().includes(q) ||
        p.bookingNumber.toLowerCase().includes(q) ||
        (p.transactionId && p.transactionId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <main className="min-h-screen bg-[#f8f5fa] dark:bg-[#141218] text-[#1d1b20] dark:text-white p-6 md:p-12">
      <div className="max-w-[1280px] mx-auto space-y-8">
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#cbc4d2]/30 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#4f378a] dark:text-amber-300">
              <Link href="/admin/dashboard" className="hover:underline no-underline text-[#4f378a]">
                Admin Console
              </Link>
              <span>/</span>
              <span>Financial Control & Payment Gateway</span>
            </div>
            <h1 className="text-3xl font-black text-[#1d1b20] dark:text-white mt-1">
              Payment Gateway & Revenue Control Center
            </h1>
          </div>

          <button
            onClick={loadData}
            className="bg-white dark:bg-[#232029] hover:bg-[#e9ddff] text-[#4f378a] px-4 py-2 rounded-xl text-xs font-bold border border-[#cbc4d2]/40 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            <span>Sync Live Ledger</span>
          </button>
        </div>

        {/* Financial Overview Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#232029] p-5 rounded-2xl border border-[#cbc4d2]/30 dark:border-white/10 shadow-sm space-y-1">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">
              Total Revenue Collected
            </span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              ₹{metrics.totalPaid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-gray-400 font-medium">Settled via Gateways</span>
          </div>

          <div className="bg-white dark:bg-[#232029] p-5 rounded-2xl border border-[#cbc4d2]/30 dark:border-white/10 shadow-sm space-y-1">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">
              Pending Pay-at-Hotel
            </span>
            <div className="text-2xl font-black text-amber-500">
              ₹{metrics.totalPending.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-gray-400 font-medium">Due at Resort Check-in</span>
          </div>

          <div className="bg-white dark:bg-[#232029] p-5 rounded-2xl border border-[#cbc4d2]/30 dark:border-white/10 shadow-sm space-y-1">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">
              Total Refunds Issued
            </span>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
              ₹{metrics.totalRefunded.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-gray-400 font-medium">Authorized Refunds</span>
          </div>

          <div className="bg-white dark:bg-[#232029] p-5 rounded-2xl border border-[#cbc4d2]/30 dark:border-white/10 shadow-sm space-y-1">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">
              Total Transactions
            </span>
            <div className="text-2xl font-black text-[#4f378a] dark:text-amber-300">
              {metrics.totalTransactions} Records
            </div>
            <span className="text-[10px] text-gray-400 font-medium">Recorded Payments</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#cbc4d2]/40 gap-4">
          <button
            onClick={() => setActiveTab("SETTINGS")}
            className={`pb-3 text-xs font-black transition-all border-b-2 cursor-pointer ${
              activeTab === "SETTINGS"
                ? "border-[#4f378a] text-[#4f378a] dark:text-amber-300"
                : "border-transparent text-gray-500 hover:text-[#4f378a]"
            }`}
          >
            ⚙️ Dynamic Gateway Settings & Tax Rules
          </button>
          <button
            onClick={() => setActiveTab("TRANSACTIONS")}
            className={`pb-3 text-xs font-black transition-all border-b-2 cursor-pointer ${
              activeTab === "TRANSACTIONS"
                ? "border-[#4f378a] text-[#4f378a] dark:text-amber-300"
                : "border-transparent text-gray-500 hover:text-[#4f378a]"
            }`}
          >
            📋 Live Payment Ledger & Refunds
          </button>
        </div>

        {/* TAB 1: DYNAMIC SETTINGS FORM */}
        {activeTab === "SETTINGS" && (
          <form onSubmit={handleSaveSettings} className="bg-white dark:bg-[#232029] p-8 rounded-3xl border border-[#cbc4d2]/40 shadow-lg space-y-8 max-w-3xl">
            <div>
              <h3 className="text-lg font-black text-[#1d1b20] dark:text-white">
                Payment Gateways Toggle & Tax Configuration
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Enable or disable payment methods in real-time. Changes instantly update the Guest Checkout page.
              </p>
            </div>

            {/* Toggles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center justify-between p-4 rounded-2xl border border-[#cbc4d2]/40 bg-[#f8f5fa] dark:bg-[#18161c] cursor-pointer hover:border-[#4f378a]">
                <div>
                  <span className="font-extrabold text-xs text-[#1d1b20] dark:text-white block">
                    💳 Credit / Debit Card
                  </span>
                  <span className="text-[11px] text-gray-500">3D-Secure OTP Simulation</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.card_enabled}
                  onChange={(e) => setConfig({ ...config, card_enabled: e.target.checked })}
                  className="w-5 h-5 accent-[#4f378a] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl border border-[#cbc4d2]/40 bg-[#f8f5fa] dark:bg-[#18161c] cursor-pointer hover:border-[#4f378a]">
                <div>
                  <span className="font-extrabold text-xs text-[#1d1b20] dark:text-white block">
                    📱 UPI Instant QR Code
                  </span>
                  <span className="text-[11px] text-gray-500">GPay, PhonePe, Paytm, BHIM</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.upi_enabled}
                  onChange={(e) => setConfig({ ...config, upi_enabled: e.target.checked })}
                  className="w-5 h-5 accent-[#4f378a] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl border border-[#cbc4d2]/40 bg-[#f8f5fa] dark:bg-[#18161c] cursor-pointer hover:border-[#4f378a]">
                <div>
                  <span className="font-extrabold text-xs text-[#1d1b20] dark:text-white block">
                    🏦 NetBanking Transfer
                  </span>
                  <span className="text-[11px] text-gray-500">HDFC, ICICI, SBI, Axis Bank</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.netbanking_enabled}
                  onChange={(e) => setConfig({ ...config, netbanking_enabled: e.target.checked })}
                  className="w-5 h-5 accent-[#4f378a] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl border border-[#cbc4d2]/40 bg-[#f8f5fa] dark:bg-[#18161c] cursor-pointer hover:border-[#4f378a]">
                <div>
                  <span className="font-extrabold text-xs text-[#1d1b20] dark:text-white block">
                    🏨 Pay at Resort (Check-in)
                  </span>
                  <span className="text-[11px] text-gray-500">Cash / Physical POS Terminal</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.pay_at_hotel_enabled}
                  onChange={(e) => setConfig({ ...config, pay_at_hotel_enabled: e.target.checked })}
                  className="w-5 h-5 accent-[#4f378a] cursor-pointer"
                />
              </label>
            </div>

            {/* Tax & Fee Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#cbc4d2]/30 pt-6">
              <div>
                <label className="block text-xs font-black text-[#1d1b20] dark:text-white mb-1">
                  GST / Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={config.gst_rate}
                  onChange={(e) => setConfig({ ...config, gst_rate: Number(e.target.value) })}
                  className="w-full bg-[#f8f5fa] dark:bg-[#18161c] border border-[#cbc4d2]/40 rounded-xl px-4 py-3 text-xs font-bold text-[#1d1b20] dark:text-white outline-none focus:ring-2 focus:ring-[#4f378a]"
                  placeholder="e.g. 18"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">Applied to room tariff during checkout</span>
              </div>

              <div>
                <label className="block text-xs font-black text-[#1d1b20] dark:text-white mb-1">
                  Resort Service Fee (₹)
                </label>
                <input
                  type="number"
                  value={config.resort_fee}
                  onChange={(e) => setConfig({ ...config, resort_fee: Number(e.target.value) })}
                  className="w-full bg-[#f8f5fa] dark:bg-[#18161c] border border-[#cbc4d2]/40 rounded-xl px-4 py-3 text-xs font-bold text-[#1d1b20] dark:text-white outline-none focus:ring-2 focus:ring-[#4f378a]"
                  placeholder="e.g. 180"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">Flat amenity surcharge per reservation</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="bg-[#4f378a] hover:bg-[#3d2a6c] text-white px-6 py-3 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer border-none"
            >
              {savingSettings ? "Saving Settings..." : "Save Dynamic Settings ➔"}
            </button>
          </form>
        )}

        {/* TAB 2: TRANSACTIONS LEDGER */}
        {activeTab === "TRANSACTIONS" && (
          <div className="bg-white dark:bg-[#232029] rounded-3xl border border-[#cbc4d2]/40 shadow-lg overflow-hidden space-y-4">
            {/* Search & Filter Bar */}
            <div className="p-6 border-b border-[#cbc4d2]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#f8f2fa]/50">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by guest name, booking ref, transaction ID..."
                className="bg-white dark:bg-[#18161c] border border-[#cbc4d2]/40 rounded-xl px-4 py-2 text-xs w-full sm:w-80 outline-none focus:ring-2 focus:ring-[#4f378a]"
              />

              <div className="flex gap-2">
                {["ALL", "PAID", "PENDING", "REFUNDED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border-none ${
                      statusFilter === st
                        ? "bg-[#4f378a] text-white"
                        : "bg-transparent text-gray-600 hover:bg-[#e6e0e9]"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Ledger Table */}
            <div className="w-full overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-500 text-[11px] font-black uppercase tracking-wider border-b border-[#cbc4d2]/20">
                    <th className="px-6 py-4">Transaction / Booking Ref</th>
                    <th className="px-6 py-4">Guest Details</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#cbc4d2]/20 text-xs font-medium">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No financial records found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-[#f8f5fa]/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-extrabold text-[#4f378a] dark:text-amber-300 block">
                            {p.bookingNumber}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono block">
                            {p.transactionId || p.id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-[#1d1b20] dark:text-white block">
                            {p.guestName}
                          </span>
                          <span className="text-[10px] text-gray-500">{p.guestEmail}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-[#f8f2fa] dark:bg-[#18161c] px-2.5 py-1 rounded-lg border border-[#cbc4d2]/30 text-[10px] font-bold">
                            {p.method}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-extrabold text-[#1d1b20] dark:text-white">
                          ₹{p.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4">
                          {p.status === "PAID" && (
                            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-black border border-emerald-300">
                              PAID
                            </span>
                          )}
                          {p.status === "PENDING" && (
                            <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full text-[10px] font-black border border-amber-300">
                              PENDING
                            </span>
                          )}
                          {p.status === "REFUNDED" && (
                            <span className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full text-[10px] font-black border border-purple-300">
                              REFUNDED
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {p.status === "PAID" && (
                            <button
                              disabled={refundingId === p.id}
                              onClick={() => handleProcessRefund(p.id, p.bookingNumber, p.amount)}
                              className="text-red-600 font-bold hover:underline border-none bg-transparent cursor-pointer"
                            >
                              {refundingId === p.id ? "Refunding..." : "Process Refund"}
                            </button>
                          )}
                          {p.status === "PENDING" && (
                            <span className="text-gray-400 text-[10px]">Due at Resort</span>
                          )}
                          {p.status === "REFUNDED" && (
                            <span className="text-purple-600 font-bold text-[10px]">Refund Settled</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
