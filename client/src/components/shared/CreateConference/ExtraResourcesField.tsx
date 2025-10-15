// components/Create/ExtraResourcesField.tsx
"use client";
import * as React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormikContext } from 'formik';
import CustomTextField from '../input-fields/CustomTextField';
import { EventFormData } from './types'; // Ensure this type has 'extraResources: string[]'
import { detailTitleStyles } from './styles';
import { useTheme } from '@mui/material/styles';
import theme from '@/themes/lightTheme';
import CustomIcon from '../Icons/CustomIcon';

const initialResourceValue = ''; // The default value for a new resource field

const ExtraResourcesField: React.FC = () => {
    // 💡 Use Formik context to manage state
    const formik = useFormikContext<EventFormData>();
    const { values, handleChange, handleBlur, errors, touched, setFieldValue } = formik;

    // 💡 Assume 'extraResources' is an array of strings in EventFormData
    const resources = values.extraResources || [];
    
    // --- Handlers ---
    
    // Handler to add a new empty text field
    const handleAddResource = () => {
        const newResources = [...resources, initialResourceValue];
        setFieldValue('extraResources', newResources);
    };

    // Handler to remove a text field at a specific index
    const handleRemoveResource = (index: number) => {
        const newResources = resources.filter((_, i) => i !== index);
        setFieldValue('extraResources', newResources);
    };

    // Handler for field changes (Formik handles this easily with array indexing)
    // The key is to generate the correct Formik path: 'extraResources[index]'
    const handleResourceChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(`extraResources[${index}]`)(event);
    };

    // Use a small spacer for visual separation
    const spacingBottom = { mb: 1.5 }; 

    return (
        <Box sx={{ width: '100%', mt: 2 }}>
            
            {/* 1. Label and Add Button */}
            <Box sx={{ display: 'flex',alignItems:'center',justifyContent:"space-between", mb: 1, px: 2 }}>
                <Typography sx={detailTitleStyles(theme)}>
                    Extra Required Resources
                </Typography>
                <IconButton 
                    onClick={handleAddResource} 
                    size="small"
                    color="secondary"
                    sx={{ p: 0.5, border: '1px solid', borderColor: 'secondary.main', padding:"4px" }}
                >
                    <AddIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* 2. Dynamic Input Fields */}
            <Box sx={{ px: 2 }}>
                {resources.map((resourceValue, index) => {
                    // Formik fields require a unique 'name' attribute
                    const fieldName = `extraResources[${index}]`;
                    
                    return (
                        <Box key={index} sx={{ display:'flex',alignItems:"end",justifyContent:"space-between",mb:2,
                              '&:focus-within': {outline: 'none',},}} >
                                <CustomTextField
                                    fieldType="text"
                                    label={`Resource ${index + 1}`}
                                    sx={{ flexGrow: 1 }} 
                                    placeholder="e.g., specific projector model, extra seating, etc."
                                    value={resourceValue}
                                    onChange={handleResourceChange(index)}
                                />
                                 {/* Delete Button */}
                                {resources.length > 0 && (
                                    <IconButton 
                                        onClick={() => handleRemoveResource(index)} 
                                        size="small"
                                        color="error"
                                        sx={{ p: 0.5, border: '1px solid', borderColor: 'error' }} // Slight margin top to align with text field
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                )}
                             </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default ExtraResourcesField;