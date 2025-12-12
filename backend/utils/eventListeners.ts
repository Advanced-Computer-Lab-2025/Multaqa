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
 * Ushering Notifications
 * -------------------------------
 */

// When an ushering team is updated -> notify students
eventBus.on("notification:ushering:teamUpdated", (notification, saveToDatabase) => {
  sendSocketNotification("notification:ushering:teamUpdated", notification, saveToDatabase);
});

// When an ushering team is deleted -> notify students
eventBus.on("notification:ushering:teamDeleted", (notification, saveToDatabase) => {
  sendSocketNotification("notification:ushering:teamDeleted", notification, saveToDatabase);
});

// When a student cancels their interview slot -> notify usher admins
eventBus.on("notification:ushering:slotCancelled", (notification, saveToDatabase) => {
  sendSocketNotification("notification:ushering:slotCancelled", notification, saveToDatabase);
});

// When new interview slots are added (after post time) -> notify students
eventBus.on("notification:ushering:slotsAdded", (notification, saveToDatabase) => {
  sendSocketNotification("notification:ushering:slotsAdded", notification, saveToDatabase);
});

// When a student books an interview slot -> notify usher admins
eventBus.on("notification:ushering:slotBooked", (notification, saveToDatabase) => {
  sendSocketNotification("notification:ushering:slotBooked", notification, saveToDatabase);
});

// When post time is updated -> notify students
eventBus.on("notification:ushering:postTimeUpdated", (notification, saveToDatabase) => {
  sendSocketNotification("notification:ushering:postTimeUpdated", notification, saveToDatabase);
});

// Broadcast message to all students
eventBus.on("notification:ushering:broadcastAll", (notification, saveToDatabase) => {
  sendSocketNotification("notification:ushering:broadcastAll", notification, saveToDatabase);
});

// Broadcast message to interview applicants only
eventBus.on("notification:ushering:broadcastApplicants", (notification, saveToDatabase) => {
  sendSocketNotification("notification:ushering:broadcastApplicants", notification, saveToDatabase);
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
