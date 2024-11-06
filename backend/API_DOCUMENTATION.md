# Event Reservation System API Documentation

## Base URL

`http://localhost:5000`

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Available Endpoints

### Authentication

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Events

- GET `/api/events` - Get all events
- POST `/api/events` - Create new event (Admin only)
- GET `/api/events/:id` - Get event by ID
- PUT `/api/events/:id` - Update event (Admin only)
- DELETE `/api/events/:id` - Delete event (Admin only)

### Reservations

- POST `/api/reservations` - Create new reservation
- GET `/api/reservations` - Get user reservations

## Interactive Documentation

Interactive API documentation is available at `/api-docs` when the server is running.

## Error Responses

The API returns consistent error responses in the following format:

```
{
"message": "Error message description",
"stack": "Error stack trace (only in development mode)"
}
```

## Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
