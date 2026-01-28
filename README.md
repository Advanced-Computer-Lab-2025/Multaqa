# Multaqa 🎓

> **A Comprehensive University Event Management Platform for the German University in Cairo (GUC)**

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-green)

## 🛠 Tech Stack

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![Gmail](https://img.shields.io/badge/Gmail_API-EA4335?style=for-the-badge&logo=gmail&logoColor=white)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Motivation](#-motivation)
- [Backend Features & Architecture](#-backend-features--architecture)
- [Extra Features](#-extra-features-our-innovations)
- [User Roles & Capabilities](#-user-roles--capabilities)
- [API Routes](#-api-routes)
- [Environment Configuration](#-environment-configuration)
- [Setup & Installation](#-setup--installation)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [Agile Development](#agile-development)
- [Team Members](#team-members)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Project Overview

**Multaqa** (ملتقى - Arabic for "meeting place") is a full-stack university event management platform built for the German University in Cairo (GUC). It connects students, staff, professors, TAs, and external vendors through a unified system for discovering, registering, and managing campus events, from academic workshops and conferences to trips, bazaars, vendor booths, gym sessions, court reservations, and ushering interviews.

### Project Details

- **Course:** Advanced Computer Lab (CSEN 704)
- **Semester:** Winter 2025
- **Institution:** German University in Cairo
- **Instructor:** Assoc. Prof. Mervat Abuelkheir

---

## 💡 Motivation

Managing university events at GUC traditionally involved scattered communication channels, manual registration via spreadsheets and emails, and limited visibility into upcoming activities. Students often missed events they would have loved to attend, while organizers struggled with capacity management, payment collection, and attendee tracking.

Multaqa was built to solve these challenges by providing a **centralized hub** where the entire campus community can discover, register for, and manage events seamlessly. The platform brings together students, professors, TAs, staff, external vendors, and administrators under one unified system with:

- **Streamlined Registration** — One-click signup with integrated wallet and card payments
- **Real-time Notifications** — Instant updates on event changes, waitlist promotions, and reminders
- **Role-based Access Control** — Tailored experiences for different user types
- **Comprehensive Analytics** — Data-driven insights for organizers to improve future events
- **Automated Workflows** — waitlist promotions, certificate generation, and refund processing

---

## 🛠️ Backend Features & Architecture

### 🔐 Authentication & Security

- **JWT Authentication**: Secure access and refresh tokens with automatic renewal
- **Email Verification**: 24-hour token expiry with automated verification emails
- **Role-Based Authorization**: 6-tier permission system with middleware protection
- **Password Security**: Bcrypt hashing with salt rounds
- **Redis Token Whitelist**: Fast shared storage for valid refresh tokens with revocation capability for enhanced security

### 🔔 Real-time Notifications System

- **Socket.IO Integration**: WebSocket connections for instant push notifications
- **Cross-Tab Synchronization**: Notifications sync across all open browser tabs
- **20+ Notification Types**: Event reminders, waitlist updates, workshop status, ushering alerts
- **Persistent Storage**: MongoDB persistence ensures no missed notifications
- **Background Schedulers**: Automated reminders and deadline notifications

### 💳 Payment Processing Engine

- **Digital Wallet**: Built-in wallet for students and staff with balance tracking
- **Stripe Integration**: Secure checkout sessions for paid events
- **Hybrid Payments**: Combine wallet balance with card payments
- **Automatic Refunds**: Smart refund system to wallet when removed from events
- **Transaction History**: Complete payment and refund tracking

### 📧 Email Automation System

- **Gmail API Integration**: Professional email delivery with OAuth2 authentication and refresh token management
- **15+ Email Templates**: Comprehensive coverage for all user interactions and edge cases
- **Multi-Scenario Coverage**: 
  - **Authentication Flow**: Email verification, role assignments, account status changes
  - **Event Management**: Registration confirmations, waitlist notifications, payment receipts, certificate delivery
  - **Moderation & Safety**: Comment deletion warnings, account suspension notifications
  - **Vendor Operations**: Application status updates, QR code delivery for external visitors
  - **Interview System**: Booking confirmations, slot opening reminders, interview reminders
  - **Facility Bookings**: Gym session changes, court reservation confirmations
  - **Bug Reporting**: Developer notifications, status updates, resolution confirmments

### ☁️ Document Storage & Management

- **Cloudinary Integration**: Secure cloud storage with automatic optimization and transformation
- **Document Types Supported**:
  - **Vendor Documentation**: Tax cards, business licenses, company logos
  - **Event Media**: Event banners, promotional images, workshop materials
  - **User Assets**: Profile pictures, uploaded attachments
  - **Generated Content**: QR codes, certificates, system-generated graphics
- **Automatic Optimization**: Image compression, format conversion, and responsive delivery
- **Secure Access Control**: Direct upload capabilities with validation and access restrictions

### 📊 QR Code Generation Engine

- **QRCode Library Integration**: Dynamic QR code generation for multiple use cases
- **Generated QR Types**:
  - **External Visitor Access**: Unique QR codes for bazaar and career fair attendees
  - **Event Check-ins**: Quick registration verification and attendance tracking
  - **Vendor Operations**: Booth access codes and customer interaction tracking
- **Automatic Distribution**: QR codes embedded in email templates and delivered to recipients
- **Format Support**: PNG generation with customizable size and error correction levels

### 📄 PDF Document Generation

- **PDFKit Integration**: Professional PDF creation for certificates and reports
- **Generated Documents**:
  - **Certificates of Attendance**: Automated workshop completion certificates with participant details
  - **Bug Reports**: Formatted technical reports with reproduction steps and environment details
  - **Event Summaries**: Comprehensive event documentation for administrators
- **Dynamic Content**: Template-based generation with variable data injection
- **Professional Formatting**: Consistent styling, logos, signatures, and layout structure

### 📈 Excel Export System

- **ExcelJS Integration**: Comprehensive spreadsheet generation for data analysis
- **Export Categories**:
  - **Event Analytics**: Attendee lists with registration details, payment status, and demographics
  - **Bug Report Analytics**: Complete bug tracking data with status, severity, and resolution metrics
  - **Financial Reports**: Payment transactions, refund tracking, and revenue analysis
  - **User Management**: User lists with roles, status, and activity metrics
  - **Vendor Reports**: Application status, participation history, and performance data
- **Advanced Formatting**: Headers, filters, conditional formatting, and data validation
- **Real-time Generation**: On-demand export with current data snapshots

### ⚡ Smart Conflict Detection System

- **Gym Session Management**: 
  - **Time Slot Validation**: Prevents double-booking of gym facilities and trainers
  - **Capacity Monitoring**: Real-time tracking prevents over-enrollment in fitness classes
- **Vendor Booth Conflicts**: 
  - **Collision Detection Engine**: Automatic identification of overlapping booth requests
  - **Fair Resolution Process**: Democratic vendor selection through automated polling system
- **Court Reservation Logic**: 
  - **Multi-Sport Scheduling**: Prevents conflicts between tennis, basketball, and football court bookings

---


## 🌟 Extra Features (Our Innovations)

These 5 features were designed and implemented from scratch by our team:

### 📅 Google Calendar Integration
- OAuth2 authentication with Google Calendar API
- One-click sync of registered events to personal calendar
- Automatic removal when unregistering from events

### ⏳ Waitlist & Auto-Promotion System
- FIFO (First-In-First-Out) waitlist queue
- **Free events**: Instant auto-registration when slot opens
- **Paid events**: Configurable payment deadline with email reminders
- Background scheduler running every minute for promotions

### 🤖 AI Comment Analyzer & Toxicity Detector
- Powered by Google Gemini 2.0 Flash
- Detects: Insults, Threats, Profanity, Hate Speech
- Multi-language support: English, Arabic, Franco-Arabic (Arabizi)
- Automatic admin flagging with score threshold (>0.7)
- Admin review workflow with false-positive marking

### 🎫 Ushering & Interview System
- Team-based structure with customizable interview slots
- One booking per student across all teams (atomic booking)
- Configurable post time windows for slot availability
- 24-hour and 5-minute automated reminders
- Admin broadcast messaging to all students or applicants

### 🐛 Bug Reporting System
- Comprehensive report submission (steps, expected/actual behavior, environment)
- Status tracking: Pending → Resolved
- PDF report generation and email to developers
- Excel export of all bug reports
- Two-way notifications (user ↔ admin)

---

## 👥 User Roles & Capabilities

### 🎓 Student

- **Account Management**: Sign up with GUC email, receive verification emails, login/logout securely
- **Event Discovery**: Browse, search by name/type, filter by location/date/professor, sort by date
- **Event Registration**: Register for workshops/trips/conferences using student ID
- **Payment Processing**: Pay via Stripe (credit/debit card), digital wallet, or both combined, receive email receipts
- **Digital Wallet**: Top up balance, view transaction history, receive automatic refunds
- **Event Management**: View registered events (upcoming/past), cancel with 2-week notice for refunds
- **Reviews & Feedback**: Rate and comment on attended events, receive warnings for inappropriate content
- **Favorites System**: Add events to favorites list, view and manage favorites
- **Facility Booking**: Reserve tennis, basketball, football courts with time slots
- **Fitness Classes**: View monthly gym schedules, register for sessions (Yoga, Pilates, Zumba, etc.)
- **Certificates**: Receive automatic certificates of attendance via email upon workshop completion
- **Vendor Interaction**: Vote in vendor booth selection polls, view GUC loyalty program partners with discounts
- **Calendar Sync**: Connect Google Calendar for automatic event synchronization
- **Bug Reporting**: Submit detailed bug reports with reproduction steps and environment details
- **Ushering Applications**: Apply for interview slots across available teams
- **Waitlist Management**: Join waitlists and receive auto-promotion notifications

### 👨‍🏫 Staff Member (Professor/TA/Staff)

- **All Student Capabilities**: Complete access to student features and functionality
- **Role Assignment Process**: Admin assigns specific roles (Staff/TA/Professor) after registration, then verification emails are sent
- **Workshop Creation** (Professor): Create and submit workshops for approval
- **Workshop Management** (Professor): Edit workshop details, view participant lists and remaining spots
- **Workshop Status Tracking** (Professor): View submission status, requested edits, and approval notifications

### 🏪 External Vendor

- **Account Setup**: Sign up with company email, upload tax card and logo for validity verification
- **Bazaar Applications**: Apply for bazaar participation with attendee details (max 5 people), booth size (2x2/4x4)
- **Platform Booth Applications**: Apply for platform booths (1-4 weeks duration) using interactive map, specify booth size and attendee details
- **Documentation Management**: Upload IDs of all attending individuals for entire event duration
- **Payment Processing**: Pay participation fees upon acceptance (location/duration-based), receive email receipts
- **Application Tracking**: View upcoming participations (accepted), monitor pending/rejected requests
- **Booth Operations**: Receive QR codes for registered visitors, manage booth logistics
- **GUC Loyalty Program**: Apply with discount rates, promo codes, terms & conditions; cancel participation
- **Cancellation Rights**: Cancel participation requests before payment deadline (3 days post-acceptance)

### 🏢 Events Office

- **Event Creation & Management**:
  - **Bazaars**: Create with name, dates, location, description, registration deadline
  - **Trips**: Create with location, price, dates, description, capacity, deadline
  - **Conferences**: Create with agenda, website link, budget, funding source, resources
- **Event Operations**: Edit event details (before start date), archive past events, delete events (if no registrations)
- **Workshop Workflow**: Receive notifications for submissions, approve/reject/request edits, publish approved workshops
- **Vendor Management**:
  - View/download vendor documents and application details
  - Accept/reject vendor participation requests with notifications
  - Create vendor polls for booth location conflicts with automated collision detection
- **Attendee Management**: Export registration lists to Excel, restrict events to specific user types
- **External Access**: Generate QR codes for external visitors to bazaars and career fairs
- **Gym Operations**: Create sessions (date, time, type, capacity), cancel/edit sessions with participant notifications
- **Analytics & Reporting**: View attendance reports, sales revenue, filter by event type/date, sort by revenue

### 👑 Admin

- **User Management**: 
  - View all users with details and status (active/blocked)
  - Block/unblock users with notification system
  - Assign correct roles for Staff/TA/Professor registrations
- **Account Administration**: Create/delete admin and Events Office accounts with credentials
- **Content Moderation**: Review AI-flagged toxic comments, delete inappropriate content
- **Event Oversight**: Delete any event (if no registrations), access all event management features
- **Vendor Operations**: Process vendor applications, view documents, accept/reject requests
- **System Management**: Bug report tracking, send bug reports to developers, and mark bugs as resolved
- **Analytics & Reporting**: View attendance reports, sales revenue, filter by event type/date, sort by revenue

### 🎫 Usher Admin

- **Team Structure Management**: Create, organize, and manage ushering teams
- **Interview Coordination**: Configure time slots, locations, and availability windows
- **Communication Hub**: Send targeted broadcasts to students and applicant groups
- **Booking Oversight**: Monitor interview appointments across all managed teams
- **Timeline Control**: Set post times and manage application deadlines

---

## 🔌 API Routes

Base URL: `http://localhost:4000`

### 🔐 Authentication (`/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user (Student/Staff/Vendor) |
| POST | `/auth/login` | Login and receive tokens |
| POST | `/auth/logout` | Logout and clear refresh token |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/auth/me` | Get current authenticated user |
| GET | `/auth/verify` | Verify email with token |

### 👥 Users (`/users`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| GET | `/users/notifications` | Get user notifications |
| PUT | `/users/:id/block` | Block a user |
| PUT | `/users/:id/unblock` | Unblock a user |
| PUT | `/users/:id/assign-role` | Assign staff role (TA/Professor/Staff) |
| POST | `/users/:eventId/register` | Register for an event |
| DELETE | `/users/:eventId/unregister` | Unregister from an event |
| POST | `/users/favorites/:eventId` | Add event to favorites |
| DELETE | `/users/favorites/:eventId` | Remove from favorites |
| GET | `/users/favorites` | Get user's favorite events |

### 🎪 Events (`/events`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/events` | Get all events (with filters) |
| GET | `/events/:id` | Get event by ID |
| POST | `/events` | Create event (Bazaar/Trip/Conference) |
| PUT | `/events/:id` | Update event |
| DELETE | `/events/:id` | Delete event |
| PUT | `/events/:id/archive` | Archive event |
| GET | `/events/:id/reviews` | Get event reviews |
| POST | `/events/:id/reviews` | Add review to event |
| PUT | `/events/:id/reviews/:reviewId` | Update review |
| DELETE | `/events/:id/reviews/:reviewId` | Delete review |
| GET | `/events/flagged-comments` | Get AI-flagged toxic comments |
| PUT | `/events/comments/:commentId/mark-safe` | Mark comment as not toxic |

### 📚 Workshops (`/workshops`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/workshops` | Get all workshops |
| POST | `/workshops` | Create workshop |
| PUT | `/workshops/:workshopId` | Update workshop |
| PUT | `/workshops/:workshopId/status` | Approve/Reject workshop |
| POST | `/workshops/:workshopId/certificates` | Send certificates to attendees |

### 🏪 Vendor Events (`/vendorEvents`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/vendorEvents/upcoming` | Get vendor's upcoming events |
| POST | `/vendorEvents/apply/booth` | Apply for platform booth |
| POST | `/vendorEvents/apply/bazaar/:bazaarId` | Apply for bazaar booth |
| GET | `/vendorEvents/requests` | Get all vendor requests |
| GET | `/vendorEvents/requests/:requestId` | Get request details |
| PUT | `/vendorEvents/requests/:requestId` | Respond to vendor request |
| POST | `/vendorEvents/loyalty-program` | Create loyalty program |

### 💳 Payments (`/payments`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/payments/checkout/:eventId` | Create Stripe checkout session |
| POST | `/payments/wallet/:eventId` | Pay with wallet balance |
| POST | `/payments/refund/:eventId` | Request refund |

### ⏳ Waitlist (`/waitlist`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/waitlist/:eventId/join` | Join event waitlist |
| DELETE | `/waitlist/:eventId/leave` | Leave event waitlist |
| GET | `/waitlist/:eventId/position` | Get position in waitlist |

### 🏀 Courts (`/courts`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/courts/all` | Get all courts availability |
| GET | `/courts/:courtId/available-slots` | Get available slots for a court |
| POST | `/courts/:courtId/reserve` | Reserve a court slot |

### 🏋️ Gym Sessions (`/gymsessions`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/gymsessions` | Get all gym sessions |
| POST | `/gymsessions` | Create gym session |
| PUT | `/gymsessions/:sessionId` | Edit gym session |
| DELETE | `/gymsessions/:sessionId` | Cancel gym session |
| POST | `/gymsessions/:sessionId/register` | Register for gym session |
| DELETE | `/gymsessions/:sessionId/unregister` | Unregister from gym session |

### 🎫 Ushering (`/ushering`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/ushering` | Create ushering teams |
| GET | `/ushering/:id/teams` | Get all teams |
| PUT | `/ushering/:usheringId/teams/:teamId` | Edit team |
| DELETE | `/ushering/:usheringId/teams/:teamId` | Delete team |
| POST | `/ushering/:id/post-time` | Set interview post time |
| GET | `/ushering/:id/post-time` | Get interview post time |
| POST | `/ushering/:usheringId/teams/:teamId/slots/:slotId/book` | Book interview slot |
| DELETE | `/ushering/bookings/:bookingId` | Cancel booking |
| POST | `/ushering/:id/broadcast` | Send broadcast message |

### 📅 Calendar (`/calendar`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/calendar/auth/google` | Get Google OAuth URL |
| GET | `/calendar/auth/google/callback` | OAuth callback |
| POST | `/calendar/events/:eventId/add` | Add event to Google Calendar |
| DELETE | `/calendar/events/:eventId/remove` | Remove event from Google Calendar |
| GET | `/calendar/status` | Check calendar connection status |

### 👑 Admin (`/admins`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admins` | Get all admin accounts |
| POST | `/admins` | Create admin/Events Office account |
| DELETE | `/admins/:adminId` | Delete admin account |

### 🐛 Bug Reports (`/bugreports`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bugreports` | Get all bug reports |
| POST | `/bugreports` | Create bug report |
| PUT | `/bugreports/:bugReportId/status` | Update bug report status |
| POST | `/bugreports/:bugReportId/email` | Send bug report to developers |
| GET | `/bugreports/export` | Export bug reports to Excel |

### 📤 Uploads (`/uploads`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/uploads/tax-card` | Upload vendor tax card |
| POST | `/uploads/logo` | Upload vendor logo |
| POST | `/uploads/event-image` | Upload event image |
| DELETE | `/uploads/:publicId` | Delete uploaded file |

### 🔔 Webhooks (`/webhooks`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/webhooks/stripe` | Stripe payment webhook |

---

## 📧 Environment Configuration

Create a `.env` file in the `/backend` directory:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# Server
PORT=4000
FRONTEND_PORT=3000

# JWT Authentication
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
VERIFICATION_TOKEN_SECRET=your_verification_token_secret
ACCESS_TOKEN_EXPIRES=5m
REFRESH_TOKEN_EXPIRES=7d
VERIFICATION_TOKEN_EXPIRES=1d

# Redis
REDIS_URL=redis://localhost:6379

# Google OAuth (Email)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://developers.google.com/oauthplayground
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GMAIL_USER=your_gmail_address

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Google Calendar
GOOGLE_CALENDAR_CLIENT_ID=your_google_calendar_client_id
GOOGLE_CALENDAR_CLIENT_SECRET=your_google_calendar_client_secret
GOOGLE_CALENDAR_REDIRECT_URI=http://localhost:4000/calendar/auth/google/callback
```

---

## 📦 Setup & Installation

> ⚠️ **Before starting**, make sure you've created the `.env` file as described in the [Environment Configuration](#-environment-configuration) section above.

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/Advanced-Computer-Lab-2025/Multaqa.git
cd Multaqa

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../client && npm install
```

### 2. Redis Setup (WSL)

Run in WSL terminal:

```bash
docker run --name redis -p 6379:6379 -d redis
docker update --restart always redis
```

### 3. Stripe Webhook (Bash)

Run in a separate bash terminal:

```bash
cd backend
npm run stripe:webhook
```

### 4. Run Backend

```bash
cd backend
npm run dev
# Server runs on http://localhost:4000
```

### 5. Run Frontend

```bash
cd client
npm run dev
# App runs on http://localhost:3000
```

---

## 📁 Project Structure

```
Multaqa/
├── 📁 backend/                     # Express.js API server
│   ├── 📁 __tests__/               # Jest test files
│   ├── 📁 config/                  # Configuration (Redis, Cloudinary, Email)
│   ├── 📁 constants/               # Application constants
│   ├── 📁 interfaces/              # TypeScript interfaces
│   │   ├── 📁 errors/              # Error interfaces
│   │   ├── 📁 models/              # Model interfaces
│   │   └── 📁 responses/           # Response interfaces
│   ├── 📁 middleware/              # Express middleware (auth, upload, roles)
│   ├── 📁 repos/                   # Data access layer
│   ├── 📁 routes/                  # API route handlers
│   ├── 📁 schemas/                 # MongoDB schemas
│   │   ├── 📁 court-schema/        # Court booking schemas
│   │   ├── 📁 event-schemas/       # Event-related schemas
│   │   ├── 📁 misc/                # Miscellaneous schemas
│   │   └── 📁 stakeholder-schemas/ # User schemas
│   ├── 📁 scripts/                 # Utility scripts (kill-port, stripe)
│   ├── 📁 services/                # Business logic services
│   ├── 📁 utils/                   # Utility functions (PDF, QR, email templates, eventBus, eventListeners)
│   │   └── 📁 llms/                # LLM integrations
│   ├── 📁 validation/              # Input validation schemas
│   ├── 📄 app.ts                   # Express application entry
│   └── 📄 package.json             # Backend dependencies
│
├── 📁 client/                      # Next.js frontend application
│   ├── 📁 .storybook/              # Storybook configuration
│   ├── 📁 docs/                    # Documentation files
│   ├── 📁 locales/                 # i18n translations (en, ar, de)
│   ├── 📁 public/                  # Static assets
│   └── 📁 src/
│       ├── 📁 app/                 # Next.js App Router
│       │   └── 📁 [locale]/        # Internationalized routes
│       ├── 📁 components/          # React components
│       │   ├── 📁 admin/           # Admin dashboard components
│       │   ├── 📁 BrowseEvents/    # Event browsing components
│       │   ├── 📁 CourtBooking/    # Court reservation components
│       │   ├── 📁 Event/           # Event detail components
│       │   ├── 📁 EventsOffice/    # Events office components
│       │   ├── 📁 gym/             # Gym session components
│       │   ├── 📁 layout/          # Layout components
│       │   ├── 📁 notifications/   # Notification components
│       │   ├── 📁 shared/          # Shared UI components
│       │   ├── 📁 vendor/          # Vendor-specific components
│       │   └── 📁 Wallet/          # Wallet/payment components
│       ├── 📁 context/             # React contexts (Auth, Notifications)
│       ├── 📁 hooks/               # Custom React hooks
│       ├── 📁 i18n/                # Internationalization config
│       ├── 📁 lib/                 # Utility libraries
│       ├── 📁 providers/           # React providers
│       ├── 📁 services/            # API service functions
│       ├── 📁 stories/             # Storybook stories
│       ├── 📁 themes/              # MUI theme configuration
│       ├── 📁 types/               # TypeScript type definitions
│       └── 📁 utils/               # Helper functions
│
├── 📄 README.md                    # This file
└── 📄 LICENSE                      # MIT License
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Storybook Tests

```bash
cd client
npm run storybook
# Opens at http://localhost:6006
```

---


## Agile Development

We followed **Agile/Scrum methodology** throughout the project:

- **Sprint-based development**: 2-week sprints with defined goals and deliverables
- **Daily meetings**: Regular team sync meetings for progress updates
- **Sprint planning**: Backlog refinement and task estimation
- **Sprint retrospectives**: Continuous improvement after each sprint
- **Task tracking**: [Sprint 1 (Jira)](https://new-guc-scad.atlassian.net/jira/software/projects/SCAD/boards/1/backlog?selectedIssue=SCAD-24) | [Sprint 2 (Excel)](https://1drv.ms/x/c/cfee3a69d7cca41e/EfILJosU9TRDhJYiWVs--qEBpFFKvRReVI_MvAltaDXHBQ?e=VdgNZr)

---


## Team Members


| #   | Name              | Role                   |
| --- | ----------------- | ---------------------- |
| 1   | <img src="https://github.com/sultann-301.png" width="20" height="20" style="border-radius:50%; vertical-align:middle"> [Mohammed Sultan](https://github.com/sultann-301) | Backend & Scrum Master |
| 2   | <img src="https://github.com/EsraaTarek382.png" width="20" height="20" style="border-radius:50%; vertical-align:middle"> [Esraa Tarek](https://github.com/EsraaTarek382) | Backend                |
| 3   | <img src="https://github.com/YasmeenTarek1.png" width="20" height="20" style="border-radius:50%; vertical-align:middle"> [Yasmeen Tarek](https://github.com/YasmeenTarek1) | Backend                |
| 4   | <img src="https://github.com/Chainingrobin.png" width="20" height="20" style="border-radius:50%; vertical-align:middle"> [Youssef Yasser](https://github.com/Chainingrobin) | Backend                |
| 5   | <img src="https://github.com/MahmoudEl-kabbany.png" width="20" height="20" style="border-radius:50%; vertical-align:middle"> [Mahmoud Elkabbany](https://github.com/MahmoudEl-kabbany) | Frontend               |
| 6   | <img src="https://github.com/maihazem607.png" width="20" height="20" style="border-radius:50%; vertical-align:middle"> [Mai Hazem](https://github.com/maihazem607) | Frontend               |
| 7   | <img src="https://github.com/layla2206.png" width="20" height="20" style="border-radius:50%; vertical-align:middle"> [Layla Khaled](https://github.com/layla2206) | Frontend               |
| 8   | <img src="https://github.com/sal-tarek.png" width="20" height="20" style="border-radius:50%; vertical-align:middle"> [Salma Tarek](https://github.com/sal-tarek) | Frontend               |
| 9   | <img src="https://github.com/AbdelrahmanWaelH.png" width="20" height="20" style="border-radius:50%; vertical-align:middle"> [Abdelrahman Wael](https://github.com/AbdelrahmanWaelH) | Frontend               |
| 10  | <img src="https://github.com/CodeNKoffee.png" width="20" height="20" style="border-radius:50%; vertical-align:middle"> [Hatem Yasser](https://github.com/CodeNKoffee) | Frontend               |

---


## 🤝 Contributing

We welcome contributions! Feel free to submit pull requests, report bugs, suggest features, or improve documentation.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---


<div align="center">

**Made with ❤️ by Multaqa Team**

_Bringing the campus community together, one event at a time_ 🎓✨

</div>
