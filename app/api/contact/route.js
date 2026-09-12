import { Resend } from "resend";
import { isRateLimited } from "@/lib/rateLimit";

// RESEND_API_KEY is read here, server-side only. It is never bundled into
// client-side JavaScript and never sent to the browser.
//
// The client is created lazily (inside the request handler, not at module
// load time) so that builds still succeed in environments where the env
// var isn't set until deploy time — the Resend SDK throws immediately if
// you construct it with an empty key.
function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;
const MIN_MESSAGE_LENGTH = 10;

const RECIPIENT_EMAIL = "aashishdhyani11@gmail.com";

// Strip characters that could be used for header injection, and trim
// to a sane length. Never trust raw user input in email headers.
function sanitize(input) {
  return String(input).replace(/[\r\n]+/g, " ").trim();
}

export async function POST(request) {
  try {
    // --- Basic per-IP rate limiting ---
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return Response.json(
        {
          success: false,
          error: "Too many requests. Please wait a few minutes and try again.",
        },
        { status: 429 }
      );
    }

    // --- Parse request body ---
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { success: false, error: "Invalid request body." },
        { status: 400 }
      );
    }

    const { name, email, message, company } = body || {};

    // --- Honeypot: real users never fill this hidden field ---
    // Bots that auto-fill every input will trip this. Return a success-
    // shaped response so bots get no signal that they were caught.
    if (company) {
      return Response.json({ success: true });
    }

    // --- Required-field validation ---
    if (!name || !email || !message) {
      return Response.json(
        { success: false, error: "Name, email, and message are all required." },
        { status: 400 }
      );
    }

    const cleanName = sanitize(name).slice(0, MAX_NAME_LENGTH);
    const cleanEmail = sanitize(email).slice(0, MAX_EMAIL_LENGTH);
    const cleanMessage = String(message).trim().slice(0, MAX_MESSAGE_LENGTH);

    if (!cleanName) {
      return Response.json(
        { success: false, error: "Please enter your name." },
        { status: 400 }
      );
    }

    // --- Email format validation ---
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return Response.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (cleanMessage.length < MIN_MESSAGE_LENGTH) {
      return Response.json(
        {
          success: false,
          error: `Your message should be at least ${MIN_MESSAGE_LENGTH} characters.`,
        },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set in the environment.");
      return Response.json(
        {
          success: false,
          error: "Email service is not configured. Please try again later.",
        },
        { status: 500 }
      );
    }

    // --- Send the email via Resend ---
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      // onboarding@resend.dev works out of the box for testing. For
      // production, verify your own domain in the Resend dashboard and
      // send from an address on that domain instead.
      from: "Portfolio Contact Form <onboarding@resend.dev>",
      to: RECIPIENT_EMAIL,
      replyTo: cleanEmail,
      subject: `New portfolio message from ${cleanName}`,
      text: `Name: ${cleanName}\nEmail: ${cleanEmail}\n\nMessage:\n${cleanMessage}`,
    });

    if (error) {
      console.error("Resend API error:", error);
      return Response.json(
        {
          success: false,
          error: "Failed to send your message. Please try again or email me directly.",
        },
        { status: 502 }
      );
    }

    return Response.json({ success: true, id: data?.id ?? null });
  } catch (err) {
    console.error("Unexpected error in /api/contact:", err);
    return Response.json(
      {
        success: false,
        error: "Something went wrong while sending your message. Please try again or email me directly.",
      },
      { status: 500 }
    );
  }
}
