import createError from 'http-errors';
import cloudinary from '../config/cloudinary';

export async function deleteCloudinaryFile(publicId: string): Promise<void> {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error(`Error deleting ${publicId}:`, error);
       throw createError(500, 'Failed to delete file from Cloudinary');
    }
}