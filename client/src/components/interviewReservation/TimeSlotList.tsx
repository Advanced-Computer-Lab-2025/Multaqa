import React from "react";
import { InterviewSlot } from "./types";

interface TimeSlotListProps {
  date: string; // "2025-04-16"
  slots: InterviewSlot[]; // Now includes all slots (booked and unbooked) for the team
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
}

const TimeSlotList: React.FC<TimeSlotListProps> = ({ 
    date, 
    slots, 
    selectedSlotId, 
    onSelectSlot 
}) => {
  // Filter for the selected date only (we no longer filter out booked slots here)
  const daySlots = slots.filter((slot) => slot.date === date);

  if (daySlots.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-4">
        No slots defined on this date.
      </p>
    );
  }

  return (
    <div className="space-y-3 max-w-60 mx-auto"> 
      {daySlots.map((slot) => {
        const isSelected = slot.id === selectedSlotId;
        const isBooked = slot.isBooked;
        const isReservedByCurrentUser = isBooked && slot.reservedBy === 'currentUser'; 

        let buttonClasses = '';
        let isDisabled = false;

        // Base styles for size, font, centering, and animation
        const baseClasses = `w-full py-3.5 rounded-lg border font-semibold text-lg tracking-wide transition duration-150 ease-in-out flex justify-center items-center`;
        
        if (isReservedByCurrentUser) {
            // Style for the slot reserved by the current user (e.g., green/success style)
            buttonClasses = `bg-green-100 text-green-700 border-green-400 shadow-md hover:bg-green-200 cursor-pointer`;
            
        } else if (isBooked) {
            // Style for slots booked by others (grayed out)
            buttonClasses = `bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed`;
            isDisabled = true;
            
        } else if (isSelected) {
            // Style for unbooked slot currently selected (your light blue inspo style)
            buttonClasses = `bg-blue-50 text-blue-700 border-blue-400 shadow-md hover:bg-blue-100 cursor-pointer`;
            
        } else {
            // Default unbooked, unselected slot (your white/light blue inspo style)
            buttonClasses = `bg-white text-blue-600 border-blue-300 hover:border-blue-400 cursor-pointer`;
        }

        return (
          <button
            key={slot.id}
            onClick={() => !isBooked || isReservedByCurrentUser ? onSelectSlot(slot.id) : null}
            disabled={isDisabled && !isReservedByCurrentUser}
            className={`${baseClasses} ${buttonClasses} ${isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
          >
            {slot.start} - {slot.end} 
            {/* REMOVED: {isReservedByCurrentUser && <span className="ml-2 text-xs font-bold">(Mine)</span>} */}
            {isBooked && !isReservedByCurrentUser && <span className="ml-2 text-xs font-bold">(Booked)</span>}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSlotList;