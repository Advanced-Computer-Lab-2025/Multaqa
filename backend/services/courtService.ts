import GenericRepo from "../repos/genericRepo";
import { ICourt } from "../interfaces/models/court.interface";
import { Court } from "../schemas/court-schema/courtSchema";
import { TIME_SLOTS } from "../constants/court.constants";
import { IAvailableSlots } from "../interfaces/models/court.interface";
import createHttpError from "http-errors";

export class CourtService {
  private courtRepo: GenericRepo<ICourt>;

  constructor() {
    this.courtRepo = new GenericRepo<ICourt>(Court);
  }

  async getDayAvailableTimeSlots(courtId: string, date: string): Promise<IAvailableSlots> {

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
    if (!result || !result.availableSlots) {
      throw createHttpError(404, 'No available slots found');
    }

    return result;
  }

  async getAllCourtsAvailability(): Promise<Array<{ court: ICourt; availability: IAvailableSlots; date: string }>> {
    // Get today's date
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayString = `${year}-${month}-${day}`;

    // Get all courts
    const courts = await this.courtRepo.findAll();

    if (!courts || courts.length === 0) {
      throw createHttpError(404, 'No courts found');
    }

    const allTimeSlots = Object.values(TIME_SLOTS);

    // Map each court to include its availability for today
    const courtsWithAvailability = courts.map(court => {
      // Get reserved slots for today
      const reservedSlots = (court.reservations || [])
        .filter(reservation => {
          console.log('Reservation date from DB:', reservation.date);

          const resDate = new Date(reservation.date);
          const resYear = resDate.getFullYear();
          const resMonth = String(resDate.getMonth() + 1).padStart(2, '0');
          const resDay = String(resDate.getDate()).padStart(2, '0');
          const resDateString = `${resYear}-${resMonth}-${resDay}`;

          console.log('Formatted reservation date:', resDateString);

          return resDateString === todayString;
        })
        .map(reservation => reservation.slot as TIME_SLOTS);

      // Get available slots by excluding reserved slots
      const availableSlots = allTimeSlots.filter(
        (slot: TIME_SLOTS) => !reservedSlots.includes(slot)
      );

      const availability: IAvailableSlots = {
        availableSlots,
        reservedSlots,
        totalAvailable: availableSlots.length,
        totalReserved: reservedSlots.length
      };

      return {
        court,
        availability,
        date: todayString
      };
    });

    return courtsWithAvailability;
  }

}