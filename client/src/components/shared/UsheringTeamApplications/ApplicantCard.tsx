'use client';

import React from 'react';
import { Avatar, Box, Card, Stack, Typography } from '@mui/material';
import { Mail, BadgeCheck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { ApplicantCardProps } from './types';
import {
    applicantCardStyles,
    initialsAvatarStyles,
    timeSlotBadgeStyles,
} from './styles';
import { getInitials, formatSlotTime } from './utils';

/**
 * ApplicantCard Component
 * 
 * Displays an applicant's information in a card with their initials avatar.
 */
const ApplicantCard: React.FC<ApplicantCardProps> = ({ slot, teamColor }) => {
    const { applicant, timeSlot } = slot;
    const initials = getInitials(applicant.firstName, applicant.lastName);
    const fullName = `${applicant.firstName} ${applicant.lastName}`;
    const timeRange = formatSlotTime(timeSlot.start, timeSlot.end);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card elevation={0} sx={applicantCardStyles(teamColor)}>
                <Stack spacing={2}>
                    {/* Header with Avatar and Name */}
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={initialsAvatarStyles(teamColor)}>
                            {initials}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {fullName}
                            </Typography>
                            <Box sx={timeSlotBadgeStyles(teamColor)}>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Clock size={12} />
                                    <span>{timeRange}</span>
                                </Stack>
                            </Box>
                        </Box>
                    </Stack>

                    {/* Contact Information */}
                    <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Mail size={14} color="#666" />
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {applicant.email}
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <BadgeCheck size={14} color="#666" />
                            <Typography variant="body2" color="text.secondary">
                                ID: {applicant.studentId}
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Card>
        </motion.div>
    );
};

export default ApplicantCard;
