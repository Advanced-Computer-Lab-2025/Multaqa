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
    console.log('📝 Incoming create admin request:', {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
    });

    // Validate request body 
    const { error, value } = createAdminValidationSchema.validate(req.body);
    if (error) {
      console.error('❌ Validation error:', error.details.map(detail => detail.message));
      throw createError(400, 'Validation error', {
        errors: error.details.map(detail => detail.message)
      });
    }

    // Create admin account
    const result = await adminService.createAdminAccount(value);

    console.log('✅ Admin account created successfully:', {
      id: (result as any)._id,
      name: result.name,
      email: result.email,
      roleType: result.roleType
    });

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      user: result
    });
  } catch (error: any) {
    console.error('❌ Failed to create admin:', error.message);
    throw createError(error.status || 500, error.message || 'Failed to create admin account');
  }
}

// Delete admin/Event Office account
async function deleteAdmin(req: Request, res: Response<DeleteAdminResponse>) {
  try {
    const { adminId } = req.params;
    console.log('🗑️  Delete admin request for ID:', adminId);

    // Get creator info from JWT token
    const creatorId = (req as any).user?.id;

    const result = await adminService.deleteAdminAccount(adminId, creatorId);

    console.log('✅ Admin deleted successfully:', result);

    res.json({
      success: true,
      message: result
    });
  } catch (error: any) {
    console.error('❌ Failed to delete admin:', error.message);
    throw createError(error.status || 500, error.message || 'Failed to delete admin account');
  }
}

// Get all admin accounts (for listing)
async function getAllAdmins(req: Request, res: Response<GetAllAdminsResponse>) {
  try {
    console.log('📋 Fetching all admin accounts...');
    const admins = await adminService.getAllAdminAccounts();

    console.log(`✅ Found ${admins.length} admin account(s)`);

    res.json({
      success: true,
      data: admins
    });
  } catch (error: any) {
    console.error('❌ Failed to fetch admins:', error.message);
    throw createError(error.status || 500, error.message || 'Failed to fetch admin accounts');
  }
}

router.get('/', authorizeRoles({ userRoles: [UserRole.ADMINISTRATION], adminRoles: [AdministrationRoleType.ADMIN] }), getAllAdmins);
router.post('/', authorizeRoles({ userRoles: [UserRole.ADMINISTRATION], adminRoles: [AdministrationRoleType.ADMIN] }), createAdmin);
router.delete('/:adminId', authorizeRoles({ userRoles: [UserRole.ADMINISTRATION], adminRoles: [AdministrationRoleType.ADMIN] }), deleteAdmin);

export default router;