import { Router, Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { signupStudentAndStaffValidationSchema, signupVendorValidationSchema, loginValidationSchema } from '../validation/auth.validation';
import createError from 'http-errors';
import { VerificationService } from '../services/verificationService';
import { SignupResponse, LoginResponse, RefreshResponse, LogoutResponse, MeResponse } from '../interfaces/responses/authResponses.interface';
import verifyJWT from '../middleware/verifyJWT.middleware';
import { UserService } from '../services/userService';

const router = Router();
const authService = new AuthService();
const userService = new UserService();
const verificationService = new VerificationService();

async function signup(req: Request, res: Response<SignupResponse>) {
  try {
    // Validate request body based on role
    let schema;
    if (req.body.type === 'vendor') {
      schema = signupVendorValidationSchema;
    } else {
      schema = signupStudentAndStaffValidationSchema;
    }
    const { error, value } = schema.validate(req.body);
    if (error) {
      throw createError(400, 'Validation error', error.message);
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
    console.error('Registration error:', error.message);
    throw createError(400, error.message || 'Registration failed');
  }
}

// --- Get Current User ---
export const getMe = async (req: Request, res: Response<MeResponse>) => {
  try {
    const user = (req as any).user;

    // Fetch full user details
    const fullUser = await userService.getUserById(user.id);
    
    res.status(200).json({
      user: fullUser,
      message: 'User fetched successfully',
    });
  } catch (error: any) {
    throw createError(400, error.message || 'Get Me failed');
  }
};


async function verifyUser(req: Request, res: Response) {
  try {
    const token = req.query.token as string;
    await verificationService.verifyUser(token);

    return res.redirect(`https://localhost:${process.env.BACKEND_PORT}/login?verified=true`); // should be frontend URL
  } catch (err) {
    return res.redirect(`https://localhost:${process.env.BACKEND_PORT}/login?verified=false`); // should be frontend URL
  }
}

async function login(req: Request, res: Response<LoginResponse>) {
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
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,           // cannot be accessed by JS
      secure: false, 
      sameSite: "lax",
      path: "/",                // available for all routes
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Send HTTP response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: user,
      accessToken: accessToken
    });
  } catch (error: any) {
    console.error('Login error:', error.message);
    throw createError(400, error.message || 'Login failed');
  }
}

// --- Refresh Access Token ---
async function refreshAccessToken(req: Request, res: Response<RefreshResponse>) {
  try {
    const newAccessToken = await authService.refreshToken(req.cookies.refreshToken);
    res.status(200).json({
      accessToken: newAccessToken
    });
  } catch (error: any) {
    throw createError(403, error.message || 'Could not refresh access token');
  }
}

async function logout(req: Request, res: Response<LogoutResponse>) {
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
}

router.post('/me', verifyJWT, getMe);
router.post('/signup', signup);
router.get('/verify', verifyUser);
router.post('/login', login);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', logout);

export default router;