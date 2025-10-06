"use client"
import React, { useState } from 'react';
import {
  Box,
  Stack,
  Avatar,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  Typography,
  IconButton,
  Collapse,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IdChip from './IdChip';
import NeumorphicBox from '../shared/containers/NeumorphicBox';
import theme from '@/themes/lightTheme';
import { RegisterBoxProps, TruncatedTextProps } from './types';

const TruncatedText: React.FC<TruncatedTextProps> = ({ children, maxChars = 40 , fontSize, fontWeight="600"}) => {
  return (
    <Tooltip title={children} arrow placement="top">
      <Typography
        variant="body2"
        sx={{
          color: '#1A1A1A',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
          fontSize: fontSize,
          fontWeight: fontWeight,
          fontFamily: "var(--font-poppins), system-ui, sans-serif"
        }}
      >
        {children}
      </Typography>
    </Tooltip>
  );
};


const RegisterBox: React.FC<RegisterBoxProps> = ({
  name = "Salma Tarek",
  id = "58-5727",
  email = "salmaabadadadadaurahsfsfsfsfsfmah@gmail.com",
  registrationDate = "25/08/2025",
  role = "N/A",
  onRoleChange
}) => {
  const [selectedRole, setSelectedRole] = useState(role);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRoleChange = (event: any) => {
    const newRole = event.target.value;
    setSelectedRole(newRole);
    if (onRoleChange) {
      onRoleChange(newRole);
    }
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
   <NeumorphicBox
     containerType="outwards"
      sx={{
        border:"1px solid #7851da",
        borderRadius: '16px',
        backgroundColor: "#e5e7eb",
        maxWidth: '290px',
        padding:"15px 20px",
        margin: '20px auto',
        fontFamily: "var(--font-poppins), system-ui, sans-serif",
      }}
    >
      {/* Header: Name, ID, and Toggle Button (Fixed Width) */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ cursor: 'pointer', mb: isExpanded ? 2 : 0, width:"250px", fontFamily: "var(--font-poppins), system-ui, sans-serif",}}
        onClick={handleToggleExpand}
      >
        {/* Name and ID Chip Group */}
        
        <Stack
          direction="row"
          justifyContent="start" 
          alignItems="center"
          spacing={2}
          sx={{
            flexGrow: 1, 
            minWidth: 0,
            overflow: 'hidden',
            height:"60px",
            maxWidth:"250px"
          }}
        >
           <NeumorphicBox containerType="outwards" 
           sx={{width:"w-fit", padding:"2px", borderRadius:"20px", boxShadow: `
                      -3px -3px 8px 0 #FAFBFF,
                      5px 5px 8px 0 rgba(107, 79, 150, 0.6)
                                         `,}}>
          <IdChip
            avatar={
              <Avatar>#</Avatar>
            }
            label={id}
            variant="outlined"
            color="primary"
            sx={{ flexShrink: 0, fontWeight:"600"}}
          />
          </NeumorphicBox>

          <Box
            sx={{
              flexGrow: 1, 
              flexShrink: 1,
              minWidth: '50px', 
              fontSize: '20px', 
              fontWeight: 600,
              color: '#1A1A1A',
            }}
          >
            <TruncatedText fontSize="16px" fontWeight="600" >{name}</TruncatedText>
          </Box>
        </Stack>

        {/* Expansion/Collapse Icon - Stays on the far right */}
        <IconButton
          size="small"
          aria-expanded={isExpanded}
          aria-label="show more"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleExpand();
          }}
          sx={{ flexShrink: 0, 
          color: theme.palette.primary.main, 
          border:  "1px solid #b6b7ba" ,
          width:"24px", 
          height:"24px",
          "&:hover": {
            borderColor: theme.palette.primary.main,
            transition: "all 0.3 ease-in-out",
  }, }}
        >
          {isExpanded ? (
            <KeyboardArrowUpIcon sx={{ fontSize: '24px', color: '#757575' }} />
          ) : (
            <KeyboardArrowDownIcon sx={{ fontSize: '24px', color: '#757575' }} />
          )}
        </IconButton>
      </Stack>

      {/* Collapsible Content */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Stack spacing={1}>
          {/* Role */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ pt: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: '#757575',
                fontWeight: 500,
                width: '140px',
                flexShrink: 0,
                fontSize: '12px'
              }}
            >
              Role
            </Typography>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <FormControl size="small" fullWidth>
                <Select
                  value={selectedRole}
                  onChange={handleRoleChange}
                  sx={{
                    height: "30px",
                    fontSize: '12px',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#D1D5DB' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1976D2' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976D2' },
                  }}
                >
                  <MenuItem sx={{ fontSize: '12px' }} value="N/A">N/A</MenuItem>
                  <MenuItem sx={{ fontSize: '12px' }} value="Staff">Staff</MenuItem>
                  <MenuItem sx={{ fontSize: '12px' }} value="TA">TA</MenuItem>
                  <MenuItem sx={{ fontSize: '12px' }} value="Professor">Professor</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Stack>

          {/* Email */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography
              variant="body2"
              sx={{
                color: '#757575',
                fontWeight: 500,
                width: '140px',
                flexShrink: 0,
                fontSize: '12px'
              }}
            >
              Email
            </Typography>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <TruncatedText fontSize="12px" fontWeight="">{email}</TruncatedText>
            </Box>
          </Stack>

          {/* Registration Date */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography
              variant="body2"
              sx={{
                color: '#757575',
                fontWeight: 500,
                width: '140px',
                flexShrink: 0,
                fontSize: '12px'
              }}
            >
              Registration Date
            </Typography>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#1A1A1A',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: '12px'
                }}
              >
                {registrationDate}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Collapse>
    </NeumorphicBox>
  );
};

export default RegisterBox;