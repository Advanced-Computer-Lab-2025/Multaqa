# Multaqa - University Event Management Platform (Frontend)

![Multaqa Logo](./public/multaqa-logo.svg)

## 🎓 About

**Multaqa** is a comprehensive university event management platform designed for the German University in Cairo (GUC). This frontend application enables students, staff, doctors, and external companies to discover, register for, and manage various campus events including bazaars, trips, competitions, workshops, and conferences.

**Project Details:**

- **Course:** Advanced Computer Lab (CSEN 704 / DMET 706)
- **Semester:** Winter 2025
- **Institution:** German University in Cairo
- **Instructor:** Assoc. Prof. Mervat Abuelkheir

## 🚀 Tech Stack

### Core Framework

- **Next.js 15.5.4** - React framework with App Router for production-ready applications
- **React 18.3.1** - JavaScript library for building user interfaces
- **TypeScript 5+** - Type-safe JavaScript for better development experience

### Styling & UI

- **Tailwind CSS 3.4.0** - Utility-first CSS framework for rapid UI development
- **PostCSS** - CSS post-processor for transforming styles
- **Autoprefixer** - Automatically adds vendor prefixes to CSS

### Fonts

- **PT Sans** (400, 700) - Primary font for body text and general content
- **Jost** (400, 600) - Secondary font for headings and titles

### Color Palette

- **Minsk Color Scheme** - Custom color palette from 50 to 950 shades for consistent branding

## 📦 Dependencies

### Production Dependencies

#### Core Framework & React

```json
"next": "15.5.4"
"react": "18.3.1"
"react-dom": "18.3.1"
```

- **Next.js**: Full-stack React framework with built-in optimization, routing, and SSR
- **React**: Core library for building component-based user interfaces
- **React DOM**: Provides DOM-specific methods for React components

#### UI Components & Styling

```json
"@mui/material": "^7.3.2"
"@emotion/react": "^11.14.0"
"@emotion/styled": "^11.14.1"
```

- **Material-UI (MUI)**: React components implementing Google's Material Design
- **Emotion**: CSS-in-JS library for styling React components with performance optimization

#### State Management

```json
"@reduxjs/toolkit": "^2.9.0"
"react-redux": "^9.2.0"
```

- **Redux Toolkit**: Modern Redux for predictable state management with less boilerplate
- **React Redux**: Official React bindings for Redux state management

#### Form Handling & Validation

```json
"formik": "^2.4.6"
"yup": "^1.7.1"
```

- **Formik**: Build forms in React without tears - handles form state, validation, and error messages
- **Yup**: Schema validation library for form data validation

#### HTTP Client

```json
"axios": "^1.12.2"
```

- **Axios**: Promise-based HTTP client for making API requests to the backend

#### Internationalization

```json
"next-intl": "^4.3.9"
```

- **Next-intl**: Internationalization library for Next.js (to be implemented in Arabic and other languages later)

#### UI Enhancements

```json
"react-icons": "^5.5.0"
"react-world-flags": "^1.6.0"
"react-hot-toast": "^2.6.0"
"react-phone-number-input": "^3.4.12"
"framer-motion": "^12.23.22"
```

- **React Icons**: Popular icon libraries (FontAwesome, Lucide, Heroicons, etc.) as React components
- **React World Flags**: Country flag components for international user interface
- **React Hot Toast**: Lightweight notification library for success/error messages
- **React Phone Number Input**: International phone number input component
- **Framer Motion**: Production-ready motion library for React animations

#### Data Visualization & Layout

```json
"recharts": "^3.2.1"
"react-pro-sidebar": "^1.1.0"
```

- **Recharts**: Composable charting library for React - perfect for event analytics and statistics
- **React Pro Sidebar**: Professional sidebar component for navigation

#### Date Handling & Animations

```json
"date-fns": "^4.1.0"
"moment": "^2.30.1"
"lottie-react": "^2.4.1"
```

- **Date-fns**: Modern JavaScript date utility library for event date management
- **Moment.js**: Parse, validate, manipulate, and display dates (legacy support)
- **Lottie React**: Render After Effects animations for enhanced user experience

### Development Dependencies

#### Build Tools & Bundling

```json
"typescript": "^5"
"autoprefixer": "^10.0.1"
"postcss": "^8"
"tailwindcss": "^3.4.0"
```

- **TypeScript**: Adds static type definitions to JavaScript
- **Autoprefixer**: PostCSS plugin to add vendor prefixes automatically
- **PostCSS**: Tool for transforming CSS with JavaScript
- **Tailwind CSS**: Utility-first CSS framework

#### Code Quality & Linting

```json
"eslint": "^9"
"eslint-config-next": "15.5.4"
"@eslint/eslintrc": "^3"
```

- **ESLint**: JavaScript linter for identifying and fixing code quality issues
- **ESLint Config Next**: ESLint configuration optimized for Next.js projects

#### Testing Framework

```json
"jest": "^30.2.0"
"vitest": "^3.2.4"
"@vitest/browser": "^3.2.4"
"@vitest/coverage-v8": "^3.2.4"
"playwright": "^1.55.1"
```

- **Jest**: JavaScript testing framework for unit and integration tests
- **Vitest**: Fast unit test framework powered by Vite
- **Vitest Browser**: Browser testing capabilities for Vitest
- **V8 Coverage**: Code coverage reports using V8's built-in coverage
- **Playwright**: End-to-end testing framework for web applications

#### Component Development & Documentation

```json
"storybook": "^9.1.10"
"@storybook/nextjs-vite": "^9.1.10"
"@storybook/addon-a11y": "^9.1.10"
"@storybook/addon-docs": "^9.1.10"
"@storybook/addon-vitest": "^9.1.10"
"@chromatic-com/storybook": "^4.1.1"
"eslint-plugin-storybook": "^9.1.10"
```

- **Storybook**: Tool for building UI components in isolation
- **Storybook Next.js Vite**: Vite-powered framework support for Next.js in Storybook
- **A11y Addon**: Accessibility testing addon for Storybook
- **Docs Addon**: Automatic documentation generation for components
- **Vitest Addon**: Integration between Storybook and Vitest for component testing
- **Chromatic**: Visual testing and review tool for Storybook

#### Type Definitions

```json
"@types/node": "^20"
"@types/react": "^18.3.12"
"@types/react-dom": "^18.3.1"
```

- **Node Types**: TypeScript definitions for Node.js APIs
- **React Types**: TypeScript definitions for React
- **React DOM Types**: TypeScript definitions for React DOM

## 🎨 Design System

### Typography

- **Primary Font**: PT Sans (400) - Used for body text and general content
- **Secondary Font**: Jost ( 600) - Used for headings, titles, and emphasis

#### Font Usage Guide

- **Default Font**: PT Sans is the default font for all text (`font-sans` class)
- **Headings & Titles**: Use `font-heading` class for Jost font (semi-bold 600 weight)
- **Explicit Font Classes**:
  - `font-pt-sans` - Explicitly use PT Sans
  - `font-jost` - Explicitly use Jost
  - `font-heading` - Use Jost for headings (recommended)

**Example Usage:**

```tsx
// Default body text (PT Sans)
<p className="text-gray-600">This is regular body text in PT Sans</p>

// Headings (Jost - recommended)
<h1 className="font-heading text-4xl font-semibold">Main Title in Jost</h1>
<h2 className="font-heading text-2xl">Subtitle in Jost</h2>

// Explicit font usage
<p className="font-pt-sans">Explicitly PT Sans</p>
<p className="font-jost font-semibold">Explicitly Jost (semi-bold)</p>
```

### Color Palette - Minsk

```css
/* Minsk Color Palette */
--minsk-50: #eff0fe
--minsk-100: #e2e2fd
--minsk-200: #cdcbfa
--minsk-300: #afabf6
--minsk-400: #9789f0
--minsk-500: #876de7
--minsk-600: #7851da
--minsk-700: #6842c0
--minsk-800: #55389b
--minsk-900: #46337a
--minsk-950: #2b1e48
```

## 🌍 Internationalization

This project uses `next-intl` for internationalization support. Currently configured for English, with plans to implement:

- **Arabic** (العربية) - Primary additional language
- **German** (Deutsch) - Considering GUC's German heritage
- **Additional languages** as needed

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
├── lib/                   # Utility libraries and configurations
├── utils/                 # Helper functions
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── constants/             # Static constants (URLs, config)
├── mock/                  # Mock data for development
├── i18n/                  # Internationalization config
└── stories/               # Storybook stories
```

## 🎯 Key Features

### Event Management

- **Browse Events**: Discover campus events with filtering and search
- **Event Registration**: Seamless registration process for students and staff
- **Event Creation**: Allow doctors and events office to create new events
- **Event Analytics**: Visual charts and statistics using Recharts

### User Roles

- **Students**: Browse and register for events
- **Staff**: Event participation and basic management
- **Doctors**: Propose academic workshops and conferences
- **Events Office**: Full event management and oversight
- **External Companies**: Register for bazaars and career fairs
- **Admins**: User verification and system administration

### Event Types

- **Bazaars & Career Fairs**: Company participation and student interaction
- **Academic Trips**: Cairo and Berlin educational excursions
- **Competitions**: Student competitions and contests
- **Workshops**: Skill-building and educational sessions
- **Conferences**: Academic and professional conferences

## 🔧 Development Tools

### Code Quality

- **ESLint**: Enforces code quality and consistency
- **TypeScript**: Provides type safety and better developer experience
- **Prettier**: Code formatting (if configured)

### Testing

- **Jest**: Unit and integration testing
- **Vitest**: Fast unit testing with browser support
- **Playwright**: End-to-end testing
- **Storybook**: Component testing and documentation

### Performance

- **Next.js**: Built-in optimization and performance features
- **Turbopack**: Fast bundler for development
- **Image Optimization**: Automatic image optimization in Next.js

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## 📝 Project Requirements

This project fulfills the requirements for:

- **MERN Stack Implementation**: MongoDB, Express.js, React, Node.js
- **Agile Methodology**: Sprint-based development
- **UI/UX Excellence**: Material Design with custom branding
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliance through Storybook a11y addon
- **Testing**: Comprehensive test coverage
- **Documentation**: Complete project documentation

## 📧 Contact

**Team Members**: Advanced Computer Lab Team - Winter 2025
**Course**: CSEN 704 / DMET 706
**Institution**: German University in Cairo
**Instructor**: Assoc. Prof. Mervat Abuelkheir

## 📄 License

This project is developed as part of academic coursework at the German University in Cairo.

---

*Built with ❤️ by GUC Students for the University Community*
