# Goal Tracker (Vibe Coded)

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

| Folder / File   | Port | Function                          |
| --------------- | ---- | --------------------------------- |
| `goal-tracker/` | 3000 | Frontend for the Goal Tracker     |
| `server/`       | 3000 | Backend API implementation        |
| `swagger-ui/`   | 3000 | API documentation server          |
| `docs/`         | 3000 | Documentation for the training    |
| `openapi.json`  | 3000 | OpenAPI specification for the API |
