import { Router, Request, Response } from 'express';
import { AdministrationService } from '../services/adminService';
import { createAdminValidationSchema } from '../validation/auth.validation';
import createError from 'http-errors';
import { CreateAdminResponse, DeleteAdminResponse, GetAllAdminsResponse } from "../interfaces/responses/administrationResponses.interface";
import { authorizeRoles } from '../middleware/authorizeRoles.middleware';
import { UserRole } from '../constants/user.constants';
import { StaffMember } from '../schemas/stakeholder-schemas/staffMemberSchema';
import { StaffPosition } from '../constants/staffMember.constants';
import { AdministrationRoleType } from '../constants/administration.constants';

const router = Router();
const adminService = new AdministrationService();   

// Create admin/Event Office account
async function createAdmin(req: Request, res: Response<CreateAdminResponse>) {
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
      user: result
    });
  } catch (error: any) {
    throw createError(error.status || 500, error.message || 'Failed to create admin account');
  }
}

// Delete admin/Event Office account
async function deleteAdmin(req: Request, res: Response<DeleteAdminResponse>) {
  try {
    const { adminId } = req.params;

    // Get creator info from JWT token
    const creatorId = (req as any).user?.id;

    const result = await adminService.deleteAdminAccount(adminId, creatorId);

    res.json({
      success: true,
      message: result
    });
  } catch (error: any) {
    throw createError(error.status || 500, error.message || 'Failed to delete admin account');
  }
}

// Get all admin accounts (for listing)
async function getAllAdmins(req: Request, res: Response<GetAllAdminsResponse>) {
  try {
    const admins = await adminService.getAllAdminAccounts();

    res.json({
      success: true,
      data: admins
    });
  } catch (error: any) {
    throw createError(error.status || 500, error.message || 'Failed to fetch admin accounts');
  }
}

router.get('/', authorizeRoles({ userRoles: [UserRole.ADMINISTRATION], adminRoles: [AdministrationRoleType.ADMIN] }), getAllAdmins);
router.post('/',  authorizeRoles({ userRoles: [UserRole.ADMINISTRATION], adminRoles: [AdministrationRoleType.ADMIN] }), createAdmin);
router.delete('/:adminId', authorizeRoles({ userRoles: [UserRole.ADMINISTRATION], adminRoles: [AdministrationRoleType.ADMIN] }), deleteAdmin);

export default router;