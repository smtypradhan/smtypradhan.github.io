# Smty Pradhan — Portfolio
### Business Strategy & Analytics · AI-Powered · New York City

A personalised, single-page portfolio built for Smty Pradhan's professional
profile in Business Strategy and Analytics. Includes an embedded Claude AI
assistant briefed on Smty's real background, projects, and experience.

---

## File Structure

```
portfolio-smty/
│
├── index.html              ← All content & structure (no inline styles/scripts)
│
├── css/
│   └── style.css           ← All styles: tokens, layout, components, animations
│
├── js/
│   ├── chat.js             ← Claude AI chat logic + PORTFOLIO_CONTEXT briefing
│   └── animations.js       ← Scroll fade-in + hero entrance reveal
│
└── README.md               ← This file
```

---

## What's Inside

| Section | Content |
|---|---|
| Hero | Name, tagline, 5 KPI stats (funding facilitated, startups, engagement lift, ML accuracy, availability) |
| Ticker | Scrolling strip of Smty's core competencies |
| Projects | 6 real projects with impact badges and external links |
| Skills | 4 skill groups: Strategy, Analytics, Execution, Certifications |
| About | Bio, background, and meta details grid |
| Testimonials | 6 real testimonials from collaborators |
| AI Chat | Live Claude assistant briefed on Smty's full background |
| Contact | Email, LinkedIn, GitHub, Medium, portfolio link |

---

## Quick Start

1. **Download** the `portfolio-smty/` folder.
2. **Open `index.html`** directly in a browser — no build step, no installs.
3. **Personalise** using the sections below.
4. **Deploy** by uploading the folder to any static host.

The AI chat requires a live internet connection to reach the Anthropic API.

---

## Customisation Guide

### 1 — Update your KPI stats (index.html)

The hero stats block is in `.hero-right`. Each row follows this pattern:

```html
<div class="stat-row">
  <span class="stat-label">Seed Funding Facilitated</span>
  <span class="stat-val">$3<em>M+</em></span>
</div>
```

Replace the label and value with your latest numbers.
Use `<em>` for the unit/suffix — it renders in terracotta italic.

Recommended KPIs for a Business Strategy & Analytics professional:
- Revenue influenced or cost savings identified
- Stakeholder engagement lift (%)
- Model accuracy or forecast accuracy (%)
- Startups / clients supported
- Decision cycle time reduced

---

### 2 — Update the AI briefing (js/chat.js)

The `PORTFOLIO_CONTEXT` constant is what the AI knows about you.
It was built from your existing portfolio at smtypradhan.github.io.
Update it whenever you:
- Complete a new project
- Earn a new certification
- Change your availability or location
- Add new testimonials

Key sections to keep fresh:

```js
const PORTFOLIO_CONTEXT = `
...
KEY IMPACT METRICS:
- Facilitated $3M+ in seed funding ...   ← update with new wins

SELECTED PROJECTS:
1. ...                                    ← add new projects here

CERTIFICATIONS & CONTINUOUS LEARNING:
- ...                                     ← add new certs here

AVAILABILITY:
Currently open to full-time roles ...     ← update when status changes
`;
```

---

### 3 — Add or edit projects (index.html)

Each project lives in a `.project-card` inside `.projects-grid`:

```html
<div class="project-card">
  <p class="project-num">07</p>
  <h3 class="project-title">Your Project Title</h3>
  <p class="project-desc">What you did and the impact it had.</p>
  <div class="project-meta-row">
    <span class="impact-badge">Key metric or outcome</span>
  </div>
  <div class="project-tags">
    <span class="tag">Tool</span>
    <span class="tag">Method</span>
  </div>
  <a href="https://your-link.com" target="_blank" class="project-link">
    View Project →
  </a>
</div>
```

The `.impact-badge` is the most important element — make it a
specific, quantified outcome (e.g. "94% forecast accuracy", "$2.8M saved").

---

### 4 — Update testimonials (index.html)

Each testimonial card follows this structure:

```html
<div class="testimonial-card">
  <p class="testimonial-quote">Their exact words here.</p>
  <div class="testimonial-author">
    <div class="testimonial-avatar">XX</div>  ← initials
    <div>
      <p class="testimonial-name">Full Name</p>
      <p class="testimonial-role">Title, Company</p>
    </div>
  </div>
</div>
```

---

### 5 — Change the colour scheme (css/style.css)

All colours are defined in `:root` at the top of `style.css`:

```css
:root {
  --cream:  #f8f4ef;    /* page background */
  --bark:   #1c1712;    /* primary text */
  --terra:  #b85c38;    /* accent colour (terracotta) */
  --terra2: #d4804f;    /* lighter accent (used in dark section) */
  --forest: #2d6a4f;    /* status dot (green) */
}
```

To change the accent, update `--terra` and `--terra2`.
The dark AI section uses `--bark` as background — update `--bark` to
change that too.

---

### 6 — Update suggestion chips (index.html)

The four quick-question buttons in the chat section:

```html
<div class="chat-suggestions">
  <button class="suggestion-btn" onclick="askSuggestion(this)">
    Tell me about the startup funding work
  </button>
  <!-- add/edit more buttons here -->
</div>
```

Change the text to match the questions you get asked most often.

---

## Deployment Options

This is a **static site** — upload the folder and you're live.

| Host | How |
|---|---|
| **GitHub Pages** | Push to your existing `smtypradhan.github.io` repo, or a subfolder |
| **Netlify** | Drag the folder onto netlify.com/drop |
| **Vercel** | `vercel deploy` or import from GitHub |
| **Cloudflare Pages** | Connect repo → no build command → output `/` |

Since you already have `smtypradhan.github.io`, the simplest path is to
copy these files into a new branch of that repo and update your GitHub
Pages settings, or host it as `smtypradhan.github.io/v2/`.

---

## API Key & Security

The Claude AI chat calls the Anthropic API directly from the browser.

**Inside Claude.ai Artifacts:** authentication is injected automatically —
no key configuration needed.

**For self-hosted production use:** wrap the API call in your own backend
endpoint. In `chat.js`, replace the direct `fetch('https://api.anthropic.com/...')`
call with a call to your own server:

```js
// Replace direct Anthropic call:
const response = await fetch('/api/portfolio-chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages: conversationHistory }),
});
```

Then handle the Anthropic API call server-side, keeping your key in an
environment variable. Never commit an API key to a public GitHub repo.

---

## JavaScript Reference

### chat.js

| Function | Description |
|---|---|
| `sendMessage(overrideText?)` | Main handler. Sends a message to Claude, renders the response. Uses `overrideText` if supplied, otherwise reads `#chat-input`. |
| `askSuggestion(btn)` | Called `onclick` by suggestion chips. Passes button text to `sendMessage()`. |
| `appendMessage(role, text, isError?)` | Creates and inserts a message bubble into the chat window. |
| `showTyping()` | Inserts the animated typing indicator (id: `typing-msg`). |
| `removeTyping()` | Removes the typing indicator. |
| `escapeHtml(str)` | Sanitises text before DOM insertion to prevent XSS. |

### animations.js

| Item | Description |
|---|---|
| `scrollObserver` | `IntersectionObserver` that adds `.visible` to `.fade-up` elements as they enter the viewport. |
| `DOMContentLoaded` listener | Adds `.visible` to `.hero .fade-up` elements 120ms after page load. |

To animate a new element on scroll: add `class="fade-up"` to it.
To stagger: add `style="transition-delay: 0.15s"` (or 0.2s, 0.3s, etc.).

---

## Browser Compatibility

| Feature | Support |
|---|---|
| CSS Grid & custom properties | All modern browsers |
| `IntersectionObserver` | Chrome 51+, Firefox 55+, Safari 12.1+, Edge 15+ |
| `fetch` + `async/await` | All modern browsers |
| `backdrop-filter` (nav blur) | Chrome, Safari, Edge — degrades gracefully in Firefox |
| CSS `animation` | All modern browsers |

---

## Personalisation Checklist

Before publishing, make sure you've:

- [ ] Updated all KPI stats in `.hero-right` with your latest numbers
- [ ] Refreshed the `PORTFOLIO_CONTEXT` in `chat.js` with any new projects/certs
- [ ] Updated your email/LinkedIn/GitHub/Medium links in the Contact section
- [ ] Replaced `© 2025 Smty Pradhan` in the footer if the year changes
- [ ] Added any new testimonials you've received
- [ ] Tested the AI chat with 3–4 questions a recruiter might ask
- [ ] Verified all project links (Tableau, GitHub, Medium) still work

---

## Credits

Built with Claude AI · Fonts by Google Fonts (Cormorant Garamond,
Space Grotesk, JetBrains Mono) · No frameworks, no build step.
