import nodemailer from 'nodemailer';
import { lookup } from 'node:dns/promises';

export async function createSmtpTransport(env = process.env) {
 // Use the OS resolver: Nodemailer's direct DNS queries can fail on Windows
 // networks even when the system can resolve and reach the mail server.
 const { address } = await lookup(env.SMTP_HOST);
 return nodemailer.createTransport({
  host:address,
  port:Number(env.SMTP_PORT || 587),
  secure:env.SMTP_SECURE === 'true',
  requireTLS:env.SMTP_SECURE !== 'true',
  tls:{servername:env.SMTP_HOST},
  auth:{user:env.SMTP_USER,pass:env.SMTP_PASS},
  connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000
 });
}

export function createEnquiryNotifier(env = process.env) {
 if(!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS || !env.ENQUIRY_TO) return null;
 return async enquiry=>{
 const transport = await createSmtpTransport(env);
 try { return await transport.sendMail({
  from:env.SMTP_FROM || env.SMTP_USER,
  to:env.ENQUIRY_TO,
  replyTo:enquiry.email,
  subject:'New Uptown Projects enquiry',
  text:[`Enquiry: ${enquiry.id}`,`Received: ${enquiry.createdAt}`,`Name: ${enquiry.name}`,`Email: ${enquiry.email}`,`Phone: ${enquiry.phone || 'Not provided'}`,`Interest: ${enquiry.interest}`,'',enquiry.message || 'No message provided'].join('\n')
 }); } finally { transport.close(); }
 };
}
