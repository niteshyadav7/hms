"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import AdminSidebar from "@/components/AdminSidebar";

interface RoomType {
  id: string;
  name: string;
  basePrice: number;
  capacity: number;
}

interface Room {
  id: string;
  roomNumber: string;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
  floor?: number;
  roomType: RoomType;
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms State
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddType, setShowAddType] = useState(false);

  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [newRoomTypeId, setNewRoomTypeId] = useState("");
  const [newRoomFloor, setNewRoomFloor] = useState("1");

  const [typeName, setTypeName] = useState("");
  const [typeDescription, setTypeDescription] = useState("");
  const [typePrice, setTypePrice] = useState("100");
  const [typeCapacity, setTypeCapacity] = useState("2");
  const [typeAmenities, setTypeAmenities] = useState("WiFi, AC, TV");

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/rooms").then((r) => r.json()),
      fetch("/api/room-types").then((r) => r.json()),
    ])
      .then(([roomsData, typesData]) => {
        if (roomsData.success) setRooms(roomsData.data);
        if (typesData.success) setRoomTypes(typesData.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomNumber: newRoomNumber,
          roomTypeId: newRoomTypeId || roomTypes[0]?.id,
          floor: parseInt(newRoomFloor),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Room created successfully!");
        setNewRoomNumber("");
        setShowAddRoom(false);
        loadData();
      } else {
        toast.error(data.error || "Failed to create room");
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    }
  };

  const handleCreateType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/room-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: typeName,
          description: typeDescription,
          basePrice: parseFloat(typePrice),
          capacity: parseInt(typeCapacity),
          amenities: typeAmenities.split(",").map((s) => s.trim()),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Room Type created successfully!");
        setTypeName("");
        setShowAddType(false);
        loadData();
      } else {
        toast.error(data.error || "Failed to create room type");
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    }
  };

  const handleToggleStatus = async (roomId: string, currentStatus: string) => {
    let nextStatus = "AVAILABLE";
    if (currentStatus === "AVAILABLE") nextStatus = "MAINTENANCE";
    else if (currentStatus === "MAINTENANCE") nextStatus = "AVAILABLE";
    else {
      toast.error("Occupied rooms status is controlled via check-out in booking desk.");
      return;
    }

    try {
      const res = await fetch(`/api/rooms/${roomId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Room status updated to ${nextStatus}`);
        loadData();
      }
    } catch (err: any) {
      toast.error("Failed to update status: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf7ff] text-[#1d1b20] flex">
      {/* Reusable Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 space-y-6 max-w-7xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#1d1b20]">Room Management</h1>
            <p className="text-sm text-[#494551] mt-1">
              Add rooms, configure room categories, and update maintenance availability in real-time.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowAddType(!showAddType)}
              className="bg-[#e9ddff] hover:bg-[#4f378a] hover:text-white text-[#22005d] px-4 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer border-none shadow-sm"
            >
              + New Category
            </button>
            <button
              onClick={() => setShowAddRoom(!showAddRoom)}
              className="bg-[#4f378a] hover:bg-[#3d2a6c] text-white px-5 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer border-none shadow-sm"
            >
              + Add Room
            </button>
          </div>
        </div>

        {/* Add Room Type Form Modal/Drawer */}
        {showAddType && (
          <form
            onSubmit={handleCreateType}
            className="bg-white aura-shadow p-6 rounded-2xl border border-[#cbc4d2]/30 space-y-4"
          >
            <h3 className="text-lg font-bold text-[#4f378a]">Create New Room Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                className="bg-[#f8f2fa] border border-[#cbc4d2] rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#4f378a]"
                placeholder="Name (e.g. Executive Suite)"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
                required
              />
              <input
                className="bg-[#f8f2fa] border border-[#cbc4d2] rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#4f378a]"
                type="number"
                placeholder="Base Price / Night (₹)"
                value={typePrice}
                onChange={(e) => setTypePrice(e.target.value)}
                required
              />
              <input
                className="bg-[#f8f2fa] border border-[#cbc4d2] rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#4f378a]"
                type="number"
                placeholder="Capacity (Guests)"
                value={typeCapacity}
                onChange={(e) => setTypeCapacity(e.target.value)}
                required
              />
              <input
                className="bg-[#f8f2fa] border border-[#cbc4d2] rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#4f378a]"
                placeholder="Amenities (comma separated)"
                value={typeAmenities}
                onChange={(e) => setTypeAmenities(e.target.value)}
              />
            </div>
            <input
              className="w-full bg-[#f8f2fa] border border-[#cbc4d2] rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#4f378a]"
              placeholder="Description"
              value={typeDescription}
              onChange={(e) => setTypeDescription(e.target.value)}
            />
            <button
              type="submit"
              className="bg-[#4f378a] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm cursor-pointer border-none"
            >
              Save Room Category
            </button>
          </form>
        )}

        {/* Add Room Form */}
        {showAddRoom && (
          <form
            onSubmit={handleCreateRoom}
            className="bg-white aura-shadow p-6 rounded-2xl border border-[#cbc4d2]/30 space-y-4"
          >
            <h3 className="text-lg font-bold text-[#4f378a]">Create New Room</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                className="bg-[#f8f2fa] border border-[#cbc4d2] rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#4f378a]"
                placeholder="Room Number (e.g. 302)"
                value={newRoomNumber}
                onChange={(e) => setNewRoomNumber(e.target.value)}
                required
              />
              <select
                className="bg-[#f8f2fa] border border-[#cbc4d2] rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#4f378a]"
                value={newRoomTypeId}
                onChange={(e) => setNewRoomTypeId(e.target.value)}
              >
                {roomTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (₹{t.basePrice})
                  </option>
                ))}
              </select>
              <input
                className="bg-[#f8f2fa] border border-[#cbc4d2] rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#4f378a]"
                type="number"
                placeholder="Floor"
                value={newRoomFloor}
                onChange={(e) => setNewRoomFloor(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-[#4f378a] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm cursor-pointer border-none"
            >
              Save Room
            </button>
          </form>
        )}

        {/* Rooms Table Card */}
        <div className="bg-white aura-shadow rounded-2xl border border-[#cbc4d2]/30 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-[#494551]">Loading rooms...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f2fa] text-[#494551] text-xs font-bold uppercase tracking-wider border-b border-[#cbc4d2]/30">
                  <th className="py-4 px-6">Room #</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Capacity</th>
                  <th className="py-4 px-6">Price / Night</th>
                  <th className="py-4 px-6">Floor</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#cbc4d2]/20 text-xs">
                {rooms.map((r) => (
                  <tr key={r.id} className="hover:bg-[#fdf7ff] transition-colors">
                    <td className="py-4 px-6 font-bold text-[#4f378a]">#{r.roomNumber}</td>
                    <td className="py-4 px-6 font-semibold">{r.roomType.name}</td>
                    <td className="py-4 px-6 text-[#494551]">{r.roomType.capacity} Guests</td>
                    <td className="py-4 px-6 font-bold text-[#1d1b20]">₹{r.roomType.basePrice}</td>
                    <td className="py-4 px-6 text-[#494551]">{r.floor || 1}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                          r.status === "AVAILABLE"
                            ? "bg-green-100 text-green-800"
                            : r.status === "OCCUPIED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {r.status !== "OCCUPIED" ? (
                        <button
                          onClick={() => handleToggleStatus(r.id, r.status)}
                          className="bg-[#e9ddff] hover:bg-[#4f378a] hover:text-white text-[#22005d] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none"
                        >
                          Toggle {r.status === "AVAILABLE" ? "Maintenance" : "Available"}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Occupied</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
