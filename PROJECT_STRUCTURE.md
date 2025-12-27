# Chat App - Project Structure

```
chat-app/
├── client/                          # Next.js client application
│   ├── src/
│   │   ├── app/                    # Next.js App Router pages
│   │   │   ├── layout.tsx          # Root layout with providers
│   │   │   ├── page.tsx            # Home page (redirects)
│   │   │   ├── providers.tsx       # React Query provider
│   │   │   ├── theme.ts            # MUI theme configuration
│   │   │   ├── login/
│   │   │   │   └── page.tsx        # Login page
│   │   │   ├── register/
│   │   │   │   └── page.tsx        # Register page
│   │   │   └── rooms/
│   │   │       ├── page.tsx        # Rooms list page
│   │   │       └── [id]/
│   │   │           └── page.tsx    # Chat room page
│   │   ├── components/             # React components (strict structure)
│   │   │   ├── LoginForm/
│   │   │   │   ├── index.ts        # Barrel export
│   │   │   │   ├── LoginForm.tsx   # Component
│   │   │   │   ├── LoginForm.sx.ts # MUI styles
│   │   │   │   └── LoginForm.test.tsx
│   │   │   ├── RegisterForm/
│   │   │   │   ├── index.ts
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   ├── RegisterForm.sx.ts
│   │   │   │   └── RegisterForm.test.tsx
│   │   │   ├── RoomsList/
│   │   │   │   ├── index.ts
│   │   │   │   ├── RoomsList.tsx
│   │   │   │   ├── RoomsList.sx.ts
│   │   │   │   └── RoomsList.test.tsx
│   │   │   └── ChatRoom/
│   │   │       ├── index.ts
│   │   │       ├── ChatRoom.tsx
│   │   │       ├── ChatRoom.sx.ts
│   │   │       └── ChatRoom.test.tsx
│   │   └── lib/                    # Utilities and API
│   │       ├── api-client.ts       # Axios client with interceptors
│   │       ├── api.ts              # API functions
│   │       ├── auth.ts             # Auth utilities
│   │       └── socket.ts           # Socket.io client
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── jest.config.js
│   └── jest.setup.js
│
├── server/                          # NestJS server application
│   ├── src/
│   │   ├── main.ts                 # Application entry point
│   │   ├── app.module.ts           # Root module
│   │   ├── app.gateway.ts          # WebSocket gateway
│   │   ├── auth/                   # Authentication module
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.service.spec.ts
│   │   │   ├── users.repository.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── local.strategy.ts
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── dto/
│   │   │   │   ├── register.dto.ts
│   │   │   │   └── login.dto.ts
│   │   │   └── schemas/
│   │   │       └── user.schema.ts
│   │   ├── rooms/                  # Rooms module
│   │   │   ├── rooms.module.ts
│   │   │   ├── rooms.controller.ts
│   │   │   ├── rooms.service.ts
│   │   │   ├── rooms.service.spec.ts
│   │   │   ├── rooms.repository.ts
│   │   │   ├── dto/
│   │   │   │   └── create-room.dto.ts
│   │   │   └── schemas/
│   │   │       └── room.schema.ts
│   │   └── messages/               # Messages module
│   │       ├── messages.module.ts
│   │       ├── messages.controller.ts
│   │       ├── messages.service.ts
│   │       ├── messages.repository.ts
│   │       ├── dto/
│   │       │   └── create-message.dto.ts
│   │       └── schemas/
│   │           └── message.schema.ts
│   ├── test/
│   │   ├── app.e2e-spec.ts         # E2E tests
│   │   └── jest-e2e.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── jest.config.js
│
├── package.json                     # Root workspace config
├── README.md                        # Project documentation
├── .prettierrc                      # Prettier configuration
└── .gitignore                       # Git ignore rules

```

## Key Features

### Client
- Next.js 14 with App Router
- Material UI components
- React Query for server state
- Socket.io client for real-time updates
- Strict component folder structure
- Comprehensive test coverage

### Server
- NestJS modular architecture
- MongoDB with Mongoose
- JWT authentication
- WebSocket gateway for real-time messaging
- Repository pattern
- DTO validation
- Unit and E2E tests

