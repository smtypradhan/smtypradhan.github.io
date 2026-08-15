/**
 * projects-loader.js
 *
 * Appends data-driven project cards to the existing #project-grid on the
 * homepage, styled with the site's own card markup (.project-card /
 * .proj-tag / .proj-footer / .chips / .chip / .proj-arrow) so a card added
 * this way is visually identical to the hand-written ones already there.
 *
 * This runs ALONGSIDE the hand-written cards in index.html — it does not
 * replace or manage them. Going forward, ship a new project by dropping a
 * JSON file into /projects/ (matching project.schema.json) and adding its
 * slug to /projects/manifest.json; this script does the rest, including
 * generating a case-study page via generate-project-pages.js.
 *
 * Filtering: the site's existing filterProjects(cat, btn) in main.js reads
 * each card's data-cat attribute and toggles display — it does not know
 * anything about JSON. New cards get a data-cat mapped from their JSON
 * `category` field via CATEGORY_TO_SLUG below, so they participate in the
 * existing filter tabs (All / Data & AI / Dashboards / Strategy) with no
 * HTML changes. A category with no mapping falls back to "data" (the
 * broadest existing bucket) and logs a console warning rather than
 * silently vanishing from every filter.
 *
 * No dependencies — plain fetch + DOM, no build step.
 */
(function () {
  "use strict";

  const GRID_SELECTOR = "#project-grid";
  const MANIFEST_URL = "/projects/manifest.json";
  const PROJECT_URL = (slug) => `/projects/${slug}.json`;

  const CATEGORY_TO_SLUG = {
    "Data & AI": "data",
    "Dashboards": "dashboard",
    "Strategy": "strategy",
  };

  async function fetchJSON(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    return res.json();
  }

  async function loadAllProjects() {
    const manifest = await fetchJSON(MANIFEST_URL);
    const projects = await Promise.all(
      manifest.map((slug) =>
        fetchJSON(PROJECT_URL(slug)).catch((err) => {
          console.warn(`[projects-loader] skipping "${slug}":`, err.message);
          return null;
        })
      )
    );
    return projects
      .filter((p) => p && p.publishReady === true)
      .sort((a, b) => {
        if (a.order != null && b.order != null) return a.order - b.order;
        if (a.order != null) return -1;
        if (b.order != null) return 1;
        return new Date(b.dateStart) - new Date(a.dateStart);
      });
  }

  function escapeHTML(str) {
    return String(str || "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function slugForCategory(category) {
    const slug = CATEGORY_TO_SLUG[category];
    if (!slug) {
      console.warn(
        `[projects-loader] no filter-tab mapping for category "${category}" — defaulting to "data". ` +
        `Add it to CATEGORY_TO_SLUG in assets/js/projects-loader.js.`
      );
      return "data";
    }
    return slug;
  }

  function cardTemplate(project) {
    const caseStudyUrl = (project.links && project.links.caseStudyUrl) || `/projects/${project.slug}/`;
    const stack = (project.technologies || []).slice(0, 3).map((t) => t.name);
    const cat = slugForCategory(project.category);

    return `
      <a class="project-card" data-cat="${escapeHTML(cat)}" data-slug="${escapeHTML(project.slug)}" href="${escapeHTML(caseStudyUrl)}">
        <span class="proj-tag">${escapeHTML(project.category)}</span>
        <h3>${escapeHTML(project.title)}</h3>
        <p>${escapeHTML(project.tagline)}</p>
        <div class="proj-footer"><div class="chips">${stack.map((name) => `<span class="chip">${escapeHTML(name)}</span>`).join("")}</div><span class="proj-arrow">↗</span></div>
      </a>
    `.trim();
  }

  function bindHover(el) {
    // main.js binds the custom-cursor hover effect once, on page load, to
    // elements that exist at that moment — these cards are added after
    // fetch resolves, so they need their own listeners to get the effect.
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  }

  async function appendDataDrivenProjects() {
    const grid = document.querySelector(GRID_SELECTOR);
    if (!grid) {
      console.warn(`[projects-loader] no element found for "${GRID_SELECTOR}" — skipping.`);
      return;
    }
    try {
      const projects = await loadAllProjects();
      projects.forEach((project) => {
        grid.insertAdjacentHTML("beforeend", cardTemplate(project));
        const card = grid.querySelector(`[data-slug="${project.slug}"]`);
        if (card) bindHover(card);
      });
    } catch (err) {
      console.error("[projects-loader] failed to load projects:", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", appendDataDrivenProjects);
  } else {
    appendDataDrivenProjects();
  }

  // exposed for manual re-init / debugging from the console
  window.appendDataDrivenProjects = appendDataDrivenProjects;
})();
