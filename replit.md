# Career Plans - Professional Career Coaching Website

## Overview

Career Plans is a modern, premium career coaching platform built for Roy Johnson, a professional career counselor. The website serves as both a marketing platform and business management system, featuring a public-facing website for client acquisition and an administrative dashboard for business operations. The platform specializes in strategic career guidance across three key demographics: freshers, middle management, and senior professionals.

The application combines a conversion-focused frontend with robust backend functionality to handle client inquiries, payment processing, and administrative oversight. Built with modern web technologies, it emphasizes premium design aesthetics while maintaining practical business functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built using **React 18 with Vite** as the build tool and development server. The architecture follows a component-based approach with:

- **Component Structure**: Organized into reusable UI components, page-specific components, and business logic components
- **Styling Framework**: Tailwind CSS with custom design system based on brand colors (Dark Teal #003752, Aqua #408FA4)
- **UI Component Library**: Radix UI primitives with custom shadcn/ui components for consistent design patterns
- **State Management**: React Query (TanStack Query) for server state management and API caching
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth transitions and interactive elements
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

The design follows a premium consulting website aesthetic with glassmorphism effects, gradient backgrounds, and modern typography using Lexend and Inter fonts.

### Backend Architecture
The server-side is built with **Express.js** following a RESTful API pattern:

- **API Structure**: Modular route handling with separate concerns for business logic and data access
- **Authentication**: Token-based admin authentication with configurable security tokens
- **Middleware Stack**: Request logging, error handling, and CORS configuration
- **File Serving**: Static asset serving for logo and profile images

### Data Storage Solutions
The application uses **PostgreSQL** as the primary database with **Drizzle ORM** for type-safe database operations:

- **Database Provider**: Neon serverless PostgreSQL for scalable cloud hosting
- **Schema Design**: Relational tables for users, contact inquiries, coaching packages, bookings, and payments
- **Type Safety**: Drizzle-zod integration for automatic TypeScript type generation from database schema
- **Migration Management**: Drizzle Kit for database schema migrations and versioning

Key database entities include:
- Users (with admin role support)
- Contact inquiries (with read/unread status)
- Coaching packages (categorized by target audience)
- Bookings (session scheduling)
- Payments (with Razorpay integration)

### Authentication and Authorization
The system implements a dual-layer security approach:

- **Public Access**: Contact forms and general website content accessible without authentication
- **Admin Authentication**: Bearer token-based authentication for administrative routes
- **Role-Based Access**: Admin-only access to dashboard, payment management, and contact inquiries
- **Environment-Based Security**: Configurable admin tokens with development defaults and production requirements

### Payment Processing Integration
The application integrates **Razorpay** for secure payment processing:

- **Order Creation**: Server-side order generation with package validation
- **Payment Verification**: Webhook-based payment confirmation with signature validation
- **Transaction Management**: Complete payment lifecycle tracking from creation to completion
- **Security**: Server-side signature verification for payment authenticity

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connectivity
- **drizzle-orm**: Type-safe ORM for database operations
- **express**: Node.js web application framework
- **razorpay**: Payment gateway integration for secure transactions

### Frontend Libraries
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI component primitives
- **framer-motion**: Animation and interaction library
- **react-hook-form**: Form state management and validation
- **zod**: TypeScript-first schema validation

### Development and Build Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **tailwindcss**: Utility-first CSS framework
- **drizzle-kit**: Database schema management and migrations

### Payment Gateway
- **Razorpay**: Indian payment gateway supporting multiple payment methods including UPI, cards, and net banking

### Database and Hosting
- **Neon Database**: Serverless PostgreSQL with automatic scaling
- **WebSocket Support**: Real-time database connections via ws library

The architecture prioritizes type safety, scalability, and maintainability while providing a premium user experience for both clients and administrators.