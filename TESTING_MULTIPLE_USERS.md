# Testing with Multiple Users Locally

Here are several ways to test the chat app with multiple users on the same machine:

## Method 1: Multiple Browser Windows (Easiest)

1. **Open multiple browser windows/tabs:**
   - Regular window: `http://localhost:3000`
   - Incognito/Private window: `http://localhost:3000` (or use a different browser)

2. **Register different users:**
   - **Window 1 (User 1):**
     - Username: `alice`
     - Email: `alice@test.com`
     - Password: `password123`
   
   - **Window 2 (User 2):**
     - Username: `bob`
     - Email: `bob@test.com`
     - Password: `password123`

3. **Create/Join the same room:**
   - User 1 creates a room (e.g., "Test Room")
   - User 2 joins the same room
   - Both users should see each other online
   - Send messages and verify they appear for both users

## Method 2: Different Browsers

Use different browsers (each maintains separate localStorage):
- Chrome: `http://localhost:3000`
- Firefox: `http://localhost:3000`
- Safari: `http://localhost:3000`
- Edge: `http://localhost:3000`

Each browser will have its own session and localStorage, so you can log in as different users.

## Method 3: Browser Profiles

Create separate browser profiles:
- **Chrome:** Settings → People → Add person
- **Firefox:** Create separate profiles using `firefox -ProfileManager`

Each profile has its own localStorage and cookies.

## Method 4: Quick Test Users Script

Use the provided script to quickly create test users:

```bash
# Make sure your server is running first, then:
npm run create-test-users
```

This will create 4 test users:
- `alice@test.com` / `password123`
- `bob@test.com` / `password123`
- `charlie@test.com` / `password123`
- `diana@test.com` / `password123`

**Alternative: Manual API calls**

You can also create users manually via curl:

```bash
# Create User 1
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@test.com","password":"password123"}'

# Create User 2
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"bob","email":"bob@test.com","password":"password123"}'
```

## Testing Scenarios

Once you have multiple users set up, test:

1. **Room Creation:**
   - User 1 creates a room
   - Verify User 2 sees it in their room list
   - Verify online count shows correctly

2. **Joining Rooms:**
   - User 2 joins User 1's room
   - Verify both users see each other in the online users list
   - Verify online count updates to 2

3. **Messaging:**
   - User 1 sends a message
   - Verify User 2 receives it immediately
   - User 2 replies
   - Verify User 1 receives it immediately
   - Verify message colors are different for each user

4. **Presence:**
   - User 1 leaves the room
   - Verify User 2 sees the online count decrease
   - User 1 rejoins
   - Verify User 2 sees the online count increase

5. **Room Management:**
   - User 1 (room creator) edits room name
   - Verify User 2 sees the updated name
   - User 1 deletes the room
   - Verify User 2 is redirected to rooms list

6. **Multiple Rooms:**
   - Create multiple rooms
   - Join different rooms from different users
   - Verify messages are isolated per room
   - Verify online counts are accurate per room

## Tips

- **Clear localStorage if needed:** Open browser console and run `localStorage.clear()` to reset authentication
- **Check Network tab:** Monitor WebSocket connections to see real-time events
- **Use Browser DevTools:** Check console logs for debugging
- **Monitor Server Logs:** Watch the server terminal for connection/disconnection events

## Troubleshooting

If you're having issues:

1. **Users not seeing each other:**
   - Check that both users are actually in the same room
   - Verify WebSocket connections are established (check Network tab)
   - Check server logs for connection errors

2. **Messages not appearing:**
   - Verify both users have joined the room
   - Check browser console for errors
   - Verify Socket.IO events are being emitted/received

3. **Online count incorrect:**
   - Refresh both browsers
   - Check that users are properly tracked in `roomUsers` map
   - Verify presence updates are being sent

