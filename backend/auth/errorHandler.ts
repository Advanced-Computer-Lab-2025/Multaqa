import {
  Request,
  Response,
  NextFunction,
  Router,
  RequestHandler,
} from "express";
import createError, { HttpError } from "http-errors";

// Error response type
interface ErrorResponse {
  success: boolean;
  error: string;
  statusCode: number;
  code?: string | number;
  type?: string;
  errors?: Array<{ field: string; message: string }>;
  stack?: string;
}

// Centralized error handler middleware using http-errors
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // If not an HttpError, convert to one
  const httpError: HttpError =
    err instanceof HttpError
      ? err
      : createError(err.status || 500, err.message || "Internal Server Error");
  const statusCode = httpError.status || 500;
  const message = httpError.message || "Internal Server Error";

  const type = httpError.name || "Error";
  const response: ErrorResponse = {
    success: false,
    error: message,
    statusCode,

    type,
  };
  if (process.env.NODE_ENV === "development") response.stack = err.stack;
  res.status(statusCode).json(response);
};

// Async handler wrapper for routes
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Router factory that auto-wraps all routes with asyncHandler
export const asyncRouter = (): Router => {
  const router = Router();
  const methods = ["get", "post", "put", "patch", "delete"] as const;
  methods.forEach((method) => {
    const original = (router[method] as Function).bind(router);
    (router as any)[method] = (path: string, ...handlers: RequestHandler[]) => {
      const wrappedHandlers = handlers.map((handler) =>
        handler.length === 4 ? handler : asyncHandler(handler as any)
      );
      return original(path, ...wrappedHandlers);
    };
  });
  return router;
};

// 404 handler using http-errors
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(createError(404, `Route ${req.originalUrl} not found`));
};
