import { Router, Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { signupStudentAndStaffValidationSchema, signupVendorValidationSchema, loginValidationSchema } from '../validation/auth.validation';
import createError from 'http-errors';
import { VerificationService } from '../services/verificationService';
import { SignupResponse, LoginResponse, RefreshResponse, LogoutResponse } from '../interfaces/responses/authResponses.interface';

const router = Router();
const authService = new AuthService();
const verificationService = new VerificationService();

router.post('/signup/studentAndStaff', async (req: Request, res: Response<SignupResponse>) => {
  try {
    // Validate request body
    const { error, value } = signupStudentAndStaffValidationSchema.validate(req.body);
    if (error) {
      throw createError(400, 'Validation error', {
        errors: error.details.map(detail => detail.message)
      });
    }

    // Create user
    const result = await authService.signup(value);

    // Send HTTP response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: result
    });
  } catch (error: any) {
    throw createError(400, error.message || 'Registration failed');
  }
});

router.post('/signup/vendor', async (req: Request, res: Response<SignupResponse>) => {
  try {
    // Validate request body
    const { error, value } = signupVendorValidationSchema.validate(req.body);
    if (error) {
      throw createError(400, 'Validation error', {
        errors: error.details.map(detail => detail.message)
      });
    }

    // Create user
    const result = await authService.signup(value);

    // Send HTTP response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: result
    });
  } catch (error: any) {
    throw createError(400, error.message || 'Registration failed');
  }
});

router.get("/verify", async (req, res, next) => {
  try {
    const token = req.query.token as string;
    await verificationService.verifyUser(token);

    return res.redirect(`https://localhost:${process.env.BACKEND_PORT}/login?verified=true`); // should be frontend URL
  } catch (err) {
    return res.redirect(`https://localhost:${process.env.BACKEND_PORT}/login?verified=false`); // should be frontend URL
  }
});

router.post('/login', async (req: Request, res: Response<LoginResponse>) => {
  try {
    // Validate request body
    const { error, value } = loginValidationSchema.validate(req.body);
    if (error) {
      throw createError(400, 'Validation error', {
        errors: error.details.map(detail => detail.message)
      });
    }

    // Login user and get tokens
    const { user, tokens } = await authService.login(value);
    const { accessToken, refreshToken } = tokens;

    // Set refresh token in HTTP-only cookie to prevent XSS attacks
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });

    // Send HTTP response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user, accessToken }
    });
  } catch (error: any) {
    throw createError(400, error.message || 'Login failed');
  }
});

// --- Refresh Access Token ---
router.post('/refresh', async (req: Request, res: Response<RefreshResponse>) => {
  try {
    const newAccessToken = await authService.refreshToken(req.cookies.refreshToken);
    res.status(200).json({
      accessToken: newAccessToken
    });
  } catch (error: any) {
    throw createError(403, error.message || 'Could not refresh access token');
  }
});

router.post('/logout', async (req: Request, res: Response<LogoutResponse>) => {
  try {
    await authService.logout(req.cookies.refreshToken);
    res.clearCookie('refreshToken');
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error: any) {
    throw createError(400, error.message || 'Logout failed');
  }
});

export default router;