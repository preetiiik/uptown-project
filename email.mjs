import nodemailer from 'nodemailer';

export function createEnquiryNotifier(env = process.env) {
 if(!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS || !env.ENQUIRY_TO) return null;
 const transport = nodemailer.createTransport({
  host:env.SMTP_HOST,
  port:Number(env.SMTP_PORT || 587),
  secure:env.SMTP_SECURE === 'true',
  requireTLS:env.SMTP_SECURE !== 'true',
  auth:{user:env.SMTP_USER,pass:env.SMTP_PASS},
  connectionTimeout:10000,greetingTimeout:10000,socketTimeout:15000
 });
 return enquiry=>transport.sendMail({
  from:env.SMTP_FROM || env.SMTP_USER,
  to:env.ENQUIRY_TO,
  replyTo:enquiry.email,
  subject:'New Uptown Projects enquiry',
  text:[`Enquiry: ${enquiry.id}`,`Received: ${enquiry.createdAt}`,`Name: ${enquiry.name}`,`Email: ${enquiry.email}`,`Phone: ${enquiry.phone || 'Not provided'}`,`Interest: ${enquiry.interest}`,'',enquiry.message || 'No message provided'].join('\n')
 });
}
