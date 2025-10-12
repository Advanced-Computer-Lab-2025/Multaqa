import React from "react";

export type UserRole =
  | "Student"
  | "Staff"
  | "TA"
  | "Professor"
  | "Admin"
  | "Event Office"
  | "Vendor";

export type UserStatus = "Active" | "Blocked";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdDate: string;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  registrationDate?: string;
  avatar?: string;
}

export type AccountType = "Admin" | "Event Office";

export interface Account {
  id: string;
  name: string;
  email: string;
  accountType: AccountType;
  createdDate: string;
}

export interface AccountCreationFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountType: string;
}

export interface UserCreationFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userRole: string;
}

export interface ManagementScreenProps<T> {
  pageTitle: string;
  pageSubtitle: string;
  boxTitle: string;
  boxSubtitle: string;
  boxIcon: React.ReactNode;
  borderColor: string;
  createButtonLabel?: string;
  createButtonIcon?: React.ReactNode;
  onOpenCreate?: () => void;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  noItemsMessage: string;
  noItemsSubtitle: string;
  gridColumns?: {
    xs?: string;
    md?: string;
    lg?: string;
  };
}
