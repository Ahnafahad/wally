import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import os from 'os'

// ── in-memory name (resets when dev server restarts) ──
let remoteName = null;

export default defineConfig({
  server: {
    host: true, // Enable network access by default
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'wally-name-api',
      configureServer(server) {
        // Log remote name change URLs when server starts
        server.httpServer?.once('listening', () => {
          setTimeout(() => {
            const address = server.httpServer?.address();
            if (address && typeof address === 'object') {
              const port = address.port;

              console.log('');
              console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════');
              console.log('\x1b[1m\x1b[36m%s\x1b[0m', '🔗 REMOTE NAME CHANGE LINKS');
              console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════');
              console.log('');
              console.log('Change the displayed name by visiting:');
              console.log('');
              console.log('\x1b[1m%s\x1b[0m', '  📱 From this device:');
              console.log(`     http://localhost:${port}/?name=YOUR_NAME`);
              console.log('');
              console.log('\x1b[1m%s\x1b[0m', '  🌐 From any device on your network:');

              // Get local network IP
              const networkInterfaces = os.networkInterfaces();
              let networkIP = null;

              Object.keys(networkInterfaces).forEach((interfaceName) => {
                networkInterfaces[interfaceName]?.forEach((iface) => {
                  if (iface.family === 'IPv4' && !iface.internal) {
                    networkIP = iface.address;
                  }
                });
              });

              if (networkIP) {
                console.log(`     http://${networkIP}:${port}/?name=YOUR_NAME`);
              } else {
                console.log('     Network IP not detected');
              }

              console.log('');
              console.log('\x1b[33m%s\x1b[0m', '  Examples:');
              console.log(`     ?name=John`);
              console.log(`     ?name=Sarah%20Ahmed  (use %20 for spaces)`);
              console.log('');
              console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════');
              console.log('');
            }
          }, 100); // Small delay to ensure server is fully started
        });
      },
      configServer(server) {
        server.middlewares.use('/api/name', (req, res, next) => {
          if (req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ name: remoteName }));
          } else if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                const { name } = JSON.parse(body);
                remoteName = name || null;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ name: remoteName }));
              } catch {
                res.writeHead(400);
                res.end();
              }
            });
          } else {
            next();
          }
        });
      },
    },
  ],
})
