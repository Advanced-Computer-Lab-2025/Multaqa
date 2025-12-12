// ./types.ts

// Custom type for the details collected during booking
export type StudentDetails = {
    studentEmail: string | null;
    studentId: string | null;
};

export interface InterviewSlot {
  id: string;
  teamId: string; // Matched your provided interface
  date: string;        // "2025-03-12"
  start: string;       // "10:00" <-- Matched your provided interface (start)
  end: string;         // "10:30" <-- Matched your provided interface (end)
  isBooked: boolean;
  reservedBy: string | null; // Changed to allow null for unbooked slots (string for 'currentUser' or other IDs)

  // --- NEW FIELDS FOR REQUIREMENT 6 (Booking Confirmation) ---
  interviewDetails: string; // e.g., "Zoom Link: https://zoom.us/j/1234567890"
  contactEmail: string; // e.g., "teamlead@usher.com"
  
  // --- NEW FIELDS FOR DETAIL ENTRY FORM (Student Data) ---
  studentEmail: string | null; 
  studentId: string | null;
}

export interface UsherTeam {
  id: string;
  team: string;
  description: string;
  icon: JSX.Element;
}