'use client';

import React from 'react';
import { Box, Chip, Skeleton, Stack, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { TeamSelectorProps } from './types';
import {
    teamSelectorChipStyles,
    teamSelectorContainerStyles
} from './styles';

/**
 * TeamSelector Component
 * 
 * Displays a horizontal row of team chips for selection.
 * The first team is selected by default.
 */
const TeamSelector: React.FC<TeamSelectorProps> = ({
    teams,
    selectedTeamId,
    onTeamSelect,
    loading = false,
}) => {
    if (loading) {
        return (
            <Box sx={teamSelectorContainerStyles}>
                <Stack direction="row" spacing={1.5} flexWrap="wrap">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton
                            key={i}
                            variant="rounded"
                            width={100}
                            height={40}
                            sx={{ borderRadius: 3 }}
                        />
                    ))}
                </Stack>
            </Box>
        );
    }

    if (teams.length === 0) {
        return (
            <Box sx={teamSelectorContainerStyles}>
                <Typography color="text.secondary" fontSize="0.875rem">
                    No teams available
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={teamSelectorContainerStyles}>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                {teams.map((team) => {
                    const isSelected = team._id === selectedTeamId;

                    return (
                        <motion.div
                            key={team._id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Chip
                                label={
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Box sx={{ display: 'flex', color: team.color }}>
                                            {team.icon}
                                        </Box>
                                        <span>{team.title}</span>
                                    </Stack>
                                }
                                onClick={() => onTeamSelect(team._id)}
                                sx={teamSelectorChipStyles(isSelected, team.color)}
                            />
                        </motion.div>
                    );
                })}
            </Stack>
        </Box>
    );
};

export default TeamSelector;
