import * as Yup from "yup";
import { rigorousValidationSchema } from "@/components/shared/input-fields/schemas";
import {
  User,
  Account,
  Applicant,
  AccountCreationFormValues,
  UserCreationFormValues,
} from "../types";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { api } from "@/api";
import { CreateAdminResponse, DeleteAdminResponse, GetAllAdminsResponse } from "../../../../../backend/interfaces/responses/administrationResponses.interface";

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
    const response = await api.post<CreateAdminResponse>("/admins", {
      name: values.fullName,
      email: values.email,
      password: values.password,
      role: mapAccountTypeToRole(values.accountType),
    });

    const createdAdmin = response.data.user;
    const newAccount: Account = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      id: (createdAdmin as any)._id || (createdAdmin as any).id,
      name: createdAdmin.name || "",
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
    name: values.fullName,
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

export const handleToggleBlock = (
  userId: string,
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
) => {
  // TODO: API call to update user status
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
};
