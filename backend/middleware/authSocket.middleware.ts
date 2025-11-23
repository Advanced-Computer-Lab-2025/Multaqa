import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import createError from "http-errors";

export const authSocketMiddleware = (socket: Socket, next: (err?: any) => void) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token)
      throw createError(401, "You are unauthorized for accessing this socket, missing token");

    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw createError(500, "ACCESS_TOKEN_SECRET is not defined in environment variables");
    }

    const decoded = jwt.verify(token, secret) as { _id: string };
    socket.data.userId = decoded._id;
    next();
  } catch (err) {
    return next(createError(403, "Invalid or expired token"));
  }
};
