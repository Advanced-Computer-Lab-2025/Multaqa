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

// Applicant Types (from /users/:id API)
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
    teamTitle: string;
    date: string;      // YYYY-MM-DD format
    timeSlot: TimeSlot;
    applicant: Applicant;
    status: BookedSlotStatus;
    createdAt?: string;
}

export type BookedSlotStatus = 'pending' | 'confirmed' | 'cancelled';

// ============================================================================
// API Response Types (matching /ushering endpoint)
// ============================================================================

// Reserved slot info from API
export interface ReservedBy {
    studentId: string;
    reservedAt: string;
}

// Slot as returned from the API
export interface ApiSlot {
    _id: string;
    id: string;
    StartDateTime: string;  // ISO date string
    EndDateTime: string;    // ISO date string
    isAvailable: boolean;
    location: string;
    reservedBy?: ReservedBy;
}

// Team as returned from the API
export interface ApiTeam {
    _id: string;
    id: string;
    title: string;
    description: string;
    slots: ApiSlot[];
}

// Ushering entry from the API
export interface ApiUsheringEntry {
    _id: string;
    id: string;
    teams: ApiTeam[];
    __v: number;
}

// Full API response from /ushering
export interface UsheringApiResponse {
    success: boolean;
    data: ApiUsheringEntry[];
    message: string;
}

// User API response from /users/:id
export interface UserApiResponse {
    success: boolean;
    data: {
        _id: string;
        firstName?: string;
        lastName?: string;
        name?: string;
        email: string;
        studentId?: string;
    };
    message?: string;
}

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
