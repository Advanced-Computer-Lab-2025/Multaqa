'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container, Typography, Stack, Skeleton, IconButton, useTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import { format } from 'date-fns';
import { Plus, Clock, UserCheck, Trash2 } from 'lucide-react';

import CustomButton from '../shared/Buttons/CustomButton';
import InterviewSlots from './InterviewSlots';
import TeamSelector from '../shared/UsheringTeamApplications/TeamSelector';
import EmptyState from '../shared/states/EmptyState';
import { CustomModal } from '../shared/modals';
import { UsheringTeam } from '../shared/UsheringTeamApplications/types';
import {
  getTeamColor,
  getTeamIcon,
  formatDateLabel,
} from '../shared/UsheringTeamApplications/utils';
import {
  mainContainerStyles,
  contentGridStyles,
  calendarContainerStyles,
  headerStyles,
  headerTitleStyles,
  headerSubtitleStyles,
  emptyStateStyles,
  cardsGridStyles,
} from '../shared/UsheringTeamApplications/styles';
import { api } from '../../api';
import { toast } from 'react-toastify';

// ============================================================================
// Types
// ============================================================================

interface BackendSlot {
  _id: string;
  id?: string;
  StartDateTime: string;
  EndDateTime: string;
  isAvailable: boolean;
  location?: string;
  reservedBy?: object;
}

interface BackendTeam {
  _id?: string;
  id: string;
  title?: string;
  description: string;
  slots: BackendSlot[];
}

interface BackendUsheringData {
  id: string;
  teams: BackendTeam[];
}

interface TeamSlot {
  _id: string;
  teamId: string;
  start: Date;
  end: Date;
  isAvailable: boolean;
}

interface InterviewSlotManagerProps {
  isAdmin?: boolean;
}

// Team name mapping based on index (backend doesn't have title)
const TEAM_NAMES = [
  'Graduates',
  'Parents',
  'Caps & Gowns',
  'Flow',
  'VIP',
  'HR',
  'Stage',
];

// ============================================================================
// Component
// ============================================================================

const InterviewSlotManager: React.FC<InterviewSlotManagerProps> = ({
  isAdmin = true,
}) => {
  const theme = useTheme();

  // State
  const [teams, setTeams] = useState<UsheringTeam[]>([]);
  const [usheringId, setUsheringId] = useState<string>('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Delete confirmation state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<string | null>(null);

  // Per-team slot storage
  const [teamSlots, setTeamSlots] = useState<Record<string, TeamSlot[]>>({});

  // Get selected team
  const selectedTeam = teams.find((t) => t._id === selectedTeamId);

  // Fetch ushering data from backend
  useEffect(() => {
    const fetchUsheringData = async () => {
      setLoading(true);
      try {
        const res = await api.get('/ushering');
        const data: BackendUsheringData[] = res.data.data;

        if (data && data.length > 0 && data[0].teams) {
          const usheringData = data[0];
          const backendTeams = usheringData.teams;

          // Store ushering ID
          setUsheringId(usheringData.id);

          // Transform teams to UsheringTeam format
          const transformedTeams: UsheringTeam[] = backendTeams.map((team, index) => {
            const title = team.title || TEAM_NAMES[index] || `Team ${index + 1}`;
            return {
              _id: team._id || team.id,
              id: team.id,
              title,
              description: team.description,
              color: getTeamColor(title),
              icon: getTeamIcon(title),
            };
          });

          setTeams(transformedTeams);

          // Set first team as selected
          if (transformedTeams.length > 0) {
            setSelectedTeamId(transformedTeams[0]._id);
          }

          // Transform slots per team
          const slotsPerTeam: Record<string, TeamSlot[]> = {};
          backendTeams.forEach((team, index) => {
            const teamId = team._id || team.id;
            slotsPerTeam[teamId] = (team.slots || []).map((slot) => ({
              _id: slot._id || slot.id || '',
              teamId,
              start: new Date(slot.StartDateTime),
              end: new Date(slot.EndDateTime),
              isAvailable: slot.isAvailable,
            }));
          });

          setTeamSlots(slotsPerTeam);
        }
      } catch (error) {
        console.error('Failed to fetch ushering data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsheringData();
  }, []);

  // Get slots for selected team and date
  const getSlotsForSelectedDate = (): TeamSlot[] => {
    if (!selectedTeamId) return [];
    const allSlotsForTeam = teamSlots[selectedTeamId] || [];
    const selectedDateStr = selectedDate.format('YYYY-MM-DD');

    return allSlotsForTeam.filter((slot) => {
      const slotDateStr = format(slot.start, 'yyyy-MM-dd');
      return slotDateStr === selectedDateStr;
    });
  };

  const slotsForSelectedDate = getSlotsForSelectedDate();

  // Handle team selection
  const handleTeamSelect = (teamId: string) => {
    setSelectedTeamId(teamId);
  };

  // Handle date change
  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      setSelectedDate(newDate);
    }
  };

  // Handle saving slots from modal
  const handleSaveSlots = async (newSlots: { start: Date; end: Date }[]) => {
    if (newSlots.length === 0 || !selectedTeamId || !usheringId) return;

    try {
      // Make real API call to save slots
      const payload = {
        slots: newSlots.map((slot) => ({
          start: slot.start.toString(),
          end: slot.end.toString(),
        })),
      };

      console.log(`Saving slots to /ushering/${usheringId}/teams/${selectedTeamId}/slots`, payload);

      await api.post(`/ushering/${usheringId}/teams/${selectedTeamId}/slots`, payload);

      // Add to local state after successful save
      const newTeamSlots: TeamSlot[] = newSlots.map((slot, index) => ({
        _id: `new-slot-${Date.now()}-${index}`,
        teamId: selectedTeamId,
        start: slot.start,
        end: slot.end,
        isAvailable: true,
      }));

      setTeamSlots((prev) => ({
        ...prev,
        [selectedTeamId]: [...(prev[selectedTeamId] || []), ...newTeamSlots],
      }));
    } catch (error) {
      console.error('Failed to save slots:', error);
    }
  };

  // Slot card styles
  const slotCardStyles = (teamColor: string, isAvailable: boolean) => ({
    p: 2,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: isAvailable ? '#fff' : `${teamColor}08`,
    border: '2px solid',
    borderColor: isAvailable ? `${teamColor}30` : `${teamColor}50`,
    borderRadius: 3,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    opacity: isAvailable ? 1 : 0.85,
    '&:hover': {
      borderColor: teamColor,
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 12px ${teamColor}20`,
    },
  });

  // Render loading skeleton
  const renderSkeleton = () => (
    <Box sx={cardsGridStyles}>
      {[1, 2, 3, 4].map((i) => (
        <Skeleton
          key={i}
          variant="rounded"
          height={60}
          sx={{ borderRadius: 3 }}
        />
      ))}
    </Box>
  );

  // Handle delete click - opens confirmation modal
  const handleDeleteClick = (slotId: string) => {
    setSlotToDelete(slotId);
    setIsDeleteModalOpen(true);
  };

  // Handle actual delete after confirmation
  const handleDeleteSlot = async (slotId: string) => {
    if (!usheringId || !selectedTeamId) return;

    try {
      console.log(`Deleting slot: /ushering/${usheringId}/teams/${selectedTeamId}/slots/${slotId}`);

      await api.delete(`/ushering/${usheringId}/teams/${selectedTeamId}/slots/${slotId}`);

      // Remove from local state after successful delete
      setTeamSlots((prev) => ({
        ...prev,
        [selectedTeamId]: (prev[selectedTeamId] || []).filter((s) => s._id !== slotId),
      }));
      toast.success("Slot deleted successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error:any) {
      toast.error(error?.response?.data?.error || error?.response?.data?.message,
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    }
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (slotToDelete !== null) {
      await handleDeleteSlot(slotToDelete);
      setIsDeleteModalOpen(false);
      setSlotToDelete(null);
    }
  };

  // Render slot cards
  const renderSlotCards = () => (
    <Box sx={cardsGridStyles}>
      {slotsForSelectedDate.map((slot) => (
        <Box
          key={slot._id}
          sx={slotCardStyles(selectedTeam?.color || '#1a1a1a', slot.isAvailable)}
        >
          <Stack
            direction="row"
            spacing={1.2}
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: '100%' }}
          >
            {/* Left: Reserved mark (only shown when reserved) */}
            {!slot.isAvailable && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <UserCheck size={14} color={selectedTeam?.color || '#1a1a1a'} />
                <Typography
                  variant="caption"
                  sx={{
                    px: 0.75,
                    py: 0.25,
                    borderRadius: 1,
                    backgroundColor: `${selectedTeam?.color}20`,
                    color: selectedTeam?.color,
                    fontWeight: 600,
                    fontSize: '0.6rem',
                  }}
                >
                  Reserved
                </Typography>
              </Box>
            )}

            {/* Center: Time (with clock icon when available) */}
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flex: 1, justifyContent: slot.isAvailable ? 'flex-start' : 'center' }}>
              {slot.isAvailable && <Clock size={16} color={selectedTeam?.color || '#1a1a1a'} />}
              <Typography variant="body2" fontWeight={500}>
                {format(slot.start, 'h:mm a')} - {format(slot.end, 'h:mm a')}
              </Typography>
            </Stack>

            {/* Right: Delete icon */}
            <IconButton
              size="small"
              onClick={() => handleDeleteClick(slot._id)}
              sx={{
                color: '#9ca3af',
                '&:hover': {
                  color: 'error.main',
                  backgroundColor: 'error.lighter',
                },
              }}
            >
              <Trash2 size={16} />
            </IconButton>
          </Stack>
        </Box>
      ))}
    </Box>
  );

  // Render empty state
  const renderEmptyState = () => (
    <Box sx={emptyStateStyles}>
      <EmptyState
        title="No slots available"
        description={
          isAdmin
            ? `No interview slots for ${selectedTeam?.title || 'this team'} on ${formatDateLabel(selectedDate.format('YYYY-MM-DD'))}. Click "Create Slots" to add some.`
            : `No interview slots for ${selectedTeam?.title || 'this team'} on ${formatDateLabel(selectedDate.format('YYYY-MM-DD'))}`
        }
      />
    </Box>
  );

  // Get stats
  const totalSlotsForTeam = teamSlots[selectedTeamId]?.length || 0;
  const availableCount = slotsForSelectedDate.filter((s) => s.isAvailable).length;
  const reservedCount = slotsForSelectedDate.filter((s) => !s.isAvailable).length;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="xl" sx={mainContainerStyles}>
        {/* Header */}
        <Box sx={headerStyles}>
          <Typography variant="h4" sx={headerTitleStyles}>
            Interview Slots
          </Typography>
          <Typography sx={headerSubtitleStyles}>
            {isAdmin
              ? 'Create and manage interview slots for each team'
              : 'View available interview slots for each team'}
          </Typography>
        </Box>

        {/* Team Selector */}
        <TeamSelector
          teams={teams}
          selectedTeamId={selectedTeamId}
          onTeamSelect={handleTeamSelect}
          loading={loading}
        />

        {/* Main Content Grid */}
        <Box sx={contentGridStyles}>
          {/* Calendar Section */}
          <Box sx={calendarContainerStyles(selectedTeam?.color || '#1a1a1a')}>
            <DateCalendar
              value={selectedDate}
              onChange={handleDateChange}
              sx={{
                width: '100%',
                '& .MuiPickersCalendarHeader-root': {
                  px: 2,
                },
              }}
            />
          </Box>

          {/* Slots Section */}
          <Box>
            {/* Header with date and actions */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              flexWrap="wrap"
              gap={2}
            >
              <Box>
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  {formatDateLabel(selectedDate.format('YYYY-MM-DD'))}
                </Typography>
                {!loading && slotsForSelectedDate.length > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    {slotsForSelectedDate.length} slot{slotsForSelectedDate.length !== 1 ? 's' : ''}
                    {reservedCount > 0 && ` (${availableCount} available, ${reservedCount} reserved)`}
                  </Typography>
                )}
              </Box>

              {/* Create Slots Button - Admin only */}
              {isAdmin && (
                <CustomButton
                  variant="contained"
                  onClick={() => setIsModalOpen(true)}
                  sx={{
                    backgroundColor: selectedTeam?.color || '#1a1a1a',
                    borderColor: selectedTeam?.color || '#1a1a1a',
                    '&:hover': {
                      backgroundColor: selectedTeam?.color || '#1a1a1a',
                      filter: 'brightness(0.9)',
                    },
                  }}
                  startIcon={<Plus size={18} />}
                >
                  Create Slots
                </CustomButton>
              )}
            </Stack>

            {/* Slots Content */}
            {loading
              ? renderSkeleton()
              : slotsForSelectedDate.length > 0
                ? renderSlotCards()
                : renderEmptyState()}
          </Box>
        </Box>

        {/* Interview Slots Modal */}
        <InterviewSlots
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSlots}
          teamColor={selectedTeam?.color || '#009688'}
          teamName={selectedTeam?.title || 'Team'}
        />

        {/* Delete Confirmation Modal */}
        <CustomModal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirm Deletion"
          description="Are you sure you want to delete this interview slot? This action cannot be undone."
          modalType="delete"
          borderColor={theme.palette.error.main}
          buttonOption1={{
            label: "Delete",
            variant: "contained",
            color: "error",
            onClick: handleConfirmDelete,
          }}
          buttonOption2={{
            label: "Cancel",
            variant: "outlined",
            color: "primary",
            onClick: () => setIsDeleteModalOpen(false),
          }}
        />
      </Container>
    </LocalizationProvider>
  );
};

export default InterviewSlotManager;
