"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Github, Linkedin, Mail, Menu, X, ArrowUpRight } from "lucide-react";
import ContactForm from "./ContactForm";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "learning", label: "Learning" },
  { id: "contact", label: "Contact" },
];

const SKILL_GROUPS = [
  { title: "Frontend", items: ["HTML5", "CSS3", "JavaScript", "React.js", "Next.js", "Responsive Web Design"] },
  { title: "Backend", items: ["Node.js", "Express.js", "REST APIs", "Backend Development"] },
  { title: "Database", items: ["MongoDB", "CRUD Operations", "Database Fundamentals"] },
  { title: "Programming", items: ["Java", "JavaScript", "Object-Oriented Programming", "Problem Solving"] },
  { title: "Tools", items: ["Git", "GitHub", "VS Code", "Postman"] },
];

const PROJECTS = [
  {
    name: "Adalat",
    description:
      "A web application project built with Next.js, developed as part of my hands-on journey into modern full-stack web development.",
    tech: ["Next.js", "React", "TypeScript", "CSS / Modern Styling"],
    repo: "https://github.com/aashishdhyani/adalat",
    live: null,
  },
];

/* Reveal-on-scroll wrapper, driven by IntersectionObserver */
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* Project card with pointer-driven tilt + glow */
function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState("rotateX(0deg) rotateY(0deg)");
  const [glow, setGlow] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 10;
    const rotateX = (0.5 - py) * 10;
    setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
    setGlow({ x: px * 100, y: py * 100, opacity: 1 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform("rotateX(0deg) rotateY(0deg)");
    setGlow((g) => ({ ...g, opacity: 0 }));
  }, []);

  return (
    <Reveal delay={index * 100}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: "relative",
          borderRadius: "12px",
          border: "1px solid #262B34",
          background: "#171A20",
          padding: "32px",
          transformStyle: "preserve-3d",
          transform,
          transition: "transform 0.15s ease-out",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(320px circle at ${glow.x}% ${glow.y}%, rgba(231,184,92,0.14), transparent 70%)`,
            opacity: glow.opacity,
            transition: "opacity 0.2s ease",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.35rem", marginBottom: "10px", color: "#E9EAEE" }}>
            {project.name}
          </h3>
          <p style={{ color: "#9AA1AD", maxWidth: "540px", marginBottom: "18px" }}>{project.description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "22px" }}>
            {project.tech.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: "0.8rem",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  background: "rgba(231,184,92,0.12)",
                  color: "#E7B85C",
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "center" }}>
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: "#E9EAEE",
                textDecoration: "none",
                borderBottom: "1px solid #262B34",
                paddingBottom: "2px",
                fontSize: "0.92rem",
              }}
            >
              View Source Code <ArrowUpRight size={14} />
            </a>
            {project.live ? (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#E7B85C",
                  textDecoration: "none",
                  fontSize: "0.92rem",
                }}
              >
                Live Demo <ArrowUpRight size={14} />
              </a>
            ) : (
              <span style={{ fontSize: "0.8rem", color: "#656B76" }}>Live demo not yet available</span>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: "#0F1115", color: "#E9EAEE", fontFamily: "Inter, system-ui, sans-serif", minHeight: "100vh" }}>
      {/* NAV */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: scrolled ? "rgba(15,17,21,0.9)" : "rgba(15,17,21,0.6)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #262B34",
        }}
      >
        <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={() => scrollTo("home")}
            style={{ display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", cursor: "pointer", color: "#E9EAEE", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.05rem" }}
          >
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#E7B85C", boxShadow: "0 0 0 4px rgba(231,184,92,0.12)" }} />
            Aashish Dhyani
          </button>

          <nav style={{ display: "flex", gap: "32px" }} className="desktop-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`nav-link ${activeSection === item.id ? "active" : ""}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => scrollTo("contact")}
              style={{
                display: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                background: "#E7B85C",
                color: "#171205",
                border: "none",
                fontWeight: 500,
                cursor: "pointer",
              }}
              className="desktop-cta"
            >
              Contact Me
            </button>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              style={{ background: "none", border: "none", color: "#E9EAEE", cursor: "pointer", display: "flex" }}
              className="mobile-toggle"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div style={{ padding: "8px 28px 20px", borderTop: "1px solid #262B34", display: "flex", flexDirection: "column" }}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                style={{
                  textAlign: "left",
                  padding: "12px 0",
                  background: "none",
                  border: "none",
                  borderBottom: "1px solid #262B34",
                  color: activeSection === item.id ? "#E7B85C" : "#9AA1AD",
                  fontSize: "0.98rem",
                  cursor: "pointer",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 28px" }}>
        {/* HERO */}
        <section id="home" style={{ padding: "120px 0 96px" }}>
          <Reveal>
            <p style={{ color: "#656B76", fontSize: "0.9rem", marginBottom: "18px" }}>Portfolio</p>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.4rem, 6vw, 3.6rem)", lineHeight: 1.05, margin: 0 }}>
              Aashish Dhyani
            </h1>
            <p style={{ color: "#E7B85C", fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.05rem, 2.4vw, 1.3rem)", marginTop: "14px" }}>
              MCA Student · Aspiring Full-Stack Developer
            </p>
            <p style={{ color: "#9AA1AD", maxWidth: "640px", fontSize: "1.05rem", marginTop: "22px" }}>
              I'm an MCA student building practical web applications with React, Next.js, Node.js, and MongoDB. I'm also
              beginning my journey into Data Structures and Algorithms using Java to strengthen my problem-solving and
              programming fundamentals.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginTop: "34px" }}>
              <button
                onClick={() => scrollTo("projects")}
                style={{ padding: "10px 20px", borderRadius: "8px", background: "#E7B85C", color: "#171205", border: "none", fontWeight: 500, cursor: "pointer" }}
              >
                View Projects
              </button>
              <button
                onClick={() => scrollTo("contact")}
                style={{ padding: "10px 20px", borderRadius: "8px", background: "transparent", color: "#E9EAEE", border: "1px solid #262B34", fontWeight: 500, cursor: "pointer" }}
              >
                Contact Me
              </button>
            </div>
            <div style={{ display: "flex", gap: "20px", marginTop: "40px", flexWrap: "wrap" }}>
              <a href="https://github.com/aashishdhyani" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#9AA1AD", textDecoration: "none", fontSize: "0.92rem" }}>
                <Github size={18} /> GitHub
              </a>
              <a href="https://www.linkedin.com/in/aashish-dhyani-2003c/" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#9AA1AD", textDecoration: "none", fontSize: "0.92rem" }}>
                <Linkedin size={18} /> LinkedIn
              </a>
              <a href="mailto:aashishdhyani11@gmail.com" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#9AA1AD", textDecoration: "none", fontSize: "0.92rem" }}>
                <Mail size={18} /> Email
              </a>
            </div>
          </Reveal>
        </section>

        {/* ABOUT */}
        <section id="about" style={{ padding: "96px 0" }}>
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "56px", alignItems: "start" }} className="about-grid">
              <div
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: 16,
                  background: "linear-gradient(160deg, #1D2129, #171A20)",
                  border: "1px solid #262B34",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "3.4rem",
                  fontWeight: 700,
                  color: "#E7B85C",
                }}
              >
                AD
              </div>
              <div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 3vw, 1.9rem)", marginBottom: "28px" }}>About</h2>
                <p style={{ color: "#9AA1AD", marginBottom: 16 }}>
                  I'm Aashish Dhyani, an MCA student and aspiring Full-Stack Developer with an interest in building
                  practical and useful web applications.
                </p>
                <p style={{ color: "#9AA1AD", marginBottom: 16 }}>
                  My current development focus is on modern web technologies including React, Next.js, Node.js, and
                  MongoDB. I enjoy learning by building projects and understanding how frontend interfaces, backend
                  systems, APIs, and databases work together.
                </p>
                <p style={{ color: "#9AA1AD", marginBottom: 16 }}>
                  Alongside web development, I have recently started learning Data Structures and Algorithms using Java.
                  My current goal is to build a strong foundation in programming, problem solving, and core computer
                  science concepts.
                </p>
                <p style={{ color: "#9AA1AD", marginBottom: 0 }}>
                  I'm continuously improving my development skills through projects, experimentation, and hands-on
                  learning.
                </p>
                <ul style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px 24px", listStyle: "none", padding: 0 }} className="focus-list">
                  {["Full-Stack Web Development", "React & Next.js", "Node.js & Backend Development", "MongoDB", "Java Fundamentals", "Beginner DSA"].map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.94rem" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E7B85C", flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </section>

        {/* SKILLS */}
        <section id="skills" style={{ padding: "96px 0" }}>
          <Reveal>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 3vw, 1.9rem)", marginBottom: "28px" }}>Skills</h2>
          </Reveal>
          {SKILL_GROUPS.map((group, i) => (
            <Reveal key={group.title} delay={i * 80}>
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: "0.85rem", color: "#656B76", fontWeight: 500, marginBottom: 14 }}>{group.title}</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="chip-hover"
                      style={{
                        padding: "8px 16px",
                        border: "1px solid #262B34",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        background: "#171A20",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </section>

        {/* PROJECTS */}
        <section id="projects" style={{ padding: "96px 0" }}>
          <Reveal>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 3vw, 1.9rem)", marginBottom: "28px" }}>
              Featured Projects
            </h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {PROJECTS.map((p, i) => (
              <ProjectCard key={p.name} project={p} index={i} />
            ))}
            <Reveal delay={PROJECTS.length * 100}>
              <div style={{ border: "1px dashed #262B34", borderRadius: "12px", padding: "28px 32px", color: "#656B76", fontSize: "0.92rem" }}>
                More projects are on the way as I keep building. This section is set up to grow — new work will appear
                here as it's finished.
              </div>
            </Reveal>
          </div>
        </section>

        {/* LEARNING */}
        <section id="learning" style={{ padding: "96px 0" }}>
          <Reveal>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 3vw, 1.9rem)", marginBottom: "28px" }}>
              Currently Learning
            </h2>
            <div style={{ border: "1px solid #262B34", borderRadius: "12px", background: "#171A20", padding: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2rem" }}>Data Structures &amp; Algorithms — Java</h3>
                <span style={{ fontSize: "0.78rem", padding: "5px 12px", borderRadius: "20px", border: "1px solid #E7B85C", color: "#E7B85C" }}>
                  Currently learning
                </span>
              </div>
              <p style={{ color: "#9AA1AD", maxWidth: 640, marginBottom: 28 }}>
                I have recently started learning Data Structures and Algorithms using Java. My current focus is on
                understanding programming fundamentals, basic data structures, algorithms, and problem-solving step by
                step.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
                {["Java Fundamentals", "Basic Problem Solving", "DSA Fundamentals", "More Advanced Topics"].map((step, idx) => (
                  <div key={step} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span
                      style={{
                        padding: "9px 16px",
                        borderRadius: "8px",
                        fontSize: "0.88rem",
                        background: idx === 0 ? "rgba(231,184,92,0.12)" : "#1D2129",
                        border: `1px solid ${idx === 0 ? "#E7B85C" : "#262B34"}`,
                        color: idx === 0 ? "#E7B85C" : "#9AA1AD",
                        fontWeight: idx === 0 ? 500 : 400,
                      }}
                    >
                      {step}
                    </span>
                    {idx < 3 && <span style={{ color: "#656B76", fontSize: "0.9rem" }}>→</span>}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ padding: "96px 0" }}>
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "56px" }} className="contact-grid">
              <div>
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.5rem, 3vw, 1.9rem)", marginBottom: "16px" }}>
                  Let's Connect
                </h2>
                <p style={{ color: "#9AA1AD", maxWidth: 440, marginBottom: 28 }}>
                  Have an opportunity, project, or question? Feel free to reach out.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <a href="https://github.com/aashishdhyani" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: "0.78rem", color: "#656B76" }}>GitHub</span>
                    <span style={{ color: "#E9EAEE", fontSize: "0.98rem" }}>github.com/aashishdhyani</span>
                  </a>
                  <a href="https://www.linkedin.com/in/aashish-dhyani-2003c/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: "0.78rem", color: "#656B76" }}>LinkedIn</span>
                    <span style={{ color: "#E9EAEE", fontSize: "0.98rem" }}>linkedin.com/in/aashish-dhyani-2003c</span>
                  </a>
                </div>
              </div>

              <div>
                <ContactForm />
                <p style={{ marginTop: 20, fontSize: "0.88rem", color: "#9AA1AD" }}>
                  Prefer email?{" "}
                  <a href="mailto:aashishdhyani11@gmail.com" style={{ color: "#E7B85C", textDecoration: "none" }}>
                    aashishdhyani11@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer style={{ borderTop: "1px solid #262B34", padding: "40px 0" }}>
        <div style={{ maxWidth: "1080px", margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ color: "#9AA1AD", fontSize: "0.9rem" }}>Aashish Dhyani</div>
              <div style={{ color: "#9AA1AD", fontSize: "0.9rem", marginTop: 4 }}>MCA Student · Aspiring Full-Stack Developer</div>
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              <a href="https://github.com/aashishdhyani" target="_blank" rel="noopener noreferrer" style={{ color: "#656B76", textDecoration: "none", fontSize: "0.88rem" }}>GitHub</a>
              <a href="https://www.linkedin.com/in/aashish-dhyani-2003c/" target="_blank" rel="noopener noreferrer" style={{ color: "#656B76", textDecoration: "none", fontSize: "0.88rem" }}>LinkedIn</a>
              <a href="mailto:aashishdhyani11@gmail.com" style={{ color: "#656B76", textDecoration: "none", fontSize: "0.88rem" }}>Email</a>
            </div>
          </div>
          <div style={{ color: "#656B76", fontSize: "0.82rem", marginTop: 18 }}>© 2026 Aashish Dhyani. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
