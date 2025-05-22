import Hapi from "@hapi/hapi";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import Boom from "@hapi/boom";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const OAUTH_REDIRECT_URI = process.env.OAUTH_REDIRECT_URI || "http://localhost:3001/oauth";

// Initialize the default client if environment variables are set
async function initializeDefaultClient() {
  if (OAUTH_CLIENT_ID && OAUTH_CLIENT_SECRET) {
    console.log('Initializing OAuth client with ID:', OAUTH_CLIENT_ID);
    try {
      await prisma.oAuthClient.upsert({
        where: { clientId: OAUTH_CLIENT_ID },
        update: {
          clientSecret: OAUTH_CLIENT_SECRET,
          redirectUris: JSON.stringify([OAUTH_REDIRECT_URI]),
          grants: JSON.stringify(["authorization_code", "refresh_token"]),
        },
        create: {
          clientId: OAUTH_CLIENT_ID,
          clientSecret: OAUTH_CLIENT_SECRET,
          redirectUris: JSON.stringify([OAUTH_REDIRECT_URI]),
          grants: JSON.stringify(["authorization_code", "refresh_token"]),
        },
      });
    } catch (error) {
      console.error('Error initializing default client:', error);
    }
  } else {
    console.log('Warning: OAuth client credentials not found in environment variables');
    console.log('OAUTH_CLIENT_ID:', OAUTH_CLIENT_ID);
    console.log('OAUTH_CLIENT_SECRET:', OAUTH_CLIENT_SECRET ? '***' : 'not set');
  }
}

// Cleanup expired authorization codes every minute
setInterval(async () => {
  try {
    const now = new Date();
    const result = await prisma.authorizationCode.deleteMany({
      where: {
        expiresAt: {
          lt: now
        }
      }
    });
    
    if (result.count > 0) {
      console.log(`Cleaned up ${result.count} expired authorization codes`);
    }
  } catch (error) {
    console.error('Error cleaning up expired authorization codes:', error);
  }
}, 60000);

const oauthPlugin = {
  name: "app/oauth",
  register: async function (server: Hapi.Server) {
    // Initialize default client
    await initializeDefaultClient();

    // Register OAuth client
    server.route([
      {
        method: "POST",
        path: "/oauth/clients",
        options: {
          cors: {
            origin: ["http://localhost:3001"],
            credentials: true,
          },
        },
        handler: async (request, h) => {
          const { redirectUris, grants } = request.payload as any;

          const clientId = uuidv4();
          const clientSecret = uuidv4();

          try {
            await prisma.oAuthClient.create({
              data: {
                clientId,
                clientSecret,
                redirectUris: JSON.stringify(redirectUris),
                grants: JSON.stringify(grants),
              }
            });

            return h
              .response({
                clientId,
                clientSecret,
              })
              .code(201);
          } catch (error) {
            console.error('Error creating OAuth client:', error);
            throw Boom.internal('Failed to create OAuth client');
          }
        },
      },
    ]);

    // Authorization endpoint
    server.route([
      {
        method: "GET",
        path: "/oauth/authorize",
        options: {
          cors: {
            origin: ["http://localhost:3001"],
            credentials: true,
          },
        },
        handler: async (request, h) => {
          const { client_id, redirect_uri, response_type, scope, state } = request.query as any;
          console.log('Authorization request received:', { 
            client_id, 
            redirect_uri, 
            response_type, 
            scope, 
            state 
          });

          // Validate client
          const client = await prisma.oAuthClient.findUnique({
            where: { clientId: client_id }
          });

          if (!client) {
            console.log('Client not found:', client_id);
            throw Boom.badRequest("Invalid client ID");
          }

          // Validate redirect URI
          const clientRedirectUris = JSON.parse(client.redirectUris);
          if (!clientRedirectUris.includes(redirect_uri)) {
            console.log('Invalid redirect URI:', { 
              provided: redirect_uri, 
              allowed: clientRedirectUris 
            });
            throw Boom.badRequest("Invalid redirect URI");
          }

          // Generate and store authorization code
          const code = uuidv4();
          const now = new Date();
          const expiresAt = new Date(now.getTime() + (10 * 60 * 1000)); // 10 minutes from now

          try {
            await prisma.authorizationCode.create({
              data: {
                code,
                clientId: client_id,
                redirectUri: redirect_uri,
                scope: scope || null,
                state: state || null,
                expiresAt
              }
            });

            console.log('Stored authorization code:', {
              code: '***',
              clientId: client_id,
              redirectUri: redirect_uri,
              expiresAt: expiresAt.toLocaleString('en-US', { 
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true
              })
            });

            // Redirect back to the client with the authorization code
            const redirectUrl = `${redirect_uri}?code=${code}&state=${state}`;
            console.log('Redirecting to:', redirectUrl);
            return h.redirect(redirectUrl);
          } catch (error) {
            console.error('Error storing authorization code:', error);
            throw Boom.internal('Error processing authorization request');
          }
        },
      },
    ]);

    // Token endpoint
    server.route([
      {
        method: "POST",
        path: "/oauth/token",
        options: {
          cors: {
            origin: ["http://localhost:3001"],
            credentials: true,
          },
        },
        handler: async (request, h) => {
          const { grant_type, code, client_id, client_secret, redirect_uri } = request.payload as any;
          console.log('Token request received:', { 
            grant_type, 
            code, 
            client_id,
            redirect_uri
          });

          // Validate client and secret
          const client = await prisma.oAuthClient.findUnique({
            where: { clientId: client_id }
          });

          if (!client) {
            console.log('Client validation failed: client not found');
            throw Boom.unauthorized("Invalid client ID");
          }

          // Validate client secret
          console.log('Client secret validation:', {
            provided: client_secret ? '***' : 'not provided',
            stored: client.clientSecret ? '***' : 'not stored',
            match: client_secret === client.clientSecret
          });

          if (!client_secret || client_secret !== client.clientSecret) {
            console.log('Client secret validation failed');
            throw Boom.unauthorized("Invalid client secret");
          }

          // Only validate redirect URI for authorization code grants
          if (grant_type === "authorization_code") {
            const clientRedirectUris = JSON.parse(client.redirectUris);
            if (!clientRedirectUris.includes(redirect_uri)) {
              console.log('Invalid redirect URI:', { 
                provided: redirect_uri, 
                allowed: clientRedirectUris 
              });
              throw Boom.unauthorized("Invalid redirect URI");
            }
          }

          if (grant_type === "authorization_code") {
            try {
              // Find and validate authorization code
              const authCode = await prisma.authorizationCode.findUnique({
                where: { code }
              });

              console.log('Authorization code validation:', {
                codeExists: !!authCode,
                code: code,
                storedCode: authCode ? {
                  clientId: authCode.clientId,
                  redirectUri: authCode.redirectUri,
                  expiresAt: authCode.expiresAt.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    hour12: true
                  })
                } : null
              });

              if (!authCode) {
                throw Boom.badRequest("Invalid authorization code");
              }

              if (authCode.clientId !== client_id) {
                throw Boom.badRequest("Client ID mismatch");
              }

              if (new Date() > authCode.expiresAt) {
                throw Boom.badRequest("Authorization code expired");
              }

              // Get the user linked to this OAuth client
              const client = await prisma.oAuthClient.findUnique({
                where: { clientId: client_id },
                include: { user: true }
              });

              if (!client || !client.user) {
                throw Boom.unauthorized("No user account found for this OAuth client. Please run the installation script first.");
              }

              const user = client.user;

              // Generate tokens
              const accessToken = jwt.sign(
                { 
                  clientId: client_id, 
                  scope: authCode.scope,
                  userId: user.id,
                  email: user.email
                },
                JWT_SECRET,
                { expiresIn: "1h" }
              );
              const refreshToken = jwt.sign(
                { 
                  clientId: client_id, 
                  scope: authCode.scope,
                  userId: user.id,
                  email: user.email
                },
                JWT_SECRET,
                { expiresIn: "7d" }
              );

              // Delete used authorization code
              try {
                await prisma.authorizationCode.delete({
                  where: { code }
                });
              } catch (error) {
                // If the code is already deleted, that's fine
                if (error instanceof Error && 'code' in error && error.code === 'P2025') {
                  console.log('Authorization code already deleted');
                } else {
                  console.error('Error deleting authorization code:', error);
                }
              }

              return h.response({
                access_token: accessToken,
                refresh_token: refreshToken,
                token_type: "Bearer",
                expires_in: 3600,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  avatar: user.avatarUrl || '/uploads/avatars/mugshot.png'
                }
              });
            } catch (error: unknown) {
              if (error && typeof error === 'object' && 'isBoom' in error) {
                throw error;
              }
              console.error('Error processing token request:', error);
              throw Boom.internal('Error processing token request');
            }
          } else if (grant_type === "refresh_token") {
            const { refresh_token } = request.payload as any;
            
            if (!refresh_token) {
              throw Boom.badRequest("Refresh token is required");
            }

            try {
              // Verify the refresh token
              const decoded = jwt.verify(refresh_token, JWT_SECRET) as { clientId: string, scope: string };
              
              if (decoded.clientId !== client_id) {
                throw Boom.unauthorized("Invalid refresh token");
              }

              // Generate new tokens
              const accessToken = jwt.sign(
                { clientId: client_id, scope: decoded.scope },
                JWT_SECRET,
                { expiresIn: "1h" }
              );
              const refreshToken = jwt.sign(
                { clientId: client_id, scope: decoded.scope },
                JWT_SECRET,
                { expiresIn: "7d" }
              );

              // Get user account
              const user = await prisma.user.findFirst({
                where: { email: `${client_id}@oauth.local` }
              });

              if (!user) {
                throw Boom.unauthorized("User not found");
              }

              return h.response({
                access_token: accessToken,
                refresh_token: refreshToken,
                token_type: "Bearer",
                expires_in: 3600,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  avatar: user.avatarUrl || '/uploads/avatars/mugshot.png'
                }
              });
            } catch (error) {
              if (error instanceof jwt.JsonWebTokenError) {
                throw Boom.unauthorized("Invalid refresh token");
              }
              throw error;
            }
          }

          throw Boom.badRequest("Unsupported grant type");
        },
      },
    ]);
  },
};

export default oauthPlugin; 