import Hapi from "@hapi/hapi";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import Boom from "@hapi/boom";

const UPLOADS_DIR = path.join(__dirname, "../../../uploads/avatars");

// plugin to instantiate Prisma Client
const usersPlugin = {
  name: "app/users",
  dependencies: ["prisma"],
  register: async function (server: Hapi.Server) {
    server.route([
      {
        method: "POST",
        path: "/signup",
        options: {
          payload: {
            maxBytes: 5 * 1024 * 1024, // 5MB limit for the entire payload
            output: "stream",
            parse: true,
            allow: "multipart/form-data",
          },
        },
        handler: signupHandler,
      },
    ]);
    server.route([
      {
        method: "GET",
        path: "/users",
        handler: getAllUsersHandler,
      },
    ]),
      server.route([
        {
          method: "GET",
          path: "/user/{userId}",
          handler: getDraftsByUserHandler,
        },
      ]);
    server.route([
      {
        method: "DELETE",
        path: "/user/{userId}",
        handler: deleteUserHandler,
      },
    ]);
  },
};

export default usersPlugin;

async function signupHandler(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const { prisma } = request.server.app;

  // Ensure the uploads directory exists
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  const payload = request.payload as any;

  // Extract fields from the payload
  const { name, email } = payload;
  const avatar = payload.avatar; // Avatar file

  if (!name || !email) {
    throw Boom.badRequest("Name and email are required.");
  }

  let avatarUrl: string | null = null;

  // Handle avatar upload
  if (avatar) {
    if (avatar._data.length > 4 * 1024 * 1024) {
      throw Boom.badRequest("Avatar file size must not exceed 4MB.");
    }

    // Generate a unique hash for the file
    const hash = crypto.createHash("sha256").update(avatar._data).digest("hex");
    const fileExtension = path.extname(avatar.hapi.filename);
    const uniqueFilename = `${hash}${fileExtension}`;
    const filePath = path.join(UPLOADS_DIR, uniqueFilename);

    // Save the file to the uploads directory
    fs.writeFileSync(filePath, avatar._data);

    // Set the avatar URL
    avatarUrl = `/uploads/avatars/${uniqueFilename}`;
  }

  try {
    // Create the user in the database
    const createdUser = await prisma.user.create({
      data: {
        name,
        email,
        avatarUrl,
        password: '', // Add empty password for OAuth users
      },
    });

    return h.response(createdUser).code(201);
  } catch (err) {
    console.error(err);
    throw Boom.internal("Failed to create user.");
  }
}

async function getAllUsersHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;

  try {
    const users = await prisma.user.findMany();
    return h.response(users).code(200);
  } catch (err) {
    console.log(err);
  }
}

async function getDraftsByUserHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;

  const userId = request.params.userId; // Remove Number() conversion since id is a string
  try {
    const drafts = await prisma.user.findUnique({
      where: { id: userId },
    });

    return h.response(drafts || undefined).code(200);
  } catch (err) {
    console.log(err);
  }
}

async function deleteUserHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
) {
  const { prisma } = request.server.app;
  const userId = request.params.userId;

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return h.response({ error: "User not found" }).code(404);
    }

    // Delete user's OAuth clients
    await prisma.oAuthClient.deleteMany({
      where: { userId: userId }
    });

    // Delete the user
    await prisma.user.delete({
      where: { id: userId }
    });

    return h.response({ message: "User and all associated data deleted successfully" }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ error: "Failed to delete user" }).code(500);
  }
}
