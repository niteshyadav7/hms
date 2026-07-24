"use client";

import React from "react";
import Link from "next/link";

export default function FeaturedSection() {
  const residences = [
    {
      title: "Azure Ocean Residence",
      price: "From ₹1,200/night",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB1oDXNIAsPdpWEWOYiPyUgeIdkfURwx1x1SYsc0tQQRBZpF0mShEXHNxw3kMYP-G_5wE5ZUM-oRUWQnt3xCYEB6MIsNQO_gP71YgwspcGZNitjFYVgiF6iXBri-C2DrzsDegHeKWGYMiMXfeGEMBH28Iwbed-bWmcUwOkrJIq72cChAwMTJ9YDB26C48GOBHYweQSww0tcHduUI2_uJDjyGeeuwF3XssUsvIYoSDoCuNi2bCcsjGxz40w8zi_wG33jLY3Xe5XjHfmE",
      specs: [
        { icon: "square_foot", text: "850 sq ft" },
        { icon: "king_bed", text: "King Suite" },
      ],
    },
    {
      title: "The Lumina Penthouse",
      price: "From ₹2,450/night",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAmvdmFWMpilKJ1HucUCfi8vWxTE9pJtQwqo-Zc86d0vVEYGtd6n_rhZqHvqGGDY6Aq66xxCvU7_h7PC8X51HFd4pa9NWRWWEwm_vcRweffxIx5VHLvucSeUhNHLjKp-xFxAjgWHZneOeLUlFbI_-eEDZlSIbLSscR0pzW3uE7Yyf1a3ZMxyxgiIljxM8jYsYji1YTbKSGfldChlTNK0EuNugSoOW_ra6QKq5YiqiZtznZn45a5drU9HjnAEf03EMpJF-LN-hnfNDiw",
      specs: [
        { icon: "pool", text: "Private Pool" },
        { icon: "home_work", text: "2,100 sq ft" },
      ],
    },
    {
      title: "Garden Sanctuary Suite",
      price: "From ₹890/night",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuALrcEBfi2BzNNiBNwufkLe3HQZg02U_BMd1pWZRUDHhaXr4pJaT9cDWs8ggpgvKRzUXGSGczwR4_UPxdu9jCq1okbErq_Y7RwIH333HKCuk_ysp2YdpouycztN_tMzoPSn5FQHBqBtEonEiriMxj52PdpPXHvCXyxBuje4QpJPORpQRu9eUrhAf1lI2tzylFwSisZ2r9-D8nYlOpzHgu9Kob3WyvlshEvL4OgQLhgY5FXEUVvAShLIX9K0s8mVkSG78RhTTKR58BrT",
      specs: [
        { icon: "nature_people", text: "Garden View" },
        { icon: "bathtub", text: "Spa Bath" },
      ],
    },
  ];

  return (
    <section className="py-16 px-4 md:px-12 max-w-[1280px] mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div className="space-y-2">
          <span className="text-[#4f378a] text-xs font-semibold tracking-widest uppercase block">
            THE COLLECTION
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1d1b20]">Featured Sanctuaries</h2>
        </div>
        <Link href="/rooms" className="text-[#4f378a] font-medium text-sm flex items-center gap-2 hover:underline">
          View all residences <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {residences.map((item, idx) => (
          <Link
            key={idx}
            href="/rooms"
            className="group relative aspect-[4/5] rounded-xl overflow-hidden aura-shadow border border-[#cbc4d2]/30 hover:-translate-y-1 transition-transform duration-300 block text-white"
          >
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${item.image}')` }}
            />
            <div className="absolute inset-0 luxury-gradient-overlay" />
            <div className="absolute bottom-0 inset-x-0 p-6 space-y-2">
              <span className="text-[#e9ddff] text-xs font-semibold">{item.price}</span>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <div className="flex items-center gap-4 text-xs text-white/80 pt-1">
                {item.specs.map((s, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">{s.icon}</span> {s.text}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
