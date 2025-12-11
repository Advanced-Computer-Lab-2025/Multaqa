import { IUshering } from "../models/ushering.interface";

export interface UsheringResponse {
    success: boolean;
    data: Partial<IUshering> | Partial<IUshering>[] | null;
    message: string;
}

export interface UsheringTeamsResponse {
    success: boolean;
    message: string;
}