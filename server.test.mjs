import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from './server.mjs';

test('enquiries are validated, persisted, and kept private', async()=>{
 const dir=await mkdtemp(join(tmpdir(),'uptown-enquiry-'));
 const notifications=[];
 const server=createApp({dataDir:dir,serveStatic:false,notify:async enquiry=>{notifications.push(enquiry);}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=`http://127.0.0.1:${server.address().port}`;
 const post=data=>fetch(base+'/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
 try {
  assert.equal((await post({name:'',email:'bad',interest:'Other Enquiry'})).status,400);
  const result=await post({name:' Test Guest ',email:'guest@example.com',interest:'Other Enquiry',message:'Please contact me.'});
  assert.equal(result.status,201);
  const response=await result.json();
  const stored=JSON.parse((await readFile(join(dir,'enquiries.jsonl'),'utf8')).trim());
  assert.equal(stored.id,response.id);
  assert.equal(notifications.length,1);
  assert.equal(notifications[0].id,response.id);
  assert.equal(notifications[0].email,'guest@example.com');
  assert.equal(stored.name,'Test Guest');
  assert.equal(stored.message,'Please contact me.');
  assert.equal((await fetch(base+'/api/enquiries')).status,405);
  assert.equal((await fetch(base+'/data/enquiries.jsonl')).status,404);
  assert.equal((await post({name:'Guest',email:'guest@example.com',interest:'Other Enquiry',message:'x'.repeat(5001)})).status,400);
  assert.equal((await fetch(base+'/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:'{'})).status,400);
  assert.equal((await readFile(join(dir,'enquiries.jsonl'),'utf8')).trim().split('\n').length,1);
 } finally {
  await new Promise(resolve=>{server.close(resolve);server.closeAllConnections();});
  await rm(dir,{recursive:true,force:true});
 }
});
