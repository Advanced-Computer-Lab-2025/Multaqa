import type { Meta, StoryObj } from '@storybook/react';
import { CustomSelectFieldV2 } from '../components/shared/input-fields';
import { useState } from 'react';

const meta = {
  title: 'Components/CustomSelectFieldV2',
  component: CustomSelectFieldV2,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    fieldType: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'Type of select field',
    },
    size: {
      control: 'select',
      options: ['small', 'medium'],
      description: 'Size of the select field',
    },
    neumorphicBox: {
      control: 'boolean',
      description: 'Enable neumorphic box styling',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the select field',
    },
    required: {
      control: 'boolean',
      description: 'Make the field required',
    },
    isError: {
      control: 'boolean',
      description: 'Show error state',
    },
  },
} satisfies Meta<typeof CustomSelectFieldV2>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleOptions = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
  { label: 'Option 4 (Disabled)', value: '4', disabled: true },
  { label: 'Option 5', value: '5' },
];

const countryOptions = [
  { label: '🇺🇸 United States', value: 'us' },
  { label: '🇬🇧 United Kingdom', value: 'uk' },
  { label: '🇨🇦 Canada', value: 'ca' },
  { label: '🇦🇺 Australia', value: 'au' },
  { label: '🇩🇪 Germany', value: 'de' },
  { label: '🇫🇷 France', value: 'fr' },
  { label: '🇯🇵 Japan', value: 'jp' },
  { label: '🇪🇬 Egypt', value: 'eg' },
];

// Basic Single Select - Standard
export const SingleSelect: Story = {
  args: {
    fieldType: 'single',
    options: sampleOptions,
    label: 'Select an Option',
    placeholder: 'Choose one...',
    size: 'medium',
  },
  render: (args: typeof meta.args) => {
    const [value, setValue] = useState<string | number | string[] | number[]>('');
    return (
      <div style={{ width: '400px', padding: '20px', backgroundColor: '#e5e7eb', minHeight: '300px' }}>
        <CustomSelectFieldV2
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

// Single Select with Neumorphic Styling
export const SingleSelectNeumorphic: Story = {
  args: {
    fieldType: 'single',
    options: countryOptions,
    label: 'Select Country',
    placeholder: 'Choose your country...',
    size: 'medium',
    neumorphicBox: true,
  },
  render: (args: typeof meta.args) => {
    const [value, setValue] = useState<string | number | string[] | number[]>('');
    return (
      <div style={{ width: '400px', padding: '20px', backgroundColor: '#e5e7eb', minHeight: '300px' }}>
        <CustomSelectFieldV2
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

// Multiple Select - Standard
export const MultipleSelect: Story = {
  args: {
    fieldType: 'multiple',
    options: sampleOptions,
    label: 'Select Options',
    placeholder: 'Choose multiple...',
    size: 'medium',
  },
  render: (args: typeof meta.args) => {
    const [value, setValue] = useState<string | number | string[] | number[]>([]);
    return (
      <div style={{ width: '400px', padding: '20px', backgroundColor: '#e5e7eb', minHeight: '300px' }}>
        <CustomSelectFieldV2
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

// Multiple Select with Neumorphic Styling
export const MultipleSelectNeumorphic: Story = {
  args: {
    fieldType: 'multiple',
    options: countryOptions,
    label: 'Select Countries',
    placeholder: 'Choose multiple countries...',
    size: 'medium',
    neumorphicBox: true,
  },
  render: (args: typeof meta.args) => {
    const [value, setValue] = useState<string | number | string[] | number[]>([]);
    return (
      <div style={{ width: '400px', padding: '20px', backgroundColor: '#e5e7eb', minHeight: '300px' }}>
        <CustomSelectFieldV2
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

// Small Size
export const SmallSize: Story = {
  args: {
    fieldType: 'single',
    options: sampleOptions,
    label: 'Small Select',
    placeholder: 'Choose...',
    size: 'small',
    neumorphicBox: true,
  },
  render: (args: typeof meta.args) => {
    const [value, setValue] = useState<string | number | string[] | number[]>('');
    return (
      <div style={{ width: '350px', padding: '20px', backgroundColor: '#e5e7eb', minHeight: '250px' }}>
        <CustomSelectFieldV2
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

// Required Field
export const RequiredField: Story = {
  args: {
    fieldType: 'single',
    options: sampleOptions,
    label: 'Required Field',
    placeholder: 'Please select...',
    size: 'medium',
    required: true,
    helperText: 'This field is required',
    neumorphicBox: true,
  },
  render: (args: typeof meta.args) => {
    const [value, setValue] = useState<string | number | string[] | number[]>('');
    return (
      <div style={{ width: '400px', padding: '20px', backgroundColor: '#e5e7eb', minHeight: '300px' }}>
        <CustomSelectFieldV2
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

// Error State
export const ErrorState: Story = {
  args: {
    fieldType: 'single',
    options: sampleOptions,
    label: 'Select with Error',
    placeholder: 'Choose one...',
    size: 'medium',
    isError: true,
    helperText: 'Please select a valid option',
    neumorphicBox: true,
  },
  render: (args: typeof meta.args) => {
    const [value, setValue] = useState<string | number | string[] | number[]>('');
    return (
      <div style={{ width: '400px', padding: '20px', backgroundColor: '#e5e7eb', minHeight: '300px' }}>
        <CustomSelectFieldV2
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

// Disabled State
export const DisabledState: Story = {
  args: {
    fieldType: 'single',
    options: sampleOptions,
    label: 'Disabled Select',
    placeholder: 'Cannot select...',
    size: 'medium',
    disabled: true,
    neumorphicBox: true,
  },
  render: (args: typeof meta.args) => {
    const [value, setValue] = useState<string | number | string[] | number[]>('2');
    return (
      <div style={{ width: '400px', padding: '20px', backgroundColor: '#e5e7eb', minHeight: '300px' }}>
        <CustomSelectFieldV2
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

// With Pre-selected Value
export const WithPreselectedValue: Story = {
  args: {
    fieldType: 'single',
    options: countryOptions,
    label: 'Pre-selected Country',
    placeholder: 'Choose country...',
    size: 'medium',
    neumorphicBox: true,
  },
  render: (args: typeof meta.args) => {
    const [value, setValue] = useState<string | number | string[] | number[]>('eg');
    return (
      <div style={{ width: '400px', padding: '20px', backgroundColor: '#e5e7eb', minHeight: '300px' }}>
        <CustomSelectFieldV2
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

// Multiple Pre-selected Values
export const MultiplePreselectedValues: Story = {
  args: {
    fieldType: 'multiple',
    options: countryOptions,
    label: 'Pre-selected Countries',
    placeholder: 'Choose countries...',
    size: 'medium',
    neumorphicBox: true,
  },
  render: (args: typeof meta.args) => {
    const [value, setValue] = useState<string | number | string[] | number[]>(['us', 'uk', 'eg']);
    return (
      <div style={{ width: '400px', padding: '20px', backgroundColor: '#e5e7eb', minHeight: '300px' }}>
        <CustomSelectFieldV2
          {...args}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

// Comparison: Side by Side
export const Comparison: Story = {
  args: {
    fieldType: 'single',
    options: countryOptions,
  },
  render: () => {
    const [standardValue, setStandardValue] = useState<string | number | string[] | number[]>('');
    const [neumorphicValue, setNeumorphicValue] = useState<string | number | string[] | number[]>('');
    
    return (
      <div style={{ 
        display: 'flex', 
        gap: '40px', 
        padding: '40px', 
        backgroundColor: '#e5e7eb',
        minHeight: '400px'
      }}>
        <div style={{ width: '350px' }}>
          <h3 style={{ marginBottom: '20px', fontWeight: 600, color: '#1E1E1E' }}>Standard</h3>
          <CustomSelectFieldV2
            fieldType="single"
            options={countryOptions}
            label="Select Country"
            placeholder="Choose..."
            size="medium"
            value={standardValue}
            onChange={setStandardValue}
          />
        </div>
        
        <div style={{ width: '350px' }}>
          <h3 style={{ marginBottom: '20px', fontWeight: 600, color: '#1E1E1E' }}>Neumorphic</h3>
          <CustomSelectFieldV2
            fieldType="single"
            options={countryOptions}
            label="Select Country"
            placeholder="Choose..."
            size="medium"
            neumorphicBox
            value={neumorphicValue}
            onChange={setNeumorphicValue}
          />
        </div>
      </div>
    );
  },
};
