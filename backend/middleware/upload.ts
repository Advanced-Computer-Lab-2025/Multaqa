import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary';
import { Request } from 'express';

// Define storage configuration
const vendorStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    let folder = 'documents';
    
    if (file.fieldname === 'logo') {
      folder = 'vendor-logos';
    } else if (file.fieldname === 'taxCard') {
      folder = 'vendor-taxcards';
    }
    else if (file.fieldname === 'nationalId') {
      folder = 'vendor-nationalids';
    } else {
      throw new Error('Invalid field name for vendor upload');
    }
     
    return {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
      resource_type: 'auto' as 'auto' | 'image' | 'raw',
    };
  },
});

// Create multer instance with configuration
export const uploadFiles = multer({
  storage: vendorStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Validate file types
      const isImage = file.mimetype.startsWith('image/');
      const isPdf = file.mimetype === 'application/pdf';
      
      if (!isImage && !isPdf) {
        return cb(new Error('Tax card must be an image or PDF file'));
      }
    
    
    cb(null, true);
  }
}) 
