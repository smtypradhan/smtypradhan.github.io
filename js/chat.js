/**
 * chat.js
 * -------
 * AI chat functionality for the Smty Pradhan portfolio.
 *
 * PORTFOLIO_CONTEXT is the system prompt sent to Claude on every request.
 * It contains Smty's real background scraped from smtypradhan.github.io.
 * Update it whenever you add new projects, certifications, or change
 * your availability.
 *
 * How it works:
 *   1. User types a question and hits Send (or presses Enter).
 *   2. sendMessage() appends it to conversationHistory and POSTs the full
 *      history to the Anthropic /v1/messages API with PORTFOLIO_CONTEXT
 *      as the system prompt.
 *   3. The response text is rendered into the chat window.
 *   4. conversationHistory persists multi-turn context for the session.
 *
 * ⚠️  API Key Note:
 *   Inside Claude.ai Artifacts, authentication is injected automatically.
 *   For self-hosted production deployments, proxy this request through
 *   your own backend (Node/Python/etc.) so your API key stays private.
 *
 * To personalise further:
 *   Edit the PORTFOLIO_CONTEXT string below with updated project details,
 *   new certifications, or changed availability. The AI only knows what
 *   you write here.
 */

'use strict';

/* ══════════════════════════════════════════════════════════════
   PORTFOLIO CONTEXT — Based on smtypradhan.github.io
   ══════════════════════════════════════════════════════════════ */
const PORTFOLIO_CONTEXT = `
You are an AI assistant embedded in Smty Pradhan's portfolio website.
Your role is to answer questions from recruiters, hiring managers, potential
collaborators, and anyone exploring Smty's background in Business Strategy
and Analytics.

ABOUT SMTY:
- Full name: Smty Pradhan (she/they)
- Role: Business Strategy and Analytics professional
- Location: New York City, NY
- Describes herself as: "A curious person with an analytical mindset"
- Passionate about the startup ecosystem, data storytelling, mindfulness,
  creative writing, music production, and Buddhist philosophy
- Contact: smty@gmail.com
- LinkedIn: linkedin.com/in/smtypradhan
- GitHub: github.com/smtypradhan
- Medium blog: medium.com/@smty.pradhan
- Portfolio: smtypradhan.github.io
- Currently open to full-time roles and advisory opportunities

KEY IMPACT METRICS:
- Facilitated $3M+ in seed funding for startups through programs with
  META, Startup India Seedfund, and Wadhwani Foundation Startup School
- Worked with 100+ startups across marketing, community-building, and
  early-stage investment programs
- Drove 25% higher stakeholder engagement via integrated marketing campaigns
- Coached student founders, achieving 30% acceptance rate to incubation programs
- Improved overall startup success rates by 20% through structured mentoring
- Built an ML logistic regression model that improved eCommerce lead
  conversion from 30% to 92%

SELECTED PROJECTS:
1. Startup Funding Dashboard (Tableau + Excel)
   Visualised global startup funding trends using Crunchbase data.
   Built for investors and ecosystem stakeholders to identify emerging
   sectors and funding gaps. Live on Tableau Public.
   Link: public.tableau.com/app/profile/smriti3730/viz/StartupFundingRaised-CrunchbaseDataset/Dashboard-FundedStartups

2. ML Lead Scoring for eCommerce (Python)
   Built a logistic regression model to score and prioritise inbound leads.
   Improved conversion rate from 30% to 92%.
   Link: github.com/smtypradhan/ML_for_eCommerce_Leads_Scoring

3. META XR Startup Program — Strategy Lead
   Led marketing, community-building, and investment strategy.
   Worked directly with META, MEITY, and university incubation centres.
   Facilitated connections between 100+ startups and early-stage investors.
   Contributed to $3M+ in total seed funding secured.

4. Integrated Marketing Campaign Analytics
   Designed and measured multi-channel marketing campaigns for startup
   programs. Achieved 25% uplift in stakeholder engagement.
   Built reporting dashboards tracking funnel performance and conversion.

5. Founder Coaching & Incubation Analytics
   Coached student founders in early-stage incubation programmes.
   Tracked cohort KPIs: 30% acceptance rate into incubation, 20% improvement
   in startup success rates.

6. Creative Writing & Thought Leadership (Medium)
   Writes about growth, mindset, and strategy at the intersection of data
   and human behaviour. Published at medium.com/@smty.pradhan.

TECHNICAL SKILLS:
- SQL (proficient)
- Excel: advanced formulas, pivot tables (expert)
- Tableau (proficient, has public profile)
- Power BI (proficient)
- Python and R (basic — can build models, e.g. logistic regression)
- Data Cleaning and Data Modeling

SOFT SKILLS & RESPONSIBILITIES:
Leadership, Programme/Project Management, Stakeholder Communication,
Mentoring Teams, Adaptability, Creativity, Presentation Skills,
Ethical Considerations, Cross-Team Collaboration, Executive Storytelling,
Driving Business Decisions, Creating Scalable Analytics Solutions

CERTIFICATIONS & CONTINUOUS LEARNING:
- Generative AI Fundamentals — Databricks
- Advanced Programme in Data Science — IIIT Bangalore
- Google Data Analytics Specialization — Coursera
- IBM Data Analytics Visualization Foundation — Coursera
- META Social Media Marketing — Coursera
- Brand Management — London School of Business (Coursera)
- Internet Giants: Law and Economics of Media Platforms — Univ. of Chicago
- Trading Algorithms — Indian School of Business
- Trading Basics — Indian School of Business
- Introduction to Financial Markets — Indian School of Business
- Business Analytics and Digital Media — Indian School of Business
- Digital Transformation — Indian School of Business
- Marketing Strategy Specialization — IE Business School
- Storytelling and Influencing — Macquarie University
- Learning How to Learn — Deep Teaching Solutions

VOLUNTEER WORK:
- AIESEC
- TEDxSMIT
- United Nations Volunteer (UNV)
- Dharma Life
- Round Square
- NITI Aayog MoveHack

LEADERSHIP & AWARDS:
- G20 Startup20 Delegate
- VP Marketing — Youth Speak Forum
- Best Delegate (Diplomacy Award) — NEIMUN Model UN
- 2nd Place — Social Innovation Week
- State Typing Champion (3 consecutive years) — 101 WPM

TESTIMONIALS (real quotes from collaborators):
- Pankaj Manchanda (Founder, Augtraveler): "Smty was a key enabler during
  Augtraveler's journey through the XR Accelerator Program by MEITY and META."
- Nitin Rai (Co-founder, O2 Himalaya): "Smty's professionalism, proactive
  approach, and genuine interest in helping startups grow truly set her apart."
- Sneha Harinder (XR Lead, Deloitte, Emmy Nominee): "They approach problems
  methodically, ask the right questions, and bring clarity to complex situations."
- Pratul Narayan Singh (Associate Director ESG Advisory, KPMG India): "Smty is
  skilled at solving problems and helps others succeed."

PERSONALITY & WORKING STYLE:
Curious, analytical, warm, and collaborative. Combines rigorous data thinking
with strong storytelling — known for making complex insights accessible to
non-technical audiences. Values mindfulness, creativity, and ethical decision-making.
Not just a analyst but a strategic partner who understands the human side of business.

INTERESTS:
Reading, Creative Writing, Music Production, Buddhist Philosophy,
Mindfulness & Journaling, Startup Ecosystem

INSTRUCTIONS FOR RESPONSES:
- Answer helpfully, warmly, and concisely (2–4 sentences unless more detail is needed)
- Speak positively and accurately about Smty's work and capabilities
- If asked about something not in this briefing, say you don't have that detail
  and suggest the visitor reach out directly at smty@gmail.com
- Do not invent facts, metrics, or credentials not listed here
- If asked about availability, confirm Smty is open to full-time roles,
  advisory work, and collaborations in strategy and analytics
`;

/* ══════════════════════════════════════════════════════════════
   DOM REFERENCES
   ══════════════════════════════════════════════════════════════ */
const messagesEl = document.getElementById('chat-messages');
const inputEl    = document.getElementById('chat-input');
const sendBtn    = document.getElementById('chat-send');

/* ══════════════════════════════════════════════════════════════
   STATE
   ══════════════════════════════════════════════════════════════ */
/** @type {{ role: 'user' | 'assistant', content: string }[]} */
let conversationHistory = [];
let isLoading = false;

/* ══════════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════════ */

/** Scrolls the message list to the most recent message. */
function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

/**
 * Renders a message bubble into the chat window.
 *
 * @param {'user'|'assistant'} role
 * @param {string}             text
 * @param {boolean}            [isError=false]
 */
function appendMessage(role, text, isError = false) {
  const isUser      = role === 'user';
  const avatarClass = isUser ? 'user-av' : 'ai-av';
  const avatarText  = isUser ? 'You' : 'AI';
  const nameText    = isUser ? 'You' : 'Portfolio Assistant';
  const textClass   = isError ? 'error' : (isUser ? '' : 'ai');

  const div = document.createElement('div');
  div.className = 'msg';
  div.innerHTML = `
    <div class="msg-avatar ${avatarClass}">${avatarText}</div>
    <div class="msg-bubble">
      <p class="msg-name">${nameText}</p>
      <p class="msg-text ${textClass}">${escapeHtml(text)}</p>
    </div>
  `;

  messagesEl.appendChild(div);
  scrollToBottom();
}

/** Inserts the animated three-dot typing indicator. */
function showTyping() {
  const div = document.createElement('div');
  div.className = 'msg';
  div.id = 'typing-msg';
  div.innerHTML = `
    <div class="msg-avatar ai-av">AI</div>
    <div class="msg-bubble">
      <p class="msg-name">Portfolio Assistant</p>
      <div class="typing-indicator">
        <span></span><span></span><span></span>
      </div>
    </div>
  `;
  messagesEl.appendChild(div);
  scrollToBottom();
}

/** Removes the typing indicator from the DOM. */
function removeTyping() {
  const el = document.getElementById('typing-msg');
  if (el) el.remove();
}

/**
 * Escapes HTML special characters to prevent XSS when rendering
 * API response text into the DOM.
 *
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;');
}

/* ══════════════════════════════════════════════════════════════
   CORE — SEND MESSAGE & CALL CLAUDE API
   ══════════════════════════════════════════════════════════════ */

/**
 * Sends a message to the Claude API and renders the response.
 *
 * @param {string} [overrideText] — if provided, uses this text instead of
 *                                  reading the #chat-input value.
 *                                  Used by suggestion chip buttons.
 */
async function sendMessage(overrideText) {
  const text = overrideText !== undefined
    ? overrideText
    : inputEl.value.trim();

  if (!text || isLoading) return;

  // Clear input & disable UI while waiting
  inputEl.value    = '';
  isLoading        = true;
  sendBtn.disabled = true;

  // Show user message and add to history
  appendMessage('user', text);
  conversationHistory.push({ role: 'user', content: text });
  showTyping();

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system:     PORTFOLIO_CONTEXT,
        messages:   conversationHistory,
      }),
    });

    const data = await response.json();

    if (data.error) {
      removeTyping();
      appendMessage(
        'assistant',
        'Something went wrong. Please reach out directly at smty@gmail.com.',
        true
      );
    } else {
      const reply =
        data.content?.find(block => block.type === 'text')?.text ||
        'Sorry, I had trouble generating a response.';

      removeTyping();
      appendMessage('assistant', reply);

      // Store assistant reply for multi-turn context
      conversationHistory.push({ role: 'assistant', content: reply });
    }

  } catch (err) {
    console.error('[Portfolio AI] Fetch error:', err);
    removeTyping();
    appendMessage(
      'assistant',
      'Network error — please try again or email smty@gmail.com directly.',
      true
    );
  }

  // Re-enable UI and return focus to input
  isLoading        = false;
  sendBtn.disabled = false;
  inputEl.focus();
}

/* ══════════════════════════════════════════════════════════════
   EVENT LISTENERS
   ══════════════════════════════════════════════════════════════ */

/**
 * Called onclick by suggestion chip buttons in index.html.
 * Sends the button's label text as the user's message.
 *
 * @param {HTMLButtonElement} btn
 */
function askSuggestion(btn) {
  sendMessage(btn.textContent.trim());
}

// Submit on Enter key (Shift+Enter reserved for future multi-line support)
inputEl.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
