# Notification System Implementation

## Overview

A complete real-time notification system has been implemented using Socket.io, integrating seamlessly with the existing backend infrastructure. The system supports all 6 notification types and provides a beautiful, user-friendly interface.

## Features Implemented

### ✅ Real-Time Notifications
- Socket.io integration with JWT authentication
- Automatic reconnection on token refresh
- Cross-tab synchronization (mark as read/delete syncs across all tabs)
- Undelivered notification delivery on connection

### ✅ 6 Notification Types Supported
1. **Workshop Request Submitted** - Events Office receives notifications when professors submit workshop requests
2. **Workshop Status Changed** - Professors receive notifications when their workshops are accepted/rejected
3. **Event New** - All users receive notifications for newly added events
4. **Event Reminder** - Registered users receive reminders 1 day and 1 hour before events
5. **Loyalty New Partner** - All users receive notifications for new GUC loyalty partners
6. **Vendor Pending Request** - Events Office/Admin receive notifications for pending vendor requests

### ✅ UI Components
- **Notification Bell** - Badge with unread count in top navigation (left side, next to back button)
- **Notification Dropdown** - Quick access to recent 5 notifications
- **Dedicated Notifications Page** - Full list with filtering (All, Unread, Read)
- **Toast Notifications** - Real-time popup notifications with title and message
- **Empty States** - Friendly messages when no notifications exist

### ✅ User Actions
- Mark individual notifications as read
- Mark all notifications as read
- Delete individual notifications
- Click unread notification to mark as read
- View all notifications on dedicated page

## File Structure

```
client/src/
├── services/
│   └── socketService.ts              # Socket.io singleton service
├── context/
│   └── NotificationContext.tsx       # Notification state management & socket listeners
├── types/
│   └── notifications.ts              # TypeScript interfaces and enums
├── providers/
│   └── ClientProvider.tsx            # Updated with NotificationProvider
├── components/
│   ├── notifications/
│   │   ├── NotificationBell.tsx      # Bell icon with badge
│   │   ├── NotificationDropdown.tsx  # Dropdown menu component
│   │   ├── NotificationItem.tsx      # Reusable notification item
│   │   ├── utils.ts                  # Helper functions
│   │   └── index.ts                  # Barrel export
│   └── layout/
│       └── TopNavigation.tsx         # Updated with NotificationBell
└── app/
    └── [locale]/
        ├── layout.tsx                # Root layout (cleaned up)
        └── notifications/
            └── page.tsx              # Full notifications page
```

## How It Works

### 1. Socket Connection
When a user logs in:
1. JWT token is stored in localStorage
2. Socket connects with token for authentication
3. Backend verifies token and adds user to online users
4. Backend sends all undelivered notifications
5. Socket listens for all 6 notification event types

### 2. Receiving Notifications
When a notification is triggered:
1. Backend emits event to appropriate users (by userId or role)
2. NotificationContext receives the event
3. Notification is added to state
4. Toast notification appears (title + message)
5. Badge count updates
6. Notification is stored in user's notifications array in database

### 3. User Interactions
**Mark as Read:**
- User clicks notification → Frontend updates state optimistically
- Socket emits "notification:read" to backend
- Backend updates database and broadcasts to all user's sockets (cross-tab sync)

**Delete:**
- User clicks delete → Frontend removes from state optimistically
- Socket emits "notification:delete" to backend
- Backend removes from database and broadcasts to all user's sockets

### 4. Cross-Tab Synchronization
If a user has multiple tabs open:
- Reading/deleting in one tab syncs to all tabs
- Handled by backend broadcasting events to all sockets for that user

## Integration with Backend

### Backend Socket Events Listened To:
```typescript
// Incoming notifications
"notification:workshop:requestSubmitted"
"notification:workshop:statusChanged"
"notification:event:new"
"notification:event:reminder"
"notification:loyalty:newPartner"
"notification:vendor:pendingRequest"

// Cross-tab sync events
"notification:read"
"notification:delete"
```

### Frontend Socket Events Emitted To Backend:
```typescript
// User actions
socket.emit("notification:read", { notificationId })
socket.emit("notification:delete", { notificationId })
```

## Design Decisions

1. **No API Endpoint Needed** - Relies entirely on socket's automatic undelivered notification delivery on connection
2. **Optimistic Updates** - UI updates immediately before backend confirmation for better UX
3. **Toast + Badge** - Dual notification approach (visual popup + persistent badge)
4. **Reusable Components** - NotificationItem works in both dropdown and full page
5. **MUI Components** - Consistent with existing design system
6. **Color Coding** - Each notification type has a unique color for easy identification

## Usage

### In Any Component
```tsx
import { useNotifications } from "@/context/NotificationContext";

function MyComponent() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    deleteNotification,
    markAllAsRead 
  } = useNotifications();

  // Use the notification data...
}
```

### Notification Structure
```typescript
interface INotification {
  _id?: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  delivered: boolean;
  createdAt: Date;
}
```

## Testing the System

### 1. Workshop Request Submitted
- As a Professor, submit a workshop request
- Events Office should receive a notification

### 2. Workshop Status Changed
- As Events Office, accept/reject a workshop
- Professor should receive a notification

### 3. Event New
- Create a new event as Events Office
- All users should receive a notification

### 4. Event Reminder
- Register for an event
- Wait until 1 day or 1 hour before event
- Should receive reminder notification

### 5. Loyalty New Partner
- Add a new loyalty partner (if functionality exists)
- All users should receive a notification

### 6. Vendor Pending Request
- Submit a vendor request
- Events Office/Admin should receive a notification

## Dependencies Added

```json
{
  "socket.io-client": "^4.x.x" // Installed via npm
}
```

## Notes

- Toast notifications use existing `react-toastify` (already in dependencies)
- Socket connects only when user is authenticated
- Socket disconnects on logout
- Token refresh triggers socket reconnection
- All notifications stored in user's notifications array in MongoDB
- Delivered status tracks if notification was sent to online user
- Read status tracks if user has read the notification

## Future Enhancements (Optional)

1. Notification preferences (enable/disable specific types)
2. Email notifications for offline users
3. Notification sound effects
4. Bulk delete notifications
5. Search/filter notifications by type
6. Export notifications
7. Notification statistics/analytics

## Troubleshooting

**Socket not connecting:**
- Check that backend is running on localhost:4000
- Verify JWT token exists in localStorage
- Check browser console for socket errors

**Notifications not appearing:**
- Verify socket is connected (check console logs)
- Ensure user role matches notification target
- Check that NotificationProvider wraps the app

**Toast not showing:**
- Verify ToastContainer is rendered in ClientProviders
- Check that react-toastify CSS is imported

**Cross-tab sync not working:**
- Backend must emit events to all user's sockets
- Check that userId is correctly extracted from socket

