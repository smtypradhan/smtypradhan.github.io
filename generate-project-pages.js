#!/usr/bin/env node
/**
 * generate-project-pages.js
 *
 * Reads projects/manifest.json + each projects/<slug>.json and writes a
 * standalone, shareable case-study page to projects/<slug>/index.html —
 * each with its own <title>, meta description, Open Graph / Twitter Card
 * tags, and JSON-LD structured data, all pulled from that project's JSON.
 *
 * No dependencies — plain Node `fs`/`path`. Run it any time a project JSON
 * changes:
 *
 *   node generate-project-pages.js
 *
 * Drafts (publishReady !== true) are still generated locally so you can
 * preview them, but are marked <meta name="robots" content="noindex">
 * so they never show up in search while unfinished.
 */
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PROJECTS_DIR = path.join(ROOT, "projects");
const OUT_DIR = path.join(ROOT, "projects"); // projects/<slug>/index.html
const SITE_ORIGIN = "https://smtypradhan.github.io";
const SITE_NAME = "Smty Pradhan — Data & Analytics";

function readJSON(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }

function esc(str) {
  return String(str || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function absoluteUrl(p) {
  if (!p) return "";
  return p.startsWith("http") ? p : `${SITE_ORIGIN}${p}`;
}

function buildJsonLd(project) {
  const type = (project.seo && project.seo.schemaType) || "CreativeWork";
  const base = {
    "@context": "https://schema.org",
    "@type": type,
    name: project.title,
    description: project.summary,
    url: `${SITE_ORIGIN}/projects/${project.slug}/`,
    image: absoluteUrl(project.coverImage && project.coverImage.src),
    dateCreated: project.dateStart,
    dateModified: project.dateModified,
    creator: { "@type": "Person", name: "Smty Pradhan", url: SITE_ORIGIN },
    keywords: (project.seo && project.seo.keywords || []).join(", ")
  };
  if (type === "SoftwareApplication") {
    base.applicationCategory = "WebApplication";
    base.operatingSystem = "Web";
    base.offers = { "@type": "Offer", price: "0", priceCurrency: "USD" };
  }
  return JSON.stringify(base, null, 2);
}

function renderMetricRow(m) {
  return `
        <div class="metric">
          <span class="metric__value">${esc(m.value)}</span>
          <span class="metric__label">${esc(m.label)}</span>
          ${m.description ? `<span class="metric__desc">${esc(m.description)}</span>` : ""}
        </div>`;
}

function renderLinks(links) {
  if (!links) return "";
  const buttons = [];
  if (links.liveUrl) buttons.push(`<a class="btn btn--primary" href="${esc(links.liveUrl)}">View live demo</a>`);
  if (links.repoUrl) buttons.push(`<a class="btn" href="${esc(links.repoUrl)}">View code</a>`);
  if (links.demoVideoUrl) buttons.push(`<a class="btn" href="${esc(links.demoVideoUrl)}">Watch demo</a>`);
  return buttons.length ? `<div class="project-links">${buttons.join("\n")}</div>` : "";
}

function renderPage(project) {
  const cs = project.caseStudy || {};
  const cover = project.coverImage || {};
  const canonical = `${SITE_ORIGIN}/projects/${project.slug}/`;
  const ogImage = absoluteUrl(cover.src);
  const isDraft = project.publishReady !== true;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(project.title)} — ${esc(SITE_NAME)}</title>
<meta name="description" content="${esc(project.summary)}">
${isDraft ? '<meta name="robots" content="noindex,nofollow">\n' : ""}<link rel="canonical" href="${canonical}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE_NAME)}">
<meta property="og:title" content="${esc(project.title)}">
<meta property="og:description" content="${esc(project.summary)}">
<meta property="og:url" content="${canonical}">
${ogImage ? `<meta property="og:image" content="${esc(ogImage)}">\n<meta property="og:image:width" content="${cover.width || 1600}">\n<meta property="og:image:height" content="${cover.height || 1000}">\n` : ""}
<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(project.title)}">
<meta name="twitter:description" content="${esc(project.summary)}">
${ogImage ? `<meta name="twitter:image" content="${esc(ogImage)}">\n` : ""}
<!-- Structured data -->
<script type="application/ld+json">
${buildJsonLd(project)}
</script>

<link rel="stylesheet" href="/assets/css/style.css">
<link rel="stylesheet" href="/assets/css/project-page.css">
</head>
<body class="project-page">
  <a class="back-link" href="/#projects">&larr; All projects</a>

  <header class="project-hero">
    <p class="project-hero__category">${esc(project.category)}</p>
    <h1 class="project-hero__title">${esc(project.title)}</h1>
    <p class="project-hero__tagline">${esc(project.tagline)}</p>
    ${renderLinks(project.links)}
  </header>

  ${cover.src ? `<img class="project-hero__image" src="${esc(cover.src)}" alt="${esc(cover.alt)}" width="${cover.width || ""}" height="${cover.height || ""}">` : ""}

  <main class="project-body">
    ${cs.problem ? `<section><h2>The problem</h2><p>${esc(cs.problem)}</p></section>` : ""}
    ${cs.approach && cs.approach.length ? `
    <section>
      <h2>Approach</h2>
      <ol class="approach-steps">
        ${cs.approach.map((step) => `<li>${esc(step)}</li>`).join("\n        ")}
      </ol>
    </section>` : ""}
    ${cs.solution ? `<section><h2>Solution</h2><p>${esc(cs.solution)}</p></section>` : ""}
    ${cs.impactMetrics && cs.impactMetrics.length ? `
    <section>
      <h2>Impact</h2>
      <div class="metrics-row">
        ${cs.impactMetrics.map(renderMetricRow).join("\n")}
      </div>
    </section>` : ""}
    ${cs.learnings ? `<section><h2>What I'd carry forward</h2><p>${esc(cs.learnings)}</p></section>` : ""}

    <section class="project-meta">
      <h2>Details</h2>
      <dl>
        <dt>Role</dt><dd>${esc(project.role)}</dd>
        <dt>Timeline</dt><dd>${esc(project.dateStart)}${project.dateEnd ? " – " + esc(project.dateEnd) : " – ongoing"}</dd>
        <dt>Built with</dt><dd>${(project.technologies || []).map((t) => esc(t.name)).join(", ")}</dd>
      </dl>
    </section>
  </main>
</body>
</html>
`;
}

function main() {
  const manifest = readJSON(path.join(PROJECTS_DIR, "manifest.json"));
  const results = [];

  manifest.forEach((slug) => {
    const jsonPath = path.join(PROJECTS_DIR, `${slug}.json`);
    if (!fs.existsSync(jsonPath)) {
      console.warn(`skip: ${slug} — no JSON file at ${jsonPath}`);
      return;
    }
    const project = readJSON(jsonPath);
    const html = renderPage(project);
    const outDir = path.join(OUT_DIR, slug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, "index.html"), html, "utf8");
    results.push({ slug, publishReady: project.publishReady === true, outPath: path.join("projects", slug, "index.html") });
  });

  console.log(`Generated ${results.length} project page(s):`);
  results.forEach((r) => console.log(`  ${r.publishReady ? "✓ live " : "… draft"}  /${r.outPath}`));
}

main();
