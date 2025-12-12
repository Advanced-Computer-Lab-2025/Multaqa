import React from "react";
import { Calendar, Clock, Mail, AlertCircle } from "lucide-react";
import { InterviewSlot } from "./types";

interface BookingDetailsViewProps {
  booking: InterviewSlot;
  onCancel: () => void;
}

const BookingDetailsView: React.FC<BookingDetailsViewProps> = ({ booking, onCancel }) => {
  const start = new Date(booking.startDateTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const end = new Date(booking.endDateTime).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const dateStr = new Date(booking.startDateTime).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6" style={{ backgroundColor: '#3a4f99' }}>
          <h1 className="text-2xl font-bold text-white text-center">
            Interview Slot Details
          </h1>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Date Section */}
          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#3a4f99' }}>
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-1" style={{ color: '#3a4f99' }}>Date</p>
              <p className="text-base text-gray-800 font-semibold">{dateStr}</p>
            </div>
          </div>

          {/* Time Section */}
          <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-purple-900 mb-1">Time</p>
              <p className="text-base text-gray-800 font-semibold">
                {start} - {end}
              </p>
            </div>
          </div>

          {/* Email Section */}
          <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900 mb-1">Your Details</p>
              <p className="text-base text-gray-800 font-semibold break-all">
                {booking.studentEmail || "N/A"}
              </p>
            </div>
          </div>

          {/* Location Section (if available) */}
          {booking.location && booking.location !== "TBD" && (
            <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-orange-900 mb-1">Location</p>
                <p className="text-base text-gray-800 font-semibold">
                  {booking.location}
                </p>
              </div>
            </div>
          )}

          {/* Warning Message */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              You must cancel this slot before reserving another.
            </p>
          </div>

          {/* Cancel Button */}
          <button
            onClick={onCancel}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 mt-6"
          >
            CANCEL SLOT
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsView;