"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { toast } from "react-hot-toast";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "GUEST" | "ADMIN";
  isApproved: boolean;
  createdAt: string;
  _count: {
    bookings: number;
  };
}

export default function AdminGuestsPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING_STAFF" | "STAFF">("ALL");
  const [errorMsg, setErrorMsg] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New User Form State
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState<"GUEST" | "ADMIN">("ADMIN");

  const fetchUsers = () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (search) query.set("search", search);

    fetch(`/api/admin/guests?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.data);
        } else {
          setErrorMsg(data.error || "Failed to load user directory");
        }
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleApproveUser = async (userId: string, isApproved: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          isApproved
            ? "Hotel Staff / Receptionist approved successfully!"
            : "User status updated to Pending."
        );
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to update user status");
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    }
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          phone: newPhone,
          role: newRole,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(
          `New ${newRole === "ADMIN" ? "Hotel Staff / Receptionist" : "Guest"} created & approved!`
        );
        setShowAddModal(false);
        setNewName("");
        setNewEmail("");
        setNewPassword("");
        setNewPhone("");
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to create user");
      }
    } catch (err: any) {
      toast.error("Error: " + err.message);
    }
  };

  const pendingStaffCount = users.filter(
    (u) => u.role === "ADMIN" && u.isApproved === false
  ).length;

  const filteredUsers = users.filter((u) => {
    if (activeTab === "PENDING_STAFF") return u.role === "ADMIN" && u.isApproved === false;
    if (activeTab === "STAFF") return u.role === "ADMIN" && u.isApproved === true;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fdf7ff] text-[#1d1b20] flex">
      {/* Reusable Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 space-y-6 max-w-7xl">
        {/* Page Header & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1d1b20]">Users & Staff Management</h1>
            <p className="text-sm text-[#494551] mt-1">
              Approve hotel staff signups, manage guest accounts, and grant administrative access.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#4f378a] hover:bg-[#3d2a6c] text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md transition-all flex items-center gap-2 border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">person_add</span>
              <span>Create Staff / User</span>
            </button>

            <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 md:w-72">
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search by Name, Email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border border-[#cbc4d2] rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#4f378a] aura-shadow"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Pending Staff Alert Banner */}
        {pendingStaffCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-900">
                  {pendingStaffCount} Pending Staff Signups Waiting For Approval
                </h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  Hotel Staff / Receptionist accounts cannot access the admin desk until approved.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("PENDING_STAFF")}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer"
            >
              Review Pending Staff
            </button>
          </div>
        )}

        {/* Navigation Filter Tabs */}
        <div className="flex items-center gap-3 border-b border-[#cbc4d2]/30 pb-3">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer ${
              activeTab === "ALL"
                ? "bg-[#4f378a] text-white shadow-sm"
                : "bg-white text-[#494551] hover:bg-[#e6e0e9]"
            }`}
          >
            All Users ({users.length})
          </button>

          <button
            onClick={() => setActiveTab("PENDING_STAFF")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1.5 ${
              activeTab === "PENDING_STAFF"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-white text-amber-800 hover:bg-amber-100"
            }`}
          >
            <span>Pending Staff</span>
            {pendingStaffCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {pendingStaffCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("STAFF")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer ${
              activeTab === "STAFF"
                ? "bg-[#4f378a] text-white shadow-sm"
                : "bg-white text-[#494551] hover:bg-[#e6e0e9]"
            }`}
          >
            Approved Staff ({users.filter((u) => u.role === "ADMIN" && u.isApproved).length})
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-xs font-semibold border border-red-200">
            {errorMsg}
          </div>
        )}

        {/* Users & Staff Directory Table Card */}
        <div className="bg-white aura-shadow rounded-2xl border border-[#cbc4d2]/30 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-[#494551]">Loading user directory...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No users found matching current tab criteria.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f2fa] text-[#494551] text-xs font-bold uppercase tracking-wider border-b border-[#cbc4d2]/30">
                  <th className="py-4 px-6">Name / Email</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Approval Status</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6">Bookings</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#cbc4d2]/20 text-xs">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#fdf7ff] transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#1d1b20]">{u.name}</div>
                      <div className="text-[#494551] text-[11px] font-medium">{u.email}</div>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                          u.role === "ADMIN"
                            ? "bg-[#e9ddff] text-[#22005d]"
                            : "bg-blue-50 text-blue-800"
                        }`}
                      >
                        {u.role === "ADMIN" ? "Hotel Staff / Receptionist" : "Guest User"}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                          u.isApproved
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800 animate-pulse"
                        }`}
                      >
                        {u.isApproved ? "Approved" : "Pending Approval"}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-[#494551] font-medium">{u.phone || "N/A"}</td>

                    <td className="py-4 px-6 font-bold text-[#4f378a]">
                      {u._count.bookings} Stays
                    </td>

                    <td className="py-4 px-6 text-right">
                      {u.role === "ADMIN" && !u.isApproved ? (
                        <button
                          onClick={() => handleApproveUser(u.id, true)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer shadow-sm"
                        >
                          Approve Staff
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApproveUser(u.id, !u.isApproved)}
                          className="text-[#494551] hover:text-[#4f378a] font-semibold text-xs border-none bg-transparent cursor-pointer"
                        >
                          {u.isApproved ? "Revoke Approval" : "Grant Approval"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Modal: Create Staff / Guest User */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-[#cbc4d2]/40 rounded-2xl p-6 max-w-md w-full aura-shadow space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-[#cbc4d2]/30">
              <h3 className="text-lg font-bold text-[#4f378a]">Create User / Staff Account</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#494551]">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jane Smith"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#f8f2fa] border border-[#cbc4d2] rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#4f378a]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#494551]">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="receptionist@hotel.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-[#f8f2fa] border border-[#cbc4d2] rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#4f378a]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#494551]">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#f8f2fa] border border-[#cbc4d2] rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#4f378a]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#494551]">Phone Number (Optional)</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-[#f8f2fa] border border-[#cbc4d2] rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#4f378a]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#494551]">Account Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as "GUEST" | "ADMIN")}
                  className="w-full bg-[#f8f2fa] border border-[#cbc4d2] rounded-xl p-3 text-xs font-semibold focus:outline-none focus:border-[#4f378a]"
                >
                  <option value="ADMIN">Hotel Staff / Receptionist</option>
                  <option value="GUEST">Guest User</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#4f378a] hover:bg-[#3d2a6c] text-white py-3.5 rounded-xl font-bold text-xs shadow-md transition-all border-none cursor-pointer"
              >
                Create & Approve Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
