#!/usr/bin/env node

/**
 * Cross-platform concurrent dev runner for Parijat
 * Starts both apps/api (port 3001) and apps/web (port 5174) simultaneously.
 */

const { spawn } = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('\x1b[36m%s\x1b[0m', '=====================================================');
console.log('\x1b[32m%s\x1b[0m', '🌸 Starting Parijat Full-Stack Development Environment');
console.log('\x1b[36m%s\x1b[0m', '   📍 Web Frontend: http://localhost:5174');
console.log('\x1b[36m%s\x1b[0m', '   🌿 Backend API:  http://localhost:3001');
console.log('\x1b[36m%s\x1b[0m', '=====================================================\n');

function runService(name, color, command, args) {
  const child = spawn(command, args, {
    shell: true,
    stdio: 'pipe',
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, FORCE_COLOR: '1' },
  });

  child.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.log(`${color}[${name}]\x1b[0m ${line}`);
      }
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line) => {
      if (line.trim()) {
        console.error(`${color}[${name}]\x1b[0m ${line}`);
      }
    });
  });

  child.on('close', (code) => {
    console.log(`${color}[${name}]\x1b[0m Process exited with code ${code}`);
  });

  return child;
}

const apiProcess = runService('API', '\x1b[34m', npmCmd, ['run', 'dev:api']);
const webProcess = runService('WEB', '\x1b[32m', npmCmd, ['run', 'dev:web']);

function cleanup() {
  console.log('\n\x1b[33mStopping all services...\x1b[0m');
  try {
    if (isWindows) {
      if (apiProcess.pid) spawn('taskkill', ['/pid', apiProcess.pid, '/f', '/t']);
      if (webProcess.pid) spawn('taskkill', ['/pid', webProcess.pid, '/f', '/t']);
    } else {
      apiProcess.kill();
      webProcess.kill();
    }
  } catch (e) {
    // Ignore errors during exit cleanup
  }
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
