import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { Router } from 'express';
import { uploadFiles } from '../middleware/upload';
import { deleteCloudinaryFile } from '../utils/cloudinaryCleanup';

export const router = Router();

async function uploadTaxCard(req: Request, res: Response) {

    const taxCard: Express.Multer.File | undefined = req.file;
  try {
    if (!taxCard) {
      throw createError(400, 'Tax card is required for vendor signup');
    }
   
    res.status(200).json({
      success: true,
      data: {
        taxCard: {
          url: taxCard.path,
          publicId: taxCard.filename,
          originalName: taxCard.originalname,
          uploadedAt: new Date()
        }
      }
    });
  } catch (error: any) {
    if(taxCard && taxCard.filename){
      await deleteCloudinaryFile(taxCard.filename);
    }
    throw createError(
      error.status || 500, 
      error.message || 'Tax card upload failed'
    );
  }
}

async function uploadLogo(req: Request, res: Response) {
    const logo: Express.Multer.File | undefined = req.file;
 try {
    if (!logo) {
      throw createError(400, 'Logo is required for vendor signup');
    }
   
    res.status(200).json({
      success: true,
      data: {
            logo: {
              url: logo.path,
              publicId: logo.filename,
              originalName: logo.originalname,
              uploadedAt: new Date()
            }
        }
    });

  } catch (error: any) {
    if(logo && logo.filename){
      await deleteCloudinaryFile(logo.filename);
    }

    throw createError(
      error.status || 500,
      error.message || 'Logo upload failed'
    );
  }
}



async function deleteFile(req: Request, res: Response) {
    const { publicId } = req.body;
    try {
        if (!publicId) {
            throw createError(400, 'publicId is required to delete a file');
        }
        await deleteCloudinaryFile(publicId);
        res.status(200).json({
            success: true,
            message: 'File deleted successfully'
        });
    } catch (error: any) {
        throw createError(
            error.status || 500,
            error.message || 'File deletion failed'
        );
    }
}

router.post('/taxCard', uploadFiles.single('taxCard'), uploadTaxCard);
router.post('/logo', uploadFiles.single('logo'), uploadLogo);
router.delete('/deletefile', deleteFile);

export default router;