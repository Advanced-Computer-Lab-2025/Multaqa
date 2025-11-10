export type UserType = "university-member" | "vendor";
export interface RegistrationFormProps {
  UserType: UserType;
}
export type UploadStatus = "idle" | "uploading" | "success" | "error";
