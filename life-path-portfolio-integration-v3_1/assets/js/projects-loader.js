/**
 * projects-loader.js
 *
 * Data-driven replacement for hand-written project cards. Drop this in
 * alongside your existing main.js and call initProjectsGrid() once the DOM
 * is ready (or add a <script src="assets/js/projects-loader.js" defer></script>
 * tag after main.js).
 *
 * How it works:
 *   1. Fetches /projects/manifest.json — a flat array of project slugs.
 *   2. Fetches /projects/<slug>.json for each slug.
 *   3. Drops anything with publishReady !== true (drafts never render).
 *   4. Sorts by `order` (ascending), falling back to dateStart (newest first).
 *   5. Renders one card per project into the grid container.
 *   6. Builds the filter tabs from the real `category` values present in the
 *      data — so a new category in a project JSON just works, no HTML edit.
 *
 * Requires no build step and no dependencies — this is plain fetch + DOM.
 */
(function () {
  "use strict";

  const GRID_SELECTOR = "#projects-grid";
  const FILTER_SELECTOR = "#projects-filter";
  const MANIFEST_URL = "/projects/manifest.json";
  const PROJECT_URL = (slug) => `/projects/${slug}.json`;

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

  function techNames(project) {
    return (project.technologies || []).map((t) => t.name);
  }

  function cardTemplate(project) {
    const cover = project.coverImage || {};
    const caseStudyUrl =
      (project.links && project.links.caseStudyUrl) || `/projects/${project.slug}/`;
    const stack = techNames(project).slice(0, 4).join(" · ");

    return `
      <article class="project-card" data-category="${escapeAttr(project.category)}" data-slug="${escapeAttr(project.slug)}">
        <a class="project-card__link" href="${escapeAttr(caseStudyUrl)}" aria-label="View case study: ${escapeAttr(project.title)}">
          <div class="project-card__media">
            ${
              cover.src
                ? `<img src="${escapeAttr(cover.src)}" alt="${escapeAttr(cover.alt || "")}" width="${cover.width || ""}" height="${cover.height || ""}" loading="lazy" />`
                : ""
            }
            ${project.featured ? `<span class="project-card__badge">Featured</span>` : ""}
          </div>
          <div class="project-card__body">
            <span class="project-card__category">${escapeHTML(project.category)}</span>
            <h3 class="project-card__title">${escapeHTML(project.title)}</h3>
            <p class="project-card__tagline">${escapeHTML(project.tagline)}</p>
            ${stack ? `<p class="project-card__stack">${escapeHTML(stack)}</p>` : ""}
          </div>
        </a>
      </article>
    `;
  }

  function escapeHTML(str) {
    return String(str || "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }
  function escapeAttr(str) { return escapeHTML(str); }

  function renderGrid(container, projects) {
    container.innerHTML = projects.map(cardTemplate).join("");
  }

  function renderFilters(filterContainer, gridContainer, projects) {
    if (!filterContainer) return;
    const categories = ["All", ...new Set(projects.map((p) => p.category))];

    filterContainer.innerHTML = categories
      .map(
        (cat, i) =>
          `<button type="button" class="filter-tab${i === 0 ? " is-active" : ""}" data-filter="${escapeAttr(cat)}">${escapeHTML(cat)}</button>`
      )
      .join("");

    filterContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-tab");
      if (!btn) return;
      filterContainer.querySelectorAll(".filter-tab").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      const filter = btn.dataset.filter;
      gridContainer.querySelectorAll(".project-card").forEach((card) => {
        const show = filter === "All" || card.dataset.category === filter;
        card.style.display = show ? "" : "none";
      });
    });
  }

  async function initProjectsGrid() {
    const grid = document.querySelector(GRID_SELECTOR);
    if (!grid) {
      console.warn(`[projects-loader] no element found for "${GRID_SELECTOR}" — skipping.`);
      return;
    }
    const filterBar = document.querySelector(FILTER_SELECTOR);

    try {
      const projects = await loadAllProjects();
      renderGrid(grid, projects);
      renderFilters(filterBar, grid, projects);
    } catch (err) {
      console.error("[projects-loader] failed to load projects:", err);
      grid.innerHTML = `<p class="projects-error">Couldn't load projects right now.</p>`;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProjectsGrid);
  } else {
    initProjectsGrid();
  }

  // exposed for manual re-init / debugging from the console
  window.initProjectsGrid = initProjectsGrid;
})();
