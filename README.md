# Multaqa 🎓

> **A Comprehensive University Event Management Platform for the German University in Cairo (GUC)**

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![Express](https://img.shields.io/badge/Express-5.1.0-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-6.20.0-green)
![Redis](https://img.shields.io/badge/Redis-5.8.3-red)
![MUI](https://img.shields.io/badge/MUI-7.3.2-007FFF)

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Quick Start](#-quick-start)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Installation & Setup](#-installation--setup)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [Troubleshooting](#-troubleshooting)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [User Roles & Permissions](#-user-roles--permissions)
- [Event Types](#-event-types)
- [Development Workflow](#-development-workflow)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [FAQ](#-frequently-asked-questions-faq)
- [Credits](#-credits)
- [License](#-license)

## 🎯 Project Overview

**Multaqa** (Arabic: "meeting place") is a comprehensive university event management platform designed specifically for the German University in Cairo (GUC). The platform enables students, staff, professors, and external companies to discover, register for, and manage various campus events including bazaars, trips, competitions, workshops, and conferences.

### Project Details

- **Course:** Advanced Computer Lab (CSEN 704 / DMET 706)
- **Semester:** Winter 2025
- **Institution:** German University in Cairo
- **Instructor:** Assoc. Prof. Mervat Abuelkheir
- **Platform:** Full-stack web application with role-based access control

## 💡 Motivation

The motivation behind developing Multaqa stems from the need for a centralized, efficient, and user-friendly platform to manage the diverse range of events at GUC. Traditional event management often involves scattered communication, manual registration processes, and limited accessibility. Multaqa addresses these challenges by providing centralized event discovery, streamlined registration, role-based access, real-time updates, and comprehensive analytics for event organizers.

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed on your system:

| Requirement | Version | Verification Command | Expected Output |
|------------|---------|---------------------|-----------------|
| **Node.js** | >= 18.0.0 | `node --version` | `v18.x.x` or higher |
| **npm** | >= 8.0.0 | `npm --version` | `8.x.x` or higher |
| **MongoDB** | Atlas or local | - | MongoDB Atlas account or local instance |
| **Redis** | Latest | `docker --version` | Docker installed for Redis |
| **Git** | Latest | `git --version` | `git version 2.x.x` |
| **Docker** | Latest | `docker --version` | `Docker version 20.x.x` or higher |

> **💡 Tip:** For Windows users, all commands should be executed in **WSL (Windows Subsystem for Linux)** terminal, not CMD or PowerShell.

#### Quick Verification

Run these commands to verify your setup:

```bash
# Verify Node.js and npm
node --version  # Should show v18.0.0 or higher
npm --version   # Should show 8.0.0 or higher

# Verify Git
git --version

# Verify Docker (required for Redis)
docker --version
docker ps  # Should run without errors
```

If any command fails, please install the missing prerequisite before continuing.

### 60-Second Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/Multaqa.git
cd Multaqa

# 2. Create environment files (see Environment Configuration section)
cp backend/.env.example backend/.env

# 3. Install backend dependencies
cd backend
npm install

# 4. Install frontend dependencies
cd ../client
npm install
cd ..

# 5. Start Redis (see Redis Setup section below)
docker run --name redis -p 6379:6379 -d redis
docker update --restart always redis

# 6. Start development servers
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev

# 7. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:4000
```

## 🛠 Tech Stack

### Frontend (Client)

```json
{
  "framework": "Next.js 15.5.4",
  "language": "TypeScript 5+",
  "ui": "Material-UI (MUI) 7.3.2",
  "styling": "Tailwind CSS 3.4.18",
  "state": "Redux Toolkit 2.9.0",
  "forms": "Formik 2.4.6 + Yup 1.7.1",
  "animations": "Framer Motion 12.23.24",
  "charts": "Recharts 3.2.1",
  "i18n": "next-intl 4.3.9",
  "realtime": "Socket.io Client 4.8.1",
  "http": "Axios 1.12.2",
  "dates": "Day.js 1.11.18",
  "dnd": "@dnd-kit/core 6.3.1"
}
```

### Backend (Server)

```json
{
  "runtime": "Node.js",
  "framework": "Express.js 5.1.0",
  "language": "TypeScript 5.9.3",
  "database": "MongoDB 6.20.0 + Mongoose 8.18.3",
  "cache": "Redis 5.8.3",
  "auth": "JWT (jsonwebtoken 9.0.2) + bcrypt 6.0.0",
  "validation": "Joi 18.0.1",
  "email": "Gmail API (googleapis 165.0.0)",
  "realtime": "Socket.io 4.8.1",
  "payments": "Stripe 19.3.0",
  "storage": "Cloudinary 1.41.3",
  "pdf": "PDFKit 0.17.2",
  "qr": "QRCode 1.5.4",
  "excel": "ExcelJS 4.4.0"
}
```

### Development Tools

- **Testing**: Vitest 3.2.4, Playwright 1.55.1
- **Storybook**: 9.1.10 for component development
- **Linting**: ESLint 9
- **Package Manager**: npm

## ✨ Features

### 🎪 Event Management

- **Browse Events**: Advanced filtering and search capabilities
- **Event Registration**: Seamless registration with automatic confirmation
- **Event Creation**: Role-based event creation and management
- **Event Analytics**: Visual charts and statistics using Recharts
- **Real-time Updates**: Live event status and capacity tracking

### 👥 User Management

- **Multi-Role Support**: Students, Staff, Doctors, Events Office, Vendors, Admins
- **Authentication**: JWT-based secure authentication with refresh tokens
- **Profile Management**: Comprehensive user profiles with role-specific fields
- **Email Verification**: Automated email verification system

### 🏛️ Facility Management

- **Court Booking**: Sports court reservation system
- **Gym Sessions**: Fitness session scheduling and management
- **Resource Allocation**: Efficient resource booking and management

### 🌐 Internationalization (Coming Soon)

- **Multi-language Support**: English, Arabic, and German
- **RTL Support**: Right-to-left text support for Arabic
- **Localized Content**: Region-specific event and content management

## 📦 Installation & Setup

### Prerequisites Installation

#### Windows Users (WSL Required)

```bash
# All commands should be executed in WSL terminal (Ubuntu on WSL)
# Do NOT use Windows CMD or PowerShell
```

#### Install Docker

```bash
# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install docker.io -y
sudo systemctl enable docker
sudo systemctl start docker

# macOS
# Download and install Docker Desktop from https://www.docker.com/products/docker-desktop
# Ensure Docker Desktop is running before proceeding
```

#### Verify Docker Installation

```bash
docker --version
```

### Clone and Setup Repository

```bash
# 1. Clone the repository
git clone https://github.com/your-username/Multaqa.git
cd Multaqa

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../client
npm install

# Return to root directory
cd ..
```

### Redis Setup (Required for Session Management)

```bash
# Start Redis container
docker run --name redis -p 6379:6379 -d redis

# Ensure Redis restarts automatically
docker update --restart always redis

# Verify Redis is running
docker ps | grep redis
```

If you need to stop Redis later:

```bash
docker stop redis
docker start redis  # To restart it
```

## 🔧 Environment Configuration

### Backend Environment File

Create a `.env` file in the `/backend` directory with the following structure:

```env
# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/MultaqaDB
FRONTEND_PORT=3000
PORT=4000

# Authentication
ACCESS_TOKEN_SECRET=your_super_secure_access_token_secret
REFRESH_TOKEN_SECRET=your_super_secure_refresh_token_secret
VERIFICATION_TOKEN_SECRET=your_super_secure_verification_token_secret
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d
VERIFICATION_TOKEN_EXPIRES=1d

# Redis Configuration (must match Docker setup)
REDIS_URL=redis://localhost:6379
```

### Environment Variables Reference

| Variable                | Description                            | Required | Default                               |
| ----------------------- | -------------------------------------- | -------- | ------------------------------------- |
| `MONGO_URI`             | MongoDB connection string              | ✅       | `mongodb://localhost:27017/MultaqaDB` |
| `PORT`                  | Backend server port                    | ✅       | `4000`                                |
| `ACCESS_TOKEN_SECRET`   | JWT access token secret                | ✅       | -                                     |
| `REFRESH_TOKEN_SECRET`  | JWT refresh token secret               | ✅       | -                                     |
| `ACCESS_TOKEN_EXPIRES`  | JWT access token expiration            | ✅       | `15m`                                 |
| `REFRESH_TOKEN_EXPIRES` | JWT refresh token expiration           | ✅       | `7d`                                  |
| `REDIS_URL`             | Redis connection URL                   | ✅       | `redis://localhost:6379`              |
| `EMAIL_HOST`            | SMTP server host                       | ❌       | -                                     |
| `EMAIL_PORT`            | SMTP server port                       | ❌       | -                                     |
| `EMAIL_USER`            | SMTP username                          | ❌       | -                                     |
| `EMAIL_PASS`            | SMTP password or app-specific password | ❌       | -                                     |

### MongoDB Setup

For development, use MongoDB Atlas (free tier available):

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Replace `username:password` with your credentials
6. Add the cluster URL to `MONGO_URI` in your `.env` file

## 🚀 Running the Application

### Backend Server

```bash
cd backend

# Install dependencies (if not already done)
npm install

# Start development server with hot-reload
npm run dev

# Expected output:
# Backend Initialized!
# Server running on http://localhost:4000
```

### Frontend Server

```bash
cd client

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Expected output:
# ▲ Next.js 15.5.4
# Local: http://localhost:3000
```

### Full Stack Startup

```bash
# Terminal 1 - Start Redis
docker start redis

# Terminal 2 - Start Backend
cd backend && npm run dev

# Terminal 3 - Start Frontend
cd client && npm run dev

# Open browser
# Frontend: http://localhost:3000
# Backend API: http://localhost:4000
```

### Verify Everything is Working

1. **Backend**: Open `http://localhost:4000` - should display "Backend Initialized!"
2. **Frontend**: Open `http://localhost:3000` - should load the Multaqa application
3. **Redis**: Run `docker ps | grep redis` - should show the redis container running

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### ❌ Redis Connection Error

**Problem:** `Error: connect ECONNREFUSED 127.0.0.1:6379`

**Solutions:**
```bash
# Check if Redis container is running
docker ps | grep redis

# If not running, start it
docker start redis

# If container doesn't exist, create it
docker run --name redis -p 6379:6379 -d redis
docker update --restart always redis

# Verify Redis is accessible
docker exec -it redis redis-cli ping  # Should return "PONG"
```

#### ❌ MongoDB Connection Error

**Problem:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions:**
```bash
# 1. Check your MONGO_URI in backend/.env
# 2. Verify MongoDB Atlas IP whitelist (add 0.0.0.0/0 for development)
# 3. Ensure username/password are correct and URL-encoded
# 4. Check network connectivity

# Test connection string format:
# mongodb+srv://username:password@cluster.mongodb.net/MultaqaDB
```

#### ❌ Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::4000`

**Solutions:**
```bash
# Find and kill the process using the port
# macOS/Linux:
lsof -ti:4000 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Or use the built-in kill script
cd backend && npm run kill-port

# Then restart the server
npm run dev
```

#### ❌ CORS Error in Browser

**Problem:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
1. Verify backend is running on `http://localhost:4000`
2. Verify frontend is running on `http://localhost:3000`
3. Check `backend/app.ts` has correct CORS configuration:
   ```typescript
   app.use(cors({ origin: "http://localhost:3000", credentials: true }))
   ```
4. Clear browser cache and cookies
5. Try in incognito/private browsing mode

#### ❌ Docker Not Running

**Problem:** `Cannot connect to the Docker daemon`

**Solutions:**
```bash
# macOS: Start Docker Desktop application
# Linux: Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Verify Docker is running
docker --version
docker ps
```

#### ❌ Environment Variables Not Loading

**Problem:** Application can't find environment variables

**Solutions:**
1. Ensure `.env` file exists in `/backend` directory
2. Verify `.env` file has no syntax errors
3. Restart the backend server after changing `.env`
4. Check for typos in variable names
5. Ensure no spaces around `=` in `.env` file

```env
# ✅ Correct
PORT=4000

# ❌ Incorrect
PORT = 4000
```

#### ❌ Module Not Found Errors

**Problem:** `Error: Cannot find module 'xyz'`

**Solutions:**
```bash
# Delete node_modules and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../client
rm -rf node_modules package-lock.json
npm install
```

#### ⚠️ Gmail API Not Sending Emails

**Problem:** Emails not being sent

**Solutions:**
1. Verify Gmail API credentials in backend `.env`
2. Check Google Cloud Console for API enablement
3. Verify service account permissions
4. Check backend logs for specific error messages

---

## 📚 API Reference

### Authentication Endpoints

```typescript
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh
GET  /auth/verify/:token
```

### Event Management

```typescript
GET    /events                    # Get all events
GET    /events/:id               # Get specific event
POST   /events                   # Create new event (authorized)
PUT    /events/:id               # Update event (authorized)
DELETE /events/:id               # Delete event (authorized)
POST   /events/:id/register      # Register for event
```

### User Management

```typescript
GET    /users/profile            # Get user profile
PUT    /users/profile            # Update user profile
GET    /users/events             # Get user's registered events
DELETE /users/events/:id         # Cancel event registration
```

### Court Booking

```typescript
GET    /courts                   # Get available courts
POST   /courts/book              # Book a court
GET    /courts/bookings          # Get user's bookings
PUT    /courts/bookings/:id      # Modify booking
DELETE /courts/bookings/:id      # Cancel booking
```

### Admin Endpoints

```typescript
GET    /admins/users             # Get all users
PUT    /admins/users/:id/verify  # Verify user account
DELETE /admins/users/:id         # Delete user
GET    /admins/analytics         # Get system analytics
```

## 📁 Project Structure

```
Multaqa/
├── 📁 backend/                     # Express.js API server
│   ├── 📁 auth/                    # Authentication middleware
│   ├── 📁 config/                  # Configuration files
│   ├── 📁 constants/               # Application constants
│   ├── 📁 interfaces/              # TypeScript interfaces
│   ├── 📁 middleware/              # Express middleware
│   ├── 📁 repos/                   # Data access layer
│   ├── 📁 routes/                  # API route handlers
│   ├── 📁 schemas/                 # MongoDB schemas
│   ├── 📁 services/                # Business logic
│   ├── 📁 utils/                   # Utility functions
│   ├── 📁 validation/              # Input validation
│   ├── 📄 app.ts                   # Express application setup
│   ├── 📄 .env                     # Environment variables (create this)
│   └── 📄 package.json             # Backend dependencies
│
├── 📁 client/                      # Next.js frontend application
│   ├── 📁 public/                  # Static assets
│   ├── 📁 src/
│   │   ├── 📁 app/                 # Next.js App Router
│   │   │   └── 📁 [locale]/        # Internationalized routes
│   │   ├── 📁 components/          # Reusable React components
│   │   │   ├── 📁 admin/           # Admin-specific components
│   │   │   ├── 📁 layout/          # Layout components
│   │   │   ├── 📁 shared/          # Shared UI components
│   │   │   └── 📁 vendor/          # Vendor-specific components
│   │   ├── 📁 constants/           # Application constants
│   │   ├── 📁 hooks/               # Custom React hooks
│   │   ├── 📁 lib/                 # Utility libraries
│   │   ├── 📁 types/               # TypeScript type definitions
│   │   ├── 📁 utils/               # Helper functions
│   │   └── 📁 stories/             # Storybook stories
│   ├── 📁 locales/                 # Internationalization files
│   │   ├── 📄 en.json              # English translations
│   │   ├── 📄 ar.json              # Arabic translations
│   │   └── 📄 de.json              # German translations
│   ├── 📄 next.config.ts           # Next.js configuration
│   ├── 📄 tailwind.config.js       # Tailwind CSS configuration
│   └── 📄 package.json             # Frontend dependencies
│
├── 📄 README.md                    # This file
├── 📄 package.json                 # Root package.json
└── 📄 .gitignore                   # Git ignore rules
```

## 👥 User Roles & Permissions

### 🎓 Student

- **Browse Events**: View all available events
- **Register for Events**: Join events with available capacity
- **View Profile**: Access personal information and event history
- **Court Booking**: Reserve sports courts
- **Gym Sessions**: Book fitness sessions

### 👨‍🏫 Staff Member

- **All Student Features**: Inherits all student capabilities
- **Event Participation**: Enhanced participation in staff events
- **Profile Management**: Extended profile with staff-specific information

### 👨‍⚕️ Doctor/Professor

- **All Staff Features**: Inherits all staff capabilities
- **Workshop Creation**: Propose and create academic workshops
- **Conference Management**: Organize academic conferences
- **Student Oversight**: Monitor student participation in academic events

### 🏢 Events Office

- **Full Event Management**: Create, edit, and delete events
- **Event Analytics**: Access comprehensive event statistics
- **User Management**: Verify and manage user accounts
- **Resource Allocation**: Manage court and gym session bookings
- **System Administration**: Access admin-level features

### 🏪 External Vendor

- **Bazaar Registration**: Register for campus bazaars and fairs
- **Booth Management**: Manage booth assignments and details
- **Event Participation**: Participate in vendor-specific events
- **Limited Profile**: Basic profile management

### 👑 Admin

- **System Administration**: Full system access and control
- **User Verification**: Approve and verify all user accounts
- **Role Management**: Assign and modify user roles
- **System Analytics**: Access comprehensive system statistics
- **Content Moderation**: Moderate events and user content

## 🎪 Event Types

### 📚 Academic Events

- **Conferences**: Academic and professional conferences
- **Workshops**: Skill-building and educational sessions
- **Seminars**: Specialized topic presentations
- **Lectures**: Guest speaker events

### 🎨 Cultural Events

- **Bazaars**: Campus marketplaces and fairs
- **Exhibitions**: Art and cultural displays
- **Performances**: Music, theater, and dance events
- **Festivals**: Seasonal and cultural celebrations

### 🏃‍♂️ Sports & Recreation

- **Competitions**: Athletic competitions and tournaments
- **Fitness Sessions**: Group fitness and wellness programs
- **Court Bookings**: Individual and group sports activities
- **Recreation Events**: Fun and social activities

### 🌍 Educational Trips

- **Cairo Tours**: Local cultural and historical excursions
- **Berlin Trips**: International educational experiences
- **Field Trips**: Academic and professional site visits
- **Cultural Exchanges**: International student programs

## 🔄 Development Workflow

### Code Style & Standards

We follow these coding standards to ensure code quality and maintainability: TypeScript strict mode for type safety, ESLint for code quality and consistency, Prettier for automated code formatting, conventional commits for standardized commit messages, and atomic design principles for component architecture.

### Git Workflow

```bash
# Feature development
git checkout -b feature/event-registration
git add .
git commit -m "feat: add event registration functionality"
git push origin feature/event-registration

# Create pull request for review
# After approval, merge to main branch
```

### Available Scripts

#### Backend Scripts

```bash
npm run dev          # Start development server with nodemon
npm run start        # Start production server
npm run build        # Build TypeScript to JavaScript
npm test             # Run test suite
```

#### Frontend Scripts

```bash
npm run dev          # Start Next.js development server
npm run build        # Build production application
npm run start        # Start production server
npm run lint         # Run ESLint
npm run storybook    # Start Storybook development server
npm run test         # Run test suite
npm run test:e2e     # Run end-to-end tests
```

## 🧪 Testing

### Testing Strategy

We implement comprehensive testing across multiple levels: unit tests for component and utility function testing with Vitest, integration tests for API endpoint testing, end-to-end tests with Playwright for complete user workflows, and component testing with Storybook for isolated component development.

### Running Tests

```bash
# Backend tests (Coming Soon)
cd backend
npm test

# Frontend tests (Coming Soon)
cd client
npm run test

# E2E tests (Coming Soon)
npm run test:e2e

# Test coverage (Coming Soon)
npm run test:coverage
```

### Component Testing (Storybook)

Some component tests are already implemented in `client/src/stories/` using Storybook. You can view and interact with these components by running:

```bash
cd client
npm run storybook
```

Additional unit, integration, and E2E tests are coming soon.

### Test Structure

```
tests/
├── unit/              # Unit tests (Coming Soon)
├── integration/       # Integration tests (Coming Soon)
├── e2e/              # End-to-end tests (Coming Soon)
└── fixtures/         # Test data and mocks
client/src/stories/    # Storybook component tests (Implemented)
```

## 🚀 Deployment

### Production Build

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd client
npm run build
```

### Environment Setup

1. **Database**: Set up MongoDB Atlas cluster
2. **Redis**: Configure Redis instance (Redis Cloud recommended)
3. **Environment Variables**: Set production environment variables
4. **Domain**: Configure custom domain and SSL certificates
5. **Monitoring**: Set up application monitoring and logging

### Deployment Platforms

- **Frontend**: Vercel (recommended for Next.js)
- **Backend**: Railway, Heroku, or DigitalOcean
- **Database**: MongoDB Atlas
- **Cache**: Redis Cloud

## 🤝 Contributing

**Note**: This is a closed university project for CSEN 704 / DMET 706 course at the German University in Cairo. Contributions are limited to the project team members only.

### Team Members

| #   | Name              | Student ID | Role                   |
| --- | ----------------- | ---------- | ---------------------- |
| 1   | Mohammed Sultan   | 58-2621    | Backend & Scrum Master |
| 2   | Esraa Tarek       | 58-4701    | Backend                |
| 3   | Yasmeen Tarek     | 58-22672   | Backend                |
| 4   | Youssef Yasser    | 58-3187    | Backend                |
| 5   | Mahmoud Elkabbany | 58-1567    | Frontend               |
| 6   | Mai Hazem         | 58-21524   | Frontend               |
| 7   | Layla Khaled      | 58-1959    | Frontend               |
| 8   | Salma Tarek       | 58-5727    | Frontend               |
| 9   | Abdelrahman Wael  | 58-10142   | Frontend               |
| 10  | Hatem Yasser      | 58-6188    | Frontend               |

### Development Workflow for Team Members

```bash
# Clone the repository
git clone https://github.com/Advanced-Computer-Lab-2025/Multaqa
cd Multaqa

# Install dependencies
cd backend && npm install
cd ../client && npm install

# Start development servers
npm run dev

# To clear cache always
npm run dev --clear

# To start production server
npm run build
npm run start
```

### Code Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and linting
2. **Peer Review**: At least one team member reviews the code
3. **Testing**: Manual testing of new features
4. **Documentation**: Update relevant documentation

### Issue Reporting

When reporting issues, please include a clear description of the problem, detailed steps to recreate it, what you expected to happen versus what actually happened, your environment details (browser, OS, Node.js version), and relevant screenshots.

## 👥 Credits

### Development Team

- **Course**: CSEN 704 / DMET 706 - Advanced Computer Lab
- **Institution**: German University in Cairo
- **Instructor**: Assoc. Prof. Mervat Abuelkheir
- **Semester**: Winter 2025

### Technologies & Libraries

- **Next.js**: [Next.js Documentation](https://nextjs.org/docs)
- **Material-UI**: [MUI Documentation](https://mui.com/)
- **Express.js**: [Express.js Guide](https://expressjs.com/)
- **MongoDB**: [MongoDB Documentation](https://docs.mongodb.com/)
- **TypeScript**: [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Inspiration

- **GUC Campus Life**: Inspired by the vibrant campus community at GUC
- **Modern Web Standards**: Following current best practices in web development
- **User Experience**: Focus on intuitive and accessible design

---

## ❓ Frequently Asked Questions (FAQ)

### General Setup

**Q: Do I need to use MongoDB Atlas or can I use a local MongoDB instance?**

A: You can use either! For local MongoDB:
```bash
# Install MongoDB locally
brew install mongodb-community  # macOS
sudo apt install mongodb         # Linux

# Update backend/.env
MONGO_URI=mongodb://localhost:27017/MultaqaDB
```

**Q: How do I reset my database?**

A: To reset your MongoDB database:
```bash
# Option 1: Drop database via MongoDB shell
mongosh "your-connection-string"
> use MultaqaDB
> db.dropDatabase()

# Option 2: Delete and recreate in MongoDB Atlas dashboard
```

**Q: How do I stop/restart Redis?**

A:
```bash
# Stop Redis
docker stop redis

# Start Redis
docker start redis

# Restart Redis
docker restart redis

# Check Redis status
docker ps | grep redis
```

### Development Issues

**Q: What if port 3000 or 4000 is already in use?**

A: You have two options:

1. **Kill the process using the port:**
```bash
# macOS/Linux
lsof -ti:4000 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Or use the backend script
cd backend && npm run kill-port
```

2. **Change the port:**
```bash
# Backend: Update backend/.env
PORT=5000

# Frontend: Next.js will automatically use 3001 if 3000 is busy
# Or specify: npm run dev -- -p 3001
```

**Q: How do I add a new admin user?**

A: You can create an admin user through the registration endpoint with admin role, or update an existing user in MongoDB:
```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "ADMIN", verified: true } }
)
```

**Q: Why am I getting CORS errors?**

A: Ensure:
1. Backend runs on `http://localhost:4000`
2. Frontend runs on `http://localhost:3000`
3. Both servers are running simultaneously
4. Check `backend/app.ts` CORS configuration matches these URLs

### Deployment

**Q: How do I deploy this application?**

A: Recommended deployment setup:
- **Frontend**: Vercel (optimized for Next.js)
- **Backend**: Railway, Render, or DigitalOcean
- **Database**: MongoDB Atlas (already cloud-based)
- **Redis**: Redis Cloud or Upstash

See the [Deployment](#-deployment) section for detailed instructions.

**Q: Do I need to configure anything for production?**

A: Yes, update these for production:
1. Change `MONGO_URI` to production database
2. Update `REDIS_URL` to production Redis instance
3. Set strong `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`
4. Update CORS origin to your production frontend URL
5. Configure Gmail API credentials for production
6. Set up environment variables on your hosting platform

### Features

**Q: How do I enable email notifications?**

A: Configure Gmail API in your backend `.env`:
1. Create a Google Cloud project
2. Enable Gmail API
3. Create service account credentials
4. Add credentials to `.env` file
5. Restart backend server

**Q: Can I add more event types?**

A: Yes! The system is designed to be extensible. You can add new event types by:
1. Creating a new schema in `backend/schemas/event-schemas/`
2. Adding routes in `backend/routes/`
3. Creating frontend components in `client/src/components/`

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support & Contact

- **Course**: CSEN 704 / DMET 706 - Advanced Computer Lab
- **Institution**: German University in Cairo
- **Instructor**: Assoc. Prof. Mervat Abuelkheir

---

<div align="center">

**Made with ❤️ by the CSEN 704 Team at German University in Cairo**

_Bringing the campus community together, one event at a time_ 🎓✨

---

**📅 Last Updated:** December 2025 | **Version:** 1.0.0

</div>
