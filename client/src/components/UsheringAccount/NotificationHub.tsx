"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  alpha,
  useTheme,
  Card,
  CardContent,
  Chip,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { Bell, Send, Users, AlertCircle, MapPin, Clock, Info, UserCheck } from 'lucide-react';
import CustomButton from '../shared/Buttons/CustomButton';
import CustomTextField from '../shared/input-fields/CustomTextField';
import { toast } from 'react-toastify';
import { api } from '@/api';

// Quick message templates
const quickTemplates = [
  { id: 'location', label: 'Location', icon: <MapPin size={14} />, prefix: '📍 ' },
  { id: 'time', label: 'Time Change', icon: <Clock size={14} />, prefix: '⏰ ' },
  { id: 'reminder', label: 'Reminder', icon: <Bell size={14} />, prefix: '🔔 ' },
  { id: 'urgent', label: 'Urgent', icon: <AlertCircle size={14} />, prefix: '🚨 ' },
];

type RecipientType = 'all' | 'applicants';

const NotificationHub: React.FC = () => {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState<RecipientType>('all');
  const [isSending, setIsSending] = useState(false);
  const [usheringId, setUsheringId] = useState<string | null>(null);

  // Fetch ushering ID on mount
  useEffect(() => {
    const fetchUsheringId = async () => {
      try {
        const response = await api.get('/ushering');
        if (response.data.success && response.data.data?.length > 0) {
          setUsheringId(response.data.data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching ushering data:', error);
      }
    };
    fetchUsheringId();
  }, []);

  const handleSendNotification = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsSending(true);
    try {
      if (recipients === 'all') {
        await api.post('/ushering/broadcast/all', { message: message.trim() });
      } else {
        if (!usheringId) {
          toast.error('No ushering event found');
          setIsSending(false);
          return;
        }
        await api.post(`/ushering/${usheringId}/broadcast/applicants`, { message: message.trim() });
      }

      const recipientLabel = recipients === 'all' ? 'all students' : 'interview applicants';
      toast.success(`Notification sent to ${recipientLabel}!`, {
        position: 'bottom-right',
        autoClose: 3000,
        theme: 'colored',
      });

      // Clear form
      setMessage('');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send notification';
      toast.error(errorMessage, {
        position: 'bottom-right',
        autoClose: 3000,
        theme: 'colored',
      });
    } finally {
      setIsSending(false);
    }
  };

  const applyTemplate = (prefix: string) => {
    setMessage(prev => prefix + prev);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.tertiary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bell size={24} color={theme.palette.tertiary.main} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
              Notification Broadcast
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Send announcements to students about interviews, locations, and updates
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        {/* Message Composer */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: `1px solid ${alpha(theme.palette.tertiary.main, 0.2)}`,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Send size={20} color={theme.palette.tertiary.main} />
              Compose Message
            </Typography>

            <Stack spacing={3}>
              {/* Recipients Selection */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                  Send To
                </Typography>
                <ToggleButtonGroup
                  value={recipients}
                  exclusive
                  onChange={(_, value) => value && setRecipients(value)}
                  sx={{ width: '100%' }}
                >
                  <ToggleButton
                    value="all"
                    sx={{
                      flex: 1,
                      py: 1.5,
                      '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.tertiary.main, 0.1),
                        color: theme.palette.tertiary.main,
                        borderColor: theme.palette.tertiary.main,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.tertiary.main, 0.15),
                        },
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Users size={18} />
                      <span>All Students</span>
                    </Stack>
                  </ToggleButton>
                  <ToggleButton
                    value="applicants"
                    sx={{
                      flex: 1,
                      py: 1.5,
                      '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.tertiary.main, 0.1),
                        color: theme.palette.tertiary.main,
                        borderColor: theme.palette.tertiary.main,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.tertiary.main, 0.15),
                        },
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <UserCheck size={18} />
                      <span>Interview Applicants</span>
                    </Stack>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Quick Templates */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                  Quick Start
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {quickTemplates.map((template) => (
                    <Chip
                      key={template.id}
                      icon={template.icon}
                      label={template.label}
                      onClick={() => applyTemplate(template.prefix)}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: alpha(theme.palette.tertiary.main, 0.08),
                        borderColor: alpha(theme.palette.tertiary.main, 0.3),
                        color: theme.palette.tertiary.main,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.tertiary.main, 0.15),
                        },
                        '& .MuiChip-icon': {
                          color: theme.palette.tertiary.main,
                        },
                      }}
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>

              {/* Message Field */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Message *
                </Typography>
                <CustomTextField
                  name="message"
                  placeholder="Write your notification message here...&#10;&#10;Example: All interviews will be held in Room C7.201. Please arrive 10 minutes early."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  fullWidth
                  multiline
                  rows={5}
                  fieldType={'text'}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
                  {message.length} characters
                </Typography>
              </Box>

              {/* Send Button */}
              <CustomButton
                variant="contained"
                startIcon={isSending ? null : <Send size={18} />}
                onClick={handleSendNotification}
                disabled={isSending || !message.trim()}
                sx={{
                  backgroundColor: theme.palette.tertiary.main,
                  borderColor: 'transparent',
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: theme.palette.tertiary.main,
                    filter: 'brightness(0.9)',
                  },
                  '&:disabled': {
                    backgroundColor: alpha(theme.palette.tertiary.main, 0.5),
                  },
                  width: "200px"
                }}
                label={isSending ? 'Sending...' : `Notify`}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Info Sidebar */}
        <Stack spacing={3}>
          {/* Recipients Info */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              backgroundColor: alpha(theme.palette.info.main, 0.05),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <Box sx={{ marginTop: 0.25 }}>
                  {recipients === 'all'
                    ? <Users size={20} color={theme.palette.info.main} />
                    : <UserCheck size={20} color={theme.palette.info.main} />
                  }
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.info.main }}>
                    Recipients
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    {recipients === 'all'
                      ? 'This notification will be sent to all registered students.'
                      : 'This notification will be sent only to students who have applied for interview slots.'}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Examples */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Info size={18} color={theme.palette.tertiary.main} />
                Example Messages
              </Typography>
              <Stack spacing={1.5}>
                <Box sx={{ p: 1.5, borderRadius: 1.5, backgroundColor: alpha(theme.palette.grey[500], 0.08) }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    "📍 All interviews will be held in Room C7.201, Building C, 2nd floor."
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, borderRadius: 1.5, backgroundColor: alpha(theme.palette.grey[500], 0.08) }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    "⏰ Today's interviews are delayed by 30 minutes due to setup. Please adjust accordingly."
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, borderRadius: 1.5, backgroundColor: alpha(theme.palette.grey[500], 0.08) }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    "🔔 Reminder: Please bring your student ID to the interview."
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Warning */}
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              backgroundColor: alpha(theme.palette.warning.main, 0.05),
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
                <AlertCircle size={20} color={theme.palette.warning.main} style={{ marginTop: 2 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.warning.main }}>
                    Note
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', mt: 0.5 }}>
                    Use this feature responsibly. Notifications are sent immediately via email and in-app alerts.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Container>
  );
};

export default NotificationHub;
