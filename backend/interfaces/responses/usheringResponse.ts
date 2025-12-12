import { IReservedSlot, ISlot, IUshering } from "../models/ushering.interface";

export interface UsheringResponse {
    success: boolean;
    data: Partial<IUshering> | Partial<IUshering>[] | null;
    message: string;
}

export interface UsheringTeamsResponse {
    success: boolean;
    message: string;
}

export interface UsheringSlotResponse {
    success: boolean;
    data:ISlot[] | null;
    message: string;
}

export interface StudentBookedSlotsResponse {
    success: boolean;
    data: IReservedSlot | null
    message: string;
}

export interface UsheringPostTimeResponse {
    success: boolean;
    data: Date | null;
    message: string;
}