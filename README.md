# smtypradhan.github.io

Personal portfolio — Smty Pradhan · Data & Analytics · New York City

---

## 🚀 How to deploy

1. Create a GitHub repo named exactly: `smtypradhan.github.io`
2. Upload all files keeping the folder structure below intact
3. Go to **Settings → Pages → Branch: main → / (root)** → Save
4. Live at: `https://smtypradhan.github.io` within ~60 seconds

---

## 📁 File structure

```
smtypradhan.github.io/
├── index.html                  ← Main page (edit content here)
├── README.md                   ← This file
└── assets/
    ├── css/
    │   └── style.css           ← All styles & color variables
    ├── js/
    │   └── main.js             ← Cursor, carousel, filter, highlight
    └── images/                 ← All logo PNGs/SVGs
        ├── google.png
        ├── ibm.png
        ├── meta.png
        └── ... (22 total)
```

---

## ✏️ How to update content

| What | Where in index.html | Search for |
|---|---|---|
| Hero headline | `<h1>` in `.hero-grid` | `Turning data into` |
| Hero stats | `.stats-col` | `stat-num` |
| Projects | `.project-grid` | `project-card` |
| Experience | `.timeline` | `tl-item` |
| Skills | `.skills-grid` | `skill-tags` |
| Collaborated With logos | `.collab-track` | `collab-cell` |
| Courses logos | `.logos-grid` | `logo-cell` |
| Recommendations | `.rec-list` | `rec-row` |
| Contact links | `.cta-band` | `cta-links` |

---

## 🎨 Color system

Edit variables at the top of `assets/css/style.css`:

```css
:root {
  --accent:        #1a2e4a;   /* Dark navy — nav, CTA band */
  --accent-bright: #2563a8;   /* Mid blue — labels, tags, accents */
  --accent-light:  #dde8f5;   /* Pale blue — avatar bg, borders */
  --accent-muted:  #e8eef6;   /* Very pale — active highlight bg */
  --black:         #111111;
  --gray-6:        #f4f4f4;   /* Section backgrounds */
  --white:         #ffffff;
}
```

---

## 🔗 Key links (already in the site)

- LinkedIn: https://linkedin.com/in/smtypradhan
- GitHub: https://github.com/smtypradhan
- Resume: https://drive.google.com/file/d/1Jd1ku5oaOv8BIc50ffJ8KcO7Alil1a-b/view

---

## 📦 Adding a new logo

1. Save your PNG/SVG to `assets/images/yourlogo.png`
2. In `index.html`, copy an existing `.logo-cell` block and update the `src` and `alt`

## 🔄 Updating recommendations

Each recommendation is a `.rec-row` block in `index.html`.  
Find by the person's initials in the `.rec-avatar` div and update the `.rec-quote` text.
