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

// Helper function to send a socket notification
async function sendSocketNotification(typeNotification: string, notification: Notification) {
  if (!notification.userId && !notification.role && !notification.adminRole && !notification.staffPosition) {
    return;
  }

  const userRepo = new GenericRepository<IUser>(User);

  // Notify specific user
  if (notification.userId) {
    const sockets = OnlineUsersService.getUserSockets(notification.userId);
    const isOnline = sockets.length > 0;

    // Add notification to user's notifications array
    const user = await userRepo.findById(notification.userId);
    if (user) {
      user.notifications.push({
        type: typeNotification,
        title: notification.title || '',
        message: notification.message || '',
        read: false,
        delivered: isOnline,
        createdAt: new Date()
      } as INotification);
      await user.save();
    }

    sockets.forEach((socketId) => io.to(socketId).emit(typeNotification, notification));
    return;
  }

  // Notify by roles
  let usersToNotify: string[] = [];

  const userService = new UserService();
  if (notification.role) {
    if (notification.role.includes(UserRole.ADMINISTRATION)) {
      if (notification.adminRole) {
        if (notification.adminRole.includes(AdministrationRoleType.EVENTS_OFFICE)) {
          (async () => {
            const eventsOfficeAdmins = await userService.getAllEventsOffice();
            eventsOfficeAdmins.forEach((admin) => {
              if (!usersToNotify.includes(String(admin._id))) {
                usersToNotify.push(String(admin._id));
              }
            });
          })();
        }
        if (notification.adminRole.includes(AdministrationRoleType.ADMIN)) {
          (async () => {
            const allAdmins = await userService.getAllAdmins();
            allAdmins.forEach((admin) => {
              if (!usersToNotify.includes(String(admin._id))) {
                usersToNotify.push(String(admin._id));
              }
            });
          })();
        }
      }
    }
    if (notification.role.includes(UserRole.STAFF_MEMBER)) {
      if (notification.staffPosition) {
        if (notification.staffPosition.includes(StaffPosition.PROFESSOR)) {
          (async () => {
            const professors = await userService.getAllProfessors();
            professors.forEach((professor) => {
              if (!usersToNotify.includes(String(professor._id))) {
                usersToNotify.push(String(professor._id));
              }
            });
          })();
        }
        if (notification.staffPosition.includes(StaffPosition.TA)) {
          (async () => {
            const tas = await userService.getAllTAs();
            tas.forEach((ta) => {
              if (!usersToNotify.includes(String(ta._id))) {
                usersToNotify.push(String(ta._id));
              }
            });
          })();
        }
        if (notification.staffPosition.includes(StaffPosition.STAFF)) {
          (async () => {
            const staffMembers = await userService.getAllStaff();
            staffMembers.forEach((staff) => {
              if (!usersToNotify.includes(String(staff._id))) {
                usersToNotify.push(String(staff._id));
              }
            });
          })();
        }
      }
    }
    if (notification.role.includes(UserRole.STUDENT)) {
      (async () => {
        const students = await userService.getAllStudents();
        students.forEach((student) => {
          if (!usersToNotify.includes(String(student._id))) {
            usersToNotify.push(String(student._id));
          }
        });
      })();
    }
  }

  usersToNotify.forEach(async (userId) => {
    const sockets = OnlineUsersService.getUserSockets(userId);
    const isOnline = sockets.length > 0;

    // Add notification to user's notifications array
    const user = await userRepo.findById(userId);
    if (user) {
      user.notifications.push({
        type: typeNotification,
        title: notification.title || '',
        message: notification.message || '',
        read: false,
        delivered: isOnline,
        createdAt: new Date()
      } as INotification);
      await user.save();
    }

    sockets.forEach((socketId) => io.to(socketId).emit(typeNotification, notification));
  });
  return;
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

// Mark notification as read
eventBus.on("notification:read", (notification) => {
  sendSocketNotification("notification:read", notification);
});

// Fallback for new generic notifications
eventBus.on("notification:new", (notification) => {
  sendSocketNotification("notification:new", notification);
});
