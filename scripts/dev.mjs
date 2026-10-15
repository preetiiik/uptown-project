import { createServer } from 'vite';
 const vite = await createServer({server:{host:'0.0.0.0'}});
 await vite.listen();
 vite.printUrls();
 const shutdown = async()=>{await vite.close();};
 process.once('SIGINT',shutdown);
 process.once('SIGTERM',shutdown);
