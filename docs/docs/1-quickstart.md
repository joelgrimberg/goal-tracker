---
sidebar_position: 2
---

# Quickstart

This guide will help you get started with the Goal Tracker application quickly.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/goal-tracker.git
cd goal-tracker
```

2. Install dependencies:
```bash
npm run install:all
```

3. Set up the database and create initial user:
```bash
npm run install:app
```
This will:
- Create a SQLite database
- Set up the database schema
- Create an initial user account
- Create an OAuth client for API access

## Starting the Application

### Start All Services

To start all services (frontend, backend, SwaggerUI, and documentation) at once:

```bash
npm run start:with-config
```

This command will:
- Start all services
- Display the OAuth configuration needed for API access
- Show all available URLs

### Start Individual Services

If you prefer to start services individually, you can use these commands:

Frontend:
```bash
npm run start:frontend
```

Backend:
```bash
npm run start:api
```

SwaggerUI Documentation:
```bash
npm run start:swagger
```

Training Documentation:
```bash
npm run start:docs
```

## Accessing the Services

Once started, you can access the different components at:

- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3002/api-docs
- Training Documentation: http://localhost:3003/goal-tracker

## API Access

The application uses OAuth 2.0 for API authentication. After running `npm run install:app`, you'll receive:
- OAuth Client ID
- OAuth Client Secret
- Authorization URL: http://localhost:3000/oauth/authorize
- Token URL: http://localhost:3000/oauth/token
- Callback URL: http://localhost:3001/oauth

These credentials can be used to configure API clients like Bruno for making authenticated requests.

For detailed API documentation, visit http://localhost:3002/api-docs when the server is running.
