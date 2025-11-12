import { IFileInfo } from '../fileData.interface';  

export interface FileUploadResponse {       
    success: boolean;
    data:IFileInfo
    message: string;
}

export interface FileDeleteResponse {
    success: boolean;
    message: string;
}
