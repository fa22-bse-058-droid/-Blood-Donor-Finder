import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Activity, Zap, MapPin, Shield, Clock, Users, Heart, Bell,
  ChevronRight, ArrowRight, AlertCircle, CheckCircle, Star,
  Droplet, Radio, BarChart3, Globe, Lock, Award, Cpu,
  TrendingUp, Eye, Database, Phone, Mail, GitBranch, ExternalLink
} from "lucide-react";

// ── Animated particle canvas ──────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = 80;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.6 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(116, 179, 206, ${p.alpha})`;
        ctx.fill();
      });
      // draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(116, 179, 206, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}

// ── Pulse ring SVG ──────────────────────────────────────────────────────────
function PulseRing({ size = 320, color = "rgba(220,38,38,0.15)" }) {
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      {[1, 0.75, 0.5].map((scale, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `1px solid ${color}`,
            transform: `scale(${scale})`,
            animation: `pulseRing ${2 + i * 0.8}s ease-out infinite`,
            animationDelay: `${i * 0.6}s`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: "50%",
          transform: "translate(-50%,-50%)",
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,67,70,0.4) 0%, rgba(220,38,38,0.1) 70%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Heart size={32} color="#ef4444" fill="#ef4444" style={{ animation: "heartBeat 1.4s ease-in-out infinite" }} />
      </div>
    </div>
  );
}

// ── Glass card ─────────────────────────────────────────────────────────────
function GlassCard({ children, style = {}, hover = true }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: "rgba(116,179,206,0.05)",
        border: "1px solid rgba(116,179,206,0.1)",
        borderRadius: 16,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 24px 48px rgba(0,20,22,0.5), 0 0 0 1px rgba(116,179,206,0.15)"
          : "0 8px 32px rgba(0,20,22,0.35)",
        borderColor: hovered ? "rgba(116,179,206,0.2)" : "rgba(116,179,206,0.1)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Donor badge ─────────────────────────────────────────────────────────────
function DonorBadge({ name, blood, score, dist, delay = 0 }) {
  return (
    <GlassCard
      style={{
        padding: "12px 16px",
        animation: `floatUp 0.6s ease both`,
        animationDelay: `${delay}s`,
        minWidth: 160,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--teal-dark), var(--surface))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--teal-pale)",
            border: "1px solid rgba(116,179,206,0.25)",
            flexShrink: 0,
          }}
        >
          {blood}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>{name}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
            <span style={{ fontSize: 11, color: "var(--teal-soft)" }}>{dist}</span>
            <span style={{ fontSize: 11, color: "#5ec4b0" }}>★ {score}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

// ── Live stat badge ─────────────────────────────────────────────────────────
function LiveBadge({ label, value, accent = "var(--teal-soft)", icon: Icon }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 14px",
        background: "rgba(116,179,206,0.05)",
        border: "1px solid rgba(116,179,206,0.09)",
        borderRadius: 10,
        backdropFilter: "blur(8px)",
      }}
    >
      {Icon && <Icon size={14} color={accent} />}
      <div>
        <div style={{ fontSize: 11, color: "var(--text-2)", lineHeight: 1 }}>{label}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: accent, lineHeight: 1.4 }}>{value}</div>
      </div>
    </div>
  );
}

// ── Emergency alert card ─────────────────────────────────────────────────────
function EmergencyCard({ type, hospital, time, urgency }) {
  const urgencyColor = urgency === "Critical" ? "#ef4444" : urgency === "High" ? "#e07b54" : "#eab308";
  return (
    <GlassCard style={{ padding: "14px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: urgencyColor,
                animation: "blink 1s step-end infinite",
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 600, color: urgencyColor, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {urgency}
            </span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)" }}>{type} Needed</div>
          <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 2 }}>{hospital}</div>
        </div>
        <div style={{ fontSize: 11, color: "var(--text-3)" }}>{time}</div>
      </div>
    </GlassCard>
  );
}

// ── Section heading ─────────────────────────────────────────────────────────
function SectionHeading({ label, title, sub }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 56 }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 14px",
          background: "rgba(116,179,206,0.08)",
          border: "1px solid rgba(116,179,206,0.18)",
          borderRadius: 100,
          fontSize: 11,
          fontWeight: 600,
          color: "var(--teal-soft)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 18,
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "var(--teal-soft)",
            animation: "blink 1.4s step-end infinite",
            display: "inline-block",
          }}
        />
        {label}
      </div>
      <h2
        style={{
          fontSize: "clamp(28px, 4vw, 44px)",
          fontWeight: 800,
          color: "var(--text-1)",
          margin: "0 0 14px",
          lineHeight: 1.15,
          letterSpacing: "-0.025em",
        }}
      >
        {title}
      </h2>
      {sub && (
        <p style={{ fontSize: 16, color: "var(--text-3)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
          {sub}
        </p>
      )}
    </div>
  );
}

// ── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, desc, accent = "var(--teal-soft)", delay = 0 }) {
  return (
    <GlassCard
      style={{
        padding: "28px 24px",
        animation: `floatUp 0.5s ease both`,
        animationDelay: `${delay}s`,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: `${accent}15`,
          border: `1px solid ${accent}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
        }}
      >
        <Icon size={20} color={accent} />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)", margin: "0 0 10px" }}>{title}</h3>
      <p style={{ fontSize: 14, color: "var(--text-3)", lineHeight: 1.65, margin: 0 }}>{desc}</p>
    </GlassCard>
  );
}

// ── Step card ─────────────────────────────────────────────────────────────────
function StepCard({ num, title, desc, icon: Icon }) {
  return (
    <div style={{ textAlign: "center", flex: 1 }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "rgba(116,179,206,0.08)",
          border: "1px solid rgba(116,179,206,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          position: "relative",
        }}
      >
        <Icon size={24} color="var(--teal-soft)" />
        <div
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: "var(--teal-dark)",
            border: "1px solid rgba(116,179,206,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 800,
            color: "var(--teal-soft)",
          }}
        >
          {num}
        </div>
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)", margin: "0 0 8px" }}>{title}</h3>
      <p style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.6, margin: 0 }}>{desc}</p>
    </div>
  );
}

// ── Stat counter ─────────────────────────────────────────────────────────────
function StatItem({ value, label, accent = "var(--teal-soft)" }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: "clamp(28px, 4vw, 42px)",
          fontWeight: 800,
          color: accent,
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 13, color: "var(--text-3)", marginTop: 6, letterSpacing: "0.02em" }}>{label}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN LANDING COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const [navBlur, setNavBlur] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      setNavBlur(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const donors = [
    { name: "Asif W.", blood: "B-", score: "9.0", dist: "1.2 km", delay: 0.1 },
    { name: "Sana M.", blood: "O+", score: "9.7", dist: "2.4 km", delay: 0.2 },
    { name: "Bilal K.", blood: "B+", score: "9.4", dist: "3.1 km", delay: 0.3 },
    { name: "Ayesha R.", blood: "A-", score: "8.8", dist: "4.5 km", delay: 0.4 },
  ];

  const features = [
    { icon: Cpu, title: "AI Smart Matching Engine", accent: "var(--teal-soft)", delay: 0, desc: "Django-driven donor pairing by blood type, haversine distance arrays, and past donation cooldown metrics." },
    { icon: MapPin, title: "Real-Time Geolocation", accent: "#5ec4b0", delay: 0.08, desc: "Hardware-linked browser tracking connecting telemetry points straight to backend core coordinates for radius queries." },
    { icon: Bell, title: "Automated Emergency Broadcast", accent: "#e07b54", delay: 0.16, desc: "Async notification pipelines via Redis broker tasks firing Twilio SMS bursts and SMTP payloads instantly." },
    { icon: Shield, title: "Neural Fraud Mitigator", accent: "#74B3CE", delay: 0.24, desc: "Predictive security flagging compromised or spam request architectures before network publication." },
    { icon: TrendingUp, title: "Shortage Predictive Matrix", accent: "#38bdf8", delay: 0.32, desc: "Advanced regional linear projections forecasting impending blood-pool deficits across municipal centers." },
    { icon: Award, title: "Donor Reputation Protocol", accent: "#74B3CE", delay: 0.4, desc: "Cryptographically safe validation system issuing verified digital badges, reputation scores, and donation PDFs." },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600;700;800&family=Space+Grotesk:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:        #0d1f20;
          --bg2:       #172A3A;
          --surface:   #1a3035;
          --teal-dark: #004346;
          --teal-mid:  #508991;
          --teal-soft: #74B3CE;
          --teal-pale: #D6F3F4;
          --accent:    #74B3CE;
          --text-1:    #D6F3F4;
          --text-2:    #74B3CE;
          --text-3:    #508991;
          --red:       #ef4444;
        }

        body {
          background: var(--bg);
          color: var(--text-1);
          font-family: 'Space Grotesk', sans-serif;
          overflow-x: hidden;
          scroll-behavior: smooth;
        }

        h1, h2, h3, h4 { font-family: 'Oxanium', sans-serif; }

        @keyframes pulseRing {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.6); }
        }
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          14%       { transform: scale(1.2); }
          28%       { transform: scale(1); }
          42%       { transform: scale(1.15); }
          70%       { transform: scale(1); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50%       { transform: scale(1.04) rotate(2deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes scanLine {
          0%   { top: 0; }
          100% { top: 100%; }
        }
        @keyframes emergencyPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
        }
        @keyframes flowLine {
          0%   { stroke-dashoffset: 200; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 26px;
          background: #ef4444;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          letter-spacing: 0.01em;
        }
        .btn-primary:hover {
          background: #dc2626;
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(239,68,68,0.35);
        }
        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 26px;
          background: rgba(116,179,206,0.06);
          color: #cbd5e1;
          border: 1px solid rgba(116,179,206,0.14);
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          backdrop-filter: blur(8px);
        }
        .btn-ghost:hover {
          background: rgba(116,179,206,0.1);
          border-color: rgba(116,179,206,0.3);
          color: var(--text-1);
          transform: translateY(-2px);
        }

        .section { padding: 100px 24px; max-width: 1160px; margin: 0 auto; }

        .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
        .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }

        .glow-red   { box-shadow: 0 0 60px rgba(0,67,70,0.25); }
        .glow-blue  { box-shadow: 0 0 60px rgba(116,179,206,0.1); }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--teal-dark); border-radius: 4px; }
      `}</style>

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: navBlur ? "rgba(13,31,32,0.85)" : "transparent",
          backdropFilter: navBlur ? "blur(20px)" : "none",
          borderBottom: navBlur ? "1px solid rgba(116,179,206,0.07)" : "none",
          transition: "all 0.3s ease",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #ef4444, #b91c1c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Droplet size={16} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 17, color: "var(--text-1)" }}>
            LifeLink <span style={{ color: "var(--teal-soft)" }}>AI</span>
          </span>
        </div>

        {/* Nav links — hidden on mobile */}
        <div
          style={{
            display: "flex",
            gap: 28,
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text-2)",
          }}
          className="nav-links"
        >
          {["Features", "How it Works", "Dashboard", "API Docs"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/ /g, "-")}`}
              style={{ color: "inherit", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={(e) => (e.target.style.color = "var(--text-1)")}
              onMouseLeave={(e) => (e.target.style.color = "var(--text-2)")}
            >
              {l}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/login" className="btn-ghost" style={{ padding: "8px 18px", fontSize: 13 }}>
            Login
          </Link>
          <Link to="/register" className="btn-primary" style={{ padding: "8px 18px", fontSize: 13 }}>
            Register
          </Link>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        style={{
          minHeight: "100vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          padding: "100px 24px 60px",
        }}
      >
        {/* bg gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
              radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,67,70,0.5) 0%, transparent 70%),
              radial-gradient(ellipse 60% 50% at 80% 50%, rgba(80,137,145,0.08) 0%, transparent 60%),
              radial-gradient(ellipse 50% 40% at 20% 80%, rgba(0,67,70,0.15) 0%, transparent 60%)
            `,
          }}
        />
        <ParticleCanvas />

        {/* grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(116,179,206,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(116,179,206,0.025) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 80%)",
          }}
        />

        <div
          style={{
            maxWidth: 1160,
            margin: "0 auto",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Left: headline */}
          <div style={{ animation: "floatUp 0.8s ease both" }}>
            {/* live badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 14px",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 100,
                fontSize: 11,
                fontWeight: 700,
                color: "#f87171",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#ef4444",
                  animation: "blink 1s step-end infinite",
                  display: "inline-block",
                }}
              />
              Decentralized Blood Intelligence Node
            </div>

            <h1
              style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.035em",
                color: "var(--text-1)",
                marginBottom: 22,
              }}
            >
              AI That Connects{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, var(--teal-soft), #74B3CE)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Blood Donors
              </span>{" "}
              Before It's Too Late.
            </h1>

            <p
              style={{
                fontSize: 16,
                color: "var(--text-3)",
                lineHeight: 1.75,
                maxWidth: 440,
                marginBottom: 36,
              }}
            >
              Real-time emergency coordination powered by intelligent donor matching and
              predictive healthcare analytics — across 62 cities in Pakistan.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 44 }}>
              <Link to="/register?role=hospital" className="btn-primary">
                <AlertCircle size={15} />
                Request Emergency Blood
              </Link>
              <Link to="/register?role=donor" className="btn-ghost">
                <Heart size={15} />
                Become a Donor
              </Link>
            </div>

            {/* live stats row */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <LiveBadge icon={Users} label="Registered Donors" value="14,200+" accent="#5ec4b0" />
              <LiveBadge icon={Activity} label="Neural Matches/Min" value="98.6%" accent="var(--teal-soft)" />
              <LiveBadge icon={Globe} label="Active Cities" value="62" accent="#74B3CE" />
            </div>
          </div>

          {/* Right: dashboard mock */}
          <div style={{ position: "relative", animation: "floatUp 0.9s ease both", animationDelay: "0.15s" }}>
            {/* floating background glow */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: 320,
                height: 320,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(116,179,206,0.08) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            {/* Main card */}
            <GlassCard style={{ padding: 24, position: "relative", overflow: "hidden" }} hover={false}>
              {/* scan line effect */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: 1,
                  background: "linear-gradient(90deg, transparent, rgba(116,179,206,0.3), transparent)",
                  animation: "scanLine 4s linear infinite",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              />

              {/* header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {["#ef4444", "#f59e0b", "#5ec4b0"].map((c) => (
                    <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Live Engine", "Ecosystem Status"].map((t, i) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: 6,
                        background: i === 0 ? "rgba(116,179,206,0.12)" : "transparent",
                        border: i === 0 ? "1px solid rgba(116,179,206,0.2)" : "1px solid rgba(116,179,206,0.07)",
                        color: i === 0 ? "var(--teal-soft)" : "var(--text-3)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* emergency banner */}
              <GlassCard
                hover={false}
                style={{
                  padding: "14px 18px",
                  marginBottom: 14,
                  borderColor: "rgba(239,68,68,0.25)",
                  background: "rgba(239,68,68,0.05)",
                  animation: "emergencyPulse 2s ease-in-out infinite",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Droplet size={22} color="#ef4444" fill="#ef4444" />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#fca5a5" }}>B- Negative Crisis</div>
                    <div style={{ fontSize: 11, color: "var(--text-3)" }}>Jinnah Hospital Matrix • 2.1km tracking node active.</div>
                  </div>
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#ef4444" }}>99.2%</div>
                    <div style={{ fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Match Accuracy</div>
                  </div>
                </div>
              </GlassCard>

              {/* dispatched label */}
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                Standby Responders Dispatched
              </div>

              {/* donor row */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {donors.slice(0, 3).map((d) => (
                  <DonorBadge key={d.name} {...d} />
                ))}
              </div>
            </GlassCard>

            {/* floating mini badge */}
            <div
              style={{
                position: "absolute",
                bottom: -16,
                right: -16,
                animation: "floatUp 1s ease both 0.4s",
              }}
            >
              <GlassCard style={{ padding: "10px 16px" }} hover={false}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#5ec4b0",
                      animation: "blink 1.5s step-end infinite",
                    }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#5ec4b0" }}>AI Network Online</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>420+ Partner Hospitals</div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ──────────────────────────────────────────────────────── */}
      <div
        style={{
          borderTop: "1px solid rgba(116,179,206,0.07)",
          borderBottom: "1px solid rgba(116,179,206,0.07)",
          background: "rgba(255,255,255,0.02)",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 32,
          }}
        >
          <StatItem value="14,200+" label="Registered Donors" accent="var(--teal-soft)" />
          <StatItem value="420+" label="Partner Hospitals" accent="#5ec4b0" />
          <StatItem value="98.6%" label="Neural Match Rate" accent="#74B3CE" />
          <StatItem value="62" label="Active Cities" accent="#e07b54" />
          <StatItem value="< 2 min" label="Avg. Donor Response" accent="#74B3CE" />
        </div>
      </div>

      {/* ── FEATURES GRID ──────────────────────────────────────────────────── */}
      <section id="features" className="section">
        <SectionHeading
          label="Full-Stack Services Infrastructure"
          title="High-Fidelity Systems Built for Scale"
          sub="High-fidelity systems engineered to meet modern enterprise scalability protocols — from AI matching to real-time emergency broadcasts."
        />
        <div className="grid-3">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* ── EMERGENCY COMMAND CENTER ───────────────────────────────────────── */}
      <section
        id="how-it-works"
        style={{
          padding: "100px 24px",
          background: "rgba(239,68,68,0.02)",
          borderTop: "1px solid rgba(239,68,68,0.08)",
          borderBottom: "1px solid rgba(239,68,68,0.08)",
        }}
      >
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <SectionHeading
            label="Live Emergency Command Center"
            title="Real-Time Crisis Coordination"
            sub="Dramatic emergency dashboard with pulsing alerts, hospital analytics, and blood inventory status — fused with intelligent urgency indicators."
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.4fr",
              gap: 24,
              alignItems: "start",
            }}
          >
            {/* Left: emergency cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <EmergencyCard type="O- Blood" hospital="PIMS Islamabad" time="2 min ago" urgency="Critical" />
              <EmergencyCard type="A+ Platelets" hospital="Services Hospital, Lahore" time="8 min ago" urgency="High" />
              <EmergencyCard type="B+ Plasma" hospital="Civil Hospital, Karachi" time="15 min ago" urgency="Medium" />

              {/* blood inventory */}
              <GlassCard style={{ padding: "18px 20px", marginTop: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                  Blood Stock Levels — Lahore Hub
                </div>
                {[
                  { type: "O+", pct: 72, color: "#5ec4b0" },
                  { type: "A+", pct: 45, color: "#f59e0b" },
                  { type: "B-", pct: 12, color: "#ef4444" },
                  { type: "AB+", pct: 88, color: "#5ec4b0" },
                ].map(({ type, pct, color }) => (
                  <div key={type} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-2)", marginBottom: 4 }}>
                      <span>{type}</span>
                      <span style={{ color }}>{pct}%</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 4, background: "rgba(116,179,206,0.07)", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          borderRadius: 4,
                          background: color,
                          transition: "width 1s ease",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </GlassCard>
            </div>

            {/* Right: analytics panel */}
            <GlassCard style={{ padding: 28 }} hover={false}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)" }}>Hospital Analytics Dashboard</h3>
                <div
                  style={{
                    fontSize: 11,
                    padding: "3px 10px",
                    background: "rgba(94,196,176,0.1)",
                    border: "1px solid rgba(94,196,176,0.2)",
                    borderRadius: 100,
                    color: "#5ec4b0",
                    fontWeight: 600,
                  }}
                >
                  ● LIVE
                </div>
              </div>

              {/* mini chart bars */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 10 }}>Donation Volume — Last 7 Days</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
                  {[40, 65, 50, 80, 55, 90, 72].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: `${h}%`,
                        borderRadius: "4px 4px 0 0",
                        background: i === 5
                          ? "linear-gradient(180deg, var(--teal-soft), var(--teal-dark))"
                          : "rgba(116,179,206,0.15)",
                        transition: "height 0.3s",
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-3)", marginTop: 4 }}>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>
              </div>

              {/* metrics grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Requests Today", value: "284", accent: "var(--teal-soft)", icon: AlertCircle },
                  { label: "Matches Confirmed", value: "241", accent: "#5ec4b0", icon: CheckCircle },
                  { label: "Avg. Match Time", value: "1.8 min", accent: "#74B3CE", icon: Clock },
                  { label: "AI Confidence", value: "97.4%", accent: "#74B3CE", icon: Cpu },
                ].map(({ label, value, accent, icon: Icon }) => (
                  <div
                    key={label}
                    style={{
                      padding: "14px 16px",
                      background: "rgba(116,179,206,0.04)",
                      border: "1px solid rgba(116,179,206,0.07)",
                      borderRadius: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                      <Icon size={12} color={accent} />
                      <span style={{ fontSize: 11, color: "var(--text-3)" }}>{label}</span>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: accent, letterSpacing: "-0.02em" }}>{value}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <SectionHeading
            label="Workflow"
            title="Three Steps. Infinite Impact."
            sub="From emergency request to confirmed donor — in under 2 minutes, powered by our intelligent network."
          />

          <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
            <StepCard
              num="1"
              title="Emergency Request Created"
              desc="Hospital or coordinator submits a verified blood request with real-time severity tagging and geolocation."
              icon={AlertCircle}
            />

            {/* connector */}
            <div
              style={{
                flex: "0 0 auto",
                alignSelf: "center",
                paddingTop: 0,
              }}
            >
              <svg width="60" height="20" viewBox="0 0 60 20">
                <line
                  x1="0" y1="10" x2="50" y2="10"
                  stroke="rgba(116,179,206,0.3)"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <polygon points="50,6 60,10 50,14" fill="rgba(116,179,206,0.4)" />
              </svg>
            </div>

            <StepCard
              num="2"
              title="AI Matches Nearest Donors"
              desc="Haversine-distance algorithm + blood type + cooldown scoring surfaces the optimal donor pool within seconds."
              icon={Cpu}
            />

            <div style={{ flex: "0 0 auto", alignSelf: "center" }}>
              <svg width="60" height="20" viewBox="0 0 60 20">
                <line
                  x1="0" y1="10" x2="50" y2="10"
                  stroke="rgba(116,179,206,0.3)"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <polygon points="50,6 60,10 50,14" fill="rgba(116,179,206,0.4)" />
              </svg>
            </div>

            <StepCard
              num="3"
              title="Real-Time Notifications Sent"
              desc="Celery-powered Twilio SMS + SMTP email bursts dispatch instantly to verified donors, with push confirmations."
              icon={Bell}
            />
          </div>
        </div>
      </section>

      {/* ── TRUST & VERIFICATION ───────────────────────────────────────────── */}
      <section
        style={{
          padding: "100px 24px",
          background: "rgba(116,179,206,0.02)",
          borderTop: "1px solid rgba(116,179,206,0.06)",
          borderBottom: "1px solid rgba(116,179,206,0.06)",
        }}
      >
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <SectionHeading
            label="Trust & Verification"
            title="Cryptographic Donor Identity System"
            sub="QR-encoded donor IDs, verified badges, and donation certificates — all backed by a cryptographically safe reputation protocol."
          />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {[
              { icon: Award, title: "Verified Donor Badge", desc: "Multi-step identity verification with biometric checks and national ID cross-reference.", accent: "#74B3CE" },
              { icon: Shield, title: "QR Donor ID Card", desc: "Tamper-proof QR codes encoding donor profile, blood type, and donation history for instant scanning.", accent: "#5ec4b0" },
              { icon: Star, title: "Reputation Score", desc: "Dynamic reliability index computed from donation consistency, response time, and hospital feedback.", accent: "#74B3CE" },
              { icon: CheckCircle, title: "Donation Certificate", desc: "Cryptographically signed PDF certificates issued after every verified donation — shareable and auditable.", accent: "var(--teal-soft)" },
            ].map((c) => (
              <GlassCard key={c.title} style={{ padding: "24px 20px", textAlign: "center" }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: `${c.accent}12`,
                    border: `1px solid ${c.accent}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <c.icon size={22} color={c.accent} />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", marginBottom: 8 }}>{c.title}</h3>
                <p style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.65 }}>{c.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "120px 24px",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
              radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,67,70,0.2) 0%, transparent 70%),
              radial-gradient(ellipse 50% 40% at 30% 20%, rgba(116,179,206,0.05) 0%, transparent 60%)
            `,
          }}
        />
        <ParticleCanvas />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
          <PulseRing size={200} color="rgba(239,68,68,0.15)" />

          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 800,
              color: "var(--text-1)",
              lineHeight: 1.1,
              letterSpacing: "-0.035em",
              marginTop: 32,
              marginBottom: 18,
            }}
          >
            Every Second Matters.{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #ef4444, #dc2626)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Let AI Save More Lives.
            </span>
          </h2>

          <p style={{ fontSize: 16, color: "var(--text-3)", lineHeight: 1.7, marginBottom: 40 }}>
            Join 14,200+ donors and 420+ hospitals already on the network. One tap can
            mean the difference between life and loss.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" className="btn-primary" style={{ padding: "15px 32px", fontSize: 15 }}>
              <Zap size={16} />
              Launch Emergency Network
            </Link>
            <Link to="/dashboard" className="btn-ghost" style={{ padding: "15px 32px", fontSize: 15 }}>
              <Eye size={16} />
              Monitor Live Board
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid rgba(116,179,206,0.07)",
          padding: "60px 24px 32px",
          background: "rgba(0,20,22,0.4)",
        }}
      >
        <div
          style={{
            maxWidth: 1160,
            margin: "0 auto",
          }}
        >
          {/* top row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: 40,
              marginBottom: 48,
            }}
          >
            {/* brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #ef4444, #b91c1c)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Droplet size={14} color="#fff" fill="#fff" />
                </div>
                <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 16, color: "var(--text-1)" }}>
                  LifeLink <span style={{ color: "var(--teal-soft)" }}>AI</span>
                </span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.65, maxWidth: 260, marginBottom: 20 }}>
                Revolutionizing emergency response infrastructures across Pakistan through
                decentralized algorithmic donor tracking operations.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                {[GitBranch, ExternalLink, Mail, Phone].map((Icon, i) => (
                  <div
                    key={i}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      background: "rgba(116,179,206,0.05)",
                      border: "1px solid rgba(116,179,206,0.09)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(116,179,206,0.1)";
                      e.currentTarget.style.borderColor = "rgba(116,179,206,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(116,179,206,0.05)";
                      e.currentTarget.style.borderColor = "rgba(116,179,206,0.09)";
                    }}
                  >
                    <Icon size={14} color="var(--text-3)" />
                  </div>
                ))}
              </div>
            </div>

            {/* cols */}
            {[
              {
                head: "Core System",
                links: ["Emergency Board", "Live Donor Map", "Hospital Matrix", "Governance Terminal"],
              },
              {
                head: "Resources",
                links: ["Core API Specs", "Data Integrity Reports", "Medical Partners", "Spam Models"],
              },
              {
                head: "Hub Support",
                links: ["National HQ, Islamabad", "Emergencies: 1122", "support@lifelinkai.gov", "System Status"],
              },
            ].map(({ head, links }) => (
              <div key={head}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--text-3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 16,
                  }}
                >
                  {head}
                </div>
                {links.map((l) => (
                  <div
                    key={l}
                    style={{
                      fontSize: 13,
                      color: "var(--text-3)",
                      marginBottom: 10,
                      cursor: "pointer",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-2)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}
                  >
                    {l}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* bottom bar */}
          <div
            style={{
              borderTop: "1px solid rgba(116,179,206,0.07)",
              paddingTop: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 12, color: "#1a3035" }}>
              © 2026 LifeLink AI Node Network. All humanitarian operations coordinated.
            </span>
            <div style={{ display: "flex", gap: 20 }}>
              {["Privacy Cryptography Protocol", "Terms of Service Routing"].map((l) => (
                <span
                  key={l}
                  style={{
                    fontSize: 12,
                    color: "#1a3035",
                    cursor: "pointer",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-3)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#1a3035")}
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}