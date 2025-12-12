import React, { useState, useEffect } from 'react';
import { Box, Typography, alpha } from '@mui/material';
import CustomModalLayout from '../shared/modals/CustomModalLayout';
import { Team } from './TeamsDescription';
import { Users, GraduationCap, Shirt, Activity, Star, UserCog, Mic2 } from 'lucide-react';
import CustomTextField from '../shared/input-fields/CustomTextField';
import CustomButton from '../shared/Buttons/CustomButton';
import { api } from '../../api';
import { toast } from "react-toastify";
import { getTeamColor, getTeamLogo } from './AddTeamsModal';

interface EditTeamModalProps {
  usheringId?: string;
  teamId: string;
  open: boolean;
  onClose: () => void;
  team: Team | null;
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditTeamModal: React.FC<EditTeamModalProps> = ({ open, onClose, team, teamId = "0", usheringId = "0", setRefresh }) => {
  const [editedTeam, setEditedTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (team) {
      setEditedTeam({ ...team });
    }
  }, [team]);

  const handleChange = (field: keyof Team, value: string) => {
    if (editedTeam) {
      setEditedTeam({ ...editedTeam, [field]: value });
    }
  };

  const handleCallApi = async (payload: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.patch("/ushering/" + usheringId + "/teams/" + teamId, payload);
      toast.success("Team updated successfully!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return res.data;
    } catch (err: any) {
      setError(err?.message || "API call failed");
      toast.error(
        err.response?.data?.error || "Failed to update team. Please try again.",
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
    if (editedTeam) {
      const payload = {
        title: editedTeam.name,
        description: editedTeam.description,
      };
      await handleCallApi(payload);
      if (setRefresh) {
        setRefresh(prev => !prev);
      }
      onClose();
    }
  };

  if (!editedTeam) return null;

  const teamColor = getTeamColor(editedTeam.name);

  return (
    <CustomModalLayout
      open={open}
      onClose={onClose}
      title="Edit Team Description"
      width="md:w-[600px]"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
        {/* Team Header Card */}
        <Box
          sx={{
            p: 2.5,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(teamColor, 0.12)} 0%, ${alpha(teamColor, 0.04)} 100%)`,
            border: `2px solid ${alpha(teamColor, 0.3)}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
            {/* Team Icon */}
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${teamColor} 0%, ${alpha(teamColor, 0.75)} 100%)`,
                color: '#fff',
                boxShadow: `0 4px 12px ${alpha(teamColor, 0.35)}`,
              }}
            >
              {getTeamLogo(editedTeam.name, 28)}
            </Box>

            {/* Team Info */}
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: teamColor,
                  fontSize: '1.25rem',
                  lineHeight: 1.2,
                }}
              >
                {editedTeam.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.8rem',
                  color: '#64748b',
                  mt: 0.5,
                }}
              >
                Update the description below
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Description Field */}
        <Box>
          <CustomTextField
            name="edit-team-desc"
            label="Team Description"
            fieldType="text"
            value={editedTeam.description}
            onChange={(e) => handleChange('description', e.target.value)}
            multiline
            rows={4}
            autoCapitalizeName={false}
            neumorphicBox={false}
            placeholder={`Describe what the ${editedTeam.name} team does...`}
          />
        </Box>

        {/* Action Button */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          pt: 2,
          borderTop: '1px solid #e2e8f0',
        }}>
          <CustomButton
            variant="contained"
            onClick={handleSubmit}
            disabled={!editedTeam.description.trim() || loading}
            sx={{
              borderColor: teamColor,
              background: `linear-gradient(135deg, ${teamColor} 0%, ${alpha(teamColor, 0.8)} 100%)`,
              boxShadow: `0 4px 14px ${alpha(teamColor, 0.4)}`,
              '&:hover': {
                background: `linear-gradient(135deg, ${alpha(teamColor, 0.9)} 0%, ${alpha(teamColor, 0.7)} 100%)`,
              },
              '&:disabled': {
                background: '#e2e8f0',
                boxShadow: 'none',
              },
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </CustomButton>
        </Box>
      </Box>
    </CustomModalLayout>
  );
};

export default EditTeamModal;
