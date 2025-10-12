import * as Yup from 'yup';

// This is a comprehensive validation schema demonstrating rigorous validation
// for the various custom input fields available in this project.
export const rigorousValidationSchema = Yup.object().shape({
  // --- CustomTextField Validations ---

  // Basic required string
  fullName: Yup.string()
    .min(3, 'Full name must be at least 3 characters')
    .required('Full name is required'),

  // Email validation
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),

  // URL validation (optional field)
  website: Yup.string()
    .url('Please enter a valid URL (e.g., https://example.com)')
    .nullable(),

  // Password with specific complexity requirements
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[@$!%*?&#]/, 'Password must contain at least one special character'),

  // Confirm password to match the password field
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Please confirm your password'),

  // Numeric validation
  age: Yup.number()
    .typeError('Age must be a number')
    .positive('Age must be a positive number')
    .integer('Age must be an integer')
    .min(18, 'You must be at least 18 years old')
    .required('Age is required'),

  // --- CustomSelectField Validations ---

  // Single-select dropdown
  userRole: Yup.string()
    .oneOf(['admin', 'editor', 'viewer'], 'Invalid role selected')
    .required('A user role must be selected'),

  // Multi-select dropdown
  interests: Yup.array()
    .of(Yup.string())
    .min(1, 'Please select at least one interest')
    .required('Interests are required'),

  // --- CustomCheckbox & CustomCheckboxGroup Validations ---

  // Single required checkbox
  termsAndConditions: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions to continue')
    .required(),

  // Checkbox group (at least one required)
  notificationPreferences: Yup.array()
    .of(Yup.string())
    .min(1, 'Please select at least one notification preference')
    .required(),

  // --- CustomRadio Validations ---

  // Radio button group
  accountType: Yup.string()
    .required('Please select an account type'),

  // --- CustomRating Validations ---

  // Rating field (e.g., 1 to 5 stars)
  satisfactionRating: Yup.number()
    .min(1, 'Rating is required')
    .max(5)
    .required('Please provide a satisfaction rating'),
});