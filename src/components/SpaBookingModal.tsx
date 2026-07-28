"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface SpaService {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  image: string;
}

const SPA_SERVICES: SpaService[] = [
  {
    id: "s1",
    name: "The Celestial Lunar Massage",
    duration: "90 Mins",
    price: 3200,
    description: "Deep tissue massage with heated lunar stones & lavender aromatherapy essential oils.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "s2",
    name: "Hydrotherapy Mineral Soaking",
    duration: "60 Mins",
    price: 2100,
    description: "Private ocean-view mineral bath infused with Himalayan salts and eucalyptus botanicals.",
    image: "https://images.unsplash.com/photo-1591343393572-358588082b7c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "s3",
    name: "Golden Radiant Facial",
    duration: "75 Mins",
    price: 2800,
    description: "Anti-aging facial treatment featuring 24k colloidal gold serum & hyaluronic hydration.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SpaBookingModal({ isOpen, onClose }: Props) {
  const [selectedService, setSelectedService] = useState<SpaService>(SPA_SERVICES[0]);
  const [date, setDate] = useState("2024-11-21");
  const [timeSlot, setTimeSlot] = useState("10:00 AM");
  const [guests, setGuests] = useState("1 Person");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const timeSlots = ["09:00 AM", "10:30 AM", "01:00 PM", "03:00 PM", "05:00 PM", "07:00 PM"];

  const handleBookSpa = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success(
        `Spa Appointment Confirmed! (${selectedService.name} on ${date} at ${timeSlot})`
      );
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#cbc4d2]/40 rounded-2xl max-w-xl w-full h-[85vh] max-h-[680px] flex flex-col aura-shadow overflow-hidden relative">
        {/* Header */}
        <div className="bg-[#4f378a] text-white p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl">spa</span>
            <div>
              <h2 className="text-lg font-bold leading-none">Celestial Wellness & Spa</h2>
              <p className="text-xs text-[#e9ddff] mt-1 font-medium">Book holistic treatments for your stay</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all border-none bg-transparent cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-6">
          {/* Treatment Select */}
          <div>
            <label className="block text-xs font-bold text-[#1d1b20] uppercase tracking-wider mb-2">
              1. Choose Treatment
            </label>
            <div className="grid grid-cols-1 gap-3">
              {SPA_SERVICES.map((serv) => (
                <div
                  key={serv.id}
                  onClick={() => setSelectedService(serv)}
                  className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedService.id === serv.id
                      ? "border-[#4f378a] bg-[#4f378a]/5 shadow-sm"
                      : "border-[#cbc4d2]/30 hover:border-[#4f378a]/40 bg-white"
                  }`}
                >
                  <img
                    src={serv.image}
                    alt={serv.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 shadow-xs"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-xs text-[#1d1b20]">{serv.name}</h4>
                      <span className="font-bold text-xs text-[#4f378a]">
                        ₹{serv.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">{serv.description}</p>
                    <span className="text-[10px] text-[#4f378a] font-semibold mt-1 inline-block">
                      ⏱ {serv.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date & Guest Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1d1b20] uppercase tracking-wider mb-2">
                2. Preferred Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#f8f2fa] border border-[#cbc4d2]/40 rounded-xl p-2.5 text-xs text-[#1d1b20] font-semibold outline-none focus:ring-2 focus:ring-[#4f378a]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1d1b20] uppercase tracking-wider mb-2">
                Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full bg-[#f8f2fa] border border-[#cbc4d2]/40 rounded-xl p-2.5 text-xs text-[#1d1b20] font-semibold outline-none focus:ring-2 focus:ring-[#4f378a] cursor-pointer"
              >
                <option value="1 Person">1 Person (Solo)</option>
                <option value="2 Persons">2 Persons (Couples Spa)</option>
              </select>
            </div>
          </div>

          {/* Time Slot Picker */}
          <div>
            <label className="block text-xs font-bold text-[#1d1b20] uppercase tracking-wider mb-2">
              3. Time Slot
            </label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setTimeSlot(slot)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    timeSlot === slot
                      ? "bg-[#6750a4] text-white border-[#6750a4] shadow-sm"
                      : "bg-[#f8f2fa] text-[#494551] border-[#cbc4d2]/30 hover:bg-[#e6e0e9]"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Summary & Confirm */}
        <div className="p-4 bg-white border-t border-[#cbc4d2]/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">Session Total:</span>
            <span className="block text-lg font-bold text-[#4f378a]">
              ₹{selectedService.price.toLocaleString("en-IN")}
            </span>
          </div>
          <button
            onClick={handleBookSpa}
            disabled={submitting}
            className="bg-[#4f378a] hover:bg-[#3d2a6c] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all border-none cursor-pointer shadow-md active:scale-95"
          >
            {submitting ? "Confirming Slot..." : "Reserve Spa Session"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SpaBookingModal;
