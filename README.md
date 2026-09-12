# Aashish Dhyani — Portfolio (Next.js)

A personal portfolio built with the Next.js App Router, including a working
contact form backed by a server-side API route and [Resend](https://resend.com)
for email delivery.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root (never commit this file):

   ```bash
   cp .env.example .env.local
   ```

   Then fill in a real value:

   ```
   RESEND_API_KEY=your_resend_api_key_here
   ```

   Get a free API key by creating an account at https://resend.com.

3. (Recommended for production) Verify a sending domain in the Resend
   dashboard. Until you do, the app sends from Resend's shared sandbox
   address (`onboarding@resend.dev`), which works for testing but is more
   likely to land in spam than mail from a verified domain you own.

4. Run the dev server:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000, scroll to Contact, and submit the form.
   Messages are emailed to `aashishdhyani11@gmail.com`, with the visitor's
   own address set as the reply-to, so you can just hit "reply" to respond.

## How the contact form works

- `components/ContactForm.jsx` is a client component. It validates the name,
  email format, and message length before submitting, disables the button
  and shows "Sending…" while the request is in flight (preventing duplicate
  submissions), and keeps whatever the visitor typed if the request fails.
- `app/api/contact/route.js` is the server-side API route. It re-validates
  everything (never trust client-side validation alone), strips characters
  that could be used for email-header injection, checks a simple per-IP rate
  limit, and calls the Resend API to actually send the email.
- `RESEND_API_KEY` is only ever read inside `route.js`, which runs on the
  server. It is never imported into a client component and never shipped to
  the browser.

## Security notes

- **Never commit `.env.local`.** It's already covered by `.gitignore`.
- **Rate limiting** (`lib/rateLimit.js`) is a basic in-memory, per-IP limiter
  (5 requests per 10 minutes). It resets on server restart and does not
  share state across multiple serverless instances. It's enough to blunt
  obvious abuse from a single client, but if you deploy somewhere with
  multiple serverless instances (e.g. Vercel under real traffic), swap it
  for a shared store such as Upstash Redis or Vercel KV.
- **Honeypot field**: the form includes a hidden `company` input that real
  visitors never see or fill in. If it arrives filled in, the API silently
  returns a success response without sending an email — this catches many
  simple bots without needing a CAPTCHA.

## Deploying

On Vercel (or any host that supports Next.js API routes), add
`RESEND_API_KEY` as an environment variable in the project's dashboard —
do not hard-code it anywhere in the source.
