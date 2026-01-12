# Chat App

A production-quality, full-stack chat application with real-time messaging, user authentication, and Google OAuth sign-in support.

## Tech Stack

- **Client**: Next.js 14 (App Router) + TypeScript + Material UI
- **Server**: NestJS + TypeScript + MongoDB (Mongoose)
- **Real-time**: WebSocket (Socket.io)
- **Authentication**: JWT + Google OAuth 2.0

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Docker** (for MongoDB) - [Download here](https://www.docker.com/get-started)
  - OR **MongoDB** installed locally
- **Git** (for cloning the repository)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd chat-app
```

### 2. Install Dependencies

Install all dependencies for both client and server:

```bash
npm install
```

This will install dependencies for the root workspace, client, and server.

### 3. Start MongoDB

You have two options to run MongoDB:

#### Option A: Using Docker (Recommended)

```bash
docker-compose up -d
```

This starts MongoDB in a Docker container on port 27017.

#### Option B: Using Local MongoDB

If you have MongoDB installed locally:

```bash
mongod
```

Make sure MongoDB is running on `mongodb://localhost:27017`

### 4. Configure Environment Variables

#### Server Configuration

Create a `.env` file in the `server` directory:

```bash
cd server
touch .env
```

Add the following environment variables to `server/.env`:

```env
# Server Configuration
PORT=3001
SERVER_URL=http://localhost:3001
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/chat-app

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production-please-use-a-strong-random-string
JWT_EXPIRES_IN=10m

# Google OAuth Configuration (Required for Google Sign-In)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
```

**Important Notes:**
- Replace `JWT_SECRET` with a strong, random string (use a password generator or `openssl rand -hex 32`)
- The Google OAuth credentials are required for Google Sign-In to work (see setup instructions below)

#### Client Configuration

Create a `.env.local` file in the `client` directory:

```bash
cd ../client
touch .env.local
```

Add the following environment variable to `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 5. Set Up Google OAuth (Required for Google Sign-In)

To enable Google Sign-In functionality, you need to create OAuth 2.0 credentials in the Google Cloud Console:

#### Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "Chat App")
5. Click "Create"

#### Step 2: Configure the OAuth Consent Screen

1. In the Google Cloud Console, navigate to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type (unless you have a Google Workspace account)
3. Fill in the required information:
   - App name: "Chat App" (or your preferred name)
   - User support email: Your email address
   - Developer contact information: Your email address
4. Click "Save and Continue"
5. On the Scopes page, click "Save and Continue" (default scopes are sufficient)
6. On the Test users page, you can add test users if your app is in testing mode. Click "Save and Continue"
7. Review and click "Back to Dashboard"

#### Step 3: Create OAuth 2.0 Credentials

1. Navigate to **APIs & Services** > **Credentials**
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen (follow Step 2 above)
4. Select application type: **Web application**
5. Give it a name (e.g., "Chat App Client")
6. Add **Authorized JavaScript origins**:
   - `http://localhost:3000`
   - `http://localhost:3001` (if needed)
7. Add **Authorized redirect URIs**:
   - `http://localhost:3001/auth/google/callback`
8. Click "Create"
9. **Copy the Client ID and Client Secret** - you'll need these for your `.env` file

#### Step 4: Update Your Environment Variables

Add the credentials you just copied to `server/.env`:

```env
GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
```

**Note for Production:**
- When deploying to production, add your production URLs to the authorized origins and redirect URIs in the Google Cloud Console
- Update the `GOOGLE_CALLBACK_URL`, `SERVER_URL`, and `CLIENT_URL` in your production environment variables

### 6. Run the Application

From the root directory, start both the server and client:

```bash
npm run dev
```

This command starts:
- **Server** on `http://localhost:3001`
- **Client** on `http://localhost:3000`

You can now open your browser and navigate to `http://localhost:3000`

## Features

- ✅ User registration and login (email/password)
- ✅ Google OAuth Sign-In
- ✅ JWT-based authentication
- ✅ Chat rooms
- ✅ Real-time messaging via WebSocket
- ✅ Message history
- ✅ User presence (online/offline status)
- ✅ Dark mode support
- ✅ Responsive Material UI design

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

To test real-time features with multiple users locally:

1. Open `http://localhost:3000` in a regular browser window
2. Open `http://localhost:3000` in an incognito/private window (or different browser)
3. Register different users in each window (or use Google Sign-In)
4. Create/join the same room from both windows
5. Test real-time messaging, presence, and room management

## Project Structure

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

## Troubleshooting

### MongoDB Connection Issues

- **Problem**: Server can't connect to MongoDB
- **Solution**: 
  - Ensure MongoDB is running: `docker-compose ps` (if using Docker)
  - Check `MONGODB_URI` in `server/.env` matches your MongoDB connection string
  - For Docker: `docker-compose up -d` to start MongoDB
  - Verify MongoDB is accessible: `mongosh mongodb://localhost:27017/chat-app`

### Google Sign-In Not Working

- **Problem**: "Google OAuth is not configured" error or redirect not working
- **Solution**:
  - Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `server/.env`
  - Ensure the redirect URI in Google Cloud Console matches: `http://localhost:3001/auth/google/callback`
  - Check that `http://localhost:3000` is in authorized JavaScript origins
  - Make sure your OAuth consent screen is properly configured
  - If in testing mode, add your Google account as a test user

### Port Already in Use

- **Problem**: Port 3000 or 3001 is already in use
- **Solution**:
  - Find the process using the port: `lsof -i :3000` or `lsof -i :3001`
  - Kill the process or change the port in your environment variables
  - For the client: Change `PORT` in `client/package.json` scripts
  - For the server: Change `PORT` in `server/.env`

### CORS Errors

- **Problem**: CORS errors when making API requests
- **Solution**:
  - Verify `CLIENT_URL` in `server/.env` matches your client URL
  - Check that `NEXT_PUBLIC_API_URL` in `client/.env.local` matches your server URL
  - In development, localhost is allowed by default

### JWT Token Issues

- **Problem**: Authentication failing or tokens expiring
- **Solution**:
  - Check `JWT_SECRET` is set and consistent (don't change it while tokens are active)
  - Verify `JWT_EXPIRES_IN` format (e.g., "10m", "1h")
  - Clear browser localStorage if tokens are corrupted

## Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run test` - Run all tests
- `npm run lint` - Lint both client and server
- `npm run format` - Format code with Prettier
- `npm run create-test-users` - Create test users (if script exists)

## License

[Add your license here]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
