"use client";

import { useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const initialFormState = { name: "", email: "", message: "" };

const inputStyle = (hasError) => ({
  background: "#171A20",
  border: `1px solid ${hasError ? "#E5484D" : "#262B34"}`,
  borderRadius: 8,
  padding: "12px 14px",
  color: "#E9EAEE",
  fontSize: "0.95rem",
  fontFamily: "inherit",
  width: "100%",
});

export default function ContactForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [company, setCompany] = useState(""); // honeypot field, kept empty by real users
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [statusMessage, setStatusMessage] = useState("");

  const isLoading = status === "loading";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Name is required.";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    if (!formData.message.trim()) {
      errors.message = "Message is required.";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message should be at least 10 characters.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate submissions while a request is already in flight.
    if (isLoading) return;

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setStatus("error");
      setStatusMessage("Please fix the highlighted fields and try again.");
      return;
    }

    setStatus("loading");
    setStatusMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, company }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(
          data.error ||
            "Something went wrong while sending your message. Please try again or email me directly."
        );
      }

      setStatus("success");
      setStatusMessage("Message sent successfully. I'll get back to you soon.");
      setFormData(initialFormState);
      setFieldErrors({});
    } catch (err) {
      setStatus("error");
      setStatusMessage(
        err.message ||
          "Something went wrong while sending your message. Please try again or email me directly."
      );
      // formData is intentionally left as-is so the visitor doesn't lose what they typed.
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Honeypot: invisible to real users, but bots that fill every field will trip it. */}
      <div style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }} aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label htmlFor="name" style={{ fontSize: "0.85rem", color: "#9AA1AD" }}>
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
          aria-invalid={!!fieldErrors.name}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
          style={inputStyle(fieldErrors.name)}
        />
        {fieldErrors.name && (
          <span id="name-error" style={{ color: "#E5484D", fontSize: "0.8rem" }}>
            {fieldErrors.name}
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label htmlFor="email" style={{ fontSize: "0.85rem", color: "#9AA1AD" }}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          style={inputStyle(fieldErrors.email)}
        />
        {fieldErrors.email && (
          <span id="email-error" style={{ color: "#E5484D", fontSize: "0.8rem" }}>
            {fieldErrors.email}
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <label htmlFor="message" style={{ fontSize: "0.85rem", color: "#9AA1AD" }}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          disabled={isLoading}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
          style={{ ...inputStyle(fieldErrors.message), resize: "vertical" }}
        />
        {fieldErrors.message && (
          <span id="message-error" style={{ color: "#E5484D", fontSize: "0.8rem" }}>
            {fieldErrors.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{
          padding: "10px 20px",
          borderRadius: "8px",
          background: isLoading ? "#a98a4d" : "#E7B85C",
          color: "#171205",
          border: "none",
          fontWeight: 500,
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.85 : 1,
          transition: "background .15s ease",
        }}
      >
        {isLoading ? "Sending…" : "Send Message"}
      </button>

      <p
        role="status"
        aria-live="polite"
        style={{
          fontSize: "0.88rem",
          margin: 0,
          minHeight: "1.2em",
          color: status === "success" ? "#4ADE80" : status === "error" ? "#E5484D" : "#656B76",
        }}
      >
        {statusMessage}
      </p>
    </form>
  );
}
