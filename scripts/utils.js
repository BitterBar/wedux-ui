const { spawn } = require('child_process');

const exec = (command, args, options) =>
  new Promise((resolve, reject) => {
    const _process = spawn(command, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      ...options,
      shell: process.platform === 'win32',
    });

    const stderrChunks = [];
    const stdoutChunks = [];

    _process.stderr?.on('data', (chunk) => stderrChunks.push(chunk));
    _process.stdout?.on('data', (chunk) => stdoutChunks.push(chunk));

    _process.on('error', (error) => reject(error));
    _process.on('exit', (code) => {
      const stderr = Buffer.concat(stderrChunks).toString().trim();
      const stdout = Buffer.concat(stdoutChunks).toString().trim();

      if (code === 0) {
        resolve({ ok: true, code, stderr, stdout });
      } else {
        reject(new Error(`Failed to execute command: ${command} ${args.join(' ')}: ${stderr}`));
      }
    });
  });

module.exports = { exec };
