import eventBus from "./eventBus";
import { io } from "../app";
import { OnlineUsersService } from "../services/onlineUsersService";
import { UserRole } from "../constants/user.constants";
import { AdministrationRoleType } from "../constants/administration.constants";
import { StaffPosition } from "../constants/staffMember.constants";
import { UserService } from "../services/userService";
import { Notification } from "../services/notificationService";
import GenericRepository from "../repos/genericRepo";
import { User } from "../schemas/stakeholder-schemas/userSchema";
import { INotification, IUser } from "../interfaces/models/user.interface";
import createError from "http-errors";

// Helper function to broadcast events to all user's sockets (for sync events like read/unread/delete)
function broadcastToUserSockets(userId: string, eventName: string, data: any) {
  try {
    const sockets = OnlineUsersService.getUserSockets(userId);
    console.log(`📡 Broadcasting ${eventName} to ${sockets.length} socket(s) for user ${userId}`, data);
    sockets.forEach((socketId) => {
      io.to(socketId).emit(eventName, data);
    });
  } catch (error) {
    console.error(`Failed to broadcast ${eventName} to user ${userId}:`, error);
  }
}

async function sendSocketNotification(typeNotification: string, notification: Notification) {
  try {
    if (!notification.userId && !notification.role && !notification.adminRole && !notification.staffPosition) {
      return;
    }

    const userRepo = new GenericRepository<IUser>(User);

    // Notify specific user
    if (notification.userId) {
      try {
        const sockets = OnlineUsersService.getUserSockets(notification.userId);
        const isOnline = sockets.length > 0;

        // Add notification to user's notifications array
        const user = await userRepo.findById(notification.userId);
        if (user) {
          user.notifications.push({
            type: notification.type,
            title: notification.title || '',
            message: notification.message || '',
            read: false,
            delivered: isOnline,
            createdAt: new Date()
          } as INotification);
          await user.save();
          
          // Get the newly created notification with its _id
          const newNotification = user.notifications[user.notifications.length - 1];
          const notificationWithId = {
            ...notification,
            _id: (newNotification._id as any)?.toString(),
          };
          
          sockets.forEach((socketId) => io.to(socketId).emit(typeNotification, notificationWithId));
        }
      } catch (error: any) {
        throw createError(500, "Error sending socket notification to specific user:", error);
      }
      return;
    }

    // Notify by roles
    const usersToNotifySet = new Set<string>();

    const userService = new UserService();
    if (notification.role) {
      const promises: Promise<any[]>[] = [];

      if (notification.role.includes(UserRole.ADMINISTRATION)) {
        if (notification.adminRole) {
          if (notification.adminRole.includes(AdministrationRoleType.EVENTS_OFFICE)) {
            promises.push(userService.getAllEventsOffice());
          }
          if (notification.adminRole.includes(AdministrationRoleType.ADMIN)) {
            promises.push(userService.getAllAdmins());
          }
        }
      }
      if (notification.role.includes(UserRole.STAFF_MEMBER)) {
        if (notification.staffPosition) {
          if (notification.staffPosition.includes(StaffPosition.PROFESSOR)) {
            promises.push(userService.getAllProfessors());
          }
          if (notification.staffPosition.includes(StaffPosition.TA)) {
            promises.push(userService.getAllTAs());
          }
          if (notification.staffPosition.includes(StaffPosition.STAFF)) {
            promises.push(userService.getAllStaff());
          }
        }
      }
      if (notification.role.includes(UserRole.STUDENT)) {
        promises.push(userService.getAllStudents());
      }

      // Await all promises and collect user IDs
      const results = await Promise.all(promises);
      results.forEach((userArray) => {
        userArray.forEach((user) => {
          usersToNotifySet.add(String(user._id));
        });
      });
    }

    // Convert Set to Array for iteration
    const usersToNotify = Array.from(usersToNotifySet);

    // Process notifications for all users
    for (const userId of usersToNotify) {
      const sockets = OnlineUsersService.getUserSockets(userId);
      const isOnline = sockets.length > 0;

      // Add notification to user's notifications array
      const user = await userRepo.findById(userId);
      if (user) {
        user.notifications.push({
          type: notification.type,
          title: notification.title || '',
          message: notification.message || '',
          read: false,
          delivered: isOnline,
          createdAt: new Date()
        } as INotification);
        await user.save();
        
        // Get the newly created notification with its _id
        const newNotification = user.notifications[user.notifications.length - 1];
        const notificationWithId = {
          ...notification,
          _id: (newNotification._id as any)?.toString(),
        };
        
        sockets.forEach((socketId) => io.to(socketId).emit(typeNotification, notificationWithId));
      }
    }
    return;
  } catch (error) {
    console.error(`Failed to send socket notification [${typeNotification}]:`, error);
  }
}

/**
 * -------------------------------
 * Professor Notifications
 * -------------------------------
 */

// When professors submit workshop requests -> notify EventsOffice
eventBus.on("notification:workshop:requestSubmitted", (notification) => {
  sendSocketNotification("notification:workshop:requestSubmitted", notification);
});

// When a professor's workshop is accepted/rejected -> notify professor
eventBus.on("notification:workshop:statusChanged", (notification) => {
  sendSocketNotification("notification:workshop:statusChanged", notification);
});

/**
 * -------------------------------
 * Event Notifications 
 * -------------------------------
 */

// New events added -> notify everyone
eventBus.on("notification:event:new", (notification) => {
  sendSocketNotification("notification:event:new", notification);
});

// Event reminders 1 day and 1 hour before -> notify attendees
eventBus.on("notification:event:reminder", (notification) => {
  sendSocketNotification("notification:event:reminder", notification);
});

/**
 * -------------------------------
 * Loyalty Program Notifications
 * -------------------------------
 */
eventBus.on("notification:loyalty:newPartner", (notification) => {
  sendSocketNotification("notification:loyalty:newPartner", notification);
});

/**
 * -------------------------------
 * Events Office/Admin Notifications
 * -------------------------------
 */

// Pending vendor requests -> notify EventsOffice/Admin
eventBus.on("notification:vendor:pendingRequest", (notification) => {
  sendSocketNotification("notification:vendor:pendingRequest", notification);
});


/**
 * -------------------------------
 * Generic notification events
 * -------------------------------
 */

// Mark notification as read - broadcast to all user's sockets for cross-tab sync
eventBus.on("notification:read", (data: { userId: string; notification: any }) => {
  const { userId, notification } = data;
  const notificationId = (notification._id as any)?.toString();
  broadcastToUserSockets(userId, "notification:read", { userId, notificationId });
});

// Mark notification as unread - broadcast to all user's sockets for cross-tab sync
eventBus.on("notification:unread", (data: { userId: string; notification: any }) => {
  const { userId, notification } = data;
  const notificationId = (notification._id as any)?.toString();
  broadcastToUserSockets(userId, "notification:unread", { userId, notificationId });
});

// Delete notification - broadcast to all user's sockets for cross-tab sync
eventBus.on("notification:delete", (data: { userId: string; notificationId: string }) => {
  const { userId, notificationId } = data;
  broadcastToUserSockets(userId, "notification:delete", { userId, notificationId });
});

// Fallback for new generic notifications
eventBus.on("notification:new", (notification) => {
  sendSocketNotification("notification:new", notification);
});
