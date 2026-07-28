"use client";

import React, { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { toast } from "react-hot-toast";

interface RoomStatus {
  id: string;
  roomNumber: string;
  category: string;
  floor: string;
  status: "CLEAN" | "DIRTY" | "INSPECTING" | "MAINTENANCE";
  assignedStaff: string;
  lastCleaned: string;
}

const INITIAL_ROOMS: RoomStatus[] = [
  { id: "r101", roomNumber: "101", category: "Oceanfront Overwater Suite", floor: "Floor 1", status: "CLEAN", assignedStaff: "Elena Rostova", lastCleaned: "Today 10:30 AM" },
  { id: "r102", roomNumber: "102", category: "Lagoon View Villa", floor: "Floor 1", status: "DIRTY", assignedStaff: "David Miller", lastCleaned: "Yesterday 4:00 PM" },
  { id: "r103", roomNumber: "103", category: "Presidential Glass Penthouse", floor: "Floor 1", status: "INSPECTING", assignedStaff: "Elena Rostova", lastCleaned: "Today 11:15 AM" },
  { id: "r104", roomNumber: "104", category: "Sunset Infinity Pool Villa", floor: "Floor 1", status: "MAINTENANCE", assignedStaff: "Technician Mark", lastCleaned: "2 days ago" },
  { id: "r201", roomNumber: "201", category: "Royal Ocean Sanctuary", floor: "Floor 2", status: "CLEAN", assignedStaff: "Sarah Jenkins", lastCleaned: "Today 09:45 AM" },
  { id: "r202", roomNumber: "202", category: "Lagoon View Villa", floor: "Floor 2", status: "DIRTY", assignedStaff: "David Miller", lastCleaned: "Yesterday 11:00 AM" },
  { id: "r203", roomNumber: "203", category: "Oceanfront Overwater Suite", floor: "Floor 2", status: "CLEAN", assignedStaff: "Sarah Jenkins", lastCleaned: "Today 12:00 PM" },
  { id: "r204", roomNumber: "204", category: "Sunset Infinity Pool Villa", floor: "Floor 2", status: "CLEAN", assignedStaff: "Sarah Jenkins", lastCleaned: "Today 08:30 AM" },
];

export default function AdminHousekeepingPage() {
  const [rooms, setRooms] = useState<RoomStatus[]>(INITIAL_ROOMS);
  const [filter, setFilter] = useState<"ALL" | "CLEAN" | "DIRTY" | "INSPECTING" | "MAINTENANCE">("ALL");

  const handleToggleStatus = (id: string, newStatus: RoomStatus["status"]) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: newStatus, lastCleaned: newStatus === "CLEAN" ? "Just now" : r.lastCleaned } : r
      )
    );
    toast.success(`Room status updated to ${newStatus}`);
  };

  const filteredRooms = rooms.filter((r) => (filter === "ALL" ? true : r.status === filter));

  const stats = {
    clean: rooms.filter((r) => r.status === "CLEAN").length,
    dirty: rooms.filter((r) => r.status === "DIRTY").length,
    inspecting: rooms.filter((r) => r.status === "INSPECTING").length,
    maintenance: rooms.filter((r) => r.status === "MAINTENANCE").length,
  };

  return (
    <div className="min-h-screen bg-[#fdf7ff] flex text-[#1d1b20]">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-8 md:p-12 space-y-8 max-w-[1400px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#cbc4d2]/30 pb-6">
          <div>
            <span className="text-[#4f378a] font-bold text-xs tracking-widest uppercase block mb-1">
              Operations & Housekeeping
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1d1b20]">Live Room Status Matrix</h1>
            <p className="text-[#494551] text-sm mt-1">Real-time room cleanliness, inspection status, and staff assignment.</p>
          </div>
          <button
            onClick={() => toast.success("All dirty rooms assigned to available staff.")}
            className="bg-[#4f378a] hover:bg-[#3d2a6c] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer border-none flex items-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">cleaning_services</span>
            Auto-Dispatch Housekeeping
          </button>
        </div>

        {/* KPI Counter Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            onClick={() => setFilter("CLEAN")}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              filter === "CLEAN" ? "bg-emerald-500 text-white border-emerald-600 shadow-md" : "bg-white border-[#cbc4d2]/30"
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider block opacity-90">Clean & Ready</span>
            <span className="text-3xl font-extrabold block mt-1">{stats.clean}</span>
          </div>

          <div
            onClick={() => setFilter("DIRTY")}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              filter === "DIRTY" ? "bg-amber-500 text-white border-amber-600 shadow-md" : "bg-white border-[#cbc4d2]/30"
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider block opacity-90">Dirty / Housekeeping</span>
            <span className="text-3xl font-extrabold block mt-1">{stats.dirty}</span>
          </div>

          <div
            onClick={() => setFilter("INSPECTING")}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              filter === "INSPECTING" ? "bg-blue-600 text-white border-blue-700 shadow-md" : "bg-white border-[#cbc4d2]/30"
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider block opacity-90">Inspecting</span>
            <span className="text-3xl font-extrabold block mt-1">{stats.inspecting}</span>
          </div>

          <div
            onClick={() => setFilter("MAINTENANCE")}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              filter === "MAINTENANCE" ? "bg-rose-600 text-white border-rose-700 shadow-md" : "bg-white border-[#cbc4d2]/30"
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider block opacity-90">Out of Service</span>
            <span className="text-3xl font-extrabold block mt-1">{stats.maintenance}</span>
          </div>
        </div>

        {/* Room Matrix Table */}
        <div className="bg-white border border-[#cbc4d2]/40 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 bg-[#f8f2fa] border-b border-[#cbc4d2]/30 flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#1d1b20]">Room Maintenance & Housekeeping Register</h3>
            <div className="flex gap-2">
              {(["ALL", "CLEAN", "DIRTY", "INSPECTING", "MAINTENANCE"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border-none ${
                    filter === tab ? "bg-[#4f378a] text-white" : "bg-transparent text-[#494551] hover:bg-[#e6e0e9]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f2fa]/60 border-b border-[#cbc4d2]/30 text-[#494551] uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-3.5">Room No.</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Floor</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Assigned Staff</th>
                  <th className="px-6 py-3.5">Last Cleaned</th>
                  <th className="px-6 py-3.5 text-right">Quick Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#cbc4d2]/20 font-medium">
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-[#f8f2fa]/50 transition-all">
                    <td className="px-6 py-4 font-bold text-sm text-[#4f378a]">
                      Suite {room.roomNumber}
                    </td>
                    <td className="px-6 py-4 text-[#1d1b20] font-semibold">{room.category}</td>
                    <td className="px-6 py-4 text-gray-500">{room.floor}</td>
                    <td className="px-6 py-4">
                      {room.status === "CLEAN" && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Clean & Ready
                        </span>
                      )}
                      {room.status === "DIRTY" && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          Dirty / Cleaning
                        </span>
                      )}
                      {room.status === "INSPECTING" && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                          Inspecting
                        </span>
                      )}
                      {room.status === "MAINTENANCE" && (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          Out of Service
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#1d1b20]">{room.assignedStaff}</td>
                    <td className="px-6 py-4 text-gray-500">{room.lastCleaned}</td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={room.status}
                        onChange={(e) => handleToggleStatus(room.id, e.target.value as any)}
                        className="bg-[#f8f2fa] border border-[#cbc4d2]/40 rounded-lg px-2.5 py-1 text-xs font-bold text-[#4f378a] cursor-pointer outline-none focus:ring-2 focus:ring-[#4f378a]"
                      >
                        <option value="CLEAN">Mark Clean</option>
                        <option value="DIRTY">Mark Dirty</option>
                        <option value="INSPECTING">Mark Inspecting</option>
                        <option value="MAINTENANCE">Mark Maintenance</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
