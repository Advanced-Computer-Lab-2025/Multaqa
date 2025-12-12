"use client";

import React from 'react';
import { Box, Typography, Card, CardContent, Container, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Calendar, 
  Bell, 
  Users, 
  Upload, 
  Clock, 
  Mail,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface GuidelineItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  tips?: string[];
}

const usheringGuidelines: GuidelineItem[] = [
  {
    id: '1',
    title: 'Post Team Descriptions',
    description: 'Post team descriptions for students to view before interview slots are posted. Include rules for selecting interview slots.',
    icon: <FileText size={24} />,
    color: '#2196F3',
    tips: [
      'Descriptions should be clear and detailed',
      'Include team responsibilities and expectations',
      'Students will use this to decide their preferences'
    ]
  },
  {
    id: '2',
    title: 'Interview Slot Management',
    description: 'Set the day and time of interview slots for each team. Support range and increment options. Edit and delete as needed.',
    icon: <Calendar size={24} />,
    color: '#4CAF50',
    tips: [
      'Set date, time range, and time increments',
      'Can edit and delete slots as needed',
      'Post slots manually or automatically'
    ]
  },
  {
    id: '3',
    title: 'Manual Slot Posting',
    description: 'Use the manual post button to control when interview slots become visible to students. This is for safety reasons.',
    icon: <Upload size={24} />,
    color: '#9C27B0',
    tips: [
      'Slots are not auto-published by default',
      'Review before making visible',
      'Students get notified on publish'
    ]
  },
  {
    id: '4',
    title: 'Automatic Slot Posting',
    description: 'Configure automatic posting by setting when the interview post cycle starts and ends. Slots will be posted automatically within this window.',
    icon: <Clock size={24} />,
    color: '#673AB7',
    tips: [
      'Set the start date/time for automatic posting',
      'Set the end date/time for the posting cycle',
      'Slots will be published automatically within the cycle'
    ]
  },
  {
    id: '5',
    title: 'Notification Center',
    description: 'Send notifications to students about new posts, interview locations, and important updates. Notify them when content is posted.',
    icon: <Bell size={24} />,
    color: '#FF9800',
    tips: [
      'Notify when team descriptions are posted',
      'Notify 5 and 10 minutes before posted interview slots',
      'Email reminders 1 day before interview'
    ]
  },
  {
    id: '6',
    title: 'View All Applicants',
    description: 'View all applicants for each team including their interview slots, names, GUC IDs, and email addresses.',
    icon: <Users size={24} />,
    color: '#009688',
    tips: [
      'Export applicant data if needed',
      'Track interview attendance',
      'Contact students directly via email'
    ]
  },
];

const UsheringGuidelines: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ fontWeight: 'bold', mb: 2, color: '#1a1a1a' }}
        >
          Ushering Account Guidelines
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{ color: '#666', maxWidth: '700px', mx: 'auto' }}
        >
          This guide outlines your responsibilities as an ushering account admin. 
          Follow these steps to manage team descriptions, interview slots, and student communications.
        </Typography>
      </Box>

      {/* Admin Responsibilities */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h5" 
          sx={{ fontWeight: 'bold', mb: 3, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <CheckCircle size={24} color="#4CAF50" />
          Your Responsibilities
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {usheringGuidelines.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.5,
                    backgroundColor: `${item.color}15`,
                    borderBottom: `2px solid ${item.color}`,
                  }}
                >
                  <Box 
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      backgroundColor: item.color,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      flexShrink: 0
                    }}
                  >
                    {item.id}
                  </Box>
                  <Box sx={{ color: item.color }}>
                    {item.icon}
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
                    {item.title}
                  </Typography>
                </Box>
                <CardContent sx={{ p: 2, pt: 1.5 }}>
                  <Typography variant="body2" sx={{ color: '#555', mb: 1.5, fontSize: '0.85rem' }}>
                    {item.description}
                  </Typography>
                  {item.tips && (
                    <Box component="ul" sx={{ m: 0, pl: 2 }}>
                      {item.tips.map((tip, idx) => (
                        <Box 
                          component="li" 
                          key={idx}
                          sx={{ 
                            color: '#666', 
                            fontSize: '0.8rem', 
                            mb: 0.5,
                            '&::marker': { color: item.color }
                          }}
                        >
                          {tip}
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Email Notifications Summary */}
      <Box sx={{ mt: 6 }}>
        <Typography 
          variant="h5" 
          sx={{ fontWeight: 'bold', mb: 3, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <Mail size={24} color="#9C27B0" />
          Email Notifications
        </Typography>
        
        <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Chip 
                icon={<Clock size={16} />}
                label="Interview slot details" 
                sx={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}
              />
              <Chip 
                icon={<Bell size={16} />}
                label="5 minutes before reminder" 
                sx={{ backgroundColor: '#FFF3E0', color: '#E65100' }}
              />
              <Chip 
                icon={<Calendar size={16} />}
                label="1 day before reminder" 
                sx={{ backgroundColor: '#E8F5E9', color: '#388E3C' }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default UsheringGuidelines;
