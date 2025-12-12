'use client';

import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Stack, Skeleton, IconButton, useTheme, Checkbox, CircularProgress, Tooltip, alpha, Fab } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { format } from 'date-fns';
import { Plus, Clock, UserCheck, Trash2, CalendarClock, Send } from 'lucide-react';

import CustomButton from '../shared/Buttons/CustomButton';
import InterviewSlots from './InterviewSlots';
import TeamSelector from '../shared/UsheringTeamApplications/TeamSelector';
import EmptyState from '../shared/states/EmptyState';
import { CustomModal, CustomModalLayout } from '../shared/modals';
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
  const [refresh, setRefresh] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Delete confirmation state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<string | null>(null);

  // Multi-select state
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  // Schedule modal state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleStartDate, setScheduleStartDate] = useState<Dayjs | null>(dayjs());
  const [scheduleEndDate, setScheduleEndDate] = useState<Dayjs | null>(dayjs().add(7, 'day'));

  // Manual post confirmation modal state
  const [isManualPostModalOpen, setIsManualPostModalOpen] = useState(false);

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
  }, [refresh]);

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
      const payload = {
        slots: newSlots.map((slot) => ({
          start: slot.start.toString(),
          end: slot.end.toString(),
        })),
      };

      console.log(`Saving slots to /ushering/${usheringId}/teams/${selectedTeamId}/slots`, payload);
      await api.post(`/ushering/${usheringId}/teams/${selectedTeamId}/slots`, payload);

      toast.success('Slots created successfully', {
        position: 'bottom-right',
        autoClose: 3000,
        theme: 'colored',
      });

      // Trigger refresh to reload data from API
      setRefresh((prev) => !prev);
    } catch (error: any) {
      console.error('Failed to save slots:', error);
      toast.error(error?.response?.data?.error || error?.response?.data?.message || 'Failed to save slots', {
        position: 'bottom-right',
        autoClose: 5000,
        theme: 'colored',
      });
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

      toast.success('Slot deleted successfully', {
        position: 'bottom-right',
        autoClose: 3000,
        theme: 'colored',
      });

      // Trigger refresh to reload data from API
      setRefresh((prev) => !prev);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || error?.response?.data?.message || 'Failed to delete slot', {
        position: 'bottom-right',
        autoClose: 5000,
        theme: 'colored',
      });
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

  // Handle slot selection toggle
  const handleSlotSelect = (slotId: string) => {
    setSelectedSlots((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(slotId)) {
        newSet.delete(slotId);
      } else {
        newSet.add(slotId);
      }
      return newSet;
    });
  };

  // Handle select all slots
  const handleSelectAll = () => {
    if (selectedSlots.size === slotsForSelectedDate.length) {
      // Deselect all
      setSelectedSlots(new Set());
    } else {
      // Select all
      setSelectedSlots(new Set(slotsForSelectedDate.map((s) => s._id)));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedSlots.size === 0 || !usheringId || !selectedTeamId) return;

    setIsDeleting(true);
    let successCount = 0;
    let failCount = 0;

    // Delete sequentially
    for (const slotId of selectedSlots) {
      try {
        await api.delete(`/ushering/${usheringId}/teams/${selectedTeamId}/slots/${slotId}`);
        successCount++;
      } catch (error) {
        failCount++;
        console.error(`Failed to delete slot ${slotId}:`, error);
      }
    }

    setIsDeleting(false);
    setSelectedSlots(new Set());

    if (successCount > 0) {
      toast.success(`${successCount} slot(s) deleted successfully`, {
        position: 'bottom-right',
        autoClose: 3000,
        theme: 'colored',
      });
    }
    if (failCount > 0) {
      toast.error(`${failCount} slot(s) failed to delete`, {
        position: 'bottom-right',
        autoClose: 5000,
        theme: 'colored',
      });
    }

    // Trigger refresh
    setRefresh((prev) => !prev);
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
            spacing={0}
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: '100%' }}
          >
            {/* Checkbox for selection */}
            <Checkbox
              size="small"
              checked={selectedSlots.has(slot._id)}
              onChange={() => handleSlotSelect(slot._id)}
              sx={{
                color: selectedTeam?.color || '#1a1a1a',
                '&.Mui-checked': {
                  color: selectedTeam?.color || '#1a1a1a',
                },
                p: 0.5,
                mr: 0.5,
              }}
            />

            {/* Reserved mark (only shown when reserved) */}
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
        <Box sx={{ ...headerStyles, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" sx={headerTitleStyles}>
              Interview Slots
            </Typography>
            <Typography sx={headerSubtitleStyles}>
              {isAdmin
                ? 'Create and manage interview slots for each team'
                : 'View available interview slots for each team'}
            </Typography>
          </Box>

          {/* Post Management Section */}
          {isAdmin && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                p: 2,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.tertiary.main, 0.3)}`,
                backgroundColor: alpha(theme.palette.tertiary.main, 0.03),
              }}
            >
              <Typography variant="caption" sx={{ color: theme.palette.tertiary.main, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Post Management
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <Tooltip
                  title={
                    <Box sx={{ p: 1 }}>
                      <Typography variant="body2" fontWeight={600} mb={0.5}>Schedule Interview Posts</Typography>
                      <Typography variant="caption">
                        Set when interview slots will be automatically posted for applicants to book,
                        and when they will be removed after the interview period ends.
                      </Typography>
                    </Box>
                  }
                  arrow
                  placement="bottom"
                >
                  <CustomButton
                    variant="outlined"
                    startIcon={<CalendarClock size={18} />}
                    sx={{
                      borderColor: theme.palette.tertiary.main,
                      color: theme.palette.tertiary.main,
                      '&:hover': {
                        borderColor: theme.palette.tertiary.main,
                        backgroundColor: alpha(theme.palette.tertiary.main, 0.08),
                      },
                    }}
                    onClick={() => setIsScheduleModalOpen(true)}
                  >
                    Schedule
                  </CustomButton>
                </Tooltip>

                <Tooltip
                  title={
                    <Box sx={{ p: 1 }}>
                      <Typography variant="body2" fontWeight={600} mb={0.5}>Manual Post</Typography>
                      <Typography variant="caption">
                        Manually post interview slots now. Use this if automatic scheduling
                        didn't work or you need to post immediately.
                      </Typography>
                    </Box>
                  }
                  arrow
                  placement="bottom"
                >
                  <CustomButton
                    variant="contained"
                    startIcon={<Send size={18} />}
                    sx={{
                      backgroundColor: theme.palette.tertiary.main,
                      borderColor: 'transparent',
                      '&:hover': {
                        backgroundColor: theme.palette.tertiary.main,
                        filter: 'brightness(0.9)',
                      },
                    }}
                    onClick={() => setIsManualPostModalOpen(true)}
                  >
                    Post Now
                  </CustomButton>
                </Tooltip>
              </Stack>
            </Box>
          )}
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
              minDate={dayjs()}
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


              <Stack direction="row" spacing={1} alignItems="center">
                {/* Select All / Delete Selected - shown when there are slots */}
                {!loading && slotsForSelectedDate.length > 0 && isAdmin && (
                  <>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <Checkbox
                        size="small"
                        checked={selectedSlots.size === slotsForSelectedDate.length && slotsForSelectedDate.length > 0}
                        indeterminate={selectedSlots.size > 0 && selectedSlots.size < slotsForSelectedDate.length}
                        onChange={handleSelectAll}
                        sx={{
                          color: selectedTeam?.color || '#1a1a1a',
                          '&.Mui-checked, &.MuiCheckbox-indeterminate': {
                            color: selectedTeam?.color || '#1a1a1a',
                          },
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Select All
                      </Typography>
                    </Stack>

                    <CustomButton
                      variant="outlined"
                      onClick={handleBulkDelete}
                      disabled={selectedSlots.size === 0 || isDeleting}
                      sx={{
                        borderColor: theme.palette.error.main,
                        color: theme.palette.error.main,
                        '&:hover': {
                          borderColor: theme.palette.error.dark,
                          backgroundColor: theme.palette.error.light,
                        },
                        '&:disabled': {
                          borderColor: '#ccc',
                          color: '#ccc',
                        },
                      }}
                      startIcon={isDeleting ? <CircularProgress size={16} color="inherit" /> : <Trash2 size={16} />}
                    >
                      {isDeleting ? 'Deleting...' : `Delete (${selectedSlots.size})`}
                    </CustomButton>
                  </>
                )}

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
            </Stack>

            {/* Slots Content */}
            <Box key={`content-${selectedTeamId}-${selectedDate.format('YYYY-MM-DD')}`}>
              {loading ? (
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
              ) : slotsForSelectedDate.length > 0 ? (
                renderSlotCards()
              ) : (
                renderEmptyState()
              )}
            </Box>
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


        {/* Schedule Posts Modal */}
        <CustomModalLayout
          open={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          title="Schedule Interview Posts"
          borderColor={theme.palette.tertiary.main}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
            {/* Info Box */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.tertiary.main, 0.08),
                border: `1px solid ${alpha(theme.palette.tertiary.main, 0.2)}`,
              }}
            >
              <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6 }}>
                <strong>How it works:</strong><br />
                • <strong>Post Start:</strong> Interview slots will become visible to applicants at this date/time.<br />
                • <strong>Post End:</strong> Interview slots will be automatically hidden after this date/time.
              </Typography>
            </Box>

            {/* Start Date Picker */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Post Start Date & Time
              </Typography>
              <DateTimePicker
                value={scheduleStartDate}
                onChange={(newValue) => setScheduleStartDate(newValue)}
                minDateTime={dayjs()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                  },
                }}
              />
            </Box>

            {/* End Date Picker */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Post End Date & Time
              </Typography>
              <DateTimePicker
                value={scheduleEndDate}
                onChange={(newValue) => setScheduleEndDate(newValue)}
                minDateTime={scheduleStartDate || dayjs()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                  },
                }}
              />
            </Box>

            {/* Action Buttons */}
            <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <CustomButton
                variant="contained"
                onClick={async () => {
                  if (!usheringId || !scheduleStartDate || !scheduleEndDate) return;

                  try {
                    const payload = {
                      postTime: {
                        startDateTime: scheduleStartDate.toISOString(),
                        endDateTime: scheduleEndDate.toISOString(),
                      },
                    };
                    console.log(payload);

                    // await api.patch(`/ushering/${usheringId}/postTime`, payload);

                    toast.success('Post schedule saved successfully', {
                      position: 'bottom-right',
                      autoClose: 3000,
                      theme: 'colored',
                    });

                    setIsScheduleModalOpen(false);
                  } catch (error: any) {
                    console.error('Failed to save schedule:', error);
                    toast.error(error?.response?.data?.error || 'Failed to save schedule', {
                      position: 'bottom-right',
                      autoClose: 5000,
                      theme: 'colored',
                    });
                  }
                }}
                disabled={!scheduleStartDate || !scheduleEndDate}
                sx={{
                  backgroundColor: theme.palette.tertiary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.tertiary.main,
                    filter: 'brightness(0.9)',
                  },
                  borderColor: "transparent"
                }}
              >
                Save
              </CustomButton>
            </Stack>
          </Box>
        </CustomModalLayout>

        {/* Manual Post Confirmation Modal */}
        <CustomModal
          open={isManualPostModalOpen}
          onClose={() => setIsManualPostModalOpen(false)}
          title="Post Interview Slots Now?"
          description="Are you sure you want to post all interview slots immediately? Students will be able to see and book these slots right away."
          borderColor={theme.palette.tertiary.main}
          buttonOption1={{
            label: "Post Now",
            variant: "contained",
            color: "primary",
            onClick: () => {
              // TODO: Handle manual post API call
              console.log('Manual post confirmed');
              toast.success('Interview slots posted successfully', {
                position: 'bottom-right',
                autoClose: 3000,
                theme: 'colored',
              });
              setIsManualPostModalOpen(false);
            },
          }}
          buttonOption2={{
            label: "Cancel",
            variant: "outlined",
            color: "primary",
            onClick: () => setIsManualPostModalOpen(false),
          }} modalType={'warning'} />
      </Container>
    </LocalizationProvider>
  );
};

export default InterviewSlotManager;
