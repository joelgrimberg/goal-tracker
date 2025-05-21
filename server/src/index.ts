import Hapi from "@hapi/hapi";
import dotenv from "dotenv"; // Import dotenv
import prisma from "./plugins/prisma";
import users from "./plugins/users";
import goals from "./plugins/goals";
import auth from "./plugins/auth";
import oauth from "./plugins/oauth";
import Inert from "@hapi/inert";
import path from "path";

// Load environment variables from .env.local first, then .env
dotenv.config({ path: '.env.local' });
dotenv.config();

const server: Hapi.Server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || "localhost",
  routes: {
    cors: {
      origin: ["http://localhost:3001"],
      credentials: true,
    },
  },
});

export async function start(): Promise<Hapi.Server> {
  // Register all plugins, including the auth plugin
  await server.register([prisma, users, goals, auth, oauth]);
  await server.register(Inert);

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
