import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import CustomModalLayout from '../shared/modals/CustomModalLayout';
import { Team } from './TeamsDescription';
import CustomTextField from '../shared/input-fields/CustomTextField';
import CustomButton from '../shared/Buttons/CustomButton';
import { api } from '../../api';
import { toast } from "react-toastify";

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
       console.log("payload in call");
       console.log(payload);
       const res = await api.patch("/ushering/" + usheringId + "/teams/" + teamId, payload);
       toast.success("Team edited successfully", {
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
         err.response.data.error || "Failed to edit team. Please try again.",
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
        color: editedTeam.color,
      };
      await handleCallApi(payload);
      if (setRefresh) {
        setRefresh(prev => !prev);
      }
      onClose();
    }
  };

  if (!editedTeam) return null;

  return (
    <CustomModalLayout
      open={open}
      onClose={onClose}
      title={`Edit ${team?.name}'s Team Information`}
      width="md:w-[500px]"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              name="edit-team-name"
              label="Team Name"
              fieldType="text"
              value={editedTeam.name}
              onChange={(e) => handleChange('name', e.target.value)}
              neumorphicBox
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              name="edit-team-color"
              label="Color (Hex or Name)"
              fieldType="text"
              value={editedTeam.color}
              onChange={(e) => handleChange('color', e.target.value)}
              neumorphicBox
              placeholder="#000000"
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              name="edit-team-desc"
              label="Description"
              fieldType="text"
              value={editedTeam.description}
              onChange={(e) => handleChange('description', e.target.value)}
              multiline
              rows={4}
              autoCapitalizeName={false}
              neumorphicBox
              required
              placeholder="Enter team description..."
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <CustomButton
            variant="contained"
            onClick={handleSubmit}
            disabled={!editedTeam.name || !editedTeam.description}
          >
            Save
          </CustomButton>
        </Box>
      </Box>
    </CustomModalLayout>
  );
};

export default EditTeamModal;
