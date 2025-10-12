import GenericRepo from "../repos/genericRepo";
import { ICourt } from "../interfaces/models/court.interface";
import { Court } from "../schemas/court-schema/courtSchema";
import { TIME_SLOTS } from "../constants/court.constants";
import { IAvailableSlots } from "../interfaces/models/court.interface";
import { create } from "domain";
import createHttpError from "http-errors";

export class CourtService {
  private courtRepo: GenericRepo<ICourt>;

  constructor() {
    this.courtRepo = new GenericRepo<ICourt>(Court);
  }

  async getAvailableTimeSlots(courtId: string, date: string): Promise<IAvailableSlots> {
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw createHttpError(400, 'Invalid date format. Use YYYY-MM-DD');
    }

    const court = await this.courtRepo.findById(courtId);
    if (!court) {
      throw createHttpError(404, 'Court not found');
    }

    // Convert date for comparison
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);

    //  reserved slots
    const reservedSlots = (court.reservations || [])
      .filter(reservation => {
        const resDate = new Date(reservation.date);
        resDate.setHours(0, 0, 0, 0);
        return resDate.getTime() === searchDate.getTime();
      })
      .map(reservation => reservation.slot as TIME_SLOTS);


    const allTimeSlots = Object.values(TIME_SLOTS);

    // Get available slots by excluding reserved slots
    const availableSlots = allTimeSlots.filter(
      (slot: TIME_SLOTS) => !reservedSlots.includes(slot)
    );

    const result: IAvailableSlots = { availableSlots, reservedSlots, totalAvailable: availableSlots.length, totalReserved: reservedSlots.length };
    if(!result || !result.availableSlots) {
      throw createHttpError(404, 'No available slots found');
    }

    return result;
  }
}