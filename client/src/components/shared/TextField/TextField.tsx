"use client";
import * as React from 'react';
import { Box, Typography, IconButton, Select, MenuItem, useTheme } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined, ExpandMore } from '@mui/icons-material';

// Import from local files
import { RichTextFieldProps, FontOption, FontSizeOption } from './types';
import { executeCommand } from './utils';
import { containerStyles, toolbarStyles, contentAreaStyles,headerLabelStyles,headerTitleContainerStyles } from './styles';

// --- Configuration Data ---
const FONT_OPTIONS: FontOption[] = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Serif', value: 'serif' },
  { label: 'Monospace', value: 'monospace' },
];

const FONT_SIZE_OPTIONS: FontSizeOption[] = [
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px', value: '16px' },
];

const RichTextField: React.FC<RichTextFieldProps> = ({ label, onContentChange, placeholder="Enter your description here..." }) => {
  const theme = useTheme();
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [fontFamily, setFontFamily] = React.useState(FONT_OPTIONS[0].value);
  const [fontSize, setFontSize] = React.useState(FONT_SIZE_OPTIONS[1].value);
  // Handle content changes (input)
  const handleInput = () => {
    if (contentRef.current) {
      onContentChange(contentRef.current.innerHTML);
    }
  };

  // Handler for font family change
  const handleFontFamilyChange = (event: any) => {
    const newFont = event.target.value as string;
    setFontFamily(newFont);
    // document.execCommand('fontName', false, newFont);
    // Note: direct execCommand for fontName is deprecated/complex.
    // In a real app, you would apply the font style to the entire content area.
    if (contentRef.current) {
        contentRef.current.style.fontFamily = newFont;
    }
    handleInput();
  };

  // Handler for font size change
  const handleFontSizeChange = (event: any) => {
    const newSize = event.target.value as string;
    setFontSize(newSize);
    // document.execCommand('fontSize', false, newSize); // Again, complex implementation
    if (contentRef.current) {
        contentRef.current.style.fontSize = newSize;
    }
    handleInput();
  };
  
  // Handler for bold/italic/underline
  const handleFormat = (command: string) => {
    // Focus the content area before executing the command to ensure the selection is correct
    if (contentRef.current) {
        contentRef.current.focus();
    }
    executeCommand(command);
  };

  return (
    <Box sx={containerStyles(theme)}>

      {/* 1. Header/Title Area (Single Tab) */}
      <Box sx={headerTitleContainerStyles(theme)}>
        <Typography sx={headerLabelStyles(theme)}>
          {label}
        </Typography>
      </Box>


        <Box
        ref={contentRef}
        contentEditable
        data-placeholder={placeholder}
        onInput={handleInput}
        sx={{ 
            ...contentAreaStyles(theme), 
            fontFamily: fontFamily, 
            fontSize: fontSize 
        }}
      />

      {/* Toolbar */}
      <Box sx={toolbarStyles(theme)}>
        
        {/* Font Family Select */}
        <Select
          value={fontFamily}
          onChange={handleFontFamilyChange}
          variant="standard"
          disableUnderline
          IconComponent={ExpandMore}
          sx={{ 
            height: '24px', 
            color:theme.palette.grey[700],
            marginRight: 1, 
            paddingRight:1,
            fontSize: '14px',
            '.MuiSelect-select': { paddingRight: '20px !important', paddingLeft: '8px' }
          }}
        >
          {FONT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value} sx={{ fontFamily: option.value, fontSize: '14px' }}>
              {option.label}
            </MenuItem>
          ))}
        </Select>

        {/* Font Size Select */}
        <Select
          value={fontSize}
          onChange={handleFontSizeChange}
          variant="standard"
          disableUnderline
          IconComponent={ExpandMore}
          sx={{ 
            height: '24px', 
            color:theme.palette.grey[700],
            marginRight:1, 
            paddingRight:1,
            fontSize: '14px',
            '.MuiSelect-select': { paddingRight: '20px !important', paddingLeft: '8px' }
          }}
        >
          {FONT_SIZE_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value} sx={{ fontSize: '14px' }}>
              {option.label}
            </MenuItem>
          ))}
        </Select>

        {/* Formatting Buttons */}
        <IconButton size="small" onClick={() => handleFormat('bold')} color="inherit">
          <FormatBold fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => handleFormat('italic')} color="inherit">
          <FormatItalic fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => handleFormat('underline')} color="inherit">
          <FormatUnderlined fontSize="small" />
        </IconButton>
        
      </Box>
    </Box>
  );
};

export default RichTextField;