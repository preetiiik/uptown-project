import { createServer } from 'vite';
import { createApp } from '../server.mjs';

const api = createApp({serveStatic:false});
const port = Number(process.env.PORT || 3001);
await new Promise((resolve,reject)=>{api.once('error',reject);api.listen(port,'127.0.0.1',resolve)});
try {
 const vite = await createServer({server:{host:'0.0.0.0',proxy:{'/api':`http://127.0.0.1:${port}`}}});
 await vite.listen();
 vite.printUrls();
 const shutdown = async()=>{await vite.close();api.close();};
 process.once('SIGINT',shutdown);
 process.once('SIGTERM',shutdown);
} catch(error) {api.close();throw error;}
