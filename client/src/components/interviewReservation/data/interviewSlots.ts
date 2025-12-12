import { InterviewSlot } from "../types";

export const interviewSlots: InterviewSlot[] = [
  // ---------------- FLOW TEAM ----------------
  {
    id: "flow-1",
    teamId: "flow",
    date: "2025-12-11", // today
    start: "09:00",
    end: "09:30",
    isBooked: false,
    reservedBy:"",
  },
  {
    id: "flow-2",
    teamId: "flow",
    date: "2025-12-13", // later this week
    start: "10:00",
    end: "10:30",
    isBooked: false,
    reservedBy:"",
  },
  {
    id: "flow-3",
    teamId: "flow",
    date: "2025-12-14",
    start: "11:00",
    end: "11:30",
    isBooked: false,
    reservedBy:"",

  },

  // ---------------- GRADUATES TEAM ----------------
  {
    id: "graduates-1",
    teamId: "graduates",
    date: "2025-12-11", // today
    start: "09:00",
    end: "09:30",
    isBooked: false,
    reservedBy:"",
  },
  {
    id: "graduates-2",
    teamId: "graduates",
    date: "2025-12-12", // later this week
    start: "10:30",
    end: "11:00",
    isBooked: false,
    reservedBy:""
  },
  {
    id: "graduates-3",
    teamId: "graduates",
    date: "2025-12-13",
    start: "13:00",
    end: "13:30",
    isBooked: false,
    reservedBy:"",
  },

  // ---------------- STAGE TEAM ----------------
  {
    id: "stage-1",
    teamId: "stage",
    date: "2025-12-12",
    start: "09:00",
    end: "09:30",
    isBooked: false,
    reservedBy:"",
  },
  {
    id: "stage-2",
    teamId: "stage",
    date: "2025-12-14",
    start: "10:00",
    end: "10:30",
    isBooked: false,
    reservedBy:"",
  },

  // ---------------- CAPS & GOWNS ----------------
  {
    id: "caps-1",
    teamId: "caps-gowns",
    date: "2025-12-13",
    start: "09:00",
    end: "09:30",
    isBooked: false,
    reservedBy:"",
  },
  {
    id: "caps-2",
    teamId: "caps-gowns",
    date: "2025-12-13",
    start: "11:00",
    end: "11:30",
    isBooked: false,
    reservedBy:"",
  },

  // ---------------- PARENTS TEAM ----------------
  {
    id: "parents-1",
    teamId: "parents",
    date: "2025-12-14",
    start: "09:00",
    end: "09:30",
    isBooked: false,
    reservedBy:"",
  },
  {
    id: "parents-2",
    teamId: "parents",
    date: "2025-12-14",
    start: "10:00",
    end: "10:30",
    isBooked: false,
    reservedBy:"",
  },

  // ---------------- VIP TEAM ----------------
  {
    id: "vips-1",
    teamId: "vips",
    date: "2025-12-15",
    start: "09:00",
    end: "09:30",
    isBooked: false,
    reservedBy: '', // Not booked
  },
  {
    id: "vips-2",
    teamId: "vips",
    date: "2025-12-15",
    start: "10:00",
    end: "10:30",
    isBooked: false,
    reservedBy: '', // Example of a slot booked by the current user
  },
];