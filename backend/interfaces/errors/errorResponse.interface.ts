export interface ErrorResponse {
  success: boolean;
  error: string;
  statusCode: number;
  code?: string | number;
  type?: string;
  errors?: Array<{ field: string; message: string }>;
  stack?: string;
}