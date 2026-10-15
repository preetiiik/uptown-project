import { defineConfig, loadEnv, type Connect } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-expect-error The backend is a native JavaScript module.
import { createApp } from './server.mjs';

export default defineConfig(({ mode }) => {
 const env = loadEnv(mode, process.cwd(), '');
 for (const [key, value] of Object.entries(env)) {
  if (process.env[key] === undefined) process.env[key] = value;
 }
 const enquiryApi = () => {
  const api = createApp({ serveStatic: false });
  const middleware: Connect.NextHandleFunction = (req, res, next) => {
   if (req.url?.split('?')[0].startsWith('/api/')) api.emit('request', req, res);
   else next();
  };
  return middleware;
 };
 return {
  plugins: [react(), {
   name: 'uptown-enquiry-api',
   configureServer(server) { server.middlewares.use(enquiryApi()); },
   configurePreviewServer(server) { server.middlewares.use(enquiryApi()); },
  }],
 };
});
