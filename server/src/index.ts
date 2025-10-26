import Hapi from "@hapi/hapi";
import dotenv from "dotenv"; // Import dotenv
import prisma from "./plugins/prisma";
import users from "./plugins/users";
import goals from "./plugins/goals";
import auth from "./plugins/auth";
import oauth from "./plugins/oauth";
import Inert from "@hapi/inert";
import path from "path";

// Load environment variables from .env first, then .env.local (which takes precedence)
// Use absolute paths to ensure files are found regardless of working directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const server: Hapi.Server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || "localhost",
});

export async function start(): Promise<Hapi.Server> {
  // Register all plugins, including the auth plugin
  // Register goals BEFORE auth to ensure it doesn't get intercepted
  await server.register([prisma, goals, users, auth, oauth]);
  await server.register(Inert);

  // Add CORS headers to all responses
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    if (response && 'header' in response && typeof response.header === 'function') {
      response.header('Access-Control-Allow-Origin', 'http://localhost:3001');
      response.header('Access-Control-Allow-Credentials', 'true');
    }
    return h.continue;
  });

  // Add CORS preflight handler for all routes
  server.route({
    method: 'OPTIONS',
    path: '/{any*}',
    handler: (request, h) => {
      return h.response().code(204)
        .header('Access-Control-Allow-Origin', 'http://localhost:3001')
        .header('Access-Control-Allow-Credentials', 'true')
        .header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        .header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
  });

  server.route({
    method: "GET",
    path: "/uploads/avatars/{filename}",
    handler: {
      directory: {
        path: path.join(__dirname, "../uploads/avatars"),
        redirectToSlash: true,
        index: false,
      },
    },
  });

  await server.start();
  return server;
}

process.on("unhandledRejection", async (err) => {
  await server.app.prisma.$disconnect();
  console.log(err);
  process.exit(1);
});

start()
  .then((server) => {
    console.log(`
🚀 Server ready at: ${server.info.uri}
⭐️ See sample requests: https://github.com/prisma/prisma-examples/blob/latest/orm/hapi/README.md#using-the-rest-api
`);
  })
  .catch((err) => {
    console.log(err);
  });
