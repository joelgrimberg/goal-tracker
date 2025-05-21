const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function readEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const envVars = {};
    content.split('\n').forEach(line => {
      if (line && !line.startsWith('#')) {
        const [key, value] = line.split('=');
        if (key && value) {
          envVars[key.trim()] = value.trim().replace(/"/g, '');
        }
      }
    });
    return envVars;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return {};
  }
}

function displayOAuthConfig() {
  const serverEnv = readEnvFile(path.join(__dirname, '../server/.env.local'));
  
  console.log('\n=== OAuth Configuration for Bruno ===\n');
  console.log('Callback URL: http://localhost:3001/oauth');
  console.log('Authorization URL: http://localhost:3000/oauth/authorize');
  console.log('Access Token URL: http://localhost:3000/oauth/token');
  console.log(`Client ID: ${serverEnv.OAUTH_CLIENT_ID}`);
  console.log(`Client Secret: ${serverEnv.OAUTH_CLIENT_SECRET}`);
  console.log('\n=====================================\n');
}

// Display OAuth configuration
displayOAuthConfig();

// Start the applications with live output
console.log('Starting applications...\n');
const child = spawn('npm', ['run', 'start:all'], { stdio: 'inherit', shell: true });

child.on('close', (code) => {
  console.log(`\nstart:all exited with code ${code}`);
}); 