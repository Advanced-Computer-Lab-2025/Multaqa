import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private readonly SOCKET_URL = "http://localhost:4000";

  /**
   * Initialize socket connection with JWT token
   */
  connect(token: string): Socket {
    if (this.socket?.connected) {
      console.log("✅ Socket already connected");
      return this.socket;
    }

    console.log("🔌 Connecting to socket server...");

    this.socket = io(this.SOCKET_URL, {
      auth: {
        token,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
    });

    this.socket.on("error", (error) => {
      console.error("❌ Socket error:", error);
    });

    return this.socket;
  }

  /**
   * Disconnect socket
   */
  disconnect(): void {
    if (this.socket) {
      console.log("🔌 Disconnecting socket...");
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Get current socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Reconnect with new token (e.g., after token refresh)
   */
  reconnect(token: string): void {
    this.disconnect();
    this.connect(token);
  }

  /**
   * Register event listener
   */
  on(event: string, callback: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  /**
   * Remove event listener
   */
  off(event: string, callback?: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  /**
   * Emit event to server
   */
  emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn("⚠️ Socket not connected. Cannot emit event:", event);
    }
  }
}

// Export singleton instance
export const socketService = new SocketService();


