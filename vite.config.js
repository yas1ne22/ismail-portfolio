import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

export default defineConfig({
  server: {
    allowedHosts: true,
  },
  plugins: [
    {
      name: 'portfolio-extensions',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url) return next();
          const cleanUrl = req.url.split('?')[0];

          // 1. Handle AEOkiller application routes
          if (cleanUrl === '/aeokiller') {
            const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
            res.writeHead(301, { Location: `/aeokiller/${query}` });
            return res.end();
          }

          if (cleanUrl.startsWith('/aeokiller/')) {
            const distBase = path.join(process.cwd(), 'Product-Case-Study-Library', '..', '..', 'Desktop', 'AEO agent', 'dist');
            const targetDist = fs.existsSync(distBase) ? distBase : path.join(process.cwd(), 'public', 'aeokiller');
            
            const relPath = cleanUrl.replace(/^\/aeokiller\/?/, '');
            let filePath = path.join(targetDist, relPath);

            if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
              filePath = path.join(filePath, 'index.html');
            }

            // Fallback for SPA routing inside aeokiller
            if (!fs.existsSync(filePath) || (!path.extname(filePath) && !fs.existsSync(filePath))) {
              filePath = path.join(targetDist, 'index.html');
            }

            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              const ext = path.extname(filePath).toLowerCase();
              if (mimeTypes[ext]) {
                res.setHeader('Content-Type', mimeTypes[ext]);
              }
              return fs.createReadStream(filePath).pipe(res);
            }
          }

          // 2. Handle Case Studies
          if (cleanUrl.startsWith('/projects/')) {
            const rel = cleanUrl.replace(/^\/projects\/?/, '');
            const targetDir = path.join(process.cwd(), 'Product-Case-Study-Library', 'projects', rel);
            
            if (fs.existsSync(targetDir)) {
              const stat = fs.statSync(targetDir);
              if (stat.isDirectory()) {
                const indexFile = path.join(targetDir, 'index.html');
                if (fs.existsSync(indexFile)) {
                  res.setHeader('Content-Type', 'text/html; charset=utf-8');
                  return fs.createReadStream(indexFile).pipe(res);
                }
              } else if (stat.isFile()) {
                const ext = path.extname(targetDir).toLowerCase();
                if (mimeTypes[ext]) {
                  res.setHeader('Content-Type', mimeTypes[ext]);
                }
                return fs.createReadStream(targetDir).pipe(res);
              }
            }
          }

          next();
        });
      },
    },
  ],
});
