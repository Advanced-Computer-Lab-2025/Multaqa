import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Box, Typography } from '@mui/material';
import { CustomTextField } from '../components/shared/input-fields';
import { Person, Phone, LocationOn, Email, Lock } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';

// Create a wrapper component to showcase all fields
const InputFieldsShowcase = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 3, 
      width: 400,
      padding: 3 
    }}>
      <Typography variant="h5" component="h2" sx={{ fontFamily: 'var(--font-jost)' }}>
        Multaqa Input Fields
      </Typography>
      
      <Typography variant="h6" component="h3">
        Basic Text Fields
      </Typography>
      
      <CustomTextField
        fieldType="name"
        label="Full Name"
        placeholder="Enter your full name"
        startIcon={
          <InputAdornment position="start">
            <Person />
          </InputAdornment>
        }
        fullWidth
      />
      
      <CustomTextField
        fieldType="phone"
        label="Phone Number"
        placeholder="123 456 7890"
        countryCode="+20"
        fullWidth
      />
      
      <CustomTextField
        fieldType="text"
        label="Location"
        placeholder="Cairo, Egypt"
        startIcon={
          <InputAdornment position="start">
            <LocationOn />
          </InputAdornment>
        }
        helperText="Enter your current location"
        fullWidth
      />
      
      <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
        Email Fields by Stakeholder
      </Typography>
      
      <CustomTextField
        fieldType="email"
        stakeholderType="student"
        label="Student Email"
        placeholder="Enter your username"
        helperText="Will auto-complete to @student.guc.edu.eg"
        showDomainHint={true}
        startIcon={
          <InputAdornment position="start">
            <Email />
          </InputAdornment>
        }
        fullWidth
      />
      
      <CustomTextField
        fieldType="email"
        stakeholderType="professor"
        label="Professor Email"
        placeholder="Enter your username"
        helperText="Will auto-complete to @guc.edu.eg"
        showDomainHint={true}
        startIcon={
          <InputAdornment position="start">
            <Email />
          </InputAdornment>
        }
        fullWidth
      />
      
      <CustomTextField
        fieldType="email"
        stakeholderType="vendor"
        label="Vendor Email"
        placeholder="Enter your company email"
        helperText="Enter complete email address"
        showDomainHint={false}
        startIcon={
          <InputAdornment position="start">
            <Email />
          </InputAdornment>
        }
        fullWidth
      />
      
      <CustomTextField
        fieldType="password"
        label="Password"
        placeholder="Create a strong password"
        helperText="Must be at least 8 characters with numbers and symbols"
        startIcon={
          <InputAdornment position="start">
            <Lock />
          </InputAdornment>
        }
        fullWidth
      />
      
      <CustomTextField
        fieldType="password"
        label="Confirm Password"
        placeholder="Re-enter your password"
        helperText="Make sure passwords match"
        startIcon={
          <InputAdornment position="start">
            <Lock />
          </InputAdornment>
        }
        fullWidth
      />
      
      <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
        Error States
      </Typography>
      
      <CustomTextField
        fieldType="email"
        value="invalid-email"
        isError={true}
        helperText="Please enter a valid email address"
        startIcon={
          <InputAdornment position="start">
            <Email />
          </InputAdornment>
        }
        fullWidth
      />
      
      <CustomTextField
        fieldType="password"
        value="123"
        isError={true}
        helperText="Password is too weak. Use at least 8 characters."
        startIcon={
          <InputAdornment position="start">
            <Lock />
          </InputAdornment>
        }
        fullWidth
      />
    </Box>
  );
};

const meta: Meta<typeof InputFieldsShowcase> = {
  title: 'Components/Input Fields/All Fields Showcase',
  component: InputFieldsShowcase,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A comprehensive showcase of all input field components with various states and configurations.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllFields: Story = {};

export const LoginForm: Story = {
  render: () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2, 
      width: 350,
      padding: 3,
      border: '1px solid #e0e0e0',
      borderRadius: 2,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <Typography variant="h5" component="h2" sx={{ 
        fontFamily: 'var(--font-jost)',
        textAlign: 'center',
        mb: 2 
      }}>
        Login to Multaqa
      </Typography>
      
      <CustomTextField
        fieldType="email"
        stakeholderType="student"
        label="Email"
        placeholder="Enter your username"
        showDomainHint={true}
        startIcon={
          <InputAdornment position="start">
            <Email />
          </InputAdornment>
        }
        fullWidth
      />
      
      <CustomTextField
        fieldType="password"
        label="Password"
        placeholder="Enter your password"
        startIcon={
          <InputAdornment position="start">
            <Lock />
          </InputAdornment>
        }
        fullWidth
      />
    </Box>
  ),
};

export const RegistrationForm: Story = {
  render: () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2, 
      width: 400,
      padding: 3,
      border: '1px solid #e0e0e0',
      borderRadius: 2,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <Typography variant="h5" component="h2" sx={{ 
        fontFamily: 'var(--font-jost)',
        textAlign: 'center',
        mb: 2 
      }}>
        Create Account
      </Typography>
      
      <CustomTextField
        fieldType="name"
        label="Full Name"
        placeholder="Enter your full name"
        startIcon={
          <InputAdornment position="start">
            <Person />
          </InputAdornment>
        }
        fullWidth
      />
      
      <CustomTextField
        fieldType="email"
        stakeholderType="student"
        label="GUC Email"
        placeholder="Enter your username"
        helperText="Use your official GUC username"
        showDomainHint={true}
        startIcon={
          <InputAdornment position="start">
            <Email />
          </InputAdornment>
        }
        fullWidth
      />
      
      <CustomTextField
        fieldType="password"
        label="Password"
        placeholder="Create a strong password"
        helperText="At least 8 characters"
        startIcon={
          <InputAdornment position="start">
            <Lock />
          </InputAdornment>
        }
        fullWidth
      />
      
      <CustomTextField
        fieldType="password"
        label="Confirm Password"
        placeholder="Re-enter your password"
        startIcon={
          <InputAdornment position="start">
            <Lock />
          </InputAdornment>
        }
        fullWidth
      />
    </Box>
  ),
};