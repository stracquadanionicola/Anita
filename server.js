const { spawn } = require('child_process');

console.log('Starting server for Anita and Nicola album...');

// Get port from environment or use default
const port = process.env.PORT || 10000;

console.log(`Server starting on port: ${port}`);

// Start Python HTTP server
const server = spawn('python3', ['-m', 'http.server', port, '--bind', '0.0.0.0'], {
    stdio: 'inherit'
});

server.on('error', (err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

server.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
    process.exit(code);
});

// Handle termination signals
process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully');
    server.kill('SIGTERM');
});

process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully');
    server.kill('SIGINT');
});
