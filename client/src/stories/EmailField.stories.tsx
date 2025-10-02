import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import EmailField from '../components/shared/input-fields/EmailField';

const meta: Meta<typeof EmailField> = {
  title: 'Components/Input Fields/EmailField',
  component: EmailField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label for the email field'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text'
    },
    stakeholderType: {
      control: { type: 'select' },
      options: ['student', 'staff', 'ta', 'professor', 'admin', 'events-office', 'vendor'],
      description: 'Type of stakeholder to determine email domain'
    },
    showDomainHint: {
      control: 'boolean',
      description: 'Whether to show domain completion hint'
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

export const StudentEmail: Story = {
  args: {
    stakeholderType: 'student',
    label: 'Student Email',
    placeholder: 'Enter your username',
    showDomainHint: true,
  },
};

export const StaffEmail: Story = {
  args: {
    stakeholderType: 'staff',
    label: 'Staff Email',
    placeholder: 'Enter your username', 
    showDomainHint: true,
  },
};

export const ProfessorEmail: Story = {
  args: {
    stakeholderType: 'professor',
    label: 'Professor Email',
    placeholder: 'Enter your username',
    showDomainHint: true,
  },
};

export const VendorEmail: Story = {
  args: {
    stakeholderType: 'vendor',
    label: 'Company Email',
    placeholder: 'Enter your company email',
    showDomainHint: false,
  },
};

export const WithDomainHint: Story = {
  args: {
    stakeholderType: 'student',
    label: 'Email with Hint',
    placeholder: 'Start typing to see domain hint',
    showDomainHint: true,
    helperText: 'Domain will auto-complete based on your role',
  },
};

export const NoDomainHint: Story = {
  args: {
    stakeholderType: 'student',
    label: 'Email without Hint',
    placeholder: 'Enter complete email',
    showDomainHint: false,
  },
};

export const ErrorState: Story = {
  args: {
    stakeholderType: 'student',
    value: 'invalid-email',
    isError: true,
    helperText: 'Please enter a valid email address',
  },
};

export const FullWidth: Story = {
  args: {
    stakeholderType: 'student',
    fullWidth: true,
    label: 'Registration Email',
    placeholder: 'Enter your username',
    showDomainHint: true,
  },
  parameters: {
    layout: 'padded',
  },
};