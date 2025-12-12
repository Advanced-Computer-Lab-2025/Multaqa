import React from "react";
import { InterviewSlot } from "./types";

interface TimeSlotListProps {
  date: string; // "2025-04-16"
  slots: InterviewSlot[];
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
}

const CURRENT_USER_ID = "S1234567"; // Replace with actual session/context user ID

const TimeSlotList: React.FC<TimeSlotListProps> = ({
  date,
  slots,
  selectedSlotId,
  onSelectSlot,
}) => {
  // Slots are already filtered by parent component using UTC dates
  if (slots.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-4">
        No slots defined on this date.
      </p>
    );
  }

  return (
    <div className="space-y-3 max-w-60 mx-auto">
      {slots.map((slot) => {
        const start = new Date(slot.startDateTime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        const end = new Date(slot.endDateTime).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        const isBooked = !slot.isAvailable;
        const isReservedByCurrentUser =
          isBooked && slot.reservedBy?.studentId === CURRENT_USER_ID;
        const isSelected = slot.id === selectedSlotId;

        let buttonClasses = "";
        let isDisabled = false;

        const baseClasses = `w-full py-3.5 rounded-lg border font-semibold text-lg tracking-wide transition duration-150 ease-in-out flex justify-center items-center`;

        if (isReservedByCurrentUser) {
          buttonClasses =
            "bg-green-100 text-green-700 border-green-400 shadow-md cursor-default";
          isDisabled = true;
        } else if (isBooked) {
          buttonClasses = "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed";
          isDisabled = true;
        } else if (isSelected) {
          buttonClasses =
            "bg-blue-50 text-blue-700 border-blue-400 shadow-md hover:bg-blue-100 cursor-pointer";
        } else {
          buttonClasses =
            "bg-white text-blue-600 border-blue-300 hover:border-blue-400 cursor-pointer";
        }

        return (
          <button
            key={slot.id}
            onClick={() => !isBooked && onSelectSlot(slot.id)}
            disabled={isDisabled}
            className={`${baseClasses} ${buttonClasses} ${
              isSelected ? "ring-2 ring-offset-2 ring-blue-500" : ""
            }`}
          >
            {start} - {end}
            {isReservedByCurrentUser && (
              <span className="ml-2 text-xs font-bold">(Mine)</span>
            )}
            {isBooked && !isReservedByCurrentUser && (
              <span className="ml-2 text-xs font-bold">(Booked)</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSlotList;
