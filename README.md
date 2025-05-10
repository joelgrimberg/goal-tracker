# Goal Tracker (Vibe Coded)

[![Deploy Documentation to GitHub Pages](https://github.com/joelgrimberg/goal-tracker/actions/workflows/deployDocumentation.yml/badge.svg?branch=main)](https://github.com/joelgrimberg/goal-tracker/actions/workflows/deployDocumentation.yml)

## Available NPM Scripts

From the root directory, you can run the following commands:

- `npm run start:api` - Starts the API server
- `npm run start:swagger` - Starts the Swagger UI documentation server
- `npm run start:all` - Starts the frontend, API server, SwaggerUI and
  documentation servers concurrently
- `npm run install:all` - Installs dependencies for all parts of the project
  (root, frontend, server, SwaggerUI and training documentation)
- `npm run start:docs` - Starts the training documentation

## Project Structure

| Folder / File   | Server / Port                      | Function                       |
| --------------- | ---------------------------------- | ------------------------------ |
| `goal-tracker/` | http://localhost:3001              | Frontend for the Goal Tracker  |
| `server/`       | http://localhost:3000              | Backend API implementation     |
| `swagger-ui/`   | http://localhost:3002/api-docs     | API documentation server       |
| `docs/`         | http://localhost:3003/goal-tracker | Documentation for the training |
