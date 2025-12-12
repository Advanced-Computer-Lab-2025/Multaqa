'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Box, Container, Typography, Skeleton, Stack, Badge } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';

import TeamSelector from './TeamSelector';
import ApplicantCard from './ApplicantCard';
import { UsheringTeam, BookedSlot } from './types';
import {
    fetchTeams,
    fetchUsheringApplications,
    fetchReservedDatesForTeam,
    getTodayISO,
    formatDateLabel,
} from './utils';
import {
    mainContainerStyles,
    contentGridStyles,
    cardsGridStyles,
    calendarContainerStyles,
    emptyStateStyles,
    headerStyles,
    headerTitleStyles,
    headerSubtitleStyles,
} from './styles';
import EmptyState from '../states/EmptyState';

// Extend dayjs with UTC plugin
dayjs.extend(utc);

/**
 * Custom Day Component with dot indicator for reserved dates
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ServerDay(props: any) {
    const { reservedDates = [], teamColor = '#1a1a1a', day, outsideCurrentMonth, ...other } = props;

    // Check if this day has reservations
    // reservedDates are in UTC format (YYYY-MM-DD), compare with local date
    const dayString = day.format('YYYY-MM-DD');
    const hasReservation = !outsideCurrentMonth && reservedDates.includes(dayString);

    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <PickersDay outsideCurrentMonth={outsideCurrentMonth} day={day} {...other} />
            {hasReservation && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 2,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: teamColor,
                    }}
                />
            )}
        </Box>
    );
}

/**
 * UsheringApplications Component
 * 
 * Main container component for viewing interview applications.
 * Flow: Select Team → Select Date → View Applicant Cards
 */
const UsheringApplications: React.FC = () => {
    // State
    const [teams, setTeams] = useState<UsheringTeam[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
    const [teamsLoading, setTeamsLoading] = useState<boolean>(true);
    const [slotsLoading, setSlotsLoading] = useState<boolean>(false);
    const [reservedDates, setReservedDates] = useState<string[]>([]);

    // Get selected team
    const selectedTeam = teams.find((t) => t._id === selectedTeamId);

    // Fetch teams on mount
    useEffect(() => {
        const loadTeams = async () => {
            const fetchedTeams = await fetchTeams(setTeamsLoading);
            setTeams(fetchedTeams);

            // Default to first team
            if (fetchedTeams.length > 0) {
                setSelectedTeamId(fetchedTeams[0]._id);
            }
        };

        loadTeams();
    }, []);

    // Fetch reserved dates when team changes
    useEffect(() => {
        const loadReservedDates = async () => {
            if (!selectedTeamId) return;
            const dates = await fetchReservedDatesForTeam(selectedTeamId);
            setReservedDates(dates);
        };

        loadReservedDates();
    }, [selectedTeamId]);

    // Fetch applications when team or date changes
    const loadApplications = useCallback(async () => {
        if (!selectedTeamId) return;

        // Use local date format for consistency with calendar
        const dateISO = selectedDate.format('YYYY-MM-DD');
        const slots = await fetchUsheringApplications(selectedTeamId, dateISO, setSlotsLoading);
        setBookedSlots(slots);
    }, [selectedTeamId, selectedDate]);

    useEffect(() => {
        loadApplications();
    }, [loadApplications]);

    // Handlers
    const handleTeamSelect = (teamId: string) => {
        setSelectedTeamId(teamId);
    };

    const handleDateChange = (newDate: Dayjs | null) => {
        if (newDate) {
            setSelectedDate(newDate);
        }
    };

    // Loading skeleton for cards
    const renderCardsSkeleton = () => (
        <Box sx={cardsGridStyles}>
            {[1, 2, 3, 4].map((i) => (
                <Box
                    key={i}
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Stack spacing={2}>
                        {/* Header with Avatar and Name */}
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Skeleton variant="circular" width={48} height={48} />
                            <Box sx={{ flex: 1 }}>
                                <Skeleton variant="text" width="70%" height={24} />
                                <Skeleton variant="rounded" width={80} height={20} sx={{ borderRadius: 2, mt: 0.5 }} />
                            </Box>
                        </Stack>
                        {/* Contact Info */}
                        <Stack spacing={1}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Skeleton variant="circular" width={14} height={14} />
                                <Skeleton variant="text" width="80%" height={16} />
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Skeleton variant="circular" width={14} height={14} />
                                <Skeleton variant="text" width="50%" height={16} />
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            ))}
        </Box>
    );

    // Empty state
    const renderEmptyState = () => (
        <Box sx={emptyStateStyles}>
            <EmptyState
                title="No applications found"
                description={`No interview applications for ${selectedTeam?.title || 'this team'} on ${formatDateLabel(selectedDate.format('YYYY-MM-DD'))}`}
            />
        </Box>
    );

    // Applicant cards
    const renderApplicantCards = () => (
        <Box sx={cardsGridStyles}>
            {bookedSlots.map((slot) => (
                <ApplicantCard
                    key={slot._id}
                    slot={slot}
                    teamColor={selectedTeam?.color || '#1a1a1a'}
                />
            ))}
        </Box>
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Container maxWidth="xl" sx={mainContainerStyles}>
                {/* Header */}
                <Box sx={headerStyles}>
                    <Typography variant="h4" sx={headerTitleStyles}>
                        Interview Applications
                    </Typography>
                    <Typography sx={headerSubtitleStyles}>
                        Select a team and date to view booked interview slots
                    </Typography>
                </Box>

                {/* Team Selector */}
                <TeamSelector
                    teams={teams}
                    selectedTeamId={selectedTeamId}
                    onTeamSelect={handleTeamSelect}
                    loading={teamsLoading}
                />

                {/* Main Content Grid */}
                <Box sx={contentGridStyles}>
                    {/* Calendar Section */}
                    <Box sx={calendarContainerStyles(selectedTeam?.color || '#1a1a1a')}>
                        <DateCalendar
                            value={selectedDate}
                            onChange={handleDateChange}
                            slots={{
                                day: ServerDay,
                            }}
                            slotProps={{
                                day: {
                                    reservedDates,
                                    teamColor: selectedTeam?.color || '#1a1a1a',
                                } as any,
                            }}
                            sx={{
                                width: '100%',
                                '& .MuiPickersCalendarHeader-root': {
                                    px: 2,
                                },
                            }}
                        />
                    </Box>

                    {/* Applicant Cards Section */}
                    <Box>
                        {/* Selected Date Header */}
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}
                        >
                            <Typography variant="h6" fontWeight={600} color="text.primary">
                                {formatDateLabel(selectedDate.format('YYYY-MM-DD'))}
                            </Typography>
                            {!slotsLoading && bookedSlots.length > 0 && (
                                <Typography variant="body2" color="text.secondary">
                                    {bookedSlots.length} application{bookedSlots.length !== 1 ? 's' : ''}
                                </Typography>
                            )}
                        </Stack>

                        {/* Cards or Empty State */}
                        {slotsLoading
                            ? renderCardsSkeleton()
                            : bookedSlots.length > 0
                                ? renderApplicantCards()
                                : renderEmptyState()}
                    </Box>
                </Box>
            </Container>
        </LocalizationProvider>
    );
};

export default UsheringApplications;
