# PlanifyAI - Frontend

React SPA (Vite) responsible for the PlanifyAI user interface.

## Local Setup
```
npm install
npm run dev
```

## Build
```
npm run build
```

## Environment Variables

Create a .env file based on .env.example.

```
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_APP_ID=""
VITE_API_URL="http://localhost:3000"
```

## Main Routes

- `/` (landing)
- `/login`
- `/register`
- `/verify-email`
- `/dashboard`
- `/plans/new`
- `/plans/:id`
- `/profile`
