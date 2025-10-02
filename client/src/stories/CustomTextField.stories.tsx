import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Person, Phone, Search } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';
import CustomTextField from '../components/shared/input-fields/CustomTextField';

const meta: Meta<typeof CustomTextField> = {
  title: 'Components/Input Fields/CustomTextField',
  component: CustomTextField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label for the input field'
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
    size: {
      control: { type: 'select' },
      options: ['small', 'medium'],
      description: 'Size of the input field'
    }
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Default Field',
    placeholder: 'Enter text here',
  },
};

export const WithStartIcon: Story = {
  args: {
    label: 'Name',
    placeholder: 'Enter your name',
  },
  render: (args) => (
    <CustomTextField
      {...args}
      startIcon={
        <InputAdornment position="start">
          <Person />
        </InputAdornment>
      }
    />
  ),
};

export const WithEndIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search...',
  },
  render: (args) => (
    <CustomTextField
      {...args}
      endIcon={
        <InputAdornment position="end">
          <Search />
        </InputAdornment>
      }
    />
  ),
};

export const WithBothIcons: Story = {
  args: {
    label: 'Phone Number',
    placeholder: '+1 (555) 123-4567',
  },
  render: (args) => (
    <CustomTextField
      {...args}
      startIcon={
        <InputAdornment position="start">
          <Phone />
        </InputAdornment>
      }
      endIcon={
        <InputAdornment position="end">
          <Search />
        </InputAdornment>
      }
    />
  ),
};

export const ErrorState: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    isError: true,
    helperText: 'Please enter a valid email address',
    value: 'invalid-email',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    helperText: 'Password must be at least 8 characters',
    type: 'password',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    placeholder: 'This field is disabled',
    disabled: true,
    value: 'Cannot edit this',
  },
};

export const SmallSize: Story = {
  args: {
    label: 'Small Field',
    placeholder: 'Small input',
    size: 'small',
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Full Width Field',
    placeholder: 'This field takes full width',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};