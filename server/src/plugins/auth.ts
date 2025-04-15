import Hapi from "@hapi/hapi";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import Boom from "@hapi/boom";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const UPLOADS_DIR = path.join(__dirname, "../../uploads/avatars");

const authPlugin = {
  name: "app/auth",
  register: async function (server: Hapi.Server) {
    server.route([
      {
        method: "POST",
        path: "/auth/register",
        options: {
          cors: {
            origin: ["http://localhost:3001"], // Allow requests from this origin
            credentials: true, // Allow credentials
          },
          payload: {
            maxBytes: 5 * 1024 * 1024, // 5MB limit for the entire payload
            output: "stream", // Required for handling file uploads
            parse: true, // Automatically parse the payload
            multipart: true, // Enable multipart handling
            allow: "multipart/form-data", // Allow multipart form data
          },
        },
        handler: async (request, h) => {
          const { prisma } = request.server.app;
          const payload = request.payload as any;

          // Extract fields from the payload
          const { email, password, name } = payload;
          const avatar = payload.avatar; // Avatar file

          if (!email || !password || !name) {
            throw Boom.badRequest("Email, password, and name are required.");
          }

          // Ensure the uploads directory exists
          if (!fs.existsSync(UPLOADS_DIR)) {
            fs.mkdirSync(UPLOADS_DIR, { recursive: true });
          }

          let avatarUrl: string | null = null;

          // Handle avatar upload
          if (avatar) {
            if (avatar._data.length > 4 * 1024 * 1024) {
              throw Boom.badRequest("Avatar file size must not exceed 4MB.");
            }

            // Generate a unique hash for the file
            const hash = crypto
              .createHash("sha256")
              .update(avatar._data)
              .digest("hex");
            const fileExtension = path.extname(avatar.hapi.filename);
            const uniqueFilename = `${hash}${fileExtension}`;
            const filePath = path.join(UPLOADS_DIR, uniqueFilename);

            // Save the file to the uploads directory
            fs.writeFileSync(filePath, avatar._data);

            // Set the avatar URL
            avatarUrl = `/uploads/avatars/${uniqueFilename}`;
          }

          try {
            // Check if the user already exists
            const existingUser = await prisma.user.findUnique({
              where: { email },
            });
            if (existingUser) {
              return h.response({ error: "User already exists" }).code(400);
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create the user
            const user = await prisma.user.create({
              data: {
                email,
                password: hashedPassword,
                name,
                avatarUrl, // Save the avatar URL in the database
              },
            });

            return h
              .response({
                id: user.id,
                email: user.email,
                name: user.name,
                avatarUrl,
              })
              .code(201);
          } catch (error) {
            console.error(error);
            return h.response({ error: "Failed to register user" }).code(500);
          }
        },
      },

      {
        method: "POST",
        path: "/auth/login",
        options: {
          cors: {
            origin: ["http://localhost:3001"], // Allow requests from this origin
            credentials: true, // Allow credentials
          },
        },
        handler: async (request, h) => {
          const { prisma } = request.server.app;
          const { email, password } = request.payload as any;

          try {
            console.log("Login attempt with email:", email);

            // Find the user
            const user = await prisma.user.findUnique({
              where: { email },
            });
            if (!user) {
              return h
                .response({ error: "Invalid email or password" })
                .code(401);
            }

            // Compare the password
            const isValidPassword = await bcrypt.compare(
              password,
              user.password,
            );
            if (!isValidPassword) {
              return h
                .response({ error: "Invalid email or password" })
                .code(401);
            }

            // Generate a JWT token
            const token = jwt.sign(
              { id: user.id, email: user.email },
              JWT_SECRET,
              {
                expiresIn: "1h",
              },
            );

            return h.response({ token }).code(200);
          } catch (error) {
            console.error(error);
            return h.response({ error: "Failed to login" }).code(500);
          }
        },
      },
      {
        method: "GET",
        path: "/auth/me",
        options: {
          cors: {
            origin: ["http://localhost:3001"], // Allow requests from this origin
            credentials: true, // Allow credentials
          },
          pre: [
            {
              method: async (request, h) => {
                const authorization = request.headers.authorization;
                if (!authorization) {
                  throw h.response({ error: "Unauthorized" }).code(401);
                }

                const token = authorization.replace("Bearer ", "");
                try {
                  const decoded = jwt.verify(token, JWT_SECRET);
                  return decoded;
                } catch (error) {
                  throw h.response({ error: "Invalid token" }).code(401);
                }
              },
              assign: "user",
            },
          ],
        },
        handler: async (request, h) => {
          const user = request.pre.user;
          return h.response(user).code(200);
        },
      },
    ]);
  },
};

export default authPlugin;
