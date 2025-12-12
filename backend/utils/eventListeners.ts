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
import { save } from "pdfkit";

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

// Helper function to add a notification to a user's notifications array if it does not already exist
async function addNotificationToUser(userId: string, notification: Notification, saveToDatabase: boolean = true) {
  try {
    const userRepo = new GenericRepository<IUser>(User);
    const user = await userRepo.findById(userId);
    if (!user) {
      console.error(`User ${userId} not found`);
      return null;
    }

    const sockets = OnlineUsersService.getUserSockets(userId);
    const isOnline = sockets.length > 0;

    console.log(`📬 Adding notification to user ${userId}: ${notification.title}`);
    user.notifications.push({
      type: notification.type,
      title: notification.title || '',
      message: notification.message || '',
      read: false,
      delivered: isOnline,
      createdAt: new Date()
    } as INotification);

    await user.save();

    return user.notifications[user.notifications.length - 1]._id;
  } catch (error) {
    console.error(`Failed to add notification to user ${userId}:`, error);
    return null;
  }
}


async function sendSocketNotification(typeNotification: string, notification: Notification, saveToDatabase: boolean = true) {
  try {
    if (!notification.userId && !notification.role) {
      return;
    }

    // Notify specific user
    if (notification.userId) {
      try {
        let notificationWithId = notification;
        if (saveToDatabase) {
          const notificationId = await addNotificationToUser(notification.userId, notification);
          notificationWithId = {
            ...notification,
            _id: notificationId?.toString()
          };
        }
        const sockets = OnlineUsersService.getUserSockets(notification.userId);
        sockets.forEach((socketId) => io.to(socketId).emit(typeNotification, notificationWithId));
      } catch (error: any) {
        throw createError(500, "Error sending socket notification to specific user:", error);
      }
      return;
    }

    // Notify by roles
    if (notification.role) {

      const usersToNotifySet = new Set<string>();
      const userService = new UserService();
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
      if (notification.role.includes(UserRole.USHER_ADMIN)) {
        promises.push(userService.getAllUsherAdmins());
      }

      // Await all promises and collect user IDs
      const results = await Promise.all(promises);
      results.forEach((userArray) => {
        userArray.forEach((user) => {
          usersToNotifySet.add(String(user._id));
        });
      });


      // Convert Set to Array for iteration
      const usersToNotify = Array.from(usersToNotifySet);

      // Process notifications for all users
      for (const userId of usersToNotify) {
        let notificationWithId = notification;
        if (saveToDatabase) {
          const notificationId = await addNotificationToUser(userId, notification);
          notificationWithId = {
            ...notification,
            _id: notificationId?.toString()
          };
        }
        const sockets = OnlineUsersService.getUserSockets(userId);
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
eventBus.on("notification:workshop:requestSubmitted", (notification, saveToDatabase) => {
  sendSocketNotification("notification:workshop:requestSubmitted", notification, saveToDatabase);
});

// When a professor's workshop is accepted/rejected -> notify professor
eventBus.on("notification:workshop:statusChanged", (notification, saveToDatabase) => {
  sendSocketNotification("notification:workshop:statusChanged", notification, saveToDatabase);
});

/**
 * -------------------------------
 * Event Notifications 
 * -------------------------------
 */

// New events added -> notify everyone
eventBus.on("notification:event:new", (notification, saveToDatabase) => {
  sendSocketNotification("notification:event:new", notification, saveToDatabase);
});

// Event reminders 1 day and 1 hour before -> notify attendees
eventBus.on("notification:event:reminder", (notification, saveToDatabase) => {
  sendSocketNotification("notification:event:reminder", notification, saveToDatabase);
});

/**
 * -------------------------------
 * Loyalty Program Notifications
 * -------------------------------
 */

// newly added partners in GUC loyalty program -> notify Student/Staff/TA/Professor
eventBus.on("notification:loyalty:newPartner", (notification, saveToDatabase) => {
  sendSocketNotification("notification:loyalty:newPartner", notification, saveToDatabase);
});

/**
 * -------------------------------
 * Events Office/Admin Notifications
 * -------------------------------
 */

// Pending vendor requests -> notify EventsOffice/Admin
eventBus.on("notification:vendor:pendingRequest", (notification, saveToDatabase) => {
  sendSocketNotification("notification:vendor:pendingRequest", notification, saveToDatabase);
});


/**
 * -------------------------------
 * Comment Moderation Notifications
 * -------------------------------
 */
// Flagged comments -> notify Admins
eventBus.on("notification:comment:flagged", (notification, saveToDatabase) => {
  sendSocketNotification("notification:comment:flagged", notification, saveToDatabase);
});

/**
 * -------------------------------
 * Bug Report Notifications
 * -------------------------------
 */
// Bug report submitted -> notify Admins
eventBus.on("notification:bugReport:submitted", (notification, saveToDatabase) => {
  sendSocketNotification("notification:bugReport:submitted", notification, saveToDatabase);
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
eventBus.on("notification:new", (notification, saveToDatabase) => {
  sendSocketNotification("notification:new", notification, saveToDatabase);
});
