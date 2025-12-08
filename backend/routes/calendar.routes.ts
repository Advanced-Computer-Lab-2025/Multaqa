import { Router, Request, Response } from 'express';
import { CalendarService } from '../services/calendarService';
import createError from 'http-errors';
import {
  GetAuthUrlResponse,
  AddEventResponse
} from '../interfaces/responses/calendarResponses.interface';
import { AuthenticatedRequest } from '../middleware/verifyJWT.middleware';
import verifyJWT from '../middleware/verifyJWT.middleware';
import { UserRole } from '../constants/user.constants';
import { StaffPosition } from '../constants/staffMember.constants';
import { authorizeRoles } from '../middleware/authorizeRoles.middleware';

const router = Router();
const calendarService = new CalendarService();

async function getAuthUrl(req: AuthenticatedRequest, res: Response<GetAuthUrlResponse>) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError(401, 'User not authenticated');
    }

    const url = calendarService.getAuthUrl(userId);
    res.json({
      success: true,
      message: 'Google Calendar auth URL generated successfully',
      url
    });
  } catch (error: any) {
    throw createError(
      error.status || 500,
      error.message || 'Failed to generate auth URL'
    );
  }
}

async function handleCallback(req: Request, res: Response) {
  try {
    const code = req.query.code as string;
    const state = req.query.state as string;
    
    if (!code) {
      throw createError(400, 'Missing authorization code');
    }

    if (!state) {
      throw createError(400, 'Missing state parameter');
    }

    const tokens = await calendarService.getTokensFromCode(code);
    await calendarService.saveUserCalendarTokens(state, tokens);

    // Send HTML to close the popup window
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Calendar Connected</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: #ffffff;
            }
            .container {
              text-align: center;
              padding: 2rem;
            }
            .checkmark {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              background: #4caf50;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 1.5rem;
            }
            .checkmark svg {
              width: 50px;
              height: 50px;
              fill: white;
            }
            h1 {
              margin: 0 0 0.5rem 0;
              color: #333;
              font-size: 24px;
              font-weight: 600;
            }
            p {
              margin: 0;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="checkmark">
              <svg viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            </div>
            <h1>Connected to Google Calendar</h1>
            <p>You can close this window now.</p>
          </div>
          <script>
            setTimeout(() => {
              window.close();
            }, 1500);
          </script>
        </body>
      </html>
    `);
  } catch (error: any) {
    console.error('Calendar callback error:', error.message);
    res.status(error.status || 500).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Connection Failed</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 2rem;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 1rem;
              backdrop-filter: blur(10px);
            }
            h1 { margin: 0 0 1rem 0; }
            p { margin: 0; opacity: 0.9; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✗ Connection Failed</h1>
            <p>${error.message || 'Failed to connect Google Calendar'}</p>
            <p style="margin-top: 1rem;">Please close this window and try again.</p>
          </div>
        </body>
      </html>
    `);
  }
}

async function addEvent(req: AuthenticatedRequest, res: Response<AddEventResponse>) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw createError(401, 'User not authenticated');
    }

    const userTokens = await calendarService.getUserCalendarTokens(userId);
    if (!userTokens) {
      throw createError(400, 'User not connected to Google Calendar');
    }

    const { title, description, startISO, endISO } = req.body;

    if (!title || !startISO || !endISO) {
      throw createError(400, 'Missing required fields: title, startISO, endISO');
    }

    const event = await calendarService.addEvent(
      userTokens,
      title,
      description,
      startISO,
      endISO
    );

    res.json({
      success: true,
      message: 'Event added to Google Calendar successfully',
      event
    });
  } catch (error: any) {
    throw createError(
      error.status || 500,
      error.message || 'Failed to add event to calendar'
    );
  }
}

router.get('/auth/google/url', verifyJWT, 
  authorizeRoles({
  userRoles: [UserRole.STUDENT, UserRole.STAFF_MEMBER],
  staffPositions: [
    StaffPosition.PROFESSOR,
    StaffPosition.TA,
    StaffPosition.STAFF,
  ],
}), getAuthUrl);

router.get('/auth/google/callback', handleCallback);

router.post('/add-event', verifyJWT, 
  authorizeRoles({
  userRoles: [UserRole.STUDENT, UserRole.STAFF_MEMBER],
  staffPositions: [
    StaffPosition.PROFESSOR,
    StaffPosition.TA,
    StaffPosition.STAFF,
  ],
}), addEvent);

export default router;
