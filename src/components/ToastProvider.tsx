"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: "#1d1b20",
          color: "#ffffff",
          borderRadius: "12px",
          padding: "12px 18px",
          fontSize: "14px",
          fontWeight: 600,
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)",
        },
        success: {
          iconTheme: {
            primary: "#4f378a",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}
