const onlineUsers: Record<string, string[]> = {};

export class OnlineUsersService {

  static getUserSockets(userId: string) {
    return onlineUsers[userId] || [];
  }

  static addSocket(userId: string, socketId: string) {
    if (!onlineUsers[userId]) {
      onlineUsers[userId] = [];
    }
    onlineUsers[userId].push(socketId);
    console.log(`User connected: ${userId}`);
  };

  static removeSocket(userId: string, socketId: string) {
    if (onlineUsers[userId]) {
      onlineUsers[userId] = onlineUsers[userId].filter(id => id !== socketId);
      if (onlineUsers[userId].length === 0) {
        delete onlineUsers[userId];
        console.log(`User fully disconnected: ${userId}`);
      }
      else {
        console.log(`Socket disconnected for user ${userId}, ${onlineUsers[userId].length} sockets remaining`);
      }
    }
  };
}