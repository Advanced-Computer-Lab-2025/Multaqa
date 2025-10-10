import Joi from 'joi';

// for student and staffMembers (staff/TA/Professor)
export const signupStudentAndStaffValidationSchema = Joi.object({
  email: Joi.string()
    .email()
    .pattern(/@student\.guc\.edu\.eg$|@guc\.edu\.eg$/)
    .required()
    .messages({
      'string.pattern.base': 'Must use a valid GUC email address (@student.guc.edu.eg or @guc.edu.eg)'
    }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }),
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),
  gucId: Joi.string()
    .pattern(/^\d{1,2}-\d{4,5}$/) // ex: 1-2345 or 1-34567 or 12-3456 or 12-34567
    .required()
    .messages({
      'string.pattern.base': 'GUC ID must be in format XX-XXXX or XX-XXXXX or X-XXXX or X-XXXXX (X is a digit)'
    })
});

export const signupVendorValidationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }),
  companyName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),
  taxCard: Joi.string()
    .trim()
    .required(),
  logo: Joi.string()
    .uri()
    .required()
});

// for all users
export const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});