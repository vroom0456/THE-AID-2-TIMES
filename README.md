# THE AID 2 TIMES - Monorepo Structure

## 📁 Project Structure

```
the-aid-2-times/
├── frontend/              # Vite + React UI (independent deployment)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── backend/               # Express.js API (learning layer)
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── supabase/              # DB/Auth/Storage configuration
│   ├��─ .env.example
│   └── README.md
└── package.json           # Root workspace config
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

```bash
# Install all dependencies
npm run install:all
```

### Development

#### Option 1: Run both frontend and backend together
```bash
npm run dev
```
This starts:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

#### Option 2: Run separately
```bash
# Terminal 1 - Frontend
cd frontend && npm run dev

# Terminal 2 - Backend
cd backend && npm run dev
```

### Production Build

```bash
# Build both
npm run build

# Or build separately
npm run build:frontend
npm run build:backend
```

## 📦 Deployment

### Frontend Deployment

The frontend is a static Vite build. Deploy to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```

### Backend Deployment

The backend is a Node.js Express server. Deploy to:
- Heroku
- Railway
- AWS EC2/Elastic Beanstalk
- DigitalOcean
- Render

```bash
cd backend
npm install
npm start
```

## ⚙️ Environment Configuration

### Frontend (.env or .env.local)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### Backend (.env)
```
PORT=3000
NODE_ENV=production
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🔐 Authentication Status

⚠️ **Supabase authentication is currently DISABLED** to resolve configuration issues.

**Temporary bypass**: Frontend bypasses login gate to access features.

### To Re-enable Auth:
1. Fix Supabase configuration
2. Set `bypassLogin = false` in `frontend/src/App.jsx`
3. Update authentication error handling

## 📡 API Routes (Backend)

```
GET  /health              - Health check
GET  /api/info           - Backend info
POST /api/auth/login     - Login (to implement)
POST /api/auth/logout    - Logout (to implement)
GET  /api/resources      - Fetch resources
POST /api/resources      - Create resource
```

## 🛠️ Development Notes

- Frontend dev server proxies `/api` requests to backend at `http://localhost:3000`
- Backend uses CORS to allow frontend requests
- Supabase client is available in both frontend and backend
- Hot-reload enabled for both frontend and backend during development

## 📚 Tech Stack

- **Frontend**: React 18, Vite, Zustand (state), React Hook Form
- **Backend**: Express.js, Node.js
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (disabled, to be fixed)
- **Storage**: Supabase Storage

## 🤝 Contributing

Each module can be developed and deployed independently:
- Make changes in `/frontend` for UI updates
- Make changes in `/backend` for API logic
- Update Supabase config in `/supabase` directory

## 📝 License

MIT
