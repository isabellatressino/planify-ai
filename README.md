# PlanifyAI

PlanifyAI is a full-stack application that helps users generate AI-powered study plans, track daily tasks, and visualize learning progress. The frontend is a React SPA, and the backend provides a REST API built with Express + Prisma (MongoDB), integrating Firebase Auth and the OpenAI API.

## Features
- AI-generated study plans
- Daily task checklist with progress updates
- Dashboard with plans and plan details
- Authentication (Firebase Auth) and user profile

## Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS
- React Router
- Framer Motion

**Backend**
- Node.js + Express
- Prisma ORM

**Database**
- MongoDB

**Auth**
- Firebase Auth (client)
- Firebase Admin SDK (backend)

**AI**
- OpenAI API (gpt-4o-mini)

## Running Locally

**Backend**
```
cd backend
npm install
npm run prisma:generate
npm run prisma:push
npm run dev
```

**Frontend**
```
cd frontend
npm install
npm run dev
```

## Environment Variables
- Frontend: `frontend/.env.example` (details in `frontend/README.md`)
- Backend: `backend/.env.example` (details in `backend/README.md`)

## Credits & License
- Author: [Isabella Tressino](https://github.com/isabellatressino)
- License: MIT 
