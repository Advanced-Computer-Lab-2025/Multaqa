import eventBus from "./eventBus";
import { io } from "../app";
import { OnlineUsersService } from "../services/onlineUsersService";
import { UserRole } from "../constants/user.constants";
import { AdministrationRoleType } from "../constants/administration.constants";
import { StaffPosition } from "../constants/staffMember.constants";
import { UserService } from "../services/userService";

// Helper function to send a socket notification
function sendSocketNotification(notification: any) {
  if (!notification.userId && !notification.role && !notification.adminRole && !notification.staffPosition) {
    return;
  }

  if (notification.userId) {
    const sockets = OnlineUsersService.getUserSockets(notification.userId);
    sockets.forEach((socketId) => io.to(socketId).emit("notification:new", notification));
    return;
  }

  // Notify by roles
  let usersToNotify: string[] = [];

  const userService = new UserService();
  if (notification.role) {
    notification.role.forEach((role: UserRole) => {
      switch (role) {
        case UserRole.ADMINISTRATION:
          if (notification.adminRole) {
            switch (notification.adminRole) {
              case AdministrationRoleType.EVENTS_OFFICE:
                (async () => {
                  const eventsOfficeAdmins = await userService.getAllEventsOffice();
                  eventsOfficeAdmins.forEach((admin) => {
                    if (!usersToNotify.includes(String(admin._id))) {
                      usersToNotify.push(String(admin._id));
                    }
                  });
                })();
                break;
              case AdministrationRoleType.ADMIN:
                // Fetch all administration
                (async () => {
                  const allAdmins = await userService.getAllAdmins();
                  allAdmins.forEach((admin) => {
                    if (!usersToNotify.includes(String(admin._id))) {
                      usersToNotify.push(String(admin._id));
                    }
                  });
                })();
                break;
            }
          }
          break;
        case UserRole.STAFF_MEMBER:
          if (notification.staffPosition) {
            switch (notification.staffPosition) {
              case StaffPosition.PROFESSOR:
                (async () => {
                  const professors = await userService.getAllProfessors();
                  professors.forEach((professor) => {
                    if (!usersToNotify.includes(String(professor._id))) {
                      usersToNotify.push(String(professor._id));
                    }
                  });
                })();
                break;
              case StaffPosition.TA:
                (async () => {
                  const tas = await userService.getAllTAs();
                  tas.forEach((ta) => {
                    if (!usersToNotify.includes(String(ta._id))) {
                      usersToNotify.push(String(ta._id));
                    }
                  });
                })();
                break;
              case StaffPosition.STAFF:
                (async () => {
                  const staffMembers = await userService.getAllStaff();
                  staffMembers.forEach((staff) => {
                    if (!usersToNotify.includes(String(staff._id))) {
                      usersToNotify.push(String(staff._id));
                    }
                  });
                })();
                break;
            }
          }
          break;
        case UserRole.STUDENT:
          // Fetch all students
          (async () => {
            const students = await userService.getAllStudents();
            students.forEach((student) => {
              if (!usersToNotify.includes(String(student._id))) {
                usersToNotify.push(String(student._id));
              }
            });
          })();
          break;
      }
    });
  }
  
  usersToNotify.forEach((userId) => {
    const sockets = OnlineUsersService.getUserSockets(userId);
    sockets.forEach((socketId) => io.to(socketId).emit("notification:new", notification));
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
  sendSocketNotification(notification);
});

// When a professor's workshop is accepted/rejected -> notify professor
eventBus.on("notification:workshop:statusChanged", (notification) => {
  sendSocketNotification(notification);
});

/**
 * -------------------------------
 * Event Notifications 
 * -------------------------------
 */

// New events added -> notify everyone
eventBus.on("notification:event:new", (notification) => {
  sendSocketNotification(notification);
});

// Event reminders 1 day and 1 hour before -> notify attendees
eventBus.on("notification:event:reminder", (notification) => {
  sendSocketNotification(notification);
});

/**
 * -------------------------------
 * Loyalty Program Notifications
 * -------------------------------
 */
eventBus.on("notification:loyalty:newPartner", (notification) => {
  sendSocketNotification(notification);
});

/**
 * -------------------------------
 * Events Office/Admin Notifications
 * -------------------------------
 */

// Pending vendor requests -> notify EventsOffice/Admin
eventBus.on("notification:vendor:pendingRequest", (notification) => {
  sendSocketNotification(notification);
});


/**
 * -------------------------------
 * Generic notification events
 * -------------------------------
 */

// Mark notification as read
eventBus.on("notification:read", (notification) => {
  sendSocketNotification(notification);
});

// Delete notification
eventBus.on("notification:delete", (notification) => {
  sendSocketNotification(notification);
});

// Update notification
eventBus.on("notification:update", (notification) => {
  sendSocketNotification(notification);
});

// Fallback for new generic notifications
eventBus.on("notification:new", (notification) => {
  sendSocketNotification(notification);
});
