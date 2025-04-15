# Backend

## Getting started

### Endpoints

#### 1. Register a New User

- **URL**: `/auth/register`
- **Method**: `POST`
- **Description**: Registers a new user with an email, password, and name.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }
  ```
- **Response**:
  - **201**: User successfully registered.
    ```json
    {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe"
    }
    ```
  - **400**: User already exists.
    ```json
    {
      "error": "User already exists"
    }
    ```
  - **500**: Server error.
    ```json
    {
      "error": "Failed to register user"
    }
    ```

#### 2. Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Description**: Authenticates a user and returns a JWT token.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  - **200**: Login successful.
    ```json
    {
      "token": "jwt-token"
    }
    ```
  - **401**: Invalid email or password.
    ```json
    {
      "error": "Invalid email or password"
    }
    ```
  - **500**: Server error.
    ```json
    {
      "error": "Failed to login"
    }
    ```

#### 3. Get Current User

- **URL**: `/auth/me`
- **Method**: `GET`
- **Description**: Retrieves the authenticated user's information based on the
  provided JWT token.
- **Headers**:
  - `Authorization`: `Bearer <jwt-token>`
- **Response**:
  - **200**: User information retrieved successfully.
    ```json
    {
      "id": "user-id",
      "email": "user@example.com"
    }
    ```
  - **401**: Unauthorized or invalid token.
    ```json
    {
      "error": "Unauthorized"
    }
    ```

### Notes

- All endpoints support CORS for requests originating from
  `http://localhost:3001`.
- JWT tokens are signed using the secret defined in the `JWT_SECRET` environment
  variable.
- Passwords are securely hashed using `bcrypt`.

```

```
