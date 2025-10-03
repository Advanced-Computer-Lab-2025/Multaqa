// Export components
export { default as CustomTextField } from './CustomTextField';

// Export types
export type {
  CustomTextFieldProps,
  FieldType,
  StakeholderType
} from './types';

// Export utilities
export {
  getEmailDomain,
  getFieldIcon,
  createLabelWithIcon,
  getEmailEndAdornment,
  getPasswordEndAdornment,
  handleEmailInputChange,
  handleEmailKeyPress,
  getEmailDisplayValue,
} from './utils';
