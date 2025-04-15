import Hapi from "@hapi/hapi";
import dotenv from "dotenv"; // Import dotenv
import prisma from "./plugins/prisma";
import users from "./plugins/users";
import goals from "./plugins/goals";
import auth from "./plugins/auth";

// Load environment variables from .env file
dotenv.config();

const server: Hapi.Server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || "localhost",
  routes: {
    cors: true,
  },
});

export async function start(): Promise<Hapi.Server> {
  // Register all plugins, including the auth plugin
  await server.register([prisma, users, goals, auth]);
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
