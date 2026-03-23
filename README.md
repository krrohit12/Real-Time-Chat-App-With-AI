# Real-Time Chat App With AI

A collaborative workspace platform where development teams can work together on projects, communicate in real-time, and use AI to generate code - all in one unified application.

---

## What This App Does

This is a real-time collaborative platform that solves the problem of context-switching between ChatGPT, Slack, and your IDE. Users can:
- Create and manage projects
- Invite team members to collaborate
- Chat in real-time within project workspaces
- Use AI (Google Gemini) to generate code by typing `@ai` in chat
- View and edit generated code with syntax highlighting
- Save all work persistently in a database

---

## Complete Application Flow

### STEP 1: User Opens Browser

**What happens:**
- User goes to the website
- App checks: "Is this person logged in?"
- Answer: No
- **Result:** App shows the Login page

---

### STEP 2: User Clicks "Register" (New Account)

**What user sees:**
- A form with Email and Password fields
- "Create Account" button

**User fills in:**
- Email: john@example.com
- Password: secret123
- Clicks "Create Account"

**What happens behind the scenes:**
1. App sends this info to the server
2. Server checks: "Does this email already exist?"
3. If no → Server saves the email and password (encrypted)
4. Server creates a special access token (like a key card)
5. Server sends back: "Success! Here's your token"
6. App saves this token
7. **Result:** User is now logged in and sees the Home page

---

### STEP 3: User Sees Home Page (Dashboard)

**What user sees:**
- "Projects" heading
- Empty list (because they're new)
- "New Project" button

**What happens behind the scenes:**
1. App asks server: "Show me all projects for this user"
2. Server checks the database
3. Server responds: "No projects found"
4. **Result:** App shows empty state with "Create your first project"

---

### STEP 4: User Creates First Project

**User clicks:**
- "New Project" button

**What user sees:**
- A popup appears
- Input field: "Project Name"
- "Create" button

**User types:**
- "todo-app"
- Clicks "Create"

**What happens behind the scenes:**
1. App sends to server: "Create a project called 'todo-app'"
2. Server saves this project in the database
3. Server links this project to the user (so only they can see it)
4. Server responds: "Done! Here's your new project"
5. **Result:** The project card appears on the Home page

---

### STEP 5: User Opens the Project

**User clicks:**
- "Open" button on the "todo-app" project

**What happens:**
- URL changes to show the project ID
- App loads the project workspace

**What user sees:**
- Split screen:
  - **Left side:** Chat box (empty)
  - **Right side:** Code editor (empty)

**What happens behind the scenes:**
1. App asks server: "Give me details for this project"
2. Server sends back project info (name, who can access it, any saved code)
3. App opens a **live connection** to the server (like a phone call that stays open)
4. App tells server: "I'm joining project 'todo-app'"
5. Server notes: "John is now in the todo-app room"
6. **Result:** User is now connected and can chat in real-time

---

### STEP 6: User Sends a Chat Message

**User types:**
- "Hello team!"
- Clicks "Send"

**What happens:**
1. Message appears in the chat immediately (for this user)
2. App sends the message through the live connection to the server
3. Server receives it and checks: "Who else is in this project room?"
4. Server sends the message to everyone in that room
5. **Result:** All team members see "john@example.com: Hello team!" instantly

**Key point:** This happens in real-time. No refresh needed.

---

### STEP 7: User Invites a Collaborator

**User clicks:**
- "Add Users" button

**What user sees:**
- Popup with a list of all users in the system
- Checkboxes next to each name

**User selects:**
- Jane (jane@example.com)
- Clicks "Add to Project"

**What happens behind the scenes:**
1. App tells server: "Add Jane to 'todo-app'"
2. Server updates the project: "todo-app now has 2 members: John and Jane"
3. **Result:** Jane can now see this project when she logs in

---

### STEP 8: Jane Joins the Project

**Meanwhile, Jane logs in:**
- She sees her Home page
- She now sees "todo-app" in her project list
- She clicks "Open"

**What happens:**
1. Jane's app loads the project workspace
2. Jane's app opens a live connection to the server
3. Server notes: "Jane is now in the todo-app room"
4. Jane sees the chat history (including John's "Hello team!" message)
5. **Result:** John and Jane are now both connected to the same project

**Now when either person sends a message, both see it instantly.**

---

### STEP 9: User Asks AI to Generate Code

**John types in the chat:**
- "@ai create a simple todo app with HTML, CSS, and JavaScript"
- Clicks "Send"

**What Jane sees:**
- John's message appears in the chat

**What happens behind the scenes:**
1. App sends the message to the server
2. Server sees "@ai" and thinks: "This is an AI request"
3. Server takes out the "@ai" part, leaving: "create a simple todo app with HTML, CSS, and JavaScript"
4. Server sends this to Google's AI service (Gemini)
5. AI thinks and generates:
   - index.html file (the webpage structure)
   - style.css file (how it looks)
   - script.js file (how it works)
6. AI sends back all this code to the server
7. Server saves the code files in the database (attached to this project)
8. Server sends a message to everyone in the room: "AI generated code!"

**What John and Jane BOTH see:**
- A message from "AI" appears
- Text: "I've created a simple todo app..."
- Below that: The actual code files displayed nicely
- The code has colors and formatting (syntax highlighting)
- The right panel now shows a file tree:
  - index.html
  - style.css
  - script.js

**Result:** Both users can see the AI-generated code at the exact same time.

---

### STEP 10: User Views and Edits the Code

**John clicks on "script.js" in the file tree**

**What happens:**
- The code from script.js appears in the editor panel
- John can read through it

**John makes changes:**
- Edits some of the code
- Clicks "Save"

**What happens behind the scenes:**
1. App sends to server: "Update script.js with this new code"
2. Server saves the updated code in the database
3. **Result:** The changes are saved

**Important:** If Jane refreshes the page, she'll see John's changes because they're saved in the database.

---

### STEP 11: User Continues Working

**Normal workflow:**
- John and Jane can keep chatting
- They can ask AI for more code: "@ai add a delete button to each todo item"
- AI generates more code
- Everyone sees it instantly
- They can edit and save
- All changes are saved to the database

**This creates a collaborative workspace where:**
- Everyone can chat
- Everyone can use AI
- Everyone sees the same code
- Changes are saved for everyone

---

### STEP 12: User Logs Out

**John clicks "Logout"**

**What happens:**
1. App tells server: "John is logging out, block his access token"
2. Server marks John's token as invalid (adds it to a blocklist)
3. App deletes the token from John's browser
4. App forgets who John is
5. **Result:** John is redirected to Login page

**Why the blocklist matters:**
Even if someone copied John's token before he logged out, it won't work anymore because the server checks the blocklist on every request.

**After logout:**
- John's live connection closes
- If he tries to visit the Home page, he's redirected to Login
- He needs to log in again to access anything

---

## Complete Flow Summary

Here's the journey in simple terms:

```
1. User opens app → Sees login page
2. User registers → Gets access token → Logged in
3. User sees dashboard → Empty (no projects yet)
4. User creates project → Project saved → Appears in list
5. User opens project → Connects live to server → Joins project "room"
6. User sends message → Goes to server → Server broadcasts to everyone in room
7. User invites collaborator → Collaborator is added to project
8. Collaborator logs in → Sees the project → Joins the same room
9. User asks AI (@ai) → Server detects it → Sends to AI → AI generates code →
   Server saves code → Broadcasts to everyone → All users see code
10. User edits code → Saves → Server updates database → Changes persist
11. User logs out → Token blocked → Cannot access anything until login again
```

---

## Key Features

### Real-time Collaboration
- Everyone sees messages instantly
- Everyone sees AI responses at the same time
- No delays, no refresh needed

### Unified Workspace
- Chat + AI + Code editor in one place
- Don't need to switch between tools
- Everything is connected

### Persistent Storage
- Close the browser, come back later
- Your projects are still there
- Your code is still there
- Your chat history is still there

### Security
- Passwords are encrypted (not stored as plain text)
- Tokens are checked on every action
- Logged out tokens don't work anymore
- Each person only sees their own projects (unless shared)

---

## Technology Stack

### Backend
- Node.js with Express
- MongoDB for data storage
- Socket.IO for real-time communication
- Redis for token blacklisting
- Google Gemini AI for code generation
- JWT for authentication
- bcrypt for password encryption

### Frontend
- React 18
- Vite (build tool)
- React Router for navigation
- Socket.IO Client for real-time updates
- Axios for HTTP requests
- TailwindCSS for styling
- highlight.js for code syntax highlighting
- Context API for state management

---

## Project Structure

```
Real-Time-Chat-App-With-AI/
├── Backend/
│   ├── controllers/       # Request handlers
│   ├── models/           # Database schemas
│   ├── routes/           # API endpoints
│   ├── services/         # Business logic
│   ├── middleware/       # Authentication & validation
│   ├── db/              # Database connection
│   ├── server.js        # Socket.IO server
│   └── app.js           # Express app
│
└── frontend/
    ├── src/
    │   ├── screens/      # Page components
    │   ├── routes/       # Route configuration
    │   ├── auth/         # Protected route guards
    │   ├── context/      # Global state management
    │   ├── config/       # Axios & Socket.IO config
    │   └── App.jsx       # Root component
    └── public/           # Static assets
```

---

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Redis (local or cloud)
- Google Gemini API key

### Backend Setup
1. Navigate to Backend folder
2. Install dependencies: `npm install`
3. Create `.env` file with:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   REDIS_HOST=your_redis_host
   REDIS_PORT=your_redis_port
   REDIS_PASSWORD=your_redis_password
   GOOGLE_AI_KEY=your_gemini_api_key
   ```
4. Start server: `npm start`

### Frontend Setup
1. Navigate to frontend folder
2. Install dependencies: `npm install`
3. Create `.env` file with:
   ```
   VITE_API_URL=http://localhost:3000
   ```
4. Start dev server: `npm run dev`

---

## How to Use

1. **Register/Login:** Create an account or log in
2. **Create Project:** Click "New Project" and give it a name
3. **Invite Team:** Click "Add Users" to invite collaborators
4. **Start Chatting:** Send messages in real-time
5. **Use AI:** Type `@ai` followed by your request (e.g., "@ai create a React component")
6. **View Code:** Check the file tree on the right panel
7. **Edit & Save:** Click on files to edit and save changes

---

## AI Code Generation

The AI integration allows you to generate code by typing `@ai` in the chat:

**Examples:**
- `@ai create a todo app with HTML, CSS, and JavaScript`
- `@ai build a React counter component`
- `@ai generate a REST API with Express and MongoDB`
- `@ai create a login form with validation`

The AI will generate complete file structures with all necessary code, and all collaborators will see the result simultaneously.

## Socket:
---
| Term       | What It Is                      | Example                        |
  |------------|---------------------------------|--------------------------------|
  | Connection | Link between browser and server | Phone call that stays open     |
  | Socket     | One user's connection           | John's phone line              |
  | Event      | Named message                   | "project-message" event        |
  | Emit       | Send an event                   | socket.emit('message', data)   |
  | On/Listen  | Receive an event                | socket.on('message', callback) |
  | Room       | Group of sockets                | Project workspace              |
  | Join       | Enter a room                    | socket.join(roomId)            |
  | Leave      | Exit a room                     | socket.leave(roomId)           |
  | Broadcast  | Send to all except sender       | socket.broadcast.to(room)      |
  | io.to      | Send to everyone in room        | io.to(room).emit()             |
  | Disconnect | Connection closes               | User leaves page               |
  | Handshake  | Initial connection data         | Token + ProjectId              |
  | Middleware | Pre-connection check            | Verify JWT before connect      |


## License
Author: Rohit Kumar 
This project is open source and available for educational purposes.
