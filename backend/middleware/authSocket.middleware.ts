import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import createError from "http-errors";

export const authSocketMiddleware = (socket: Socket, next: (err?: any) => void) => {
  const token = socket.handshake.auth?.token;
  if (!token) 
    throw createError(401, "You are unauthorized for accessing this socket, missing token");
  
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { _id: string };
    socket.data.userId = decoded._id;
    next();
  } catch (err) {
    throw createError(403, "Invalid or expired token");
  }
};
