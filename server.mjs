import { createServer } from 'node:http';
import { appendFile, mkdir, readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { createEnquiryNotifier } from './email.mjs';

const root = fileURLToPath(new URL('.', import.meta.url));
const interests = new Set(['Acquiring a Villa','Farmhouse / Nature Retreat','Project Management','Turnkey Projects','Project Consultancy','Material Procurement','Landscape Design','Other Enquiry']);
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.png':'image/png', '.webp':'image/webp', '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.ico':'image/x-icon', '.woff2':'font/woff2' };
const reply = (res, status, data) => { res.writeHead(status, {'Content-Type':'application/json','Cache-Control':'no-store'}); res.end(JSON.stringify(data)); };

export function createApp({ dataDir = process.env.ENQUIRY_DATA_DIR || resolve(root, 'data'), serveStatic = true, notify = createEnquiryNotifier() } = {}) {
 return createServer(async (req, res) => {
  try {
   const url = new URL(req.url, 'http://localhost');
   if (url.pathname === '/api/enquiries') {
    if (req.method !== 'POST') { res.setHeader('Allow','POST'); return reply(res,405,{error:'Method not allowed.'}); }
    if (!req.headers['content-type']?.startsWith('application/json')) return reply(res,415,{error:'Please submit JSON.'});
    let body = ''; let size = 0;
    for await (const chunk of req) { size += chunk.length; if(size > 16384) return reply(res,413,{error:'Your enquiry is too long.'}); body += chunk; }
    let input;
    try { input = JSON.parse(body); } catch { return reply(res,400,{error:'Invalid enquiry data.'}); }
    if (!input || typeof input !== 'object' || Array.isArray(input)) return reply(res,400,{error:'Invalid enquiry data.'});
    const fields = {};
    for (const [key, limit] of Object.entries({name:120,email:254,phone:40,interest:80,message:5000})) {
     if(input[key] !== undefined && typeof input[key] !== 'string') return reply(res,400,{error:'Invalid form fields.'});
     fields[key] = (input[key] || '').trim();
     if(fields[key].length > limit) return reply(res,400,{error:`Please shorten the ${key} field.`});
    }
    if(!fields.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email) || !interests.has(fields.interest)) return reply(res,400,{error:'Please enter your name, a valid email, and an interest.'});
    const enquiry = {id:randomUUID(),createdAt:new Date().toISOString(),...fields};
    await mkdir(dataDir,{recursive:true});
    await appendFile(resolve(dataDir,'enquiries.jsonl'),JSON.stringify(enquiry)+'\n',{encoding:'utf8',mode:0o600});
    if(notify) {
     try {await notify(enquiry);}
     catch(error) {
      console.error('Email notification failed for saved enquiry:',enquiry.id,error.code || error.name);
      await appendFile(resolve(dataDir,'email-failures.jsonl'),JSON.stringify({enquiryId:enquiry.id,failedAt:new Date().toISOString()})+'\n',{encoding:'utf8',mode:0o600}).catch(()=>console.error('Could not record email failure:',enquiry.id));
     }
    }
    return reply(res,201,{id:enquiry.id,message:'Thank you! Your enquiry has been submitted. Our lifestyle concierge will respond within 24 hours.'});
   }
   if(url.pathname.startsWith('/api/')) return reply(res,404,{error:'Not found.'});
   if(!serveStatic || !['GET','HEAD'].includes(req.method)) return reply(res,404,{error:'Not found.'});
   const dist = resolve(root,'dist');
   const path = resolve(dist,'.'+decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
   if(!path.startsWith(dist+sep)) return reply(res,404,{error:'Not found.'});
   try {
    const content = await readFile(path);
    res.writeHead(200,{'Content-Type':mime[extname(path)] || 'application/octet-stream','X-Content-Type-Options':'nosniff'});
    res.end(req.method === 'HEAD' ? undefined : content);
   } catch(error) { if(error.code === 'ENOENT' || error.code === 'EISDIR') return reply(res,404,{error:'Not found.'}); throw error; }
  } catch(error) {
   console.error('Enquiry server error:', error.code || error.name);
   if(!res.headersSent) reply(res,500,{error:'We could not save your enquiry. Please try again.'});
   else res.end();
  }
 });
}

if(process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
 const port = Number(process.env.PORT || 3001);
 if(!createEnquiryNotifier()) console.warn('Email notifications are disabled until SMTP settings are configured. Enquiries will still be saved.');
 createApp().listen(port,()=>console.log(`Uptown website and enquiry API: http://localhost:${port}`));
}
