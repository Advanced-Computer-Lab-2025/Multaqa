import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import createError from "http-errors";

export const authSocketMiddleware = (socket: Socket, next: (err?: any) => void) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      console.error("❌ Socket auth failed: No token provided");
      return next(createError(401, "You are unauthorized for accessing this socket, missing token"));
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      console.error("❌ Socket auth failed: ACCESS_TOKEN_SECRET not configured");
      return next(createError(500, "ACCESS_TOKEN_SECRET is not defined in environment variables"));
    }

    const decoded = jwt.verify(token, secret) as { id: string };
    
    if (!decoded.id) {
      console.error("❌ Socket auth failed: Token payload missing id");
      return next(createError(403, "Invalid token payload"));
    }
    
    socket.data.userId = decoded.id;
    console.log(`✅ Socket authenticated for user: ${decoded.id}`);
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      console.error("❌ Socket auth failed: Invalid token -", err.message);
      return next(createError(403, "Invalid token"));
    } else if (err instanceof jwt.TokenExpiredError) {
      console.error("❌ Socket auth failed: Token expired");
      return next(createError(403, "Token expired"));
    }
    console.error("❌ Socket auth failed:", err);
    return next(createError(403, "Authentication failed"));
  }
};
