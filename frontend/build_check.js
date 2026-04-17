const { exec } = require('child_process');
const fs = require('fs');

exec('npx vite build', (err, stdout, stderr) => {
  fs.writeFileSync('vite_error.log', stdout + '\n\nSTDERR:\n\n' + stderr);
});
