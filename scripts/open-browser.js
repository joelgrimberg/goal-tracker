const { exec } = require('child_process');
const platform = process.platform;

let command;

if (platform === 'win32') {
  command = 'start';
} else if (platform === 'darwin') {
  command = 'open';
} else {
  command = 'xdg-open';
}

exec(`${command} http://localhost:3001`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error opening browser: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
});

