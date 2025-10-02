import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import PasswordField from '../components/shared/input-fields/PasswordField';

const meta: Meta<typeof PasswordField> = {
  title: 'Components/Input Fields/PasswordField',
  component: PasswordField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label for the password field'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text'
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

export const Default: Story = {
  args: {},
};

export const CustomLabel: Story = {
  args: {
    label: 'New Password',
    placeholder: 'Create a strong password',
  },
};

export const WithHelperText: Story = {
  args: {
    helperText: 'Password must be at least 8 characters with numbers and symbols',
  },
};

export const WeakPassword: Story = {
  args: {
    value: '123',
    isError: true,
    helperText: 'Password is too weak. Use at least 8 characters.',
  },
};

export const StrongPassword: Story = {
  args: {
    value: 'MyStr0ng!P@ssw0rd',
    helperText: 'Strong password ✓',
  },
};

export const ConfirmPassword: Story = {
  args: {
    label: 'Confirm Password',
    placeholder: 'Re-enter your password',
    helperText: 'Make sure passwords match',
  },
};

export const PasswordMismatch: Story = {
  args: {
    label: 'Confirm Password',
    value: 'differentpassword',
    isError: true,
    helperText: 'Passwords do not match',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'lockedpassword',
    helperText: 'Password cannot be changed',
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    label: 'Account Password',
    placeholder: 'Enter your account password',
  },
  parameters: {
    layout: 'padded',
  },
};