"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import VirtualTourModal from "@/components/VirtualTourModal";

interface Room {
  id: string;
  roomNumber: string;
  status: string;
  floor?: number;
  roomType: {
    name: string;
    description: string;
    basePrice: number;
    capacity: number;
    amenities: string[];
    images: string[];
  };
}

export default function RoomDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [showVirtualTourModal, setShowVirtualTourModal] = useState(false);

  const [checkIn, setCheckIn] = useState("2024-10-24");
  const [checkOut, setCheckOut] = useState("2024-10-28");
  const [guests, setGuests] = useState("2 Adults, 1 Child");

  useEffect(() => {
    fetch(`/api/rooms`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const found = data.data.find((r: Room) => r.id === id);
          if (found) setRoom(found);
          else {
            // Fallback room object matching code.html
            setRoom({
              id,
              roomNumber: "402",
              status: "AVAILABLE",
              roomType: {
                name: "Horizon Suite",
                description:
                  "Perched on the highest floors of Lumina Grand, the Horizon Suite offers an unparalleled perspective of the azure coastline. Designed with a master-class in minimalist luxury, the space features hand-selected Italian marble, sustainable teak accents, and a smart-lighting system that mimics the natural circadian rhythm of the sea.",
                basePrice: 850,
                capacity: 3,
                amenities: [
                  "Hyper-speed Wi-Fi 6",
                  "Complimentary Mini-Bar",
                  "Premium Linens & Robes",
                  '85" OLED Cinema Display',
                  "Nespresso Vertuo Station",
                  "24/7 Butler Service",
                ],
                images: [
                  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85",
                  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=85",
                  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85",
                ],
              },
            });
          }
        }
      })
      .catch(() => {
        setRoom({
          id,
          roomNumber: "402",
          status: "AVAILABLE",
          roomType: {
            name: "Horizon Suite",
            description:
              "Perched on the highest floors of Lumina Grand, the Horizon Suite offers an unparalleled perspective of the azure coastline.",
            basePrice: 850,
            capacity: 3,
            amenities: [
              "Hyper-speed Wi-Fi 6",
              "Complimentary Mini-Bar",
              "Premium Linens & Robes",
              '85" OLED Cinema Display',
              "Nespresso Vertuo Station",
              "24/7 Butler Service",
            ],
            images: [
              "https://lh3.googleusercontent.com/aida-public/AB6AXuDqhGI9v2yELLXUQurYj2i4EB9JgTHueGwouo8ApPeZstQD9KXV7SfeFEL_sysM1YfEllCYdd15V_7QYzRL7MERk-CgPWhRQMF8-Q-szP5oFbL3cRq16RYg_7aCYeWmCZlp-4feGHFxfierVbZSgAiJQEVxcJ0LOgEoWqsr6hY_lrcA3_d5YSCLtc298Ip9YVvsRAG6IlCxWvTAvF-NGmror911ohUcN6NAwVxXZdVGysws74vwFZ7F_T1ZMPWWVryjAQen-6MLPTsE",
            ],
          },
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

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

  const basePrice = room ? room.roomType.basePrice : 850;
  const roomTotal = basePrice * nights;
  const resortFee = 120;
  const grandTotal = roomTotal + resortFee;

  const handleReserveStay = () => {
    router.push(
      `/booking/checkout?roomId=${id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
    );
  };

  if (loading) {
    return <div className="py-24 text-center text-[#4f378a]">Loading room details...</div>;
  }

  if (!room) {
    return (
      <div className="py-24 text-center text-gray-600">
        <h2 className="text-2xl font-bold">Room Not Found</h2>
        <Link
          href="/rooms"
          className="mt-4 inline-block bg-[#4f378a] text-white px-6 py-2.5 rounded-xl font-semibold no-underline"
        >
          Back to Rooms List
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-[1280px] mx-auto px-4 md:px-12 py-8 text-[#1d1b20]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-8 text-[#494551] text-xs font-semibold">
        <Link href="/" className="hover:text-[#4f378a] transition-colors no-underline">
          Home
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <Link href="/rooms" className="hover:text-[#4f378a] transition-colors no-underline">
          Our Accommodations
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-[#4f378a] font-bold">{room.roomType.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Gallery & Experience Details */}
        <div className="lg:col-span-8 space-y-10">
          {/* Bento Gallery */}
          <section className="grid grid-cols-4 grid-rows-2 gap-4 h-[460px]">
            <div className="col-span-3 row-span-2 relative group overflow-hidden rounded-xl aura-shadow border border-[#cbc4d2]/30">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt={room.roomType.name}
                src={
                  room.roomType.images?.[0] ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuDqhGI9v2yELLXUQurYj2i4EB9JgTHueGwouo8ApPeZstQD9KXV7SfeFEL_sysM1YfEllCYdd15V_7QYzRL7MERk-CgPWhRQMF8-Q-szP5oFbL3cRq16RYg_7aCYeWmCZlp-4feGHFxfierVbZSgAiJQEVxcJ0LOgEoWqsr6hY_lrcA3_d5YSCLtc298Ip9YVvsRAG6IlCxWvTAvF-NGmror911ohUcN6NAwVxXZdVGysws74vwFZ7F_T1ZMPWWVryjAQen-6MLPTsE"
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
              <button
                onClick={() => setShowVirtualTourModal(true)}
                className="absolute bottom-4 left-4 z-20 bg-white/90 hover:bg-white text-[#4f378a] px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer border-none flex items-center gap-2 backdrop-blur-md active:scale-95"
              >
                <span className="material-symbols-outlined text-base">360</span>
                <span>Launch 360° Virtual Tour</span>
              </button>
            </div>
            <div className="col-span-1 row-span-1 relative group overflow-hidden rounded-xl aura-shadow border border-[#cbc4d2]/30">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Bathroom view"
                src={
                  room.roomType.images?.[1] ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuCeKXZ1dFnETCWUmerb7odBTjQzRat5GdfgJwX7cVSc3nczJpivhhG7rL88QDwV-D37dWjnfviSKVJVmm8WWO-jYgr9gi67rNGkBrjxE9ImUCw6vjFueYO7ednNLIvFKqUxjevKIf1fnor8hOdV08vCsYN1GIKjDs2E43-hr2tslfmhR3zH9kmA_5EsAwBO8CkC1idlsI4Fa60WDXJ3Ws3aGtN0QpQuidnT7umdRcaN0Z__oFvA5-B2nZJFB8CVfAkNoE6J0-ujmaIK"
                }
              />
            </div>
            <div className="col-span-1 row-span-1 relative group overflow-hidden rounded-xl aura-shadow border border-[#cbc4d2]/30">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Balcony view"
                src={
                  room.roomType.images?.[2] ||
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuDpvUFHmF_VlJCEqqQFDo4noIIb94FaUMcOfzqOOvg2sVlATrfBEUyhhKiftCG-MgyLgBk6efp2BqPGYVDyXyyTGyE-TUo7T8uEIbCBYUoYFXo9oVOPfbQQh0Jrzf5IXGVpRo9RL04DIPluZv5xWToc2KLE19cnLOF89COhC5O5j8eijea3De8z9cgBjdEjI0o_efGsSUd_jZlAGgkkQlCLe0OLYmIRYwBqnhj5toMbTIDKkpVhJ2FKq6TTadtlUEf0dTVvUTg1Lsqf"
                }
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-xs font-bold">
                +12 Photos
              </div>
            </div>
          </section>

          {/* Room Title & Specs */}
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <h1 className="text-3xl md:text-4xl font-bold text-[#4f378a]">
                {room.roomType.name}
              </h1>
              <div className="flex gap-2">
                <span className="bg-[#4f378a]/10 text-[#4f378a] px-3 py-1 rounded-full text-xs font-bold">
                  Ocean View
                </span>
                <span className="bg-[#ffdf93] text-[#594400] px-3 py-1 rounded-full text-xs font-bold">
                  Best Seller
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-[#cbc4d2]/40">
              <div className="flex flex-col gap-1">
                <span className="text-[#494551] text-[11px] font-semibold uppercase tracking-wider">
                  Size
                </span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4f378a]">square_foot</span>
                  <span className="text-lg font-bold text-[#1d1b20]">112 m²</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[#494551] text-[11px] font-semibold uppercase tracking-wider">
                  Bed Type
                </span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4f378a]">king_bed</span>
                  <span className="text-lg font-bold text-[#1d1b20]">Grand King</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[#494551] text-[11px] font-semibold uppercase tracking-wider">
                  Occupancy
                </span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4f378a]">group</span>
                  <span className="text-lg font-bold text-[#1d1b20]">
                    Up to {room.roomType.capacity}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[#494551] text-[11px] font-semibold uppercase tracking-wider">
                  View
                </span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4f378a]">waves</span>
                  <span className="text-lg font-bold text-[#1d1b20]">Panoramic Ocean</span>
                </div>
              </div>
            </div>
          </section>

          {/* Detailed Description */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#1d1b20]">The Experience</h2>
            <p className="text-sm md:text-base text-[#494551] leading-relaxed">
              {room.roomType.description}
            </p>
            <p className="text-sm text-[#494551]">
              Every detail has been curated for the discerning traveler, from the personalized pillow menu to the private sommelier-stocked wine cellar.
            </p>
          </section>

          {/* Included Amenities Grid */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[#1d1b20]">Included Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {room.roomType.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#4f378a]">check_circle</span>
                  <span className="text-sm font-medium text-[#1d1b20]">{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Policies */}
          <section className="bg-[#f8f2fa] p-6 rounded-2xl space-y-4 border border-[#cbc4d2]/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4f378a]">info</span>
              <h2 className="text-lg font-bold text-[#1d1b20]">Booking Policies</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 text-xs text-[#494551]">
              <div className="space-y-1">
                <h3 className="font-bold text-[#4f378a] uppercase">Cancellation</h3>
                <p>
                  Free cancellation up to 48 hours before check-in. Late cancellations will incur a 1-night stay fee.
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-[#4f378a] uppercase">Check-in / Out</h3>
                <p>
                  Check-in: 3:00 PM. Check-out: 11:00 AM. Early check-in available upon request via Guest Portal.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Sticky Booking Widget */}
        <aside className="lg:col-span-4 sticky top-24">
          <div className="glass-panel p-6 rounded-2xl aura-shadow border border-white/60 flex flex-col gap-6 bg-white/80 backdrop-blur-xl">
            <div className="flex justify-between items-baseline">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#494551] font-semibold uppercase">
                  Starting from
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[#4f378a]">
                    ₹{room.roomType.basePrice}
                  </span>
                  <span className="text-xs text-gray-500">/ night</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="text-[#1d1b20]">4.9 (124 reviews)</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 border border-[#cbc4d2] rounded-lg flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-[#494551]">Check In</label>
                  <input
                    className="bg-transparent border-none p-0 focus:ring-0 text-xs font-semibold text-[#1d1b20] outline-none"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>
                <div className="p-3 border border-[#cbc4d2] rounded-lg flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-[#494551]">Check Out</label>
                  <input
                    className="bg-transparent border-none p-0 focus:ring-0 text-xs font-semibold text-[#1d1b20] outline-none"
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-3 border border-[#cbc4d2] rounded-lg flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-[#494551]">Guests</label>
                <select
                  className="bg-transparent border-none p-0 focus:ring-0 text-xs font-semibold text-[#1d1b20] outline-none"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                >
                  <option value="2 Adults, 1 Child">2 Adults, 1 Child</option>
                  <option value="2 Adults">2 Adults</option>
                  <option value="1 Adult">1 Adult</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#cbc4d2]/30 text-xs text-[#494551]">
              <div className="flex justify-between">
                <span>
                  ₹{basePrice} x {nights} nights
                </span>
                <span className="font-semibold text-[#1d1b20]">₹{roomTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Resort Fee (Lumina+)</span>
                <span className="font-semibold text-[#1d1b20]">₹{resortFee}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#1d1b20] pt-2">
                <span>Total</span>
                <span className="text-[#4f378a]">₹{grandTotal}</span>
              </div>
            </div>

            <button
              onClick={handleReserveStay}
              className="w-full bg-[#4f378a] hover:bg-[#3d2a6c] text-white py-4 rounded-xl text-sm font-bold transition-all cursor-pointer border-none shadow-md flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Reserve Your Stay</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>

            <p className="text-center text-[11px] text-gray-500 italic">You won't be charged yet</p>

            <div className="bg-[#f8f2fa] p-3 rounded-xl flex items-center gap-3 border border-white">
              <div className="bg-[#e9ddff] p-2 rounded-full text-[#4f378a]">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </div>
              <div className="flex flex-col text-xs">
                <span className="font-bold text-[#4f378a]">Price Match Guarantee</span>
                <span className="text-[11px] text-gray-500">Found a lower price? We'll match it.</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <VirtualTourModal
        isOpen={showVirtualTourModal}
        onClose={() => setShowVirtualTourModal(false)}
        roomTitle={room.roomType.name}
      />
    </main>
  );
}
