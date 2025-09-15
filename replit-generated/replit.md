# MekanMatch - Social Nightlife Discovery Platform

## Overview

MekanMatch is a mobile-first social platform designed to help users discover vibrant nightlife venues with real-time crowd insights and social features. The platform provides venue discovery, real-time gender ratios, crowd density information, and social check-in functionality to enhance the nightlife experience in Istanbul and beyond.

The application is built as a full-stack web application with a React-based frontend styled with TailwindCSS and shadcn/ui components, powered by an Express.js backend with PostgreSQL database using Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Styling**: TailwindCSS with custom brand colors (midnight blue, neon purple, electric pink) and shadcn/ui component library for consistent design
- **State Management**: React Query for server state management and custom React Context for client-side app state
- **Routing**: Wouter for lightweight client-side routing
- **Typography**: Custom font stack using Montserrat, Open Sans, and Poppins fonts
- **Responsive Design**: Mobile-first approach with glass morphism effects and nightlife-inspired visual design

### Backend Architecture
- **Framework**: Express.js with TypeScript running in ESM mode
- **API Design**: RESTful API structure with organized route handlers
- **Database Layer**: Drizzle ORM for type-safe database operations with PostgreSQL
- **Development Setup**: Hot reload with Vite middleware integration for development
- **Data Storage**: In-memory storage implementation with interface for easy database migration

### Authentication System
- **Phone-based Authentication**: SMS verification flow with mock implementation for demo purposes
- **User Profiles**: Profile setup with interests, age, gender, and subscription tiers (free, premium, elite)
- **Session Management**: Client-side state persistence using localStorage

### Database Schema Design
- **Users Table**: Stores user profiles, subscription information, and preferences
- **Venues Table**: Contains venue details, location data, features, and operational information
- **Check-ins Table**: Tracks user visits to venues with visibility settings
- **Events Table**: Manages venue events and promotional activities
- **Menu Items**: Stores venue menu and pricing information
- **Notifications**: Handles user alerts and promotional messages

### Real-time Features Architecture
- **Crowd Analytics**: Real-time gender ratio calculation and crowd density tracking
- **Social Discovery**: User visibility and connection features within venues
- **Live Updates**: Dynamic crowd statistics and venue information updates

### UI Component System
- **Design System**: Comprehensive component library using Radix UI primitives
- **Brand Identity**: Custom color palette with neon glow effects and dark theme
- **Mobile Navigation**: Bottom tab navigation with smooth animations
- **Interactive Elements**: Gesture-friendly buttons, cards, and form components

## External Dependencies

### Database and Hosting
- **Neon Database**: PostgreSQL hosting with serverless connection pooling
- **Drizzle Kit**: Database migration and schema management tools

### UI and Styling
- **Radix UI**: Headless component primitives for accessibility and behavior
- **TailwindCSS**: Utility-first CSS framework for rapid styling
- **Lucide React**: Icon library for consistent iconography
- **class-variance-authority**: Type-safe variant styling utility

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Development environment plugins and runtime error handling

### Networking and Data
- **TanStack Query**: Server state management with caching and synchronization
- **Wouter**: Minimal client-side routing solution
- **date-fns**: Date manipulation and formatting utilities

### Form Handling
- **React Hook Form**: Performant form library with validation
- **Zod**: Schema validation for type-safe form handling and API validation

The architecture emphasizes type safety, developer experience, and scalable patterns while maintaining the vibrant, nightlife-inspired user experience that defines the MekanMatch brand.