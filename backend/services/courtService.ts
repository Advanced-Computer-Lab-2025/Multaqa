
import mongoose from 'mongoose';
import GenericRepo from "../repos/genericRepo";
import { ICourt } from "../interfaces/models/court.interface";
import { Court } from "../schemas/court-schema/courtSchema";
import {  TIME_SLOTS } from "../constants/court.constants";


export class CourtService {
  private courtRepo: GenericRepo<ICourt>;
  
  constructor() {
    this.courtRepo = new GenericRepo<ICourt>(Court);
  }

  async getAvailableTimeSlots(courtId: string, date: string) {
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }

    
    const court = await this.courtRepo.findById(courtId);
    
    if (!court) {
      throw new Error('Court not found');
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

    return { 
      availableSlots,
      reservedSlots,
      totalAvailable: availableSlots.length,
      totalReserved: reservedSlots.length
    };
  }
}