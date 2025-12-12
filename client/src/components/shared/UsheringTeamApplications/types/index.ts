import React from 'react';

// Team Types
export interface UsheringTeam {
    _id: string;
    id: string;
    title: string;
    description: string;
    color: string;
    icon: React.ReactNode;
}

// Applicant Types
export interface Applicant {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    studentId: string;
}

// Slot Types
export interface TimeSlot {
    start: string; // HH:mm format
    end: string;   // HH:mm format
}

export interface BookedSlot {
    _id: string;
    teamId: string;
    date: string;      // YYYY-MM-DD format
    timeSlot: TimeSlot;
    applicant: Applicant;
    status: BookedSlotStatus;
    createdAt?: string;
}

export type BookedSlotStatus = 'pending' | 'confirmed' | 'cancelled';

// API Response Types
export interface TeamApplicationsResponse {
    success: boolean;
    data: BookedSlot[];
    message?: string;
}

export interface TeamsResponse {
    success: boolean;
    data: Array<{
        _id: string;
        id: string;
        title: string;
        description: string;
    }>;
    message?: string;
}

// Component Props Types
export interface TeamSelectorProps {
    teams: UsheringTeam[];
    selectedTeamId: string;
    onTeamSelect: (teamId: string) => void;
    loading?: boolean;
}

export interface ApplicantCardProps {
    slot: BookedSlot;
    teamColor: string;
}
export interface UsheringApplicationsProps {
    // No props needed for now, component manages its own state
}
