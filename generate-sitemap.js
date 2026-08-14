#!/usr/bin/env node
/**
 * generate-sitemap.js
 *
 * Builds sitemap.xml from the same data source as generate-project-pages.js:
 * projects/manifest.json + each projects/<slug>.json. Draft projects
 * (publishReady !== true) are excluded, same as the homepage grid and the
 * noindex rule on their generated pages — a draft should never appear in
 * the sitemap while it's still unpublished.
 *
 * Run this any time a project JSON changes, alongside generate-project-pages.js:
 *
 *   node generate-project-pages.js && node generate-sitemap.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PROJECTS_DIR = path.join(ROOT, "projects");
const SITE_ORIGIN = "https://smtypradhan.github.io";

function readJSON(p) { return JSON.parse(fs.readFileSync(p, "utf8")); }

function todayISO() { return new Date().toISOString().slice(0, 10); }

function urlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function main() {
  const manifest = readJSON(path.join(PROJECTS_DIR, "manifest.json"));
  const entries = [urlEntry(`${SITE_ORIGIN}/`, todayISO(), "monthly", "1.0")];
  let included = 0;

  manifest.forEach((slug) => {
    const jsonPath = path.join(PROJECTS_DIR, `${slug}.json`);
    if (!fs.existsSync(jsonPath)) {
      console.warn(`skip: ${slug} — no JSON file at ${jsonPath}`);
      return;
    }
    const project = readJSON(jsonPath);
    if (project.publishReady !== true) {
      console.log(`skip (draft): ${slug}`);
      return;
    }
    const lastmod = project.dateModified || project.dateStart || todayISO();
    entries.push(urlEntry(`${SITE_ORIGIN}/projects/${project.slug}/`, lastmod, "monthly", "0.8"));
    included++;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml, "utf8");
  console.log(`Wrote sitemap.xml with ${entries.length} URL(s) (${included} published project page(s) + homepage).`);
}

main();
