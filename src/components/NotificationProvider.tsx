"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: "DINING" | "HOUSEKEEPING" | "BOOKING" | "SYSTEM";
  timestamp: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: SystemNotification[];
  unreadCount: number;
  addNotification: (title: string, message: string, type: SystemNotification["type"]) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetchDynamicNotifications();
  }, []);

  const fetchDynamicNotifications = async () => {
    try {
      // 1. Check local read status memory
      const readMapJson = localStorage.getItem("lumina_read_notif_ids");
      const readIds: string[] = readMapJson ? JSON.parse(readMapJson) : [];

      // 2. Fetch live real-time system notifications from DB API
      const res = await fetch("/api/notifications");
      const json = await res.json();

      if (json.success && Array.isArray(json.notifications)) {
        const synced = json.notifications.map((n: SystemNotification) => ({
          ...n,
          read: n.read || readIds.includes(n.id),
        }));
        setNotifications(synced);
      }
    } catch (err) {
      console.error("Failed to fetch dynamic notifications:", err);
    } finally {
      setIsLoaded(true);
    }
  };

  // Sync read status IDs to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        const readIds = notifications.filter((n) => n.read).map((n) => n.id);
        localStorage.setItem("lumina_read_notif_ids", JSON.stringify(readIds));
      } catch (err) {
        console.error("Failed to sync read status:", err);
      }
    }
  }, [notifications, isLoaded]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = (title: string, message: string, type: SystemNotification["type"]) => {
    const newNotif: SystemNotification = {
      id: `notif_${Date.now()}`,
      title,
      message,
      type,
      timestamp: "Just now",
      read: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);

    // Live Toast Alert
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-in fade-in slide-in-from-top-5" : "animate-out fade-out"
          } max-w-sm w-full bg-[#1b1c1c] text-white p-4 rounded-2xl shadow-2xl border border-[#c9a227]/40 flex items-start gap-3 pointer-events-auto font-body`}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#755b00] to-[#c9a227] flex items-center justify-center flex-shrink-0 text-white">
            <span className="material-symbols-outlined text-xl">notifications_active</span>
          </div>
          <div className="flex-1">
            <h4 className="font-extrabold text-xs text-[#ffe08e]">{title}</h4>
            <p className="text-[11px] text-gray-200 mt-0.5 leading-relaxed font-medium">{message}</p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-gray-400 hover:text-white border-none bg-transparent cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      ),
      { duration: 4500 }
    );
  };

  const markAllAsRead = async () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);

    try {
      const readIds = updated.map((n) => n.id);
      localStorage.setItem("lumina_read_notif_ids", JSON.stringify(readIds));
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "MARK_ALL_READ" }),
      });
    } catch (err) {
      console.error("Failed to sync markAllAsRead API:", err);
    }
  };

  const clearNotification = async (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);

    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CLEAR", id }),
      });
    } catch (err) {
      console.error("Failed to sync clearNotification API:", err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAllAsRead,
        clearNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}
