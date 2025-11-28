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
import { api } from "@/api";

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
  const [isLoading, setIsLoading] = useState(false);
  const [canShowToasts, setCanShowToasts] = useState(false);

  // Computed unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      console.log("📥 Fetching notifications from API...");

      const response = await api.get("/users/notifications");

      if (response.data.success) {
        const fetchedNotifications = response.data.data || [];
        console.log(`✅ Fetched ${fetchedNotifications.length} notifications`);

        // Sort by newest first
        const sortedNotifications = fetchedNotifications.sort(
          (a: INotification, b: INotification) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setNotifications(sortedNotifications);
      }
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Handler for marking notification as read
  const markAsRead = useCallback((notificationId: string) => {
    console.log("📖 Marking notification as read:", notificationId);

    // Optimistically update local state
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n._id === notificationId ? { ...n, read: true } : n
      );
      return updated;
    });

    // Emit to backend
    socketService.emit("notification:read", { notificationId });
  }, []);

  // Handler for marking notification as unread
  const markAsUnread = useCallback((notificationId: string) => {
    console.log("📭 Marking notification as unread:", notificationId);

    // Optimistically update local state
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === notificationId ? { ...n, read: false } : n
      )
    );

    // Emit to backend
    socketService.emit("notification:unread", { notificationId });
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

    // Show toast notification only if toasts are enabled
    if (canShowToasts) {
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
    }
  }, [canShowToasts]);

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

  // Handle notification unread event from backend (sync across tabs)
  const handleNotificationUnread = useCallback(
    (data: { userId: string; notificationId: string }) => {
      console.log("📭 Notification unread event received:", data);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === data.notificationId ? { ...n, read: false } : n
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

  // Fetch notifications on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, fetchNotifications]);

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

    // Listen to read/unread/delete events for cross-tab sync
    socketService.on("notification:read", handleNotificationRead);
    socketService.on("notification:unread", handleNotificationUnread);
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
      socketService.off("notification:unread");
      socketService.off("notification:delete");
      socketService.disconnect();
    };
  }, [
    isAuthenticated,
    user,
    handleNewNotification,
    handleNotificationRead,
    handleNotificationUnread,
    handleNotificationDelete,
  ]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAsUnread,
        deleteNotification,
        markAllAsRead,
        isLoading,
        refetch: fetchNotifications,
        enableToasts: () => setCanShowToasts(true),
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


