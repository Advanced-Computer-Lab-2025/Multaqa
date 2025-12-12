// ./types.ts

// Custom type for the details collected during booking
export type StudentDetails = {
    studentEmail: string | null;
    studentId: string | null;
};

export interface InterviewSlot {
  id: string;                 // Unique slot ID
  teamId: string;             // The team this slot belongs to

  startDateTime: string;      // ISO string of slot start time
  endDateTime: string;        // ISO string of slot end time
  isAvailable: boolean;       // True if the slot is available for booking

  reservedBy?: {              // Optional info about who reserved the slot
    studentId: string;
    reservedAt: string;
  } | null;

  studentId: string | null;   // ID of the student who booked it (or null)
  studentEmail: string | null; // Email of the student who booked it (or null)

  location: string;           // Slot location, e.g., "TBD" or room name
}


export interface UsherTeam {
  id: string;
  team: string;
  description: string;
  icon: JSX.Element;
}