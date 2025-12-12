import React from "react";
import { InterviewSlot } from "./types";

interface Props {
  slots: InterviewSlot[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

const Calendar: React.FC<Props> = ({ slots, selectedDate, onSelectDate }) => {
  const uniqueDates = Array.from(new Set(slots.map(slot => slot.date)));

  return (
    <div className="mb-10">
      <h3 className="font-semibold mb-3">Available Dates</h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {uniqueDates.map(date => (
          <button
            key={date}
            onClick={() => onSelectDate(date)}
            className={`p-4 rounded-lg border transition
              ${selectedDate === date
                ? "bg-blue-600 text-white border-blue-700"
                : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
              }`}
          >
            {new Date(date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric"
            })}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
