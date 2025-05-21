# Goal Tracker (Vibe Coded)

[![Deploy Documentation to GitHub Pages](https://github.com/joelgrimberg/goal-tracker/actions/workflows/deployDocumentation.yml/badge.svg?branch=main)](https://github.com/joelgrimberg/goal-tracker/actions/workflows/deployDocumentation.yml)

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

## Available NPM Scripts

From the root directory, you can run the following commands:

- `npm run start:api` - Starts the API server
- `npm run start:swagger` - Starts the Swagger UI documentation server
- `npm run start:all` - Starts the frontend, API server, SwaggerUI and
  documentation servers concurrently
- `npm run start:with-config` - Starts all services and displays OAuth
  configuration for API access
- `npm run install:all` - Installs dependencies for all parts of the project
  (root, frontend, server, SwaggerUI and training documentation)
- `npm run install:app` - Sets up the database and creates initial user
- `npm run start:docs` - Starts the training documentation

## Project Structure

| Folder / File   | Server / Port                      | Function                       |
| --------------- | ---------------------------------- | ------------------------------ |
| `goal-tracker/` | http://localhost:3001              | Frontend for the Goal Tracker  |
| `server/`       | http://localhost:3000              | Backend API implementation     |
| `swagger-ui/`   | http://localhost:3002/api-docs     | API documentation server       |
| `docs/`         | http://localhost:3003/goal-tracker | Documentation for the training |

## API Access

The application uses OAuth 2.0 for API authentication. After running
`npm run install:app`, you'll receive:

- OAuth Client ID
- OAuth Client Secret
- Authorization URL
- Token URL
- Callback URL

These credentials can be used to configure API clients like Bruno for making
authenticated requests.

For detailed API documentation, visit http://localhost:3002/api-docs when the
server is running.
