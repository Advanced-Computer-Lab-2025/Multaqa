"use client";
import * as React from 'react';
import { Box, Typography, IconButton, Select, MenuItem, useTheme } from '@mui/material';
import { FormatBold, FormatItalic, FormatUnderlined, ExpandMore } from '@mui/icons-material';
import { useField, FieldHookConfig } from "formik";

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

const RichTextField: React.FC<RichTextFieldProps> = (props) => {
  const theme = useTheme();
const isFormik = "name" in props && (props as any).name !== undefined && "value" in props === false;

// ────── Formik branch ──────
let field: any = { value: "" };
let helpers: any = { setValue: () => {}, setTouched: () => {} };

if (isFormik) {
  const [f, , h] = useField<string>(props as FieldHookConfig<string>);
  field = f;
  helpers = h;
} else {
  field = { value: (props as any).value ?? "" };
  helpers = {
    setValue: (props as any).onChange,
    setTouched: () => {},
  };
}

const value = field.value ?? "";
const setValue = helpers.setValue;
const setTouched = helpers.setTouched;

  // ────── UI state ──────
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [fontFamily, setFontFamily] = React.useState(FONT_OPTIONS[0].value);
  const [fontSize, setFontSize] = React.useState(FONT_SIZE_OPTIONS[1].value);
  // Handle content changes (input)
const handleInput = () => {
    if (contentRef.current) setValue(contentRef.current.innerHTML);
  };

  const applyFontStyles = () => {
    if (contentRef.current) {
      contentRef.current.style.fontFamily = fontFamily;
      contentRef.current.style.fontSize = fontSize;
    }
  };

React.useEffect(() => {
    applyFontStyles();
    if (contentRef.current && contentRef.current.innerHTML !== value) {
      contentRef.current.innerHTML = value;
    }
  }, [value, fontFamily, fontSize]);

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
  
const handleFormat = (command: string) => {
    contentRef.current?.focus();
    document.execCommand(command, false);
    handleInput();
  };

  const handleFocus = () => setTouched(true);
  const handleBlur = () => {
    setTouched(true);
    handleInput();
  };

  return (
<Box sx={containerStyles(theme)}>
      {props.label && (
        <Box sx={headerTitleContainerStyles(theme)}>
          <Typography sx={headerLabelStyles(theme)}>{props.label}</Typography>
        </Box>
      )}

<Box
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={props.placeholder ?? "Enter text..."}
        onInput={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        dangerouslySetInnerHTML={{ __html: value }}
        sx={{
          ...contentAreaStyles(theme),
          minHeight: "120px",
          outline: "none",
          "&:empty:before": {
            content: "attr(data-placeholder)",
            color: theme.palette.text.disabled,
            pointerEvents: "none",
          },
        }}
      />
    </Box>
/*{

      <Box sx={toolbarStyles(theme)}>
        
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

        <IconButton size="small" onClick={() => handleFormat('bold')} color="inherit">
          <FormatBold fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => handleFormat('italic')} color="inherit">
          <FormatItalic fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => handleFormat('underline')} color="inherit">
          <FormatUnderlined fontSize="small" />
        </IconButton>
        
      </Box>*/
  );
};

export default RichTextField;