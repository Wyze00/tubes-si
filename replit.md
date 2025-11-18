# Nuxt Template Application

## Overview
This is a Nuxt.js 4.x application with Vue 3, Tailwind CSS 4, and Prisma ORM. It demonstrates a full-stack setup with server-side API routes and PostgreSQL database integration.

## Project Architecture

### Frontend
- **Framework**: Nuxt.js 4.2.0
- **UI Framework**: Vue 3.5.22
- **Styling**: Tailwind CSS 4.1.16
- **Build Tool**: Vite 7.1.12

### Backend
- **Runtime**: Nitro 2.12.9 (Nuxt server)
- **Database**: PostgreSQL (Replit managed)
- **ORM**: Prisma 6.18.0

### Key Files
- `app/pages/index.vue` - Home page that fetches and displays database data
- `app/app.vue` - Root application component
- `server/api/test.ts` - API endpoint for fetching data from database
- `server/util/prismaService.ts` - Singleton Prisma client service
- `prisma/schema.prisma` - Database schema definition
- `nuxt.config.ts` - Nuxt configuration with Replit-specific settings

## Development Setup

### Environment Configuration
The application is configured to run on Replit with:
- **Host**: 0.0.0.0
- **Port**: 5000
- **HMR**: WebSocket via Replit domain proxy
- **Database**: PostgreSQL (DATABASE_URL environment variable)

### Running the Application
```bash
npm run dev
```

The dev server starts on port 5000 with hot module replacement (HMR) configured for the Replit proxy environment.

### Database Management
```bash
# Generate Prisma client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name <migration_name>

# Deploy migrations
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio
```

## Recent Changes (November 1, 2025)

### GitHub Import Setup
- Migrated from MySQL to PostgreSQL for Replit compatibility
- Configured Nuxt dev server for Replit environment:
  - Set server host to 0.0.0.0:5000
  - Configured HMR WebSocket with Replit domain proxy
  - Added origin configuration for proper module resolution
  - Disabled devtools to reduce complexity
- Regenerated Prisma migrations for PostgreSQL
- Added sample data to the Nuxt table
- Configured deployment for autoscale mode

### Configuration Notes
The `nuxt.config.ts` includes Replit-specific settings:
- Vite server origin set to Replit dev domain
- HMR configured with WSS protocol on port 443
- Cache-Control headers set to prevent caching issues
- Tailwind CSS 4 integration via Vite plugin

## Database Schema

### Nuxt Model
```prisma
model Nuxt {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
}
```

## API Endpoints

### GET /api/test
Fetches all records from the Nuxt table.

**Response:**
```json
{
  "message": "Data fetched securely",
  "data": [
    {
      "id": 1,
      "title": "Welcome to Nuxt",
      "content": "This is a sample Nuxt application running on Replit"
    }
  ]
}
```

## Deployment

The application is configured for **autoscale** deployment:
- **Build**: `npm run build`
- **Run**: `node .output/server/index.mjs`

This creates an optimized production build that automatically scales based on traffic.

## Testing

Test files are located in the `test/` directory:
- `test/test.test.ts` - Sample test file
- `test/setup.ts` - Test environment setup

Run tests with:
```bash
npm run test
```

## User Preferences

No specific user preferences have been set yet.
