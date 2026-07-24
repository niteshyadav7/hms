"use client";

import React from "react";
import { Badge, BadgeVariant } from "../atoms/Badge";
import { Button } from "../atoms/Button";

export interface BookingData {
  id: string;
  bookingNumber: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  totalPrice: number;
  status: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  room: {
    roomNumber: string;
    roomType: {
      name: string;
    };
  };
  payments: {
    method: string;
    status: string;
  }[];
}

interface BookingTableProps {
  bookings: BookingData[];
  isAdmin?: boolean;
  onUpdateStatus?: (bookingId: string, newStatus: string) => void;
}

export const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  isAdmin = false,
  onUpdateStatus,
}) => {
  const getStatusBadgeVariant = (status: string): BadgeVariant => {
    switch (status) {
      case "CONFIRMED":
        return "blue";
      case "CHECKED_IN":
        return "green";
      case "CHECKED_OUT":
        return "grey";
      case "CANCELLED":
        return "red";
      default:
        return "yellow";
    }
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="table-custom">
        <thead>
          <tr>
            <th>Booking Ref</th>
            <th>Guest</th>
            <th>Room</th>
            <th>Dates</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td><strong>{b.bookingNumber}</strong></td>
              <td>
                <div><strong>{b.guestName}</strong></div>
                <small style={{ color: "var(--color-grey-500)", display: "block" }}>{b.guestEmail}</small>
                <small style={{ color: "var(--color-grey-500)" }}>{b.guestPhone}</small>
              </td>
              <td>
                <div>#{b.room.roomNumber}</div>
                <small style={{ color: "var(--color-grey-500)" }}>{b.room.roomType.name}</small>
              </td>
              <td>
                {new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}
              </td>
              <td>${b.totalPrice}</td>
              <td>
                <Badge variant={b.payments[0]?.status === "PAID" ? "green" : "yellow"}>
                  {b.payments[0]?.status || "PENDING"} ({b.payments[0]?.method})
                </Badge>
              </td>
              <td>
                <Badge variant={getStatusBadgeVariant(b.status)}>
                  {b.status}
                </Badge>
              </td>
              <td>
                {isAdmin && onUpdateStatus ? (
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {b.status === "CONFIRMED" && (
                      <Button size="sm" variant="primary" onClick={() => onUpdateStatus(b.id, "CHECKED_IN")}>
                        Check In
                      </Button>
                    )}
                    {b.status === "CHECKED_IN" && (
                      <Button size="sm" variant="glass" onClick={() => onUpdateStatus(b.id, "CHECKED_OUT")}>
                        Check Out
                      </Button>
                    )}
                    {(b.status === "CONFIRMED" || b.status === "PENDING") && (
                      <Button size="sm" variant="danger" onClick={() => onUpdateStatus(b.id, "CANCELLED")}>
                        Cancel
                      </Button>
                    )}
                  </div>
                ) : (
                  b.status === "CONFIRMED" && onUpdateStatus && (
                    <Button size="sm" variant="danger" onClick={() => onUpdateStatus(b.id, "CANCELLED")}>
                      Cancel Stay
                    </Button>
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
