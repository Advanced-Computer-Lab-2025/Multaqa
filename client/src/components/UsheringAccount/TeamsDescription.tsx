import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Container, Tooltip, IconButton, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { GraduationCap, Users, Shirt, Activity, Star, UserCog, Mic2, Trash2, Edit } from 'lucide-react';
import CustomButton from '../shared/Buttons/CustomButton';
import AddTeamsModal from './AddTeamsModal';
import EditTeamModal from './EditTeamModal';
import { CustomModal } from '../shared/modals';
import EmptyState from '../shared/states/EmptyState';

export interface Team {
  name: string;
  description: string;
  logo: React.ReactNode;
  color: string;
}

interface TeamsDescriptionProps {
  user : string ;
  teams?: Team[];
}

const initialTeamsData: Team[] = [
  {
    name: 'Graduates',
    description: 'Supporting graduates through their big day, ensuring they are in the right place at the right time.',
    logo: <GraduationCap size={40} />,
    color: '#009688', // Teal
  },
  {
    name: 'Parents',
    description: 'Guiding parents and guests to their seats and answering their questions with a smile.',
    logo: <Users size={40} />,
    color: '#9C27B0', // Purple
  },
  {
    name: 'Caps & Gowns',
    description: 'Managing the distribution and collection of graduation attire to ensure everyone looks their best.',
    logo: <Shirt size={40} />,
    color: '#2196F3', // Blue
  },
  {
    name: 'Flow',
    description: 'Orchestrating the movement of the crowd to maintain a smooth and safe experience for everyone.',
    logo: <Activity size={40} />,
    color: '#FF9800', // Orange
  },
  {
    name: 'VIP',
    description: 'Providing exceptional service to our distinguished guests and ensuring their comfort.',
    logo: <Star size={40} />,
    color: '#FFC107', // Amber
  },
  {
    name: 'HR',
    description: 'Managing the volunteer team, checking in members, and ensuring everyone is happy and hydrated.',
    logo: <UserCog size={40} />,
    color: '#FF5722', // Deep Orange
  },
  {
    name: 'Stage',
    description: 'Assisting with stage operations, handing out diplomas, and guiding speakers.',
    logo: <Mic2 size={40} />,
    color: '#4CAF50', // Green
  },
];

const TeamsDescription: React.FC<TeamsDescriptionProps> = ({ teams: propTeams , user}) => {
  const theme = useTheme();
  const [teams, setTeams] = useState<Team[]>([]); // [] -> to check the add teams button
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState<{ team: Team, index: number } | null>(null);

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teamToDeleteIndex, setTeamToDeleteIndex] = useState<number | null>(null);

  const handleAddTeams = (newTeams: Team[]) => {
    setTeams([...teams, ...newTeams]);
  };

  const handleEditClick = (team: Team, index: number) => {
    setTeamToEdit({ team, index });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedTeam: Team) => {
    // Mock update - in real app this would call backend
    // For now, we just close the modal as requested "dont do the edit changes on the actual cards"
    // But to show it works, I'll log it.
    console.log('Saving edited team:', updatedTeam);
    // If we wanted to update locally:
    // const updatedTeams = [...teams];
    // updatedTeams[teamToEdit!.index] = updatedTeam;
    // setTeams(updatedTeams);
    setIsEditModalOpen(false);
    setTeamToEdit(null);
  };

  const handleDeleteClick = (index: number) => {
    setTeamToDeleteIndex(index);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (teamToDeleteIndex !== null) {
      const updatedTeams = teams.filter((_, i) => i !== teamToDeleteIndex);
      setTeams(updatedTeams);
      setIsDeleteModalOpen(false);
      setTeamToDeleteIndex(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 6 }}>
        <Box sx={{ flex: 1 }} />

        <Box sx={{ textAlign: 'center', flex: 2 }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', mb: 2, color: '#1a1a1a' }}>
            Graduation Teams
          </Typography>
          {user=="student" && <Typography variant="subtitle1" sx={{ color: '#666', maxWidth: '600px', mx: 'auto' }}>
            Only apply once to the team that most suits you. Each individual brings a wealth of experience, creativity, and passion to our organization.
          </Typography>}
        </Box>

        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          {teams.length === 0 && user=="usher-admin" &&
           (<span>
                <CustomButton
                  label="Add Teams' Descriptions"
                  createButtonStyle
                  onClick={() => setIsAddModalOpen(true)}
                />
            </span>
          )}
        </Box>
      </Box>
      {(!teams || teams.length==0) &&
      <EmptyState
      title = "No teams have been created yet!"
      description = "Press the (+) button to add your team description"
      />
      }
      {teams&&teams.length>0&& <Grid container spacing={3}>
        {teams?.map((team, index) => (
          <Grid size={{ xs: 12, md: 6 }} key={index}>
            <motion.div
              whileHover={{ scale: 1.02, translateY: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  display: 'flex',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  height: '100%',
                  minHeight: '160px',
                  transition: 'box-shadow 0.3s ease',
                  position: 'relative',
                  '&:hover': {
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  },
                }}
              >
                {/* Action Buttons */}
                {user=="usher-admin"&&<Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 1,
                    zIndex: 10,
                  }}
                >
                  <Tooltip title="Edit Team">
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(team, index)}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        "&:hover": {
                          backgroundColor: `${team.color}15`,
                          borderColor: team.color,
                          color: team.color,
                        },
                      }}
                    >
                      <Edit size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Team">
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(index)}
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        "&:hover": {
                          backgroundColor: "rgba(255, 0, 0, 0.1)",
                          borderColor: "error.main",
                          color: "error.main",
                        },
                      }}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </Tooltip>
                </Box>
}
                <Box
                  sx={{
                    width: '120px',
                    backgroundColor: team.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    p: 2,
                  }}
                >
                  <Box sx={{ color: 'white', fontSize: '2rem' }}>
                    {team.logo}
                  </Box>
                </Box>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3, width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                      {team.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: team.color, fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {team.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color={team.color} sx={{ lineHeight: 1.6 }}>
                    {team.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>}
     

      <AddTeamsModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTeams={handleAddTeams}
      />

      <EditTeamModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        team={teamToEdit?.team || null}
        onSave={handleSaveEdit}
      />

      <CustomModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        description={`Are you sure you want to delete this team? This action cannot be undone and you cannot add a new team later on.`}
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
  );
};

export default TeamsDescription;
