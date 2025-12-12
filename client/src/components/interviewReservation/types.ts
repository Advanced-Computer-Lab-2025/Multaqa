export interface InterviewSlot {
  reservedBy: string;
  id: string;
  teamId: string;
  date: string;        // "2025-03-12"
  start: string;       // "10:00"
  end: string;         // "10:30"
  isBooked: boolean;
}

export interface UsherTeam {
  id: string;
  team: string;
  description: string;
  icon: JSX.Element;
}