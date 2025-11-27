# Notifications Route Testing Guide

## Correct URL Format

The notifications page must include the **locale prefix** and your **entity role**:

### ✅ Correct URLs
```
http://localhost:3000/en/professor/notifications
http://localhost:3000/en/student/notifications
http://localhost:3000/en/admin/notifications
http://localhost:3000/en/events-office/notifications
http://localhost:3000/en/vendor/notifications
http://localhost:3000/en/ta/notifications
http://localhost:3000/en/staff/notifications
```

### ❌ Incorrect URLs (Won't Work)
```
http://localhost:3000/professor/notifications     ❌ Missing locale
http://localhost:3000/notifications               ❌ Missing locale and entity
http://localhost:3000/en/notifications            ❌ Missing entity
```

## How to Test

### Option 1: Manual URL Entry
1. Make sure you're **logged in** as a specific role (e.g., professor)
2. In the browser address bar, type:
   ```
   http://localhost:3000/en/professor/notifications
   ```
3. Press Enter
4. **Expected Result**: You should see the notifications page with tabs (All, Unread, Read)

### Option 2: Using the Notification Bell
1. Click the 🔔 bell icon in the **top right** corner
2. The dropdown will open showing recent notifications
3. Click **"View All Notifications"** button at the bottom
4. **Expected Result**: You'll be automatically navigated to your entity-scoped notifications page

## What You Should See

### With Notifications
- Tabs: All | Unread | Read
- Page Title: "Notifications"
- Subtitle: "View and manage all your notifications"
- List of notification cards with:
  - Icon (type-specific)
  - Title
  - Message
  - Timestamp
  - Delete button
  - Read/Unread badge

### With NO Notifications (Empty State)
- Tabs: All | Unread | Read (still visible)
- Page Title: "Notifications"
- Large 🔔 icon (grayed out)
- Message: "No Notifications"
- Subtitle: "You don't have any notifications yet."

**Important**: The page works **with or without** notifications present!

## Debugging

If the route doesn't work, check:

1. **Are you logged in?**
   - You must be authenticated to access entity routes
   - Try logging in first, then navigating to the notifications page

2. **Does the entity match your role?**
   - If you're logged in as a **student** but try to access `/en/professor/notifications`
   - The system will **redirect** you to `/en/student/notifications`
   - Always use the entity that matches your logged-in role

3. **Check browser console**
   - Open DevTools (F12)
   - Look for: `"✅ Notifications tab accessed for entity: professor"`
   - If you see this, the route is working correctly

4. **Check for redirects**
   - If you're being redirected, check the Network tab in DevTools
   - You might be logged in as a different role than expected

## Example User Flow

### As a Professor:
1. Login as professor → redirected to `/en/professor`
2. Navigate to `/en/professor/notifications` (manually or via bell)
3. See notifications page (even if empty)
4. Can filter, view, mark as read, or delete notifications

### As a Student:
1. Login as student → redirected to `/en/student`
2. Navigate to `/en/student/notifications` (manually or via bell)
3. See notifications page (even if empty)
4. Can filter, view, mark as read, or delete notifications

## Common Issues

### Issue: "Page not found" or blank page
**Solution**: Make sure you're including the locale (`/en/`) in the URL

### Issue: Redirected to a different entity
**Solution**: You're trying to access a different role's notifications. Use the entity that matches your logged-in role.

### Issue: Can't see any notifications
**Solution**: This is normal if you haven't received any notifications yet. The page still works and shows the empty state with "No Notifications" message.

### Issue: Route doesn't exist in navigation
**Solution**: The notifications route is accessed via:
- The notification bell dropdown (click "View All Notifications")
- Or by manually typing the full URL with locale and entity

The route is **not** in the sidebar navigation by design - it's accessed through the notification bell.

