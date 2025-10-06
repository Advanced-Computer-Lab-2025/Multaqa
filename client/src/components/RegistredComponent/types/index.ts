export interface RegisterBoxProps {
  name?: string;
  id?: string;
  email?: string;
  registrationDate?: string;
  role?: string;
  onRoleChange?: (role: string) => void;
}

export interface TruncatedTextProps {
  children: string;
  maxChars?: number;
  fontSize: string;
  fontWeight: string;
}