# Goal Tracker (Vibe Coded)

## TODO

- [ ] Add E2E tests

## Keyboard Mapping

| Key                         | Page     | Effect                              |
| --------------------------- | -------- | ----------------------------------- |
| `s`                         | General  | Seed database                       |
| `ArrowDown` or `j`          | About    | Move selection down                 |
| `ArrowUp` or `k`            | About    | Move selection up                   |
| `Enter`                     | About    | Open selected link or email         |
| `Escape`                    | About    | Navigate back to the home page      |
| `e`                         | About    | Open the first email in the list    |
| `t`                         | About    | Open the Twitter link in a new tab  |
| `l`                         | About    | Open the LinkedIn link in a new tab |
| `a`                         | Header   | Navigate to the About page          |
| `=` or `+`                  | Header   | Toggle the menu                     |
| `Escape`                    | Login    | Navigate back to the home page      |
| `Ctrl+Enter` or `Cmd+Enter` | Login    | Submit the login form               |
| `Escape`                    | Register | Navigate                             |
| `j` or `ArrowDown`          | App      | Move selection down                 |
| `k` or `ArrowUp`            | App      | Move selection up                   |
| `Enter` or `e`              | App      | Edit the selected goal              |
| `i`                         | App      | Toggle info for the selected goal   |
| `t`                         | App      | Delete the selected goal            |
| `l`                         | App      | Login/logout                        |
| `m`                         | App      | Show modal                          |
| `Escape`                    | App      | Cancel selection and close modal    |

## Available NPM Scripts

From the root directory, you can run the following commands:

- `npm run start:api` - Starts the API server
- `npm run start:swagger` - Starts the Swagger UI documentation server
- `npm start` - Starts both the API and Swagger UI servers concurrently
- `npm run install:all` - Installs dependencies for all parts of the project (root, server, and swagger-ui)
- `npm test` - Runs the API tests

## Project Structure

- `server/` - Backend API implementation
- `swagger-ui/` - API documentation server
- `openapi.json` - OpenAPI specification for the API
