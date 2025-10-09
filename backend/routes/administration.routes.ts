import { Router, Request, Response } from 'express';
import { AdminService } from '../services/administrationService';
import { createAdminValidationSchema } from '../validation/auth.validation';
import createError from 'http-errors';

const router = Router();
const adminService = new AdminService();


// Missing: role authorization, only Admin should access this 


// Create admin/Event Office account
router.post('/create-admin', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { error, value } = createAdminValidationSchema.validate(req.body);
    if (error) {
      throw createError(400, 'Validation error', {
        errors: error.details.map(detail => detail.message)
      });
    }

    // Create admin account
    const result = await adminService.createAdminAccount(value);

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      data: result
    });
  } catch (error: any) {
    throw createError(error.status || 500, error.message || 'Failed to create admin account');
  }
});

// Delete admin/Event Office account
router.delete('/:adminId', async (req: Request, res: Response) => {
  try {
    const { adminId } = req.params;
    
    // Get creator info from JWT token
    const creatorId = (req as any).user?.id;

    const result = await adminService.deleteAdminAccount(adminId, creatorId);

    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    throw createError(error.status || 500, error.message || 'Failed to delete admin account');
  }
});

// Get all admin accounts (for listing)
router.get('/', async (req: Request, res: Response) => {
  try {
    const admins = await adminService.getAllAdminAccounts();

    res.json({
      success: true,
      data: admins
    });
  } catch (error: any) {
    throw createError(error.status || 500, error.message || 'Failed to fetch admin accounts');
  }
});

export default router;