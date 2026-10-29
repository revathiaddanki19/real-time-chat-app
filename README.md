# Real-Time Chat Application

A web-based Real-Time Chat Application that allows users to communicate instantly through a secure and interactive chat system.

The application provides user authentication, real-time messaging, online/offline status, typing indicators, unread message notifications, message history, message deletion, and account deletion.

## Features

### User Authentication

- User registration
- User login
- JWT-based authentication
- Password hashing using bcryptjs
- Protected API routes
- Automatic token validation
- Secure account management

### Real-Time Messaging

- Send messages instantly
- Receive messages without refreshing the page
- Real-time communication using Socket.IO
- Message history stored in MongoDB
- Messages are displayed in chronological order

### Online and Offline Status

- Shows whether a user is online or offline
- Displays the user's last seen time
- Status updates happen in real time

### Typing Indicator

- Shows when another user is typing
- Automatically removes the indicator when typing stops

### Notifications

- Unread message count
- Notification sound
- Browser notification popup
- Unread count is removed when the conversation is opened

### Message Management

- Users can delete their own messages
- Deleted messages are removed in real time
- Users cannot delete another user's messages
- Empty messages are rejected
- Messages are limited to 500 characters

### Account Management

- Users can delete their own accounts
- All messages associated with the deleted account are removed
- Account deletion is reflected in real time for other users

### Security

- Passwords are hashed before storing them in MongoDB
- JWT tokens are used for authentication
- Protected routes require authentication
- Users cannot send messages to themselves
- Users can delete only their own messages
- Input validation is implemented
- Sensitive `.env` information is excluded from GitHub

## Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript
- Socket.IO Client

### Backend

- Node.js
- Express.js
- Socket.IO
- JSON Web Token (JWT)
- bcryptjs

### Database

- MongoDB
- Mongoose

### Development Tools

- Visual Studio Code
- MongoDB
- Git
- GitHub
- PowerShell

## Project Structure

```text
real-time-chat-app
|
|-- backend
|   |
|   |-- config
|   |
|   |-- middleware
|   |   `-- authMiddleware.js
|   |
|   |-- models
|   |   |-- Message.js
|   |   `-- User.js
|   |
|   |-- routes
|   |   |-- authRoutes.js
|   |   |-- messageRoutes.js
|   |   `-- userRoutes.js
|   |
|   |-- .env
|   |-- .gitignore
|   |-- package.json
|   |-- package-lock.json
|   `-- server.js
|
|-- frontend
|   |-- chat.html
|   |-- index.html
|   |-- register.html
|   |-- notifications.js
|   `-- test.html
|
|-- postman
|
|-- .gitignore
`-- README.md