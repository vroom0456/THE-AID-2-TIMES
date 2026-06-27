# Supabase Configuration

This directory contains Supabase-related configurations and documentation.

## Overview

The project uses Supabase for:
- **Authentication** (currently disabled for development)
- **Database** (PostgreSQL)
- **File Storage** (for PDFs and resources)

## Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Temporary Auth Bypass

**Note:** Supabase authentication is currently **disabled** to resolve configuration issues.
The frontend (`frontend/src/App.jsx`) uses a temporary bypass login.

To re-enable authentication:
1. Fix your Supabase configuration
2. Set `bypassLogin = false` in `frontend/src/App.jsx`
3. Update the auth service with proper error handling

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Resources Table
```sql
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  file_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Storage Buckets

- `pdfs` - PDF files for resources
- `profiles` - User profile images
- `documents` - Additional documents

## Auth Methods

Currently available (when enabled):
- Email/Password
- OAuth providers (configure in Supabase dashboard)
