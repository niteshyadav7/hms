"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface MenuItem {
  id: string;
  name: string;
  category: "BREAKFAST" | "MAIN" | "DESSERT" | "COCKTAIL";
  price: number;
  description: string;
  image: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: "m1",
    name: "Truffle Eggs Benedict",
    category: "BREAKFAST",
    price: 650,
    description: "Poached organic eggs, black truffle hollandaise, toasted brioche & prosciutto.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "m2",
    name: "Artisan Acai Bowl",
    category: "BREAKFAST",
    price: 450,
    description: "Organic Amazonian acai, dragonfruit, wild berries, chia seeds & coconut flakes.",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "m3",
    name: "Wagyu Beef Ribeye (250g)",
    category: "MAIN",
    price: 2400,
    description: "A5 Japanese Wagyu, smoked rosemary jus, truffle mashed potatoes & roasted asparagus.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "m4",
    name: "Grilled Lobster Tail",
    category: "MAIN",
    price: 2800,
    description: "Butter-poached Atlantic lobster, garlic herb emulsion & saffron risotto.",
    image: "https://images.unsplash.com/photo-1553240799-36bbf332a5c3?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "m5",
    name: "Gold Leaf Chocolate Soufflé",
    category: "DESSERT",
    price: 550,
    description: "70% Valrhona dark chocolate, edible 24k gold leaf & Madagascar vanilla gelato.",
    image: "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "m6",
    name: "Lumina Sunset Spritz",
    category: "COCKTAIL",
    price: 750,
    description: "Prosecco, Aperol, passionfruit infusion, fresh mint & edible orchids.",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80",
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function RoomServiceModal({ isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<"ALL" | "BREAKFAST" | "MAIN" | "DESSERT" | "COCKTAIL">("ALL");
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const curr = prev[id] || 0;
      const next = Math.max(0, curr + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const filteredItems = MENU_ITEMS.filter((item) =>
    activeTab === "ALL" ? true : item.category === activeTab
  );

  const totalAmount = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = MENU_ITEMS.find((m) => m.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const totalItemsCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const handlePlaceOrder = () => {
    if (totalItemsCount === 0) {
      toast.error("Please select at least one menu item.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success(`In-Room Dining Order Placed! (Total: ₹${totalAmount.toLocaleString("en-IN")})`);
      setCart({});
      setSpecialInstructions("");
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-[#cbc4d2]/40 rounded-2xl max-w-2xl w-full h-[85vh] max-h-[700px] flex flex-col aura-shadow overflow-hidden relative">
        {/* Modal Header */}
        <div className="bg-[#4f378a] text-white p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl">restaurant</span>
            <div>
              <h2 className="text-lg font-bold leading-none">In-Room Gourmet Dining</h2>
              <p className="text-xs text-[#e9ddff] mt-1 font-medium">Delivered directly to your suite in 25–35 mins</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-all border-none bg-transparent cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="p-3 bg-[#f8f2fa] border-b border-[#cbc4d2]/30 flex gap-2 overflow-x-auto no-scrollbar">
          {(["ALL", "BREAKFAST", "MAIN", "DESSERT", "COCKTAIL"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer border-none transition-all ${
                activeTab === tab
                  ? "bg-[#6750a4] text-white shadow-sm"
                  : "bg-transparent text-[#494551] hover:bg-[#e6e0e9]"
              }`}
            >
              {tab === "ALL" ? "All Offerings" : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {filteredItems.map((item) => {
            const qty = cart[item.id] || 0;
            return (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3.5 rounded-xl border border-[#cbc4d2]/30 bg-white hover:border-[#4f378a]/40 transition-all shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0 shadow-sm"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-[#1d1b20]">{item.name}</h4>
                    <span className="font-bold text-xs text-[#4f378a]">
                      ₹{item.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                </div>
                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-[#f8f2fa] p-1.5 rounded-lg border border-[#cbc4d2]/20">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, -1)}
                    className="w-6 h-6 rounded-md bg-white text-gray-700 hover:bg-[#4f378a] hover:text-white flex items-center justify-center transition-all border-none cursor-pointer text-xs font-bold shadow-xs"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-[#1d1b20] w-4 text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, 1)}
                    className="w-6 h-6 rounded-md bg-[#4f378a] text-white hover:bg-[#3d2a6c] flex items-center justify-center transition-all border-none cursor-pointer text-xs font-bold shadow-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Special Instructions & Footer Order Summary */}
        <div className="p-4 bg-white border-t border-[#cbc4d2]/30 space-y-3">
          <input
            type="text"
            placeholder="Special culinary instructions (e.g. extra sauce, allergy note)..."
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="w-full bg-[#f8f2fa] border border-[#cbc4d2]/40 rounded-xl px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-[#4f378a]"
          />
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-xs text-gray-500 font-medium">Total ({totalItemsCount} items):</span>
              <span className="block text-lg font-bold text-[#4f378a]">
                ₹{totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={submitting || totalItemsCount === 0}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer border-none shadow-md ${
                totalItemsCount > 0
                  ? "bg-[#4f378a] hover:bg-[#3d2a6c] active:scale-95"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {submitting ? "Placing Order..." : "Confirm & Order to Suite"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomServiceModal;
