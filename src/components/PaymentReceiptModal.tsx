"use client";

import React from "react";
import { toast } from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bookingNumber: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  guestEmail: string;
  paymentMethod: string;
  baseAmount: number;
  gstRate: number;
  resortFee: number;
  totalAmount: number;
  transactionId?: string;
}

export function PaymentReceiptModal({
  isOpen,
  onClose,
  bookingNumber,
  roomName,
  checkIn,
  checkOut,
  guestName,
  guestEmail,
  paymentMethod,
  baseAmount,
  gstRate,
  resortFee,
  totalAmount,
  transactionId,
}: Props) {
  if (!isOpen) return null;

  const gstAmount = (baseAmount * (gstRate / 100));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1d1b20] border border-[#cbc4d2]/40 rounded-3xl max-w-md w-full p-6 sm:p-8 aura-shadow space-y-6 relative overflow-hidden text-[#1d1b20] dark:text-white">
        {/* Top Header Badge */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>
          <h3 className="text-xl font-black tracking-tight">Payment & Stay Receipt</h3>
          <p className="text-xs text-gray-500 font-medium">
            Lumina Grand Resorts • Ref #{bookingNumber}
          </p>
        </div>

        {/* Transaction Reference Box */}
        <div className="bg-[#f8f5fa] dark:bg-[#252029] p-3.5 rounded-2xl border border-[#cbc4d2]/30 text-center space-y-1">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
            Transaction Reference ID
          </span>
          <span className="text-xs font-mono font-extrabold text-[#4f378a] dark:text-amber-300">
            {transactionId || `TXN-${Date.now()}`}
          </span>
        </div>

        {/* Guest & Room Details */}
        <div className="space-y-2 text-xs border-b border-[#cbc4d2]/30 pb-4">
          <div className="flex justify-between">
            <span className="text-gray-500 font-bold">Guest Name:</span>
            <span className="font-extrabold">{guestName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-bold">Email:</span>
            <span className="font-extrabold truncate max-w-[180px]">{guestEmail}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-bold">Suite Reserved:</span>
            <span className="font-extrabold">{roomName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-bold">Dates:</span>
            <span className="font-extrabold">{checkIn} — {checkOut}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 font-bold">Method:</span>
            <span className="font-extrabold uppercase text-[#4f378a] dark:text-amber-300">
              {paymentMethod}
            </span>
          </div>
        </div>

        {/* Itemized Financial Breakdown */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-gray-600 dark:text-gray-300">
            <span>Base Room Tariff:</span>
            <span>₹{baseAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-300">
            <span>GST / Tax ({gstRate}%):</span>
            <span>₹{gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-gray-600 dark:text-gray-300">
            <span>Resort Service Fee:</span>
            <span>₹{resortFee.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="flex justify-between items-center text-sm font-black border-t border-[#cbc4d2]/30 pt-3 text-[#4f378a] dark:text-amber-300">
            <span>Total Paid Amount:</span>
            <span className="text-lg">
              ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <a
            href={`/api/bookings/${bookingNumber}/invoice`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#4f378a] hover:bg-[#3d2a6c] text-white py-3 rounded-xl text-xs font-bold transition-all border-none cursor-pointer shadow-md flex items-center justify-center gap-1.5 no-underline"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            <span>Download Official PDF Tax Invoice 📄</span>
          </a>

          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 bg-[#f8f2fa] dark:bg-[#252029] hover:bg-[#e6e0e9] text-[#1d1b20] dark:text-white py-2.5 rounded-xl text-xs font-bold transition-all border-none cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>Quick Print</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 text-[#1d1b20] dark:text-white py-2.5 rounded-xl text-xs font-bold transition-all border-none cursor-pointer"
            >
              Done & Dashboard ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentReceiptModal;
