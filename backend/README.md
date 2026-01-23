# PlanifyAI - Backend

PlanifyAI API built with Express + Prisma (MongoDB). It integrates OpenAI to generate study plans and Firebase Admin to validate frontend tokens.

## Stack

- Node.js + Express (ES Modules)
- Prisma ORM + MongoDB
- Firebase Admin SDK
- OpenAI API
- Jest + Supertest (tests)

## Local setup

```
npm install
npm run prisma:generate
npm run prisma:push
npm run dev
```

## Prisma

```
npx prisma generate
npx prisma db push
```

## Database

Set `DATABASE_URL` to your MongoDB connection string.

```
DATABASE_URL="mongodb://localhost:27017/planify"
```

## Environment variables

Create a `.env` file based on `.env.example`.

```
PORT=3000
DATABASE_URL=""
OPENAI_API_KEY=""
FIREBASE_PROJECT_ID=""
FIREBASE_CLIENT_EMAIL=""
FIREBASE_PRIVATE_KEY=""
EMAIL_HASH_PEPPER=""
CORS_ORIGINS="http://localhost:5173"
```

## Main endpoints

Profile:
```
GET /me
```

Plans:
```
POST /plans
GET /plans
GET /plans/:id
PATCH /plans/:id/task
DELETE /plans/:id
```
