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

const DEFAULT_NOTIFICATIONS: SystemNotification[] = [
  {
    id: "notif_1",
    title: "🍽️ Gourmet Dining Alert",
    message: "Order #ORD-8812 (Truffle Eggs Benedict) has been dispatched to kitchen.",
    type: "DINING",
    timestamp: "2 mins ago",
    read: false,
  },
  {
    id: "notif_2",
    title: "🧹 Housekeeping Matrix",
    message: "Suite 402 (Overwater Sanctuary) cleaning completed & verified.",
    type: "HOUSEKEEPING",
    timestamp: "10 mins ago",
    read: false,
  },
  {
    id: "notif_3",
    title: "🎉 VIP Reservation",
    message: "New booking confirmed for Sunset Lagoon Suite #301.",
    type: "BOOKING",
    timestamp: "25 mins ago",
    read: true,
  },
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<SystemNotification[]>(DEFAULT_NOTIFICATIONS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lumina_notifications");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
        }
      }
    } catch (err) {
      console.error("Failed to load saved notifications:", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("lumina_notifications", JSON.stringify(notifications));
      } catch (err) {
        console.error("Failed to save notifications to localStorage:", err);
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
          } max-w-sm w-full bg-[#1d1b20] text-white p-4 rounded-2xl shadow-2xl border border-[#cbc4d2]/40 flex items-start gap-3 pointer-events-auto`}
        >
          <div className="w-9 h-9 rounded-xl bg-[#4f378a] flex items-center justify-center flex-shrink-0 text-amber-300">
            <span className="material-symbols-outlined text-xl">notifications_active</span>
          </div>
          <div className="flex-1">
            <h4 className="font-extrabold text-xs text-amber-300">{title}</h4>
            <p className="text-[11px] text-gray-200 mt-0.5 leading-relaxed">{message}</p>
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

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
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
