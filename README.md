# Real-Time Chat Application

A web-based Real-Time Chat Application that allows users to communicate instantly through a secure and interactive chat system.

The application provides user authentication, real-time messaging, online/offline status, typing indicators, unread message notifications, message history, message deletion, and account deletion.

## Features

### User Authentication

* User registration
* User login
* JWT-based authentication
* Password hashing using bcrypt
* Protected API routes
* Automatic token validation
* Logout by clearing the authentication session

### Real-Time Messaging

* Send messages instantly
* Receive messages without refreshing the page
* Real-time communication using Socket.IO
* Message history stored in MongoDB
* Messages are displayed in chronological order

### Online and Offline Status

* Shows whether a user is online or offline
* Displays the user's last seen time
* Status updates happen in real time

### Typing Indicator

* Shows when another user is typing
* Automatically removes the indicator when typing stops

### Notifications

* Unread message count
* Notification sound
* Browser notification popup
* Unread count is removed when the conversation is opened

### Message Management

* Users can delete their own messages
* Deleted messages are removed in real time
* Users cannot delete another user's messages
* Empty messages are rejected
* Messages are limited to 500 characters

### Account Management

* Users can delete their own accounts
* All messages associated with the deleted account are removed
* Account deletion is reflected in real time for other users

### Security

* Passwords are hashed before storing them in MongoDB
* JWT tokens are used for authentication
* Protected routes require authentication
* Users cannot send messages to themselves
* Users can delete only their own messages
* Basic input validation is implemented
* Sensitive `.env` information is excluded from GitHub

## Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Socket.IO
* JWT
* bcryptjs

### Database

* MongoDB
* Mongoose

### Development Tools

* Visual Studio Code
* MongoDB
* Git
* GitHub
* PowerShell

## Project Structure

```text
real-time-chat-app
│
├── backend
│   │
│   ├── config
│   │
│   ├── middleware
│   │   └── authMiddleware.js
│   │
│   ├── models
│   │   ├── Message.js
│   │   └── User.js
│   │
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── messageRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend
│   ├── chat.html
│   ├── index.html
│   ├── register.html
│   ├── notifications.js
│   └── test.html
│
├── postman
│
├── .gitignore
└── README.md
```

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/revathiaddanki19/real-time-chat-app.git
```

Move into the project folder:

```bash
cd real-time-chat-app
```

### 2. Install Backend Dependencies

Move into the backend folder:

```bash
cd backend
```

Install the required packages:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` folder.

Add:

```text
MONGO_URI=mongodb://127.0.0.1:27017/real_time_chat
PORT=5000
JWT_SECRET=real_time_chat_secret_123
```

For a real deployment, use a strong secret value for `JWT_SECRET`.

### 4. Start MongoDB

Make sure MongoDB is running on your system.

The application uses:

```text
mongodb://127.0.0.1:27017/real_time_chat
```

### 5. Start the Backend

From the `backend` folder, run:

```bash
node server.js
```

The server should start at:

```text
http://localhost:5000
```

You should see:

```text
MongoDB connected successfully
Server running on http://localhost:5000
```

### 6. Start the Frontend

Open another terminal.

Move to the frontend folder:

```bash
cd frontend
```

Start the frontend using:

```bash
npx http-server
```

The frontend will normally be available at:

```text
http://127.0.0.1:8080
```

Open:

```text
http://127.0.0.1:8080/index.html
```

## Application Flow

### Registration

1. User opens the registration page.
2. User enters username, email and password.
3. Backend validates the information.
4. Password is hashed using bcrypt.
5. User information is stored in MongoDB.

### Login

1. User enters email and password.
2. Backend verifies the credentials.
3. JWT token is generated.
4. Token is stored by the frontend.
5. User is redirected to the chat page.

### Sending a Message

```text
User A
   |
   | Send Message
   ↓
Frontend
   |
   ↓
Socket.IO / Backend
   |
   ↓
MongoDB
   |
   ↓
User B
```

Messages are stored in MongoDB and delivered to the receiver in real time using Socket.IO.

### Online Status

When a user connects:

```text
User connected
      ↓
Socket.IO
      ↓
isOnline = true
      ↓
Other users receive status update
```

When a user disconnects:

```text
User disconnected
      ↓
Socket.IO
      ↓
isOnline = false
      ↓
lastSeen is updated
      ↓
Other users receive status update
```

## API Endpoints

### Authentication

| Method | Endpoint                   | Description                     |
| ------ | -------------------------- | ------------------------------- |
| POST   | `/api/auth/register`       | Register a new user             |
| POST   | `/api/auth/login`          | Login user                      |
| DELETE | `/api/auth/delete-account` | Delete logged-in user's account |

### Users

| Method | Endpoint     | Description                             |
| ------ | ------------ | --------------------------------------- |
| GET    | `/api/users` | Get all users except the logged-in user |

### Messages

| Method | Endpoint                          | Description           |
| ------ | --------------------------------- | --------------------- |
| POST   | `/api/messages/send`              | Send a message        |
| GET    | `/api/messages/history/:userId`   | Get chat history      |
| PUT    | `/api/messages/read/:userId`      | Mark messages as read |
| DELETE | `/api/messages/delete/:messageId` | Delete own message    |

Protected endpoints require a valid JWT token.

## Socket.IO Events

The application uses Socket.IO for real-time communication.

Important events include:

```text
join
sendMessage
receiveMessage
deleteMessage
messageDeleted
typing
stopTyping
userStatusChanged
userAccountDeleted
```

These events allow the application to update the interface without requiring a page refresh.

## Database

The application uses MongoDB with two main collections.

### User Collection

Stores:

* Username
* Email
* Hashed password
* Online status
* Last seen
* Created and updated timestamps

### Message Collection

Stores:

* Sender
* Receiver
* Message content
* Read status
* Created and updated timestamps

## Validation

The application performs several validations:

* Username, email and password are required
* Password must contain at least 6 characters
* Duplicate usernames are rejected
* Duplicate emails are rejected
* Empty messages are rejected
* Whitespace-only messages are rejected
* Messages longer than 500 characters are rejected
* Users cannot send messages to themselves
* Receiver must exist
* Users can delete only their own messages

## Testing

The application was tested using multiple browser sessions to verify:

* Registration
* Login
* Authentication
* Real-time messaging
* Message history
* Online status
* Offline status
* Last seen
* Typing indicator
* Unread message notifications
* Browser notifications
* Notification sound
* Message deletion
* Account deletion
* Real-time account deletion
* Message validation
* Protected routes

## Security

The project implements:

* JWT authentication
* Password hashing with bcryptjs
* Protected backend routes
* Input validation
* Authorization checks
* `.env` protection through `.gitignore`
* Ownership validation for message deletion

## Future Enhancements

Possible future improvements include:

* Group chats
* Profile pictures
* Image and file sharing
* Message editing
* Emoji support
* Search messages
* Voice and video calling
* Message reactions
* Read receipts
* Better mobile responsiveness
* Cloud deployment
* MongoDB Atlas
* Improved notification management

## Author

**Addanki Revathi**

B.Tech - Computer Science and Engineering

Vignan Foundation for Science and Technology, Hyderabad

GitHub: https://github.com/revathiaddanki19

## License

This project was developed as an academic/project application for learning and demonstrating real-time web communication, authentication, database management, and Socket.IO.
