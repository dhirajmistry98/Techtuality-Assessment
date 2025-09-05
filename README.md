Task Manager Application

A simple Task Manager app built with Node.js, Express, MongoDB, and React. Users can signup, login, add tasks, view tasks, and logout. JWT authentication is used with secure cookies.

What You Need

Node.js (v18+ recommended)

MongoDB (local or cloud, e.g., MongoDB Atlas)

npm (comes with Node.js)

Browser to use frontend (http://localhost:3000)

How to Start
Backend (Server)

Go to the server folder:

cd server


Install dependencies:

npm install


Create a .env file in the server folder with:

PORT=5001
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
NODE_ENV=development


Start the backend server:

npm start


Server will run at: http://localhost:5001

Frontend (Client)

Go to the client folder:

cd client


Install dependencies:

npm install


Start the frontend:

npm run dev


Frontend will run at: http://localhost:3000

What You Can Do

Signup/Login – Create a new account or login

Add Tasks – Add tasks for the logged-in user

View Tasks – See all your tasks

Logout – Log out and clear session

The app uses cookies to store your login session. Make sure credentials are included in API requests.
