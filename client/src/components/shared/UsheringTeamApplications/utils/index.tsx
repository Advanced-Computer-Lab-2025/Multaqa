import React from 'react';
import { toast } from 'react-toastify';
import {
    GraduationCap,
    Users,
    Shirt,
    Activity,
    Star,
    UserCog,
    Mic2,
} from 'lucide-react';
import {
    UsheringTeam,
    BookedSlot,
    Applicant,
} from '../types';
import { api } from '../../../../api';

// ============================================================================
// Team Color Mapping (from TeamsDescription.tsx)
// ============================================================================

/**
 * Map team titles to their brand colors.
 * Colors match the TeamsDescription.tsx implementation.
 */
export const getTeamColor = (title: string): string => {
    const colorMap: Record<string, string> = {
        'Graduates': '#009688',     // Teal
        'Parents': '#9C27B0',       // Purple
        'Caps & Gowns': '#2196F3',  // Blue
        'Flow': '#FF9800',          // Orange
        'Flow Team': '#FF9800',     // Orange
        'VIP': '#FFC107',           // Amber
        'HR': '#FF5722',            // Deep Orange
        'Stage': '#4CAF50',         // Green
    };
    return colorMap[title] || '#1a1a1a'; // Default fallback
};

// ============================================================================
// Team Icon Mapping (from TeamsDescription.tsx)
// ============================================================================

/**
 * Map team titles to lucide-react icons.
 * Icons match the TeamsDescription.tsx implementation.
 */
export const getTeamIcon = (title: string): React.ReactNode => {
    const iconMap: Record<string, React.ReactNode> = {
        'Graduates': <GraduationCap size={24} />,
        'Parents': <Users size={24} />,
        'Caps & Gowns': <Shirt size={24} />,
        'Flow': <Activity size={24} />,
        'Flow Team': <Activity size={24} />,
        'VIP': <Star size={24} />,
        'HR': <UserCog size={24} />,
        'Stage': <Mic2 size={24} />,
    };
    return iconMap[title] || <Users size={24} />; // Default fallback
};

// ============================================================================
// Helper Utilities
// ============================================================================

/**
 * Extract initials from a full name.
 * @param firstName - First name
 * @param lastName - Last name
 * @returns Initials (e.g., "JD" for "John Doe")
 */
export const getInitials = (firstName: string, lastName: string): string => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return `${first}${last}`;
};

/**
 * Format a time slot range.
 * @param start - Start time (HH:mm)
 * @param end - End time (HH:mm)
 * @returns Formatted time range (e.g., "09:00 - 10:00")
 */
export const formatSlotTime = (start: string, end: string): string => {
    return `${start} - ${end}`;
};

/**
 * Format a date for display.
 * @param isoDate - ISO date string (YYYY-MM-DD)
 * @returns Formatted date (e.g., "Thu, Dec 12")
 */
export const formatDateLabel = (isoDate: string): string => {
    const date = new Date(isoDate + 'T00:00:00');
    return date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
};

/**
 * Get today's date in ISO format.
 * @returns Today's date (YYYY-MM-DD)
 */
export const getTodayISO = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// ============================================================================
// Mock Data
// ============================================================================

/**
 * Mock teams data.
 * TODO: Remove when integrating with real API.
 */
export const MOCK_TEAMS: UsheringTeam[] = [
    {
        _id: 'team-1',
        id: 'graduates',
        title: 'Graduates',
        description: 'Handle graduate coordination and seating',
        color: getTeamColor('Graduates'),
        icon: getTeamIcon('Graduates'),
    },
    {
        _id: 'team-2',
        id: 'parents',
        title: 'Parents',
        description: 'Manage parent seating and guidance',
        color: getTeamColor('Parents'),
        icon: getTeamIcon('Parents'),
    },
    {
        _id: 'team-3',
        id: 'caps-gowns',
        title: 'Caps & Gowns',
        description: 'Distribute caps and gowns to graduates',
        color: getTeamColor('Caps & Gowns'),
        icon: getTeamIcon('Caps & Gowns'),
    },
    {
        _id: 'team-4',
        id: 'flow',
        title: 'Flow',
        description: 'Manage crowd flow and directions',
        color: getTeamColor('Flow'),
        icon: getTeamIcon('Flow'),
    },
    {
        _id: 'team-5',
        id: 'vip',
        title: 'VIP',
        description: 'Handle VIP guests and special arrangements',
        color: getTeamColor('VIP'),
        icon: getTeamIcon('VIP'),
    },
    {
        _id: 'team-6',
        id: 'hr',
        title: 'HR',
        description: 'Handle human resources and usher management',
        color: getTeamColor('HR'),
        icon: getTeamIcon('HR'),
    },
    {
        _id: 'team-7',
        id: 'stage',
        title: 'Stage',
        description: 'Manage stage operations and coordination',
        color: getTeamColor('Stage'),
        icon: getTeamIcon('Stage'),
    },
];

/**
 * Generate mock applicants.
 */
const generateMockApplicant = (id: number): Applicant => {
    const firstNames = ['Ahmed', 'Sara', 'Omar', 'Fatma', 'Youssef', 'Nour', 'Ali', 'Mariam'];
    const lastNames = ['Hassan', 'Mohamed', 'Ibrahim', 'Mahmoud', 'Khalil', 'Salem', 'Nasser'];

    const firstName = firstNames[id % firstNames.length];
    const lastName = lastNames[id % lastNames.length];

    return {
        _id: `applicant-${id}`,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.guc.edu.eg`,
        studentId: `49-${10000 + id}`,
    };
};

/**
 * Generate mock booked slots.
 */
const generateMockBookedSlots = (teamId: string, date: string, count: number): BookedSlot[] => {
    const timeSlots = [
        { start: '09:00', end: '09:30' },
        { start: '09:30', end: '10:00' },
        { start: '10:00', end: '10:30' },
        { start: '10:30', end: '11:00' },
        { start: '11:00', end: '11:30' },
        { start: '11:30', end: '12:00' },
    ];

    return Array.from({ length: Math.min(count, timeSlots.length) }, (_, i) => ({
        _id: `slot-${teamId}-${date}-${i}`,
        teamId,
        date,
        timeSlot: timeSlots[i],
        applicant: generateMockApplicant(i + parseInt(teamId.split('-')[1] || '1') * 10),
        status: 'confirmed' as const,
        createdAt: new Date().toISOString(),
    }));
};

/**
 * Mock booked slots data organized by teamId and date.
 * TODO: Remove when integrating with real API.
 */
export const MOCK_BOOKED_SLOTS: Record<string, Record<string, BookedSlot[]>> = {
    'team-1': {
        [getTodayISO()]: generateMockBookedSlots('team-1', getTodayISO(), 4),
    },
    'team-2': {
        [getTodayISO()]: generateMockBookedSlots('team-2', getTodayISO(), 3),
    },
    'team-3': {
        [getTodayISO()]: generateMockBookedSlots('team-3', getTodayISO(), 5),
    },
    'team-4': {
        [getTodayISO()]: generateMockBookedSlots('team-4', getTodayISO(), 2),
    },
    'team-5': {
        [getTodayISO()]: generateMockBookedSlots('team-5', getTodayISO(), 6),
    },
    'team-6': {
        [getTodayISO()]: generateMockBookedSlots('team-6', getTodayISO(), 4),
    },
    'team-7': {
        [getTodayISO()]: generateMockBookedSlots('team-7', getTodayISO(), 3),
    },
};

// ============================================================================
// API Functions (Ready for Integration)
// ============================================================================

/**
 * Fetch team applications for a specific team and date.
 * 
 * @param teamId - The team ID to fetch applications for
 * @param date - The date in YYYY-MM-DD format
 * @param setLoading - Loading state setter
 * @returns Promise resolving to array of booked slots
 * 
 * TODO: For integration, uncomment the API call and remove mock data.
 */
export const fetchTeamApplications = async (
    teamId: string,
    date: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<BookedSlot[]> => {
    setLoading(true);

    try {
        // TODO: Remove mock data and uncomment API call for integration
        // ----------------------------------------------------------------
        // import { api } from '../../../../api';
        
        // const response = await api.get(`/ushering/teams/${teamId}/applications`, {
        //   params: { date }
        // });
        
        // return response.data.data;
        // ----------------------------------------------------------------

        // MOCK DATA - Remove for integration
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        return MOCK_BOOKED_SLOTS[teamId]?.[date] ?? [];

    } catch (err: unknown) {
        const error = err as { response?: { data?: { error?: string; message?: string } }; message?: string };
        const errorMessage =
            error?.response?.data?.error ||
            error?.response?.data?.message ||
            error?.message ||
            'Failed to fetch applications. Please try again.';

        toast.error(errorMessage, {
            position: 'bottom-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
        });

        return [];
    } finally {
        setLoading(false);
    }
};

/**
 * Fetch all teams.
 * 
 * @param setLoading - Loading state setter
 * @returns Promise resolving to array of teams
 * 
 * TODO: For integration, uncomment the API call and remove mock data.
 */
export const fetchTeams = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<UsheringTeam[]> => {
    setLoading(true);
    try {
        // TODO: Remove mock data and uncomment API call for integration
        // ----------------------------------------------------------------
        const response = await api.get('/ushering');
        
        const usheringArray = response.data.data;
        
        // Extract teams from the nested structure
        const allTeams: UsheringTeam[] = [];
        if (usheringArray && Array.isArray(usheringArray)) {
          for (const entry of usheringArray) {
            if (entry.teams && Array.isArray(entry.teams)) {
              for (const team of entry.teams) {
                allTeams.push({
                  _id: team._id,
                  id: team.id,
                  title: team.title,
                  description: team.description,
                  color: team.color || getTeamColor(team.title),
                  icon: getTeamIcon(team.title),
                });
              }
            }
          }
        }
        
        return allTeams;
        // ----------------------------------------------------------------

        // MOCK DATA - Remove for integration
        await new Promise(resolve => setTimeout(resolve, 200));
        return MOCK_TEAMS;

    } catch (err: unknown) {
        const error = err as { response?: { data?: { error?: string; message?: string } }; message?: string };
        const errorMessage =
            error?.response?.data?.error ||
            error?.response?.data?.message ||
            error?.message ||
            'Failed to fetch teams. Please try again.';

        toast.error(errorMessage, {
            position: 'bottom-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
        });

        return [];
    } finally {
        setLoading(false);
    }
};
