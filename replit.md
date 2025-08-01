# Snapy - AI-Powered Design Platform

## Overview

Snapy is a comprehensive SaaS platform for creating professional digital assets with AI-powered design tools. The application features a vector graphics editor, AI asset generation, premium templates, and multi-format export capabilities. Built as a full-stack monorepo with React frontend and Express.js backend, the platform is designed for serverless deployment on Vercel with scalable architecture supporting tiered subscription plans.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design system
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Canvas Engine**: Fabric.js integration for vector graphics manipulation and editing
- **Theme Support**: Built-in light/dark mode with CSS custom properties

### Backend Architecture
- **Framework**: Express.js with TypeScript for RESTful API services
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Centralized schema definitions in shared directory for frontend/backend consistency
- **Session Management**: PostgreSQL-based session storage with connect-pg-simple
- **File Processing**: Server-side image processing and export functionality

### Data Storage Solutions
- **Primary Database**: PostgreSQL for user data, projects, templates, assets, and subscription information
- **Database Provider**: Neon Database (PostgreSQL-compatible serverless database)
- **ORM**: Drizzle ORM with migrations stored in dedicated migrations directory
- **Schema Structure**: Normalized tables for users, projects, templates, assets, and exports

### Authentication and Authorization
- **Authentication Strategy**: Simplified header-based authentication (demo implementation)
- **User Roles**: Basic role-based access with user profiles and subscription tiers
- **Session Management**: Server-side session storage with PostgreSQL backend
- **Authorization**: Middleware-based route protection for authenticated endpoints

### External Dependencies
- **AI Services**: OpenAI API integration for image generation and AI-powered asset creation
- **Payment Processing**: Stripe integration for subscription management and billing
- **Cloud Database**: Neon Database for serverless PostgreSQL hosting
- **Development Tools**: Replit-specific plugins and error overlay for development experience
- **UI Components**: Comprehensive Radix UI primitives for accessible component foundation
- **Vector Graphics**: Fabric.js for canvas manipulation and vector editing capabilities