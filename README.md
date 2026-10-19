# Uptown Projects Website

Premium responsive React + TypeScript + Framer Motion website built with supplied Uptown content and project photos.

## Setup
Requires Node.js 20.6+ (for native `.env` loading).
```bash
npm install
# On a fresh checkout, copy .env.example to .env first.
npm run dev
```
Open the local URL printed by Vite. The enquiry API runs inside Vite, so no separate backend process is needed during development. Direct `npx vite` and `npx vite preview` also include the API and load the project `.env`. Restart an existing dev server after updating to this version.

## Production
```bash
npm run build
npm start
```
Deploy this project to a Node.js host, install dependencies, build, and run `npm start`. The server serves `dist/` and the enquiry API on `PORT` (default 3001). A static-only upload cannot handle form submissions.

## Features
- Responsive hero, project photography marquee, philosophy, services, project directory, statistics, process, testimonials, enquiry, footer.
- Filter by project status and type.
- Click a project card for the gallery and enquiry link.
- Enquiries submit to `POST /api/enquiries` with backend validation and on-page success/error feedback.
- Submissions are stored in `data/enquiries.jsonl`, outside the public website. Set `ENQUIRY_DATA_DIR` to a persistent private directory in production; keep backups.
- Saved enquiries trigger email notifications when SMTP is configured. The separate WhatsApp contact link remains available.
- Logo and imagery derived from supplied images.zip, converted to lightweight WebP.

## Content notes
- Project statuses for projects not explicitly specified in the submitted content were used as provisional placeholder categories. Verify them before publishing.
- Testimonials and performance metrics come from the supplied content and should be approved before publication.
- Add your Instagram URL when available.

## Backend checks
Run `npm test` to check validation, persisted submissions, and blocked public access to saved enquiries.

## Environment configuration
`npm run dev`, `npm start`, and `npm run preview` automatically load the project `.env` file. Copy `.env.example` to `.env` on a fresh checkout. The local `.env` is ignored by Git.

- `PORT`: production server port, default `3001`. Development uses Vite's frontend port for both the website and API.
- `ENQUIRY_DATA_DIR`: private enquiry storage directory, default `./data`. Use a persistent absolute path in production.

Hosting-provided environment variables take precedence over `.env`. SMTP credentials are required for email notifications; file storage works without them.

## Enquiry email notifications
Set `ENQUIRY_TO` to the recipient. Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, and `SMTP_PASS` for the sending account. `SMTP_FROM` defaults to `SMTP_USER`. The current defaults use Gmail SMTP on port 587 with STARTTLS. Enter a Gmail app password in `.env`, never your normal account password or credentials in chat. Restart the server after changes.

Email sending happens after the enquiry is saved. Failed email attempts are logged by enquiry ID in `data/email-failures.jsonl`; submissions remain saved and there is no automatic email retry.

## Blank page when opening index.html

Do not double-click the source `index.html` or serve it with Live Server. Vite must compile the React/TypeScript entry point. In the `uptown-projects` folder, run `npm.cmd run dev` and open the localhost URL printed in the terminal. On Windows, `npm.cmd` also avoids PowerShell script execution policy errors. For production, run `npm.cmd run build` followed by `npm.cmd start`.
