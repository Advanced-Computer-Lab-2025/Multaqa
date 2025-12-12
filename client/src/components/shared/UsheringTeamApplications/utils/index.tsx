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

/**
 * Extract time in HH:mm format from ISO datetime string (using local time).
 * @param isoDateTime - ISO datetime string
 * @returns Time string in HH:mm format (local time)
 */
export const extractTimeFromISO = (isoDateTime: string): string => {
    const date = new Date(isoDateTime);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

/**
 * Extract date in YYYY-MM-DD format from ISO datetime string (using local time).
 * This matches how the calendar displays dates in the user's local timezone.
 * @param isoDateTime - ISO datetime string
 * @returns Date string in YYYY-MM-DD format (local time)
 */
export const extractDateFromISO = (isoDateTime: string): string => {
    const date = new Date(isoDateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// ============================================================================
// API Functions
// ============================================================================

/**
 * Fetch user data by their ID.
 * 
 * @param userId - The user's ID to fetch
 * @returns Promise resolving to Applicant data or null if not found
 */
export const fetchUserById = async (userId: string): Promise<Applicant | null> => {
    try {
        const response = await api.get(`/users/${userId}`);
        const userData = response.data.data;

        // Handle different name formats from API
        let firstName = userData.firstName || '';
        let lastName = userData.lastName || '';

        // If only 'name' field is available, split it
        if (!firstName && !lastName && userData.name) {
            const nameParts = userData.name.split(' ');
            firstName = nameParts[0] || '';
            lastName = nameParts.slice(1).join(' ') || '';
        }

        return {
            _id: userData._id,
            firstName,
            lastName,
            email: userData.email || '',
            // Use gucId (e.g., "58-2147") instead of studentId or _id
            studentId: userData.gucId || userData.studentId || userData._id,
        };
    } catch (error) {
        console.error(`Failed to fetch user ${userId}:`, error);
        return null;
    }
};

/**
 * Fetch ushering applications - gets all reserved slots (where isAvailable: false)
 * and enriches them with user data.
 * 
 * @param teamId - The team ID to fetch applications for
 * @param date - The date in YYYY-MM-DD format
 * @param setLoading - Loading state setter
 * @returns Promise resolving to array of booked slots
 */
export const fetchUsheringApplications = async (
    teamId: string,
    date: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<BookedSlot[]> => {
    setLoading(true);

    try {
        // Fetch ushering data
        const response = await api.get('/ushering');
        const usheringData = response.data.data;

        const bookedSlots: BookedSlot[] = [];

        if (usheringData && Array.isArray(usheringData)) {
            for (const entry of usheringData) {
                if (entry.teams && Array.isArray(entry.teams)) {
                    for (const team of entry.teams) {
                        // Filter by team ID
                        if (team._id !== teamId) continue;

                        if (team.slots && Array.isArray(team.slots)) {
                            // Get only reserved slots (isAvailable: false)
                            const reservedSlots = team.slots.filter(
                                (slot: { isAvailable: boolean; reservedBy?: { studentId: string } }) =>
                                    !slot.isAvailable && slot.reservedBy?.studentId
                            );

                            for (const slot of reservedSlots) {
                                // Filter by date
                                const slotDate = extractDateFromISO(slot.StartDateTime);
                                if (slotDate !== date) continue;

                                // Fetch user data for this reservation
                                const applicant = await fetchUserById(slot.reservedBy.studentId);

                                if (applicant) {
                                    bookedSlots.push({
                                        _id: slot._id,
                                        teamId: team._id,
                                        teamTitle: team.title,
                                        date: slotDate,
                                        timeSlot: {
                                            start: extractTimeFromISO(slot.StartDateTime),
                                            end: extractTimeFromISO(slot.EndDateTime),
                                        },
                                        applicant,
                                        status: 'confirmed',
                                        createdAt: slot.reservedBy.reservedAt,
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }

        // Sort by time slot
        bookedSlots.sort((a, b) => a.timeSlot.start.localeCompare(b.timeSlot.start));

        return bookedSlots;

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
 * Fetch team applications for a specific team and date.
 * 
 * @param teamId - The team ID to fetch applications for
 * @param date - The date in YYYY-MM-DD format
 * @param setLoading - Loading state setter
 * @returns Promise resolving to array of booked slots
 * 
 * @deprecated Use fetchUsheringApplications instead
 */
export const fetchTeamApplications = async (
    teamId: string,
    date: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<BookedSlot[]> => {
    // Redirect to the new implementation
    return fetchUsheringApplications(teamId, date, setLoading);
};

/**
 * Fetch all teams.
 * 
 * @param setLoading - Loading state setter
 * @returns Promise resolving to array of teams
 */
export const fetchTeams = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
): Promise<UsheringTeam[]> => {
    setLoading(true);
    try {
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

/**
 * Fetch all dates that have reserved slots for a specific team.
 * Used to show dots on calendar days with reservations.
 * 
 * @param teamId - The team ID to fetch reserved dates for
 * @returns Promise resolving to array of date strings (YYYY-MM-DD format, UTC)
 */
export const fetchReservedDatesForTeam = async (teamId: string): Promise<string[]> => {
    try {
        const response = await api.get('/ushering');
        const usheringData = response.data.data;

        const reservedDates = new Set<string>();

        if (usheringData && Array.isArray(usheringData)) {
            for (const entry of usheringData) {
                if (entry.teams && Array.isArray(entry.teams)) {
                    for (const team of entry.teams) {
                        // Filter by team ID
                        if (team._id !== teamId) continue;

                        if (team.slots && Array.isArray(team.slots)) {
                            // Get only reserved slots (isAvailable: false)
                            for (const slot of team.slots) {
                                if (!slot.isAvailable && slot.reservedBy?.studentId) {
                                    const slotDate = extractDateFromISO(slot.StartDateTime);
                                    reservedDates.add(slotDate);
                                }
                            }
                        }
                    }
                }
            }
        }

        return Array.from(reservedDates);
    } catch (error) {
        console.error('Failed to fetch reserved dates:', error);
        return [];
    }
};
