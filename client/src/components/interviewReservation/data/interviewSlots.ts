// ./data/interviewSlots.ts

import { InterviewSlot } from "../types";

// NOTE: This file now matches the InterviewSlot type with 'start' and 'end' keys.

export const interviewSlots: InterviewSlot[] = [
  // ---------------- FLOW TEAM ----------------
  {
    id: "flow-1",
    teamId: "flow",
    date: "2025-12-11", 
    start: "09:00", // <-- CORRECTED
    end: "09:30",   // <-- CORRECTED
    isBooked: false,
    reservedBy: null,
    interviewDetails: "Zoom Link: https://zoom.us/j/94830182",
    contactEmail: "flow.lead@usher.com",
    studentEmail: null,
    studentId: null,
  },
  {
    id: "flow-2",
    teamId: "flow",
    date: "2025-12-13", 
    start: "10:00", // <-- CORRECTED
    end: "10:30",   // <-- CORRECTED
    isBooked: false,
    reservedBy: null,
    interviewDetails: "Meeting Room: Building C, Room 201",
    contactEmail: "flow.lead@usher.com",
    studentEmail: null,
    studentId: null,
  },
  {
    id: "flow-3",
    teamId: "flow",
    date: "2025-12-14", 
    start: "11:00", // <-- CORRECTED
    end: "11:30",   // <-- CORRECTED
    isBooked: false,
    reservedBy: null,
    interviewDetails: "Google Meet Link: https://meet.google.com/abc-flow",
    contactEmail: "flow.lead@usher.com",
    studentEmail: null,
    studentId: null,
  },

  // ---------------- GRADUATES TEAM ----------------
  {
    id: "graduates-1",
    teamId: "graduates",
    date: "2025-12-11",
    start: "09:00", // <-- CORRECTED
    end: "09:30",   // <-- CORRECTED
    isBooked: false,
    reservedBy: null,
    interviewDetails: "Zoom Link: https://zoom.us/j/999111222",
    contactEmail: "grads.lead@usher.com",
    studentEmail: null,
    studentId: null,
  },
  {
    id: "graduates-2",
    teamId: "graduates",
    date: "2025-12-12",
    start: "10:30", // <-- CORRECTED
    end: "11:00",   // <-- CORRECTED
    isBooked: false,
    reservedBy: null,
    interviewDetails: "Meeting Room: Building A, Room 105",
    contactEmail: "grads.lead@usher.com",
    studentEmail: null,
    studentId: null,
  },
  {
    id: "graduates-3",
    teamId: "graduates",
    date: "2025-12-13",
    start: "13:00", // <-- CORRECTED
    end: "13:30",   // <-- CORRECTED
    isBooked: false,
    reservedBy: null,
    interviewDetails: "Google Meet Link: https://meet.google.com/abc-grad",
    contactEmail: "grads.lead@usher.com",
    studentEmail: null,
    studentId: null,
  },

  // ---------------- STAGE TEAM ----------------
  {
    id: "stage-1",
    teamId: "stage",
    date: "2025-12-12",
    start: "09:00", // <-- CORRECTED
    end: "09:30",   // <-- CORRECTED
    isBooked: false,
    reservedBy: null,
    interviewDetails: "Zoom Link: https://zoom.us/j/777888999",
    contactEmail: "stage.lead@usher.com",
    studentEmail: null,
    studentId: null,
  },
  {
    id: "stage-2",
    teamId: "stage",
    date: "2025-12-14",
    start: "10:00", // <-- CORRECTED
    end: "10:30",   // <-- CORRECTED
    isBooked: false,
    reservedBy: null,
    interviewDetails: "Meeting Room: Stage Green Room",
    contactEmail: "stage.lead@usher.com",
    studentEmail: null,
    studentId: null,
  },

  // ---------------- CAPS & GOWNS ----------------
  {
    id: "caps-1",
    teamId: "caps-gowns",
    date: "2025-12-13",
    start: "09:00", // <-- CORRECTED
    end: "09:30",   // <-- CORRECTED
    isBooked: false,
    reservedBy: null,
    interviewDetails: "Google Meet Link: https://meet.google.com/abc-caps1",
    contactEmail: "caps.lead@usher.com",
    studentEmail: null,
    studentId: null,
  },
  {
    id: "caps-2",
    teamId: "caps-gowns",
    date: "2025-12-13",
    start: "11:00", // <-- CORRECTED
    end: "11:30",   // <-- CORRECTED
    isBooked: false,
    reservedBy: null,
    interviewDetails: "Google Meet Link: https://meet.google.com/abc-caps2",
    contactEmail: "caps.lead@usher.com",
    studentEmail: null,
    studentId: null,
  },

  // ---------------- PARENTS TEAM ----------------
  {
    id: "parents-1",
    teamId: "parents",
    date: "2025-12-14",
    start: "09:00", // <-- CORRECTED
    end: "09:30",   // <-- CORRECTED
    isBooked: false,
    reservedBy: null,
    interviewDetails: "Zoom Link: https://zoom.us/j/333444555",
    contactEmail: "parents.lead@usher.com",
    studentEmail: null,
    studentId: null,
  },
  {
    id: "parents-2",
    teamId: "parents",
    date: "2025-12-14",
    start: "10:00", // <-- CORRECTED
    end: "10:30",   // <-- CORRECTED
    isBooked: false,
    reservedBy: null,
    interviewDetails: "Zoom Link: https://zoom.us/j/666777888",
    contactEmail: "parents.lead@usher.com",
    studentEmail: null,
    studentId: null,
  },

  // ---------------- VIP TEAM ----------------
  {
    id: "vips-1",
    teamId: "vips",
    date: "2025-12-15",
    start: "09:00", // <-- CORRECTED
    end: "09:30",   // <-- CORRECTED
    isBooked: false,
    reservedBy: null,
    interviewDetails: "Private Meeting Room: VIP Suite 1",
    contactEmail: "vips.lead@usher.com",
    studentEmail: null,
    studentId: null,
  },
  // Example of a slot booked by the current user to test the "Details View"
  {
    id: "vips-2",
    teamId: "vips",
    date: "2025-12-15",
    start: "10:00", // <-- CORRECTED
    end: "10:30",   // <-- CORRECTED
    isBooked: true, 
    reservedBy: 'currentUser', 
    interviewDetails: "Private Meeting Room: VIP Suite 2",
    contactEmail: "vips.lead@usher.com",
    studentEmail: 'jdoe@mail.com', 
    studentId: 'S100456', 
  },
];