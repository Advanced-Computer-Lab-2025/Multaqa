import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Person, Phone, Search, Email, Lock } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';
import { CustomTextField } from '../components/shared/input-fields';

const meta: Meta<typeof CustomTextField> = {
  title: 'Components/Input Fields/CustomTextField',
  component: CustomTextField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    fieldType: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'numeric', 'phone'],
      description: 'Type of input field'
    },
    label: {
      control: 'text',
      description: 'Label for the input field'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text'
    },
    stakeholderType: {
      control: { type: 'select' },
      options: ['student', 'staff', 'ta', 'professor', 'admin', 'events-office', 'vendor'],
      description: 'Type of stakeholder for email domain (email fields only)'
    },
    showDomainHint: {
      control: 'boolean',
      description: 'Whether to show domain completion hint (email fields only)'
    },
    countryCode: {
      control: 'text',
      description: 'Country code prefix (phone fields only)'
    },
    isError: {
      control: 'boolean',
      description: 'Whether the field has an error state'
    },
    helperText: {
      control: 'text',
      description: 'Helper text below the field'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled'
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the field takes full width'
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TextInput: Story = {
  args: {
    fieldType: 'text',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    startIcon: (
      <InputAdornment position="start">
        <Person />
      </InputAdornment>
    ),
  },
};

export const EmailInput: Story = {
  args: {
    fieldType: 'email',
    label: 'Email Address',
    placeholder: 'Enter your email',
    startIcon: (
      <InputAdornment position="start">
        <Email />
      </InputAdornment>
    ),
  },
};

export const EmailWithDomainHint: Story = {
  args: {
    fieldType: 'email',
    stakeholderType: 'student',
    label: 'Student Email',
    placeholder: 'Enter your username',
    showDomainHint: true,
    startIcon: (
      <InputAdornment position="start">
        <Email />
      </InputAdornment>
    ),
  },
};

export const PasswordInput: Story = {
  args: {
    fieldType: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    startIcon: (
      <InputAdornment position="start">
        <Lock />
      </InputAdornment>
    ),
  },
};

export const PhoneInput: Story = {
  args: {
    fieldType: 'phone',
    label: 'Phone Number',
    placeholder: '123 456 7890',
    countryCode: '+20',
  },
};

export const NumericInput: Story = {
  args: {
    fieldType: 'numeric',
    label: 'Age',
    placeholder: 'Enter your age',
  },
};

export const WithSearchIcon: Story = {
  args: {
    fieldType: 'text',
    label: 'Search',
    placeholder: 'Search...',
    startIcon: (
      <InputAdornment position="start">
        <Search />
      </InputAdornment>
    ),
  },
};

export const ErrorState: Story = {
  args: {
    fieldType: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    isError: true,
    helperText: 'Please enter a valid email address',
    value: 'invalid-email',
    startIcon: (
      <InputAdornment position="start">
        <Email />
      </InputAdornment>
    ),
  },
};

export const WithHelperText: Story = {
  args: {
    fieldType: 'password',
    label: 'Password',
    placeholder: 'Enter password',
    helperText: 'Password must be at least 8 characters with numbers and symbols',
    startIcon: (
      <InputAdornment position="start">
        <Lock />
      </InputAdornment>
    ),
  },
};

export const Disabled: Story = {
  args: {
    fieldType: 'text',
    label: 'Disabled Field',
    placeholder: 'This field is disabled',
    disabled: true,
    value: 'Cannot edit this',
    startIcon: (
      <InputAdornment position="start">
        <Person />
      </InputAdornment>
    ),
  },
};

export const FullWidth: Story = {
  args: {
    fieldType: 'text',
    label: 'Full Width Field',
    placeholder: 'This field takes full width',
    fullWidth: true,
    startIcon: (
      <InputAdornment position="start">
        <Person />
      </InputAdornment>
    ),
  },
  parameters: {
    layout: 'padded',
  },
};