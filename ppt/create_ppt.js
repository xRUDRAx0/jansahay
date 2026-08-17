const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// ════════════════════════════════════════════════════════════════════
//  JANSAHAY — Presentation Generator
//  Template: ASCENDANT AGENTS (7 slides strict)
//  Inspiration: WellCall (visual richness, stats, screenshot showcase)
// ════════════════════════════════════════════════════════════════════

const C = {
  bg:           "060B18",
  bgCard:       "0C1528",
  bgCardHover:  "101D38",
  surface:      "111B30",
  border:       "1A2744",
  borderAccent: "2563EB",

  blue:         "3B82F6",
  blueLight:    "60A5FA",
  blueDark:     "1D4ED8",
  cyan:         "06B6D4",
  gold:         "F59E0B",
  goldLight:    "FCD34D",
  green:        "10B981",
  red:          "EF4444",
  purple:       "8B5CF6",

  white:        "FFFFFF",
  text:         "E2E8F0",
  textMuted:    "94A3B8",
  textDim:      "475569",
  textFaint:    "334155",
};

const F = { h: "Segoe UI", b: "Segoe UI", m: "Cascadia Code" };

// ─── REUSABLE COMPONENTS ───────────────────────────────────────────

function bg(slide) {
  slide.background = { color: C.bg };
}

function crown(slide) {
  // Three small crown symbols top-left (matching template exactly)
  slide.addText("♛  ♛  ♛", {
    x: 0.35, y: 0.2, w: 1.5, h: 0.35,
    fontSize: 12, fontFace: F.h, color: C.gold, charSpacing: 2,
  });
}

function cornerBrackets(slide) {
  // Top-left bracket
  slide.addShape("line", { x: 0.25, y: 0.25, w: 0.7, h: 0, line: { color: C.blue, width: 1.8 } });
  slide.addShape("line", { x: 0.25, y: 0.25, w: 0, h: 0.7, line: { color: C.blue, width: 1.8 } });
  // Top-right bracket
  slide.addShape("line", { x: 12.38, y: 0.25, w: 0.7, h: 0, line: { color: C.blue, width: 1.8 } });
  slide.addShape("line", { x: 13.08, y: 0.25, w: 0, h: 0.7, line: { color: C.blue, width: 1.8 } });
  // Bottom-left bracket
  slide.addShape("line", { x: 0.25, y: 7.0, w: 0.7, h: 0, line: { color: C.blue, width: 1.8 } });
  slide.addShape("line", { x: 0.25, y: 6.3, w: 0, h: 0.7, line: { color: C.blue, width: 1.8 } });
  // Bottom-right bracket
  slide.addShape("line", { x: 12.38, y: 7.0, w: 0.7, h: 0, line: { color: C.blue, width: 1.8 } });
  slide.addShape("line", { x: 13.08, y: 6.3, w: 0, h: 0.7, line: { color: C.blue, width: 1.8 } });
}

function glowBar(slide) {
  slide.addShape("rect", {
    x: 0, y: 7.3, w: 13.33, h: 0.2,
    fill: { color: C.blue, transparency: 80 },
    line: { width: 0 },
  });
}

function branding(slide) {
  slide.addText("JANSAHAY", {
    x: 0.35, y: 7.05, w: 1.8, h: 0.3,
    fontSize: 7, fontFace: F.h, color: C.textDim, bold: true, charSpacing: 4,
  });
}

function slideNum(slide, n, total) {
  slide.addText(`${String(n).padStart(2,"0")}  /  ${String(total).padStart(2,"0")}`, {
    x: 11.5, y: 7.05, w: 1.5, h: 0.3,
    fontSize: 8, fontFace: F.m, color: C.textDim, align: "right",
  });
}

// Central bordered content frame (matching template's cyan rectangle)
function contentFrame(slide) {
  slide.addShape("roundRect", {
    x: 0.4, y: 1.4, w: 12.53, h: 5.5,
    fill: { type: "none" },
    line: { color: C.border, width: 0.75, dashType: "solid" },
    rectRadius: 0.12,
  });
}

// Section title pill (matching template's centered title box)
function titlePill(slide, text) {
  const pillW = Math.max(text.length * 0.22, 4);
  const pillX = (13.33 - pillW) / 2;
  
  slide.addShape("roundRect", {
    x: pillX, y: 0.55, w: pillW, h: 0.65,
    fill: { color: C.bgCard },
    line: { color: C.gold, width: 1.5 },
    rectRadius: 0.32,
    shadow: { type: "outer", blur: 12, offset: 0, color: C.gold, opacity: 0.15 },
  });
  slide.addText(text, {
    x: pillX, y: 0.55, w: pillW, h: 0.65,
    fontSize: 22, fontFace: F.h, color: C.white, bold: true,
    align: "center", valign: "middle", charSpacing: 3,
  });
}

function card(slide, x, y, w, h, opts = {}) {
  slide.addShape("roundRect", {
    x, y, w, h,
    fill: { color: opts.fill || C.bgCard },
    line: { color: opts.border || C.border, width: opts.lineW || 0.75 },
    rectRadius: opts.radius || 0.08,
    shadow: { type: "outer", blur: 6, offset: 2, color: "000000", opacity: 0.25 },
  });
  if (opts.topColor) {
    slide.addShape("rect", {
      x: x + 0.01, y, w: w - 0.02, h: 0.05,
      fill: { color: opts.topColor }, line: { width: 0 },
    });
  }
}

function statBox(slide, x, y, w, h, value, label, color) {
  card(slide, x, y, w, h, { topColor: color });
  slide.addText(value, {
    x, y: y + 0.15, w, h: 0.65,
    fontSize: 30, fontFace: F.h, color, bold: true, align: "center",
  });
  slide.addText(label, {
    x: x + 0.1, y: y + 0.8, w: w - 0.2, h: 0.45,
    fontSize: 9, fontFace: F.b, color: C.textMuted, align: "center", lineSpacingMultiple: 1.3,
  });
}

function iconDot(slide, x, y, letter, color) {
  slide.addShape("ellipse", {
    x, y, w: 0.42, h: 0.42,
    fill: { color, transparency: 80 },
    line: { color, width: 1.2 },
  });
  slide.addText(letter, {
    x, y, w: 0.42, h: 0.42,
    fontSize: 14, fontFace: F.h, color, bold: true, align: "center", valign: "middle",
  });
}

function bullets(slide, items, x, y, w, h, opts = {}) {
  const rows = items.map(item => ({
    text: item,
    options: {
      fontSize: opts.size || 13, fontFace: F.b, color: C.textMuted,
      bullet: { type: "bullet", code: "25CF", color: opts.bulletColor || C.blue },
      paraSpaceAfter: opts.gap || 8,
      lineSpacingMultiple: 1.35,
    },
  }));
  slide.addText(rows, { x, y, w, h, valign: "top" });
}

// Decorative background blobs
function blobs(slide) {
  slide.addShape("ellipse", {
    x: -2, y: -1.5, w: 5.5, h: 5.5,
    fill: { color: C.blue, transparency: 95 }, line: { width: 0 },
  });
  slide.addShape("ellipse", {
    x: 10, y: 4, w: 5, h: 5,
    fill: { color: C.cyan, transparency: 96 }, line: { width: 0 },
  });
}

function setupSlide(prs, num, total, title, opts = {}) {
  const slide = prs.addSlide();
  bg(slide);
  if (!opts.noBlobs) blobs(slide);
  cornerBrackets(slide);
  crown(slide);
  if (title) {
    titlePill(slide, title);
    contentFrame(slide);
  }
  glowBar(slide);
  branding(slide);
  slideNum(slide, num, total);
  return slide;
}

// ════════════════════════════════════════════════════════════════════
//  BUILD PRESENTATION
// ════════════════════════════════════════════════════════════════════

function build() {
  const prs = new pptxgen();
  prs.layout = "LAYOUT_WIDE";
  prs.author = "JANSAHAY Team";
  prs.subject = "JANSAHAY — AI Public-Service Copilot";
  const T = 7; // Total slides (template strict)

  // ────────────────────── SLIDE 1: TITLE ──────────────────────
  {
    const s = prs.addSlide();
    bg(s); blobs(s); cornerBrackets(s); glowBar(s);

    // Crown
    s.addText("♛  ♛  ♛", {
      x: 4.8, y: 0.6, w: 3.5, h: 0.5,
      fontSize: 20, fontFace: F.h, color: C.gold, align: "center", charSpacing: 6,
    });

    // Decorative horizontal lines
    s.addShape("line", {
      x: 2, y: 1.3, w: 9.33, h: 0,
      line: { color: C.gold, width: 0.8, dashType: "dash" },
    });

    // "ASCENDANT AGENTS" style title — "JANSAHAY"
    s.addText("JANSAHAY", {
      x: 1, y: 1.5, w: 11.33, h: 1.4,
      fontSize: 60, fontFace: F.h, color: C.white, bold: true,
      align: "center", charSpacing: 10,
      shadow: { type: "outer", blur: 25, offset: 0, color: C.blue, opacity: 0.3 },
    });

    // Tagline pill
    s.addShape("roundRect", {
      x: 3.8, y: 3.0, w: 5.7, h: 0.55,
      fill: { color: C.blue, transparency: 82 },
      line: { color: C.blue, width: 1 },
      rectRadius: 0.27,
    });
    s.addText("AI  PUBLIC-SERVICE  COPILOT", {
      x: 3.8, y: 3.0, w: 5.7, h: 0.55,
      fontSize: 13, fontFace: F.h, color: C.blueLight, bold: true,
      align: "center", charSpacing: 5,
    });

    // Subtitle
    s.addText(
      "Navigate government services effortlessly. Our AI copilot\nunderstands your needs, checks eligibility, and guides you\nstep-by-step through any public-service journey.",
      {
        x: 2.5, y: 3.8, w: 8.33, h: 1.2,
        fontSize: 13, fontFace: F.b, color: C.textMuted,
        align: "center", lineSpacingMultiple: 1.6,
      }
    );

    // Decorative line
    s.addShape("line", {
      x: 5, y: 5.2, w: 3.33, h: 0,
      line: { color: C.border, width: 0.75 },
    });

    // Team info (matching template layout)
    card(s, 2.5, 5.5, 8.33, 1.3, { border: C.gold });
    
    s.addText([
      { text: "TEAM NAME : ", options: { fontSize: 14, fontFace: F.h, color: C.gold, bold: true } },
      { text: "[Your Team Name]", options: { fontSize: 14, fontFace: F.b, color: C.textMuted } },
    ], { x: 3, y: 5.65, w: 7, h: 0.4 });
    
    s.addText([
      { text: "TEAM MEMBERS : ", options: { fontSize: 14, fontFace: F.h, color: C.gold, bold: true } },
      { text: "[Member 1, Member 2, Member 3]", options: { fontSize: 14, fontFace: F.b, color: C.textMuted } },
    ], { x: 3, y: 6.1, w: 7, h: 0.4 });

    branding(s); slideNum(s, 1, T);
  }

  // ────────────────── SLIDE 2: PROBLEM STATEMENT ──────────────
  {
    const s = setupSlide(prs, 2, T, "PROBLEM STATEMENT");

    // Left column: problem cards (WellCall style with icons)
    const problems = [
      { icon: "🔍", title: "Discovery Gap", desc: "Citizens struggle to discover which government schemes they qualify for among thousands of programs across departments.", color: C.blue },
      { icon: "📄", title: "Document Friction", desc: "Manual document verification is slow, error-prone, and creates bottlenecks delaying benefit distribution.", color: C.cyan },
      { icon: "🌐", title: "Accessibility Barriers", desc: "Language barriers and low digital literacy exclude the most vulnerable populations from vital services.", color: C.gold },
      { icon: "⏱", title: "No Unified Tracking", desc: "No way to track applications across departments — missed deadlines, lost paperwork, repeated visits.", color: C.red },
    ];

    problems.forEach((p, i) => {
      const x = 0.65 + (i % 2) * 4.05;
      const y = 1.7 + Math.floor(i / 2) * 2.55;
      card(s, x, y, 3.85, 2.3, { topColor: p.color });
      iconDot(s, x + 0.2, y + 0.25, p.icon, p.color);
      s.addText(p.title, {
        x: x + 0.75, y: y + 0.2, w: 2.8, h: 0.35,
        fontSize: 14, fontFace: F.h, color: C.white, bold: true,
      });
      s.addText(p.desc, {
        x: x + 0.2, y: y + 0.7, w: 3.45, h: 1.4,
        fontSize: 11, fontFace: F.b, color: C.textMuted, lineSpacingMultiple: 1.4, valign: "top",
      });
    });

    // Right side: Impact stats (WellCall inspiration)
    card(s, 8.9, 1.7, 4.0, 5.1, { border: C.gold });
    s.addText("THE SCALE", {
      x: 8.9, y: 1.85, w: 4.0, h: 0.4,
      fontSize: 12, fontFace: F.h, color: C.gold, bold: true, align: "center", charSpacing: 3,
    });
    s.addShape("line", {
      x: 9.4, y: 2.3, w: 3, h: 0,
      line: { color: C.border, width: 0.5 },
    });
    
    const stats = [
      { val: "950M+", lbl: "Indians lack easy access\nto government schemes", c: C.gold },
      { val: "70%", lbl: "of eligible beneficiaries\nnever apply", c: C.blue },
      { val: "₹2.7L Cr", lbl: "in welfare benefits\ngo unclaimed yearly", c: C.cyan },
      { val: "23+", lbl: "ministries with separate\nportals & processes", c: C.green },
    ];
    stats.forEach((st, i) => {
      const y = 2.5 + i * 1.05;
      s.addText(st.val, {
        x: 9.1, y, w: 1.6, h: 0.5,
        fontSize: 22, fontFace: F.h, color: st.c, bold: true, align: "right",
      });
      s.addText(st.lbl, {
        x: 10.8, y, w: 2.0, h: 0.55,
        fontSize: 9, fontFace: F.b, color: C.textMuted, lineSpacingMultiple: 1.3,
      });
      if (i < 3) {
        s.addShape("line", {
          x: 9.4, y: y + 0.75, w: 3, h: 0,
          line: { color: C.border, width: 0.3 },
        });
      }
    });
  }

  // ──────────────────── SLIDE 3: SOLUTION ─────────────────────
  {
    const s = setupSlide(prs, 3, T, "SOLUTION");

    // "OUR SOLUTION" subtitle
    s.addText("How JANSAHAY transforms public service access", {
      x: 0.6, y: 1.5, w: 12, h: 0.35,
      fontSize: 11, fontFace: F.b, color: C.textMuted, italic: true,
    });

    // Solution flow (WellCall style: icon → title → desc)
    const solutions = [
      { icon: "💬", title: "PROACTIVE AI COPILOT", desc: "Understands user needs in natural language and instantly matches them with relevant government services and schemes.", color: C.blue, step: "01" },
      { icon: "📋", title: "DOCUMENT DOCTOR", desc: "AI-powered extraction and verification of details from uploaded documents — income certificates, IDs, and more.", color: C.green, step: "02" },
      { icon: "🎯", title: "SMART MATCHING", desc: "Proactively discovers schemes citizens qualify for based on their profile, alerting them to new opportunities.", color: C.gold, step: "03" },
      { icon: "📊", title: "JOURNEY TRACKER", desc: "Unified dashboard to track every application with real-time status updates, reminders, and next-step guidance.", color: C.cyan, step: "04" },
    ];

    solutions.forEach((sol, i) => {
      const x = 0.65 + i * 3.1;
      const y = 2.1;
      const w = 2.9;
      const h = 4.6;
      card(s, x, y, w, h, { topColor: sol.color });

      // Step number
      s.addText(sol.step, {
        x: x + 0.15, y: y + 0.2, w: 0.5, h: 0.35,
        fontSize: 11, fontFace: F.m, color: sol.color, bold: true,
      });

      // Icon circle
      s.addShape("ellipse", {
        x: x + 0.9, y: y + 0.8, w: 0.8, h: 0.8,
        fill: { color: sol.color, transparency: 82 },
        line: { color: sol.color, width: 1.2 },
      });
      s.addText(sol.icon, {
        x: x + 0.9, y: y + 0.8, w: 0.8, h: 0.8,
        fontSize: 24, align: "center", valign: "middle",
      });

      // Title
      s.addText(sol.title, {
        x: x + 0.15, y: y + 1.85, w: w - 0.3, h: 0.5,
        fontSize: 12, fontFace: F.h, color: C.white, bold: true,
        align: "center", charSpacing: 1.5,
      });

      // Description
      s.addText(sol.desc, {
        x: x + 0.2, y: y + 2.5, w: w - 0.4, h: 1.8,
        fontSize: 10.5, fontFace: F.b, color: C.textMuted,
        lineSpacingMultiple: 1.45, valign: "top", align: "center",
      });

      // Connector arrow to next
      if (i < 3) {
        s.addText("→", {
          x: x + w - 0.15, y: y + 1.0, w: 0.5, h: 0.5,
          fontSize: 18, color: C.textDim, align: "center", valign: "middle",
        });
      }
    });
  }

  // ─────────────────── SLIDE 4: ARCHITECTURE ──────────────────
  {
    const s = setupSlide(prs, 4, T, "ARCHITECTURE");

    // Left: Architecture layers (vertical flow diagram)
    const layers = [
      { label: "FRONTEND", desc: "React / Next.js\nTailwind CSS, TypeScript\nResponsive Web App", color: C.blue },
      { label: "AI ENGINE", desc: "LLM Orchestration\nIntent + Entity Extraction\nSemantic Matching", color: C.cyan },
      { label: "PROCESSING", desc: "OCR / NLP Pipelines\nEligibility Rule Engine\nScheme Database Indexer", color: C.gold },
      { label: "DATA LAYER", desc: "PostgreSQL / MongoDB\nEncrypted Cloud Storage\nRedis Cache", color: C.green },
    ];

    layers.forEach((l, i) => {
      const y = 1.65 + i * 1.35;
      // Color bar
      s.addShape("rect", {
        x: 0.65, y, w: 0.1, h: 1.1,
        fill: { color: l.color }, line: { width: 0 },
      });
      card(s, 0.85, y, 5.5, 1.1);
      s.addText(l.label, {
        x: 1.05, y: y + 0.08, w: 2.2, h: 0.35,
        fontSize: 13, fontFace: F.h, color: l.color, bold: true, charSpacing: 2,
      });
      s.addText(l.desc, {
        x: 3.3, y: y + 0.05, w: 2.8, h: 1.0,
        fontSize: 9.5, fontFace: F.b, color: C.textMuted, lineSpacingMultiple: 1.35,
      });
      // Connector
      if (i < 3) {
        s.addShape("line", {
          x: 3.5, y: y + 1.1, w: 0, h: 0.25,
          line: { color: C.border, width: 1, dashType: "dash" },
        });
        s.addText("▼", {
          x: 3.25, y: y + 1.1, w: 0.5, h: 0.25,
          fontSize: 8, color: C.textDim, align: "center",
        });
      }
    });

    // Right: Tech stack cards
    card(s, 6.8, 1.65, 5.8, 5.0);
    s.addText("TECH STACK", {
      x: 6.8, y: 1.8, w: 5.8, h: 0.4,
      fontSize: 14, fontFace: F.h, color: C.white, bold: true, align: "center", charSpacing: 3,
    });
    s.addShape("line", {
      x: 7.5, y: 2.25, w: 4.4, h: 0,
      line: { color: C.border, width: 0.5 },
    });

    const techs = [
      { cat: "Frontend", items: "React, Next.js, Tailwind CSS, TypeScript", c: C.blue },
      { cat: "AI / ML", items: "LLMs (GPT / Gemini), OCR, NLP Pipelines", c: C.cyan },
      { cat: "Backend", items: "Python FastAPI, Node.js, REST APIs", c: C.gold },
      { cat: "Database", items: "PostgreSQL, MongoDB, Redis", c: C.green },
      { cat: "DevOps", items: "Docker, Kubernetes, CI/CD, AWS/GCP", c: C.purple },
      { cat: "Security", items: "OAuth 2.0, AES Encryption, RBAC", c: C.red },
    ];

    techs.forEach((t, i) => {
      const y = 2.45 + i * 0.68;
      s.addShape("rect", {
        x: 7.1, y: y + 0.05, w: 0.07, h: 0.35,
        fill: { color: t.c }, line: { width: 0 },
      });
      s.addText(t.cat, {
        x: 7.35, y, w: 1.6, h: 0.45,
        fontSize: 11, fontFace: F.h, color: t.c, bold: true,
      });
      s.addText(t.items, {
        x: 9.0, y, w: 3.3, h: 0.45,
        fontSize: 10, fontFace: F.b, color: C.textMuted,
      });
    });
  }

  // ─────────────────── SLIDE 5: TECHNOLOGY USED ───────────────
  {
    const s = setupSlide(prs, 5, T, "TECHNOLOGY USED");

    const categories = [
      {
        title: "FRONTEND", items: ["React / Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
        color: C.blue, icon: "⚛",
      },
      {
        title: "AI & INTELLIGENCE", items: ["Large Language Models", "Computer Vision / OCR", "NLP Pipelines", "Vector Search"],
        color: C.cyan, icon: "🧠",
      },
      {
        title: "BACKEND & INFRA", items: ["Python (FastAPI)", "Node.js Runtime", "PostgreSQL + MongoDB", "Docker & K8s"],
        color: C.gold, icon: "⚙",
      },
      {
        title: "TRUST & SECURITY", items: ["OAuth 2.0 / JWT", "AES-256 Encryption", "RBAC Policies", "Audit Logging"],
        color: C.green, icon: "🔒",
      },
    ];

    categories.forEach((cat, i) => {
      const x = 0.55 + i * 3.1;
      const y = 1.7;
      const w = 2.95;
      const h = 5.0;

      card(s, x, y, w, h, { topColor: cat.color });

      // Icon
      s.addShape("ellipse", {
        x: x + 0.95, y: y + 0.35, w: 0.75, h: 0.75,
        fill: { color: cat.color, transparency: 82 },
        line: { color: cat.color, width: 1 },
      });
      s.addText(cat.icon, {
        x: x + 0.95, y: y + 0.35, w: 0.75, h: 0.75,
        fontSize: 22, align: "center", valign: "middle",
      });

      // Title
      s.addText(cat.title, {
        x: x, y: y + 1.3, w, h: 0.4,
        fontSize: 11, fontFace: F.h, color: C.white, bold: true,
        align: "center", charSpacing: 2,
      });

      // Items as pills
      cat.items.forEach((item, j) => {
        const iy = y + 1.95 + j * 0.65;
        s.addShape("roundRect", {
          x: x + 0.2, y: iy, w: w - 0.4, h: 0.48,
          fill: { color: C.bg },
          line: { color: C.border, width: 0.5 },
          rectRadius: 0.06,
        });
        s.addText(item, {
          x: x + 0.2, y: iy, w: w - 0.4, h: 0.48,
          fontSize: 10, fontFace: F.b, color: C.textMuted,
          align: "center", valign: "middle",
        });
      });
    });
  }

  // ──────────────── SLIDE 6: WORKING PROTOTYPE ────────────────
  {
    const s = setupSlide(prs, 6, T, "WORKING PROTOTYPE");

    // Main demo area
    card(s, 0.7, 1.7, 11.93, 5.0, { border: C.blue });

    // Play button
    s.addShape("ellipse", {
      x: 5.9, y: 3.0, w: 1.5, h: 1.5,
      fill: { color: C.blue, transparency: 65 },
      line: { color: C.blue, width: 2.5 },
      shadow: { type: "outer", blur: 20, offset: 0, color: C.blue, opacity: 0.3 },
    });
    s.addText("▶", {
      x: 5.97, y: 3.0, w: 1.5, h: 1.5,
      fontSize: 40, color: C.white, align: "center", valign: "middle",
    });

    s.addText("CLICK TO PLAY DEMO", {
      x: 3.5, y: 4.7, w: 6.33, h: 0.5,
      fontSize: 14, fontFace: F.h, color: C.textMuted,
      align: "center", charSpacing: 4,
    });
    s.addText("Attach video link for demo", {
      x: 3.5, y: 5.2, w: 6.33, h: 0.4,
      fontSize: 12, fontFace: F.b, color: C.textDim,
      align: "center", italic: true,
    });

    // Bottom info cards
    const demoLinks = [
      { label: "LIVE DEMO", val: "[URL]", c: C.blue },
      { label: "GITHUB REPO", val: "[URL]", c: C.cyan },
      { label: "VIDEO DEMO", val: "[URL]", c: C.gold },
    ];
    demoLinks.forEach((d, i) => {
      const x = 1.2 + i * 3.8;
      card(s, x, 5.8, 3.4, 0.7);
      s.addText(d.label, {
        x, y: 5.8, w: 3.4, h: 0.35,
        fontSize: 8, fontFace: F.h, color: d.c, bold: true, align: "center", charSpacing: 2,
      });
      s.addText(d.val, {
        x, y: 6.1, w: 3.4, h: 0.35,
        fontSize: 10, fontFace: F.b, color: C.textMuted, align: "center",
      });
    });
  }

  // ──────────────── SLIDE 7: UTILITY / SCALABILITY ────────────
  {
    const s = setupSlide(prs, 7, T, "UTILITY / SCALABILITY");

    // Top: Impact stat cards (WellCall inspiration)
    statBox(s, 0.6, 1.7, 2.8, 1.3, "10×", "Faster scheme\ndiscovery", C.blue);
    statBox(s, 3.6, 1.7, 2.8, 1.3, "90%", "Document processing\naccuracy", C.green);
    statBox(s, 6.6, 1.7, 2.8, 1.3, "24/7", "AI assistance\navailability", C.cyan);
    statBox(s, 9.6, 1.7, 2.8, 1.3, "∞", "Scalable to any\ngovernment scheme", C.gold);

    // Left: Utility
    card(s, 0.6, 3.3, 5.8, 3.6, { topColor: C.blue });
    s.addText("UTILITY", {
      x: 0.8, y: 3.5, w: 5.4, h: 0.4,
      fontSize: 14, fontFace: F.h, color: C.blue, bold: true, charSpacing: 3,
    });
    bullets(s, [
      "Bridges the digital divide for millions of underserved citizens",
      "Reduces processing time from weeks to minutes with AI verification",
      "Eliminates missed opportunities through proactive scheme matching",
      "Supports multi-language interactions for inclusive access",
    ], 0.8, 4.0, 5.4, 2.7, { size: 11 });

    // Right: Scalability
    card(s, 6.7, 3.3, 5.8, 3.6, { topColor: C.gold });
    s.addText("SCALABILITY", {
      x: 6.9, y: 3.5, w: 5.4, h: 0.4,
      fontSize: 14, fontFace: F.h, color: C.gold, bold: true, charSpacing: 3,
    });
    bullets(s, [
      "Cloud-native microservices for horizontal scaling",
      "Plug-and-play integration with new government portals",
      "WhatsApp / voice assistant integration for wider reach",
      "Deploy at district, state, or national level",
    ], 6.9, 4.0, 5.4, 2.7, { size: 11, bulletColor: C.gold });
  }

  // ──────── BONUS SLIDE 8: THE JANSAHAY EXPERIENCE ────────────
  // (WellCall's final slide with screenshots — added as bonus)
  {
    const s = setupSlide(prs, "★", T, "THE JANSAHAY EXPERIENCE");

    const imgDir = path.join(__dirname, "images");
    const screens = [
      { file: "dashboard.png.png", label: "Smart Dashboard", sub: "Personalized home with insights" },
      { file: "ai_agent.png.png", label: "AI Workspace Assistant", sub: "Natural language copilot" },
      { file: "discover.png.png", label: "Discover Services", sub: "Filtered scheme discovery" },
      { file: "document_doctor.png.png", label: "Document Doctor", sub: "AI extraction & verification" },
    ];

    // Also try without double extension
    const positions = [
      { x: 0.55, y: 1.65, w: 5.95, h: 2.7 },
      { x: 6.8, y: 1.65, w: 5.95, h: 2.7 },
      { x: 0.55, y: 4.55, w: 5.95, h: 2.7 },
      { x: 6.8, y: 4.55, w: 5.95, h: 2.7 },
    ];

    screens.forEach((scr, i) => {
      const pos = positions[i];
      card(s, pos.x, pos.y, pos.w, pos.h, { border: C.blue });

      // Try both filename variants
      let imgPath = path.join(imgDir, scr.file);
      if (!fs.existsSync(imgPath)) {
        imgPath = path.join(imgDir, scr.file.replace(".png.png", ".png"));
      }

      if (fs.existsSync(imgPath)) {
        s.addImage({
          path: imgPath,
          x: pos.x + 0.06, y: pos.y + 0.06,
          w: pos.w - 0.12, h: pos.h - 0.55,
          rounding: true,
        });
      } else {
        s.addText("[ " + scr.label + " screenshot ]", {
          x: pos.x, y: pos.y, w: pos.w, h: pos.h - 0.5,
          fontSize: 13, fontFace: F.b, color: C.textDim,
          align: "center", valign: "middle", italic: true,
        });
      }

      // Label bar at bottom
      s.addShape("rect", {
        x: pos.x + 0.06, y: pos.y + pos.h - 0.45, w: pos.w - 0.12, h: 0.4,
        fill: { color: C.bgCard, transparency: 10 },
        line: { width: 0 },
      });
      s.addText(scr.label, {
        x: pos.x + 0.2, y: pos.y + pos.h - 0.48, w: pos.w * 0.5, h: 0.2,
        fontSize: 10, fontFace: F.h, color: C.white, bold: true,
      });
      s.addText(scr.sub, {
        x: pos.x + 0.2, y: pos.y + pos.h - 0.3, w: pos.w - 0.4, h: 0.2,
        fontSize: 8, fontFace: F.b, color: C.textMuted,
      });
    });
  }

  // ────────────────────── SAVE ─────────────────────────────────
  const out = path.join(__dirname, "JANSAHAY_Presentation.pptx");
  prs.writeFile({ fileName: out }).then(() => {
    console.log(`\n  ✅  Saved: ${out}`);
    console.log(`  📑  Slides: ${T} (template) + 1 bonus screenshot slide`);
    console.log(`  🎨  Theme: Dark navy + blue/cyan/gold accents`);
    console.log(`  📸  Screenshots: auto-embedded from ./images/\n`);
  });
}

build();
