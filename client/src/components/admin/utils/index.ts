import * as Yup from "yup";
import { rigorousValidationSchema } from "@/components/shared/input-fields/schemas";
import {
  User,
  Account,
  Applicant,
  AccountCreationFormValues,
  UserCreationFormValues,
  UserRole,
} from "../types";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { api } from "@/api";
import { CreateAdminResponse, GetAllAdminsResponse } from "../../../../../backend/interfaces/responses/administrationResponses.interface";
import { AxiosError } from "axios";
import { GetAllUnAssignedStaffMembersResponse, GetAllUsersResponse, GetAllProfessorsResponse, GetAllStaffResponse, GetAllTAsResponse } from "../../../../../backend/interfaces/responses/userResponses.interface";
import { capitalizeName } from "../../shared/input-fields/utils";

export const userCreationSchema = Yup.object().shape({
  fullName: rigorousValidationSchema.fields.fullName,
  email: rigorousValidationSchema.fields.email,
  password: rigorousValidationSchema.fields.password,
  confirmPassword: rigorousValidationSchema.fields.confirmPassword,
  userRole: Yup.string().required("User role is required"),
});

export const accountCreationSchema = Yup.object().shape({
  fullName: rigorousValidationSchema.fields.fullName,
  email: rigorousValidationSchema.fields.email,
  password: rigorousValidationSchema.fields.password,
  confirmPassword: rigorousValidationSchema.fields.confirmPassword,
  accountType: Yup.string().required("Account type is required"),
});

// Map frontend account type to backend role type
const mapAccountTypeToRole = (accountType: string): string => {
  return accountType === "Admin" ? "admin" : "eventsOffice";
};

// Map backend role type to frontend account type
const mapRoleToAccountType = (roleType: string): "Admin" | "Event Office" => {
  return roleType === "admin" ? "Admin" : "Event Office";
};

// Format date from ISO string to DD/MM/YYYY
const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

// Fetch all admin accounts
export const fetchAdminAccounts = async (): Promise<Account[]> => {
  try {
    const response = await api.get<GetAllAdminsResponse>("/admins");
    const admins = response.data.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return admins.map((admin: any) => ({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      accountType: mapRoleToAccountType(admin.roleType),
      createdDate: formatDate(admin.registeredAt),
    }));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch admin accounts";
    console.error("Failed to fetch admin accounts:", error);
    throw new Error(errorMessage);
  }
};

// Create admin account
export const handleCreateAccount = async (
  values: AccountCreationFormValues,
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>,
  handleCloseCreate: () => void
) => {
  try {
    const normalizedFullName = capitalizeName(String(values.fullName ?? ""), false);

    const response = await api.post<CreateAdminResponse>("/admins", {
      name: normalizedFullName,
      email: values.email,
      password: values.password,
      role: mapAccountTypeToRole(values.accountType),
    });

    const createdAdmin = response.data.user;
    const newAccount: Account = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      id: (createdAdmin as any)._id || (createdAdmin as any).id,
      name: capitalizeName(String(createdAdmin.name || ""), false),
      email: createdAdmin.email || "",
      accountType: mapRoleToAccountType(createdAdmin.roleType || ""),
      createdDate: formatDate(createdAdmin.registeredAt?.toString() || new Date().toISOString()),
    };

    setAccounts((prev) => [newAccount, ...prev]);
    handleCloseCreate();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create admin account";
    console.error("Failed to create admin account:", error);
    throw new Error(errorMessage);
  }
};

// Delete admin account
export const handleDeleteAccount = async (
  accountToDelete: Account,
  accounts: Account[],
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>,
  handleCloseDeleteModal: () => void
) => {
  if (accountToDelete) {
    try {
      await api.delete(`/admins/${accountToDelete.id}`);
      setAccounts(accounts.filter((acc) => acc.id !== accountToDelete.id));
      handleCloseDeleteModal();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete admin account";
      console.error("Failed to delete admin account:", error);
      throw new Error(errorMessage);
    }
  }
};

export const handleCreateUser = (
  values: UserCreationFormValues,
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  handleCloseCreate: () => void
) => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const createdDate = `${dd}/${mm}/${yyyy}`;

  const created: User = {
    id: String(Date.now()),
    name: capitalizeName(String(values.fullName ?? ""), false),
    email: values.email,
    role: values.userRole as User["role"],
    status: "Active",
    createdDate,
  };
  setUsers((prev) => [created, ...prev]);
  handleCloseCreate();
};

export const handleDragStart = (
  event: DragStartEvent,
  setActiveId: React.Dispatch<React.SetStateAction<string | null>>
) => {
  setActiveId(event.active.id as string);
};

export const assignToRole = (
  roleKey: string,
  user: Applicant,
  setAssigned: React.Dispatch<
    React.SetStateAction<Record<string, Applicant[]>>
  >,
  setApplicants: React.Dispatch<React.SetStateAction<Applicant[]>>
) => {
  setAssigned((prev) => ({
    ...prev,
    [roleKey]: [...(prev[roleKey] || []), user],
  }));
  setApplicants((prev) => prev.filter((a) => a.id !== user.id));
};

export const handleDragEnd = (
  event: DragEndEvent,
  setActiveId: React.Dispatch<React.SetStateAction<string | null>>,
  applicants: Applicant[],
  roleKeys: readonly string[],
  setAssigned: React.Dispatch<
    React.SetStateAction<Record<string, Applicant[]>>
  >,
  setApplicants: React.Dispatch<React.SetStateAction<Applicant[]>>
) => {
  const { active, over } = event;
  setActiveId(null);

  if (!over) return;

  const draggedUserId = active.id as string;
  const targetRole = over.id as string;

  if (roleKeys.includes(targetRole)) {
    const draggedUser = applicants.find((a) => a.id === draggedUserId);
    if (draggedUser) {
      assignToRole(targetRole, draggedUser, setAssigned, setApplicants);
    }
  }
};

export const handleToggleBlock = async (
  userId: string,
  currentStatus: "Active" | "Blocked",
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
) => {
  try {
    const action = currentStatus === "Active" ? "block" : "unblock";
    console.log(`🔒 ${action === "block" ? "Blocking" : "Unblocking"} user:`, userId);

    const response = await api.post(`/users/${userId}/${action}`);

    console.log('✅ Action successful:', response.data.message);

    // Update local state
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
            ...user,
            status: user.status === "Active" ? "Blocked" : "Active",
          }
          : user
      )
    );
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error('❌ Failed to toggle block status:', errorMessage);
      throw new Error(errorMessage);
    }
    if (error instanceof Error) {
      console.error('❌ Failed to toggle block status:', error.message);
      throw new Error(error.message);
    }
    throw new Error("Failed to toggle block status");
  }
};

// Fetch all users
export const fetchAllUsers = async (): Promise<User[]> => {
  try {
    console.log('📋 Fetching all users...');

    const response = await api.get<GetAllUsersResponse>('/users');
    const users = response.data.data;

    console.log(`✅ Found ${users.length} user(s)`);

    // Map backend data to User interface
    return users.map((user: any) => ({
      id: user._id,
      name: user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.name || 'Unknown',
      email: user.email,
      role: mapBackendRoleToFrontend(user.role, user.position, user.roleType) as UserRole,
      status: user.status === 'active' ? 'Active' : 'Blocked',
      createdDate: formatDate(user.registeredAt || user.createdAt || new Date().toISOString()),
      registeredAt: user.registeredAt,
      verifiedAt: user.verifiedAt,
      updatedAt: user.updatedAt,
    }));
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error('❌ Failed to fetch users:', errorMessage);
      throw new Error(errorMessage);
    }
    if (error instanceof Error) {
      console.error('❌ Failed to fetch users:', error.message);
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch users");
  }
};

// Map backend role to frontend UserRole
function mapBackendRoleToFrontend(role: string, position?: string, roleType?: string): string {
  if (role === 'staffMember') {
    if (position === 'TA') return 'TA';
    if (position === 'professor') return 'Professor';
    if (position === 'staff') return 'Staff';
    return 'Staff';
  }
  if (role === 'student') return 'Student';
  if (role === 'administration') {
    if (roleType === 'admin') return 'Admin';
    if (roleType === 'eventsOffice') return 'Event Office';
    return 'Admin';
  }
  if (role === 'vendor') return 'Vendor';
  return 'Student'; // default
}

// Fetch unassigned staff members
export const fetchUnassignedStaff = async (): Promise<Applicant[]> => {
  try {
    console.log('📋 Fetching unassigned staff members...');

    const response = await api.get<GetAllUnAssignedStaffMembersResponse>('/users/unassigned-staff');
    const staffMembers = response.data.data;

    console.log(`✅ Found ${staffMembers.length} unassigned staff member(s)`);

    // Map backend data to Applicant interface
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return staffMembers.map((staff: any) => ({
      id: staff._id,
      name: `${staff.firstName} ${staff.lastName}`,
      email: staff.email,
      gucId: staff.gucId,
      registrationDate: formatDate(staff.registeredAt || staff.createdAt || new Date().toISOString()),
    }));
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error('❌ Failed to fetch unassigned staff:', errorMessage);
      throw new Error(errorMessage);
    }
    if (error instanceof Error) {
      console.error('❌ Failed to fetch unassigned staff:', error.message);
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch unassigned staff");
  }
};

// Fetch all TAs
export const fetchAllTAs = async (): Promise<Applicant[]> => {
  try {
    console.log('📋 Fetching all TAs...');
    const response = await api.get<GetAllTAsResponse>('/users/tas');
    const tas = response.data.data;

    console.log(`✅ Found ${tas.length} TA(s)`);

    // Map backend data to Applicant interface
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return tas.map((ta: any) => ({
      id: ta._id,
      name: `${ta.firstName} ${ta.lastName}`,
      email: ta.email,
      gucId: ta.gucId,
      registrationDate: formatDate(ta.registeredAt || ta.createdAt || new Date().toISOString()),
    }));
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error('❌ Failed to fetch all TAs:', errorMessage);
      throw new Error(errorMessage);
    }
    if (error instanceof Error) {
      console.error('❌ Failed to fetch all TAs:', error.message);
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch all TAs");
  }
};

// Fetch all Professors
export const fetchAllProfessors = async (): Promise<Applicant[]> => {
  try {
    console.log('📋 Fetching all Professors...');
    const response = await api.get<GetAllProfessorsResponse>('/users/professors');
    const professors = response.data.data;
    console.log(`✅ Found ${professors.length} Professor(s)`);

    // Map backend data to Applicant interface
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return professors.map((professor: any) => ({
      id: professor._id,
      name: `${professor.firstName} ${professor.lastName}`,
      email: professor.email,
      gucId: professor.gucId,
      registrationDate: formatDate(professor.registeredAt || professor.createdAt || new Date().toISOString()),
    }));
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error('❌ Failed to fetch all Professors:', errorMessage);
      throw new Error(errorMessage);
    }
    if (error instanceof Error) {
      console.error('❌ Failed to fetch all Professors:', error.message);
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch all Professors");
  }
};

// Fetch all Staff
export const fetchAllStaff = async (): Promise<Applicant[]> => {
  try {
    console.log('📋 Fetching all Staff...');
    const response = await api.get<GetAllStaffResponse>('/users/staff');
    const staff = response.data.data;

    console.log(`✅ Found ${staff.length} Staff member(s)`);

    // Map backend data to Applicant interface
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return staff.map((staffMember: any) => ({
      id: staffMember._id,
      name: `${staffMember.firstName} ${staffMember.lastName}`,
      email: staffMember.email,
      gucId: staffMember.gucId,
      registrationDate: formatDate(staffMember.registeredAt || staffMember.createdAt || new Date().toISOString()),
    }));
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.error || error.message;
      console.error('❌ Failed to fetch all Staff:', errorMessage);
      throw new Error(errorMessage);
    }
    if (error instanceof Error) {
      console.error('❌ Failed to fetch all Staff:', error.message);
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch all Staff");
  }
};

// Assign role to a user
export const handleAssignRole = async (
  userId: string,
  position: string,
  applicant: Applicant,
  setAssigned: React.Dispatch<React.SetStateAction<Record<string, Applicant[]>>>,
  setApplicants: React.Dispatch<React.SetStateAction<Applicant[]>>
) => {
  try {
    console.log('👤 Assigning role:', { userId, position });

    const response = await api.post(`/users/${userId}/assign-role`, {
      position: position, // Backend expects : TA, professor, staff
    });

    console.log('✅ Role assigned successfully:', response.data.message);

    // Keep the optimistic update that was already done
    // The assignment was already moved visually, we just confirm it worked

    return response.data;
  } catch (error: unknown) {
    // If it fails, revert the optimistic update
    let errorMessage = "Failed to assign role";

    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.error || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error('❌ Failed to assign role:', errorMessage);

    // Revert: move applicant back to pending
    setAssigned((prev) => ({
      ...prev,
      [position]: prev[position].filter((a) => a.id !== applicant.id),
    }));
    setApplicants((prev) => [...prev, applicant]);

    throw new Error(errorMessage);
  }
};
