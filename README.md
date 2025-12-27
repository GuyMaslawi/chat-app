# Chat App

A production-quality, full-stack chat application with real-time messaging.

## Tech Stack

- **Client**: Next.js 14 (App Router) + TypeScript + Material UI
- **Server**: NestJS + TypeScript + MongoDB (Mongoose)
- **Real-time**: WebSocket (Socket.io)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:

**Server** (`server/.env`):
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

**Client** (`client/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. Start MongoDB using Docker:
```bash
docker-compose up -d
```

Alternatively, if you have MongoDB installed locally:
```bash
mongod
```

4. Run development servers:
```bash
npm run dev
```

This starts both the server (port 3001) and client (port 3000).

## Testing

### Automated Tests

Run all tests:
```bash
npm run test
```

Run client tests only:
```bash
npm run test --workspace=client
```

Run server tests only:
```bash
npm run test --workspace=server
```

Run server e2e tests:
```bash
npm run test:e2e --workspace=server
```

### Manual Testing with Multiple Users

To test with multiple users locally, see [TESTING_MULTIPLE_USERS.md](./TESTING_MULTIPLE_USERS.md) for detailed instructions.

**Quick Start:**
1. Open `http://localhost:3000` in a regular browser window
2. Open `http://localhost:3000` in an incognito/private window (or different browser)
3. Register different users in each window
4. Create/join the same room from both windows
5. Test real-time messaging, presence, and room management

## Architecture

### Client Structure
- Components follow strict folder structure with separate files for component, styles, tests, types, and utils
- State management: React Query for server state, useState/useReducer for local state
- API client with centralized error handling
- Material UI for all UI components

### Server Structure
- Modular NestJS architecture
- Repository pattern for database access
- DTOs with class-validator
- Global validation and exception filters
- JWT authentication
- WebSocket gateway for real-time messaging

## Features

- User authentication (register/login)
- Chat rooms
- Real-time messaging
- Message history
- User presence

