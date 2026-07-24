"use client";

import React from "react";
import { Users, DollarSign, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Card } from "../atoms/Card";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";

interface RoomCardProps {
  id: string;
  roomNumber: string;
  isAvailable: boolean;
  roomType: {
    name: string;
    description: string;
    basePrice: number;
    capacity: number;
    amenities: string[];
  };
  onBook: (roomId: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  id,
  roomNumber,
  isAvailable,
  roomType,
  onBook,
}) => {
  return (
    <Card hoverable style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--color-grey-800)" }}>{roomType.name}</h3>
            <span style={{ fontSize: "0.85rem", color: "var(--color-grey-500)" }}>Room #{roomNumber}</span>
          </div>
          <Badge variant={isAvailable ? "green" : "red"}>
            {isAvailable ? (
              <><CheckCircle size={12} /> Available</>
            ) : (
              <><XCircle size={12} /> Booked / Unavailable</>
            )}
          </Badge>
        </div>

        <p style={{ fontSize: "0.9rem", color: "var(--color-grey-600)", marginBottom: "1rem", lineHeight: "1.5" }}>
          {roomType.description}
        </p>

        <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem", color: "var(--color-grey-600)", marginBottom: "1rem" }}>
          <span><Users size={14} style={{ display: "inline", marginRight: "4px" }} /> Max {roomType.capacity} Guests</span>
          <span><DollarSign size={14} style={{ display: "inline", marginRight: "2px" }} /> ${roomType.basePrice} / night</span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.25rem" }}>
          {roomType.amenities.map((item, idx) => (
            <Badge key={idx} variant="blue">
              {item}
            </Badge>
          ))}
        </div>
      </div>

      <Button
        disabled={!isAvailable}
        onClick={() => onBook(id)}
        variant="primary"
        fullWidth
        style={{ opacity: isAvailable ? 1 : 0.6 }}
      >
        {isAvailable ? "Book Room Now" : "Unavailable for selected dates"} <ArrowRight size={16} />
      </Button>
    </Card>
  );
};
