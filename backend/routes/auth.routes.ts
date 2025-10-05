import { Router, Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { signupStudentAndStaffValidationSchema, signupVendorValidationSchema, loginValidationSchema } from '../validation/auth.validation';

const router = Router();
const authService = new AuthService();

router.post('/signup/studentAndStaff', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { error, value } = signupStudentAndStaffValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Create user
    const result = await authService.signup(value);

    // Send HTTP response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
});

router.post('/signup/vendor', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { error, value } = signupVendorValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Create user
    const result = await authService.signupVendor(value);

    // Send HTTP response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { error, value } = loginValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    // Login user
    const result = await authService.login(value);

    // Send HTTP response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
});

export default router;