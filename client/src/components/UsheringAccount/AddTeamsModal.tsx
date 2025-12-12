import React, { useState, useMemo } from 'react';
import { Box, IconButton, Typography, alpha, LinearProgress, Collapse } from '@mui/material';
import { ExpandMore, ExpandLess, CheckCircle } from '@mui/icons-material';
import CustomModalLayout from '../shared/modals/CustomModalLayout';
import { Team } from './TeamsDescription';
import { Users, GraduationCap, Shirt, Activity, Star, UserCog, Mic2 } from 'lucide-react';
import CustomTextField from '../shared/input-fields/CustomTextField';
import CustomButton from '../shared/Buttons/CustomButton';
import { api } from '../../api';
import { toast } from "react-toastify";

// All team configurations with their default icons and colors
const allTeams = [
  { name: 'Graduates', icon: GraduationCap, color: '#009688', defaultDesc: 'Supporting graduates through their big day, ensuring they are in the right place at the right time.'
 },
  { name: 'Parents', icon: Users, color: '#9C27B0', defaultDesc: 'Guiding parents and guests to their seats and answering their questions with a smile.' },
  { name: 'Caps & Gowns', icon: Shirt, color: '#2196F3', defaultDesc: 'Managing the distribution and collection of graduation attire to ensure everyone looks their best.' },
  { name: 'Flow', icon: Activity, color: '#FF9800', defaultDesc: 'Orchestrating the movement of the crowd to maintain a smooth and safe experience for everyone.' },
  { name: 'VIP', icon: Star, color: '#FFC107', defaultDesc: 'Providing exceptional service to our distinguished guests and ensuring their comfort.'},
  { name: 'HR', icon: UserCog, color: '#FF5722', defaultDesc: 'Managing the volunteer team, checking in members, and ensuring everyone is happy and hydrated.' },
  { name: 'Stage', icon: Mic2, color: '#4CAF50', defaultDesc:  'Assisting with stage operations, handing out diplomas, and guiding speakers.' },
];

// Helper function to get color from team name
export const getTeamColor = (name: string): string => {
  const team = allTeams.find(t => t.name === name);
  return team?.color || '#1a1a1a';
};

// Helper function to get logo from team name
export const getTeamLogo = (name: string, size: number = 40): React.ReactNode => {
  const team = allTeams.find(t => t.name === name);
  if (team) {
    const IconComponent = team.icon;
    return <IconComponent size={size} />;
  }
  return <Users size={size} />;
};

interface AddTeamsModalProps {
  open: boolean;
  onClose: () => void;
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface TeamFormData {
  name: string;
  description: string;
  expanded: boolean;
}

const AddTeamsModal: React.FC<AddTeamsModalProps> = ({ open, onClose, setRefresh }) => {
  // Initialize all teams with empty descriptions
  const [teamsData, setTeamsData] = useState<TeamFormData[]>(
    allTeams.map(team => ({
      name: team.name,
      description: '',
      expanded: false,
    }))
  );
  const [loading, setLoading] = useState(false);

  // Calculate completion progress
  const completedCount = useMemo(() => {
    return teamsData.filter(t => t.description.trim().length > 0).length;
  }, [teamsData]);

  const progress = (completedCount / allTeams.length) * 100;
  const allComplete = completedCount === allTeams.length;

  const handleDescriptionChange = (index: number, value: string) => {
    const updated = [...teamsData];
    updated[index].description = value;
    setTeamsData(updated);
  };

  const toggleExpand = (index: number) => {
    const updated = [...teamsData];
    updated[index].expanded = !updated[index].expanded;
    setTeamsData(updated);
  };

  const handleUseDefault = (index: number) => {
    const updated = [...teamsData];
    updated[index].description = allTeams[index].defaultDesc;
    setTeamsData(updated);
  };

  const handleCallApi = async (payload: any) => {
    setLoading(true);
    try {
      await api.post("/ushering", payload);
      toast.success("All teams created successfully!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || "Failed to create teams. Please try again.",
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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!allComplete) return;

    const teamsPayload = teamsData.map(t => ({
      title: t.name,
      description: t.description,
    }));

    await handleCallApi({ teams: teamsPayload });
    if (setRefresh) {
      setRefresh(prev => !prev);
    }
    // Reset form
    setTeamsData(allTeams.map(team => ({
      name: team.name,
      description: '',
      expanded: false,
    })));
    onClose();
  };

  return (
    <CustomModalLayout
      open={open}
      onClose={onClose}
      title="Create Graduation Teams Post"
      width="md:w-[700px]"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* Progress Section */}
        <Box sx={{ mb: 2, px: 0.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
              {completedCount} of {allTeams.length} teams configured
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: allComplete ? '#10b981' : '#6366f1',
                fontWeight: 600,
              }}
            >
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: '#e2e8f0',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: allComplete
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              },
            }}
          />
        </Box>

        {/* Scrollable Teams List */}
        <Box sx={{
          maxHeight: '400px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          pr: 1,
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { background: '#f1f5f9', borderRadius: '10px' },
          '&::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: '10px' },
          '&::-webkit-scrollbar-thumb:hover': { background: '#94a3b8' },
        }}>
          {teamsData.map((team, index) => {
            const teamConfig = allTeams[index];
            const IconComponent = teamConfig.icon;
            const isComplete = team.description.trim().length > 0;

            return (
              <Box
                key={team.name}
                sx={{
                  borderRadius: 2.5,
                  border: `1.5px solid ${isComplete ? alpha(teamConfig.color, 0.4) : '#e2e8f0'}`,
                  background: isComplete
                    ? `linear-gradient(135deg, ${alpha(teamConfig.color, 0.08)} 0%, ${alpha(teamConfig.color, 0.02)} 100%)`
                    : '#fff',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  minHeight: team.expanded ? '180px' : '70px',
                }}
              >
                {/* Team Header - Always Visible */}
                <Box
                  onClick={() => toggleExpand(index)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: alpha(teamConfig.color, 0.05),
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Team Icon */}
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `linear-gradient(135deg, ${teamConfig.color} 0%, ${alpha(teamConfig.color, 0.7)} 100%)`,
                        color: '#fff',
                        boxShadow: `0 2px 8px ${alpha(teamConfig.color, 0.3)}`,
                      }}
                    >
                      <IconComponent size={20} />
                    </Box>

                    {/* Team Name & Status */}
                    <Box>
                      <Typography sx={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>
                        {team.name}
                      </Typography>
                      <Typography sx={{ fontSize: '0.75rem', color: isComplete ? '#10b981' : '#94a3b8' }}>
                        {isComplete ? 'Description added' : 'Needs description'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isComplete && (
                      <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />
                    )}
                    <IconButton size="small" sx={{ color: '#64748b' }}>
                      {team.expanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>
                </Box>

                {/* Collapsible Description Section */}
                <Collapse in={team.expanded}>
                  <Box sx={{ px: 2, pb: 2 }}>
                    <CustomTextField
                      name={`team-desc-${index}`}
                      label="Team Description"
                      fieldType="text"
                      value={team.description}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                      multiline
                      rows={2}
                      neumorphicBox={false}
                      placeholder={`Describe what the ${team.name} team does...`}
                      autoCapitalizeName={false}
                    />
                    {!team.description && (
                      <Box
                        onClick={() => handleUseDefault(index)}
                        sx={{
                          mt: 1,
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        <Typography sx={{ fontSize: '0.75rem', color: '#6366f1' }}>
                          ✨ Use suggested description
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </Box>
            );
          })}
        </Box>

        {/* Fixed Action Buttons */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pt: 2,
          mt: 2,
          borderTop: '1px solid #e2e8f0',
          flexShrink: 0,
        }}>
          <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {allComplete ? '✓ All teams ready!' : `${allTeams.length - completedCount} remaining`}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <CustomButton
              variant="contained"
              onClick={handleSubmit}
              disabled={!allComplete || loading}
              sx={{
                '&:disabled': {
                  background: '#e2e8f0',
                  boxShadow: 'none',
                },
                width: "w-fit"
              }}
            >
              {loading ? 'Posting...' : 'Post'}
            </CustomButton>
          </Box>
        </Box>
      </Box>
    </CustomModalLayout>
  );
};

export default AddTeamsModal;
