import {
  Request,
  Response,
  NextFunction,
  Router,
  RequestHandler,
} from "express";
import createError, { HttpError } from "http-errors";
import { MongooseError } from "mongoose";
import { ErrorResponse} from "../interfaces/errors/errorResponse.interface";


// Centralized error handler middleware using http-errors
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Handle Mongoose ValidationError
  if (err?.name === "ValidationError" && err.errors) {
    const errors = Object.values(err.errors).map((e: any) => ({
      field: e.path,
      message: e.message,
    }));
    const response: ErrorResponse = {
      success: false,
      error: "Validation Error",
      statusCode: 400,
      type: "MongooseValidationError",
      errors,
    };
    if (process.env.NODE_ENV === "development") response.stack = err.stack;
    res.status(400).json(response);
  }

  // Handle Mongoose CastError (e.g., invalid ObjectId)
  if (err?.name === "CastError") {
    const response: ErrorResponse = {
      success: false,
      error: `Invalid value for field '${err.path}': ${err.value}`,
      statusCode: 400,
      type: "MongooseCastError",
    };
    if (process.env.NODE_ENV === "development") response.stack = err.stack;
    res.status(400).json(response);
  }

  // Handle Mongoose duplicate key error
  if (err?.code === 11000) {
    const fields = Object.keys(err.keyValue || {});
    const response: ErrorResponse = {
      success: false,
      error: `Duplicate value for field(s): ${fields.join(", ")}`,
      statusCode: 409,
      type: "MongooseDuplicateKeyError",
    };
    if (process.env.NODE_ENV === "development") response.stack = err.stack;
    res.status(409).json(response);
  }

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
