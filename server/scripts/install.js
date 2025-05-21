const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createEnvFile(content, filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content);
  console.log(`Created ${filePath}`);
}

async function main() {
  try {
    console.log('Welcome to the Goal Tracker installation script!');
    console.log('This script will help you set up your initial user account and OAuth configuration.\n');

    // Get user information
    const name = await question('Enter your name: ');
    const email = await question('Enter your email: ');

    // Create or update user account
    console.log('Setting up user account...');
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (user) {
      console.log('\nA user with this email already exists:');
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      
      const shouldUpdate = await question('\nWould you like to update this user? (yes/no): ');
      
      if (!['yes', 'y', 'YES', 'Y'].includes(shouldUpdate.toLowerCase().trim())) {
        console.log('\nInstallation cancelled. No changes were made.');
        process.exit(0);
      }

      console.log('\nUpdating user information...');
      user = await prisma.user.update({
        where: { email },
        data: {
          name,
          // Don't update password for OAuth users
        }
      });
    } else {
      console.log('Creating new user account...');
      user = await prisma.user.create({
        data: {
          name,
          email,
          password: '', // OAuth users don't need a password
        }
      });
    }

    // Create OAuth client with the user's email
    console.log('\nCreating OAuth client...');
    const clientId = uuidv4();
    const clientSecret = uuidv4();
    const redirectUri = 'http://localhost:3001/oauth';

    // Check if user already has an OAuth client
    const existingClient = await prisma.oAuthClient.findFirst({
      where: { 
        clientId: clientId
      }
    });

    if (existingClient) {
      console.log('Updating existing OAuth client...');
      await prisma.oAuthClient.update({
        where: { id: existingClient.id },
        data: {
          clientId,
          clientSecret,
          redirectUris: JSON.stringify([redirectUri]),
          grants: JSON.stringify(['authorization_code', 'refresh_token']),
          userId: user.id  // Link to user
        }
      });
    } else {
      console.log('Creating new OAuth client...');
      await prisma.oAuthClient.create({
        data: {
          clientId,
          clientSecret,
          redirectUris: JSON.stringify([redirectUri]),
          grants: JSON.stringify(['authorization_code', 'refresh_token']),
          userId: user.id  // Link to user
        }
      });
    }

    // Create server .env file (with placeholder values)
    const serverEnvContent = `# Server Configuration
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_jwt_secret_here"

# OAuth Configuration
OAUTH_CLIENT_ID="your_client_id_here"
OAUTH_CLIENT_SECRET="your_client_secret_here"
OAUTH_REDIRECT_URI="http://localhost:3001/oauth"
`;

    // Create server .env.local file (with actual values)
    const serverEnvLocalContent = `# Server Configuration
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET="${uuidv4()}"

# OAuth Configuration
OAUTH_CLIENT_ID="${clientId}"
OAUTH_CLIENT_SECRET="${clientSecret}"
OAUTH_REDIRECT_URI="${redirectUri}"
`;

    // Create frontend .env file (with placeholder values)
    const frontendEnvContent = `# Frontend Configuration
NEXT_PUBLIC_API_URL="http://localhost:3000"

# OAuth Configuration
NEXT_PUBLIC_OAUTH_CLIENT_ID="your_client_id_here"
NEXT_PUBLIC_OAUTH_CLIENT_SECRET="your_client_secret_here"
NEXT_PUBLIC_OAUTH_REDIRECT_URI="http://localhost:3001/oauth"
`;

    // Create frontend .env.local file (with actual values)
    const frontendEnvLocalContent = `# Frontend Configuration
NEXT_PUBLIC_API_URL="http://localhost:3000"

# OAuth Configuration
NEXT_PUBLIC_OAUTH_CLIENT_ID="${clientId}"
NEXT_PUBLIC_OAUTH_CLIENT_SECRET="${clientSecret}"
NEXT_PUBLIC_OAUTH_REDIRECT_URI="${redirectUri}"
`;

    // Create example files
    const serverEnvExample = `# Server Configuration
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_jwt_secret_here"

# OAuth Configuration
OAUTH_CLIENT_ID="your_client_id_here"
OAUTH_CLIENT_SECRET="your_client_secret_here"
OAUTH_REDIRECT_URI="http://localhost:3001/oauth"
`;

    const frontendEnvExample = `# Frontend Configuration
NEXT_PUBLIC_API_URL="http://localhost:3000"

# OAuth Configuration
NEXT_PUBLIC_OAUTH_CLIENT_ID="your_client_id_here"
NEXT_PUBLIC_OAUTH_CLIENT_SECRET="your_client_secret_here"
NEXT_PUBLIC_OAUTH_REDIRECT_URI="http://localhost:3001/oauth"
`;

    // Write environment files
    await createEnvFile(serverEnvContent, path.join(__dirname, '../../server/.env'));
    await createEnvFile(serverEnvLocalContent, path.join(__dirname, '../../server/.env.local'));
    await createEnvFile(frontendEnvContent, path.join(__dirname, '../../goal-tracker/.env'));
    await createEnvFile(frontendEnvLocalContent, path.join(__dirname, '../../goal-tracker/.env.local'));
    await createEnvFile(serverEnvExample, path.join(__dirname, '../../server/.env.example'));
    await createEnvFile(frontendEnvExample, path.join(__dirname, '../../goal-tracker/.env.example'));

    console.log('\nInstallation completed successfully!');
    console.log('\nYour account has been created:');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log('\nOAuth client has been configured:');
    console.log(`Client ID: ${clientId}`);
    console.log(`Client Secret: ${clientSecret}`);
    console.log('\nEnvironment files have been created:');
    console.log('- server/.env (with placeholder values)');
    console.log('- server/.env.local (with actual values)');
    console.log('- goal-tracker/.env (with placeholder values)');
    console.log('- goal-tracker/.env.local (with actual values)');
    console.log('- server/.env.example');
    console.log('- goal-tracker/.env.example');
    console.log('\nNext steps:');
    console.log('1. Start the server: cd server && npm run dev');
    console.log('2. Start the frontend: cd goal-tracker && npm run dev');
    console.log('3. Visit http://localhost:3001 and log in with OAuth');

  } catch (error) {
    console.error('Error during installation:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

main(); 