# Online Courses Backend API

This is the backend API for an online courses platform. It provides endpoints for user authentication, user management, and course management.

## Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file with the following variables:
```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
```

3. Start the server:
```
npm run dev
```

## API Endpoints

### Authentication

#### Register a new user
```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "role": "student" // Optional, defaults to "student", can be "instructor"
}
```

#### Login user
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```
Response includes JWT access token for authenticating subsequent requests and sets a refresh token as an HTTP-only cookie.

#### Refresh token
```http
POST /api/auth/refresh-token
```
Gets a new access token using the refresh token stored in cookies.

#### Logout user
```http
POST /api/auth/logout
```
Clears the refresh token cookie and removes the refresh token from the database.

### User Management

User routes are prefixed with `/api`.

#### Get current user profile
```http
GET /api/me
Authorization: Bearer {token}
```
Returns the profile information of the currently authenticated user.

### Course Management

Course routes are prefixed with `/api/courses`.

#### Get all courses
```http
GET /api/courses
```

#### Create a course (Instructor only)
```http
POST /api/courses
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Course Title",
  "description": "Course Description",
  "price": 29.99
}
```

## Authentication

The system implements a secure JWT-based authentication:

1. **Access Tokens**: Short-lived (15 minutes) for API requests
2. **Refresh Tokens**: Long-lived (7 days) stored as HTTP-only cookies
3. **Token Refresh**: Automatic refreshing of expired access tokens
4. **User Roles**: Different permissions for 'student' and 'instructor' roles

All protected routes require a valid JWT access token in the Authorization header:

```
Authorization: Bearer {access_token}
```

The token is obtained from the login endpoint or refresh token endpoint.

## Models

### User Model
- username: String (required)
- email: String (required, unique)
- password: String (required, hashed)
- role: String (enum: 'student', 'instructor', default: 'student')
- refreshToken: String (stores the current refresh token)
- timestamps: true (createdAt, updatedAt)

### Course Model
- title: String (required)
- description: String (required)
- instructor: ObjectId (reference to User)
- price: Number (default: 0)
- timestamps: true (createdAt, updatedAt)

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200: Success
- 201: Resource created
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Server error

Each error response includes a message explaining the error.
