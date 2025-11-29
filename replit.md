# Atlantic Weizard - Digital Products Marketplace

## Overview

Atlantic Weizard is a full-stack e-commerce platform for selling digital products (PDFs, guides, templates) and online courses. The application provides instant digital downloads with secure token-based access, user accounts with purchase history, PayU payment integration for Indian markets, and a complete admin panel for product and order management. The platform features a responsive, mobile-first UI with dark/light theme support and offers lifetime access to purchased content through a user dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**: React with TypeScript, built using Vite for fast development and optimized production builds.

**UI Framework**: Shadcn/ui components (Radix UI primitives) with Tailwind CSS for styling. The design system uses CSS variables for theming, supporting both light and dark modes with a luxury aesthetic featuring gold/amber accent colors.

**State Management**: 
- TanStack Query (React Query) for server state management with aggressive caching (staleTime: Infinity)
- React Context API for cross-cutting concerns (cart, authentication, theme)
- Local storage for cart persistence

**Routing**: Wouter for client-side routing (lightweight alternative to React Router)

**Key Design Patterns**:
- Component composition with Radix UI primitives
- Custom hooks for reusable logic (useAuth, useCart, useToast, useIsMobile)
- Context providers for global state (AuthProvider, CartProvider, ThemeProvider)
- Form handling with react-hook-form and zod validation

### Backend Architecture

**Runtime**: Node.js with Express.js server

**API Design**: RESTful API with JSON responses, organized in a single routes file with modular service imports

**Authentication**: Passport.js with local strategy using scrypt for password hashing, session-based authentication with express-session

**Session Management**: PostgreSQL-backed sessions using connect-pg-simple for production persistence

**Security Features**:
- HMAC-signed download tokens with expiration for secure file access
- Password hashing with scrypt and salt
- Session secrets with secure defaults
- CORS and trust proxy configuration for production deployment

**Key Design Decisions**:
- Monolithic server structure for simplicity (single entry point in server/index.ts)
- Service layer pattern (storage, email, payment services)
- Database abstraction through IStorage interface (currently PostgreSQL implementation)

### Data Storage

**Database**: PostgreSQL accessed via Neon serverless driver

**ORM**: Drizzle ORM with type-safe schema definitions

**Schema Design**:
- Products table supporting both PDF and course types
- Courses table with one-to-one relationship to products
- Course modules table with ordered content (video, PDF, text)
- Orders table with JSONB for flexible customer info and cart items
- User access table for purchase tracking and lifetime access grants
- Users and admins tables for authentication
- Session table for connect-pg-simple (auto-created)

**Migration Strategy**: Drizzle Kit for schema migrations, with push and seed scripts

### External Dependencies

**Payment Gateway**: PayU integration for Indian market
- Supports TEST and LIVE modes
- HMAC-based hash generation for transaction security
- Callback URLs for success/failure handling
- Transaction ID generation and verification

**Email Service**: Resend API for transactional emails
- Order confirmations
- Gracefully degrades when API key not configured
- Email service disabled mode for development

**File Storage**: Currently configured for external URLs (referenced in fileUrl fields)
- PDF products store download URLs
- Course modules store content URLs for video/PDF materials
- Secure download tokens protect file access

**Development Tools**:
- TypeScript for type safety across full stack
- Vite for frontend development with HMR
- esbuild for production server bundling
- Drizzle Kit for database schema management

**Infrastructure Considerations**:
- Designed for deployment on platforms supporting Node.js (Replit, Vercel, etc.)
- Environment-based configuration (DATABASE_URL, SESSION_SECRET, RESEND_API_KEY, PayU credentials)
- WebSocket support required for Neon serverless PostgreSQL
- Trust proxy configuration for deployment behind reverse proxies