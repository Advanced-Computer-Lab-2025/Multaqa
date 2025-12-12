// src/data/usherTeams.tsx
import { UsherTeam } from "../types";
import { FaRoute, FaUserGraduate, FaStar } from "react-icons/fa";
import { MdEvent, MdPeople } from "react-icons/md";
import { GiClothes } from "react-icons/gi";

export const usherTeams: UsherTeam[] = [
  {
    id: "flow",
    team: "Flow Team",
    description: "Guides guests and manages movement throughout the graduation venue.",
    icon: <FaRoute size={40} color="#ff9f43" />
  },
  {
    id: "graduates",
    team: "Graduates Team",
    description: "Assists graduates with assembly and procession coordination.",
    icon: <FaUserGraduate size={40} color="#1dd1a1" />
  },
  {
    id: "stage",
    team: "Stage Team",
    description: "Supports stage activities, timing, and VIP stage protocol.",
    icon: <MdEvent size={40} color="#feca57" />
  },
  {
    id: "caps-gowns",
    team: "Caps & Gowns",
    description: "Manages distribution and return of caps and gowns.",
    icon: <GiClothes size={40} color="#54a0ff" />
  },
  {
    id: "parents",
    team: "Parents Team",
    description: "Assists parents and guests with seating and directions.",
    icon: <MdPeople size={40} color="#5f27cd" />
  },
  {
    id: "vips",
    team: "VIP Team",
    description: "Supports dignitaries and ensures VIP protocol is followed.",
    icon: <FaStar size={40} color="#ff6b6b" />
  }
];
