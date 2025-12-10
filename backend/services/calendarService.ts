import { google } from 'googleapis';
import createError from 'http-errors';
import GenericRepository from '../repos/genericRepo';
import { IUser } from '../interfaces/models/user.interface';
import { User } from '../schemas/stakeholder-schemas/userSchema';

export interface CalendarTokens {
  access_token: string;
  refresh_token: string;
  scope?: string;
  token_type?: string;
  expiry_date?: number;
}

export class CalendarService {
  private oauth2Client;
  private userRepo: GenericRepository<IUser>;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CALENDAR_CLIENT_ID,
      process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
      process.env.GOOGLE_CALENDAR_REDIRECT_URI
    );
    this.userRepo = new GenericRepository(User);
  }

  getAuthUrl(userId: string): string {
    const scopes = ['https://www.googleapis.com/auth/calendar'];
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      state: userId, // Pass userId in state to retrieve it in callback
    });
  }

  async getTokensFromCode(code: string): Promise<CalendarTokens> {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens as CalendarTokens;
  }

  async saveUserCalendarTokens(userId: string, tokens: CalendarTokens): Promise<void> {
    try {
      const user = await this.userRepo.update(userId, {
        googleCalendar: tokens
      });

      if (!user) {
        throw createError(404, 'User not found');
      }
    } catch (error: any) {
      throw createError(
        error.status || 500,
        error.message || 'Failed to save calendar tokens'
      );
    }
  }

  async getUserCalendarTokens(userId: string): Promise<CalendarTokens | null> {
    try {
      const user = await this.userRepo.findById(userId, {
        select: 'googleCalendar'
      });
      
      if (!user) {
        throw createError(404, 'User not found');
      }

      return user.googleCalendar || null;
    } catch (error: any) {
      throw createError(
        error.status || 500,
        error.message || 'Failed to retrieve calendar tokens'
      );
    }
  }

  async addEvent(
    tokens: CalendarTokens,
    title: string,
    description: string,
    startISO: string,
    endISO: string
  ) {
    this.oauth2Client.setCredentials(tokens);
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    const event = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: title,
        description,
        start: { dateTime: startISO },
        end: { dateTime: endISO },
      },
    });

    return event.data;
  }
}
