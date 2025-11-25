"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { socketService } from "@/services/socketService";
import { useAuth } from "./AuthContext";
import {
  INotification,
  NotificationContextType,
} from "@/types/notifications";
import { toast } from "react-toastify";

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<INotification[]>([]);

  // Computed unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handler for marking notification as read
  const markAsRead = useCallback((notificationId: string) => {
    console.log("📖 Marking notification as read:", notificationId);
    
    // Optimistically update local state
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === notificationId ? { ...n, read: true } : n
      )
    );

    // Emit to backend
    socketService.emit("notification:read", { notificationId });
  }, []);

  // Handler for deleting notification
  const deleteNotification = useCallback((notificationId: string) => {
    console.log("🗑️ Deleting notification:", notificationId);
    
    // Optimistically update local state
    setNotifications((prev) => prev.filter((n) => n._id !== notificationId));

    // Emit to backend
    socketService.emit("notification:delete", { notificationId });
  }, []);

  // Handler for marking all as read
  const markAllAsRead = useCallback(() => {
    console.log("📖 Marking all notifications as read");
    
    const unreadNotifications = notifications.filter((n) => !n.read);
    
    // Optimistically update local state
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    // Emit each unread notification to backend
    unreadNotifications.forEach((notification) => {
      if (notification._id) {
        socketService.emit("notification:read", { notificationId: notification._id });
      }
    });
  }, [notifications]);

  // Handle incoming notifications
  const handleNewNotification = useCallback((notification: INotification) => {
    console.log("🔔 New notification received:", notification);
    
    // Add notification to state (sort by newest first)
    setNotifications((prev) => [notification, ...prev]);

    // Show toast notification
    toast.info(
      <div>
        <strong>{notification.title}</strong>
        <p style={{ fontSize: "0.875rem", marginTop: "0.25rem" }}>
          {notification.message}
        </p>
      </div>,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    );
  }, []);

  // Handle notification read event from backend (sync across tabs)
  const handleNotificationRead = useCallback(
    (data: { userId: string; notificationId: string }) => {
      console.log("📖 Notification read event received:", data);
      
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === data.notificationId ? { ...n, read: true } : n
        )
      );
    },
    []
  );

  // Handle notification delete event from backend (sync across tabs)
  const handleNotificationDelete = useCallback(
    (data: { userId: string; notificationId: string }) => {
      console.log("🗑️ Notification delete event received:", data);
      
      setNotifications((prev) =>
        prev.filter((n) => n._id !== data.notificationId)
      );
    },
    []
  );

  // Setup socket connection and listeners
  useEffect(() => {
    if (!isAuthenticated || !user) {
      console.log("⏸️ User not authenticated yet, skipping socket connection");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.log("⏸️ No token found, skipping socket connection");
      return;
    }

    console.log("🔌 Setting up socket connection for notifications...");

    // Connect socket
    socketService.connect(token);

    // Listen to all notification events
    socketService.on(
      "notification:workshop:requestSubmitted",
      handleNewNotification
    );
    socketService.on(
      "notification:workshop:statusChanged",
      handleNewNotification
    );
    socketService.on("notification:event:new", handleNewNotification);
    socketService.on("notification:event:reminder", handleNewNotification);
    socketService.on("notification:loyalty:newPartner", handleNewNotification);
    socketService.on(
      "notification:vendor:pendingRequest",
      handleNewNotification
    );

    // Listen to read/delete events for cross-tab sync
    socketService.on("notification:read", handleNotificationRead);
    socketService.on("notification:delete", handleNotificationDelete);

    // Cleanup on unmount
    return () => {
      console.log("🔌 Cleaning up socket listeners...");
      socketService.off("notification:workshop:requestSubmitted");
      socketService.off("notification:workshop:statusChanged");
      socketService.off("notification:event:new");
      socketService.off("notification:event:reminder");
      socketService.off("notification:loyalty:newPartner");
      socketService.off("notification:vendor:pendingRequest");
      socketService.off("notification:read");
      socketService.off("notification:delete");
      socketService.disconnect();
    };
  }, [
    isAuthenticated,
    user,
    handleNewNotification,
    handleNotificationRead,
    handleNotificationDelete,
  ]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        deleteNotification,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};


