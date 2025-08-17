Cloud File Management System

A full-stack web application built with the MERN stack that allows users to securely upload and manage their files. 

PUBLIC URL: http://13.55.223.48/

LOGIN:

Username:  User1
Email:     user1@email.com
Password : user

Tech Stack

Frontend: React, Tailwind CSS, Axios

Backend: Node.js, Express, MongoDB (with Mongoose)

Authentication: JSON Web Tokens (JWT)

Prerequisites

Before you begin, ensure you have the following installed:

Node.js and npm

MongoDB (running locally or a connection string from a service like MongoDB Atlas)

Getting Started

Follow these steps to get your development environment set up and running.

1. Clone the Repository


git clone https://github.com/your-username/your-repository-name.git
cd your-repository-name

2. Backend Setup


# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a local environment file from the example
cp .env.example .env

Now, open the newly created .env file and add your configuration values:


# Your MongoDB connection string
MONGO_URI=mongodb://localhost:xxxx/file-storage-app

# A long, random string to secure your tokens
JWT_SECRET=your_super_secret_key_for_jwt```

Now, start the backend server:

npm run dev

The backend server should now be running on http://localhost:5001.

3. Frontend Setup

In a new terminal, set up and run the React frontend.


# Navigate to the frontend directory from the root
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start

The application will automatically open in your browser at http://localhost:3000.

Usage

Once both servers are running, you can register a new user, log in, and begin uploading and managing your files. Ensure the API base URL in frontend/src/axiosConfig.jsx is pointing to your backend server (http://localhost:5001 by default).