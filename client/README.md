Task Manager Application

A full-stack Task Manager application built with Node.js, Express, MongoDB, and React, featuring JWT authentication with secure cookies. Users can register, login, create tasks, view their tasks, and logout securely.

Table of Contents

Features

Tech Stack

Installation

Environment Variables

Available Routes

Frontend Usage

Backend Usage

License

Features

User registration and login with JWT authentication

Secure HTTP-only cookies for session management

Create and view tasks (CRUD operations possible)

Middleware for authentication and validation

CORS configured for frontend integration

Health check endpoint

Optional: Search/filter tasks and state management via Context API or Redux

Tech Stack

Backend: Node.js, Express.js, MongoDB, Mongoose

Authentication: JWT, bcryptjs

Validation & Security: express-validator, cookie-parser, CORS

Frontend: React, Vite, Hooks (optional TailwindCSS for styling)

Installation
Backend

Clone the repository:

git clone <your-repo-url>
cd fullstack-app/server


Install dependencies:

npm install


Create a .env file in the server folder:

PORT=5001
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
NODE_ENV=development


Start the backend server:

npm start


Server will run on: http://localhost:5001

Frontend

Navigate to the client folder:

cd ../client


Install dependencies:

npm install


Start the frontend:

npm run dev


Frontend will run on: http://localhost:3000

Available Routes
Health Check

GET /api/health – Returns server status and timestamp.

Auth Routes

POST /api/auth/signup – Register a new user

POST /api/auth/login – Login user and set JWT cookie

GET /api/auth/me – Get logged-in user info (requires authentication)

POST /api/auth/logout – Logout and clear JWT cookie

Task Routes

GET /api/tasks – Get all tasks for the logged-in user

POST /api/tasks – Create a new task

PUT /api/tasks/:id – Update a task by ID

DELETE /api/tasks/:id – Delete a task by ID

Note: Requests must include credentials for cookie-based JWT authentication:

fetch('http://localhost:5001/api/tasks', {
  method: 'GET',
  credentials: 'include' // Include cookies
});

Frontend Usage

Signup/Login Form – User can register and login; JWT is stored in HTTP-only cookies

Dashboard – Displays a list of tasks for the logged-in user

Add Task Form – Allows creating a new task via POST request

Logout Button – Clears authentication cookies and logs the user out

Optional enhancements:

Search or filter tasks

State management using Context API or Redux

License

This project is MIT Licensed.