import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, TextField, Typography, Paper } from '@mui/material';
import theme from '@/themes/lightTheme';
import CustomButton from '@/components/shared/Buttons/CustomButton';
import { toast } from 'react-toastify';
import { api } from '../../api';

// Validation schema for bug report
const bugReportSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  stepsToReproduce: Yup.string().required('Steps to reproduce are required'),
  expectedResult: Yup.string().required('Expected result is required'),
  actualResult: Yup.string().required('Actual result is required'),
  environment: Yup.string().required('Environment is required'),
});

const BugReportForms = () => {
  const [loading, setLoading] = useState(false);
  const accentColor = theme.palette.tertiary.main;

  const tertiaryInputStyles = {
    '& .MuiInputLabel-root': {
      color: theme.palette.grey[500],
      '&.Mui-focused': { color: accentColor },
    },
    '& .MuiInputBase-input': {
      color: '#000000',
      '&::placeholder': {
        color: theme.palette.grey[400],
        opacity: 1,
      },
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: theme.palette.grey[400],
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottomColor: accentColor,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: accentColor,
    },
  };

  const outlinedTextAreaStyles = {
    '& .MuiOutlinedInput-root': {
      alignItems: 'flex-start',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: accentColor,
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: accentColor,
        borderWidth: '2px',
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderRadius: '16px',
      borderColor: theme.palette.grey[300],
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.grey[500],
      '&.Mui-focused': { color: accentColor },
    },
  };

  const outlinedSingleLineStyles = {
    '& .MuiOutlinedInput-root': {
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: accentColor,
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: accentColor,
        borderWidth: '2px',
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderRadius: '12px',
      borderColor: theme.palette.grey[300],
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.grey[500],
      '&.Mui-focused': { color: accentColor },
    },
  };

  const initialValues = {
    title: '',
    stepsToReproduce: '',
    expectedResult: '',
    actualResult: '',
    environment: '',
  };

  const handleCallApi = async (payload: any) => {
    setLoading(true);
    try {
      // TODO: Replace with your actual bug report API endpoint
      const res = await api.post('/bugs', payload);
      toast.success('Bug report submitted successfully', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      resetForm();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || 'Failed to submit bug report. Please try again.',
        {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: any, actions: any) => {
    const payload = {
      title: values.title,
      stepsToReproduce: values.stepsToReproduce,
      expectedResult: values.expectedResult,
      actualResult: values.actualResult,
      environment: values.environment,
    };
    // handleCallApi(payload);
    window.alert(JSON.stringify(payload, null, 2));
  };

  const {
    handleSubmit,
    values,
    isSubmitting,
    handleChange,
    handleBlur,
    errors,
    touched,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema: bugReportSchema,
    onSubmit: onSubmit,
  });

  const handleReset = () => {
    resetForm();
  };

  return (
    <Box sx={{ p: 4, maxWidth: '1000px', margin: '0 auto' , backgroundColor: theme.palette.background.default }}>
      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 700,
          color: accentColor,
          textAlign: 'center',
        }}
      >
        Bug Reporting
      </Typography>

      {/* Form Box */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: '32px',
          background: theme.palette.background.paper,
          border: `1.5px solid ${accentColor}`,
          boxShadow: '0 4px 24px 0 rgba(110, 138, 230, 0.08)',
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* Title Field */}
          <Typography sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}>
            Title:
          </Typography>
          <TextField
            name="title"
            id="title"
            placeholder="Enter bug title"
            type="text"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
            sx={{ ...outlinedSingleLineStyles, mb: 2 }}
          />
          {errors.title && touched.title && (
            <Typography sx={{ color: '#db3030', fontSize: '0.875rem', mt: -1.5, mb: 1 }}>
              {errors.title}
            </Typography>
          )}

          {/* Steps to Reproduce Field */}
          <Typography sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}>
            Steps to Reproduce:
          </Typography>
          <TextField
            name="stepsToReproduce"
            id="stepsToReproduce"
            placeholder="Describe the steps to reproduce the bug"
            value={values.stepsToReproduce}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
            multiline
            rows={6}
            sx={{ ...outlinedTextAreaStyles, mb: 2 }}
          />
          {errors.stepsToReproduce && touched.stepsToReproduce && (
            <Typography sx={{ color: '#db3030', fontSize: '0.875rem', mt: -1.5, mb: 1 }}>
              {errors.stepsToReproduce}
            </Typography>
          )}

          {/* Expected Result Field */}
          <Typography sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}>
            Expected Result:
          </Typography>
          <TextField
            name="expectedResult"
            id="expectedResult"
            placeholder="What did you expect to happen?"
            value={values.expectedResult}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
            multiline
            rows={4}
            sx={{ ...outlinedTextAreaStyles, mb: 2 }}
          />
          {errors.expectedResult && touched.expectedResult && (
            <Typography sx={{ color: '#db3030', fontSize: '0.875rem', mt: -1.5, mb: 1 }}>
              {errors.expectedResult}
            </Typography>
          )}

          {/* Actual Result Field */}
          <Typography sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}>
            Actual Result:
          </Typography>
          <TextField
            name="actualResult"
            id="actualResult"
            placeholder="What actually happened?"
            value={values.actualResult}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
            multiline
            rows={4}
            sx={{ ...outlinedTextAreaStyles, mb: 2 }}
          />
          {errors.actualResult && touched.actualResult && (
            <Typography sx={{ color: '#db3030', fontSize: '0.875rem', mt: -1.5, mb: 1 }}>
              {errors.actualResult}
            </Typography>
          )}

          {/* Environment Field */}
          <Typography sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}>
            Environment:
          </Typography>
          <TextField
            name="environment"
            id="environment"
            placeholder="e.g., Browser, OS, Device"
            type="text"
            value={values.environment}
            onChange={handleChange}
            onBlur={handleBlur}
            fullWidth
            sx={{ ...outlinedSingleLineStyles, mb: 3 }}
          />
          {errors.environment && touched.environment && (
            <Typography sx={{ color: '#db3030', fontSize: '0.875rem', mt: -1.5, mb: 1 }}>
              {errors.environment}
            </Typography>
          )}

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <CustomButton
              label="Reset Form"
              variant="outlined"
              color="tertiary"
              type="button"
              onClick={handleReset}
              sx={{
                px: 3,
                width: '150px',
                height: '40px',
                fontWeight: 700,
                fontSize: '16px',
                borderRadius: '20px',
                borderColor: accentColor,
                color: accentColor,
                '&:hover': {
                  borderColor: '#5a7ae0',
                  background: 'rgba(110, 138, 230, 0.05)',
                },
              }}
            />
            <CustomButton
              disabled={isSubmitting || loading}
              label={isSubmitting || loading ? 'Submitting...' : 'Report Bug'}
              variant="contained"
              color="tertiary"
              type="submit"
              sx={{
                px: 3,
                width: '150px',
                height: '40px',
                fontWeight: 700,
                fontSize: '16px',
                borderRadius: '20px',
                boxShadow: '0 2px 8px 0 rgba(110, 138, 230, 0.15)',
                background: accentColor,
                '&:hover': {
                  background: '#5a7ae0',
                },
              }}
            />
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default BugReportForms;
