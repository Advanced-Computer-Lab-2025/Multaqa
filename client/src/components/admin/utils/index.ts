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

export const handleCreateAccount = (
  values: AccountCreationFormValues,
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>,
  handleCloseCreate: () => void
) => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const createdDate = `${dd}/${mm}/${yyyy}`;

  const created: Account = {
    id: String(Date.now()),
    name: values.fullName,
    email: values.email,
    accountType: values.accountType as "Admin" | "Event Office",
    createdDate,
  };
  setAccounts((prev) => [created, ...prev]);
  handleCloseCreate();
};

export const handleDeleteAccount = (
  accountToDelete: Account,
  accounts: Account[],
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>,
  handleCloseDeleteModal: () => void
) => {
  if (accountToDelete) {
    // TODO: API call to delete account
    setAccounts(accounts.filter((acc) => acc.id !== accountToDelete.id));
    handleCloseDeleteModal();
  }
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
