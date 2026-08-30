(() => {
  const LANG_KEY = "kc-lang";
  const THEME_KEY = "kc-theme";
  const SUPPORTED = ["en", "es"];

  const appRoot = document.querySelector("[data-app]");
  const statusEl = document.querySelector("[data-status]");
  const brandEl = document.querySelector("[data-bind='brand']");
  const navList = document.querySelector("[data-nav-list]");
  const mobileNavList = document.querySelector("[data-mobile-nav-list]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const langButtons = [...document.querySelectorAll("[data-lang]")];
  const skipLink = document.querySelector(".skip-link");

  let content = null;
  let lang = "en";
  let theme = "dark";

  function t(value) {
    if (value == null) return "";
    if (typeof value === "string") return value;
    return value[lang] ?? value.en ?? Object.values(value)[0] ?? "";
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function externalHint() {
    return ` <span class="visually-hidden">${escapeHtml(t(content.ui.externalLink))}</span>`;
  }

  function setStatus(message, isError = false) {
    if (!appRoot) return;
    appRoot.innerHTML = `<p class="shell status${isError ? " status--error" : ""}">${escapeHtml(message)}</p>`;
    appRoot.setAttribute("aria-busy", isError ? "false" : "true");
  }

  function preferredLang() {
    const stored = localStorage.getItem(LANG_KEY);
    if (SUPPORTED.includes(stored)) return stored;
    const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    if (SUPPORTED.includes(nav)) return nav;
    return content?.site?.defaultLanguage || "en";
  }

  function preferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
    if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
    return content?.site?.themeDefault || "dark";
  }

  function applyTheme(next) {
    theme = next;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    if (themeToggle && content) {
      themeToggle.setAttribute(
        "aria-label",
        t(theme === "dark" ? content.ui.theme.toLight : content.ui.theme.toDark)
      );
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "dark" ? "#0b1210" : "#f3f7f4";
  }

  function applyLang(next) {
    lang = SUPPORTED.includes(next) ? next : "en";
    document.documentElement.lang = lang;
    localStorage.setItem(LANG_KEY, lang);
    langButtons.forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
    });
    if (skipLink && content) skipLink.textContent = t(content.ui.skipToContent);
    if (menuToggle && content) {
      const open = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute(
        "aria-label",
        t(open ? content.ui.closeMenu : content.ui.openMenu)
      );
    }
    if (themeToggle && content) {
      themeToggle.setAttribute(
        "aria-label",
        t(theme === "dark" ? content.ui.theme.toLight : content.ui.theme.toDark)
      );
    }
    document.title = content?.site?.brand
      ? `${content.site.brand} · ${t(content.site.tagline)}`
      : "Korckyjals-CODE";
    render();
  }

  function navItems() {
    return [
      { id: "about", label: content.ui.nav.about },
      { id: "path", label: content.ui.nav.path },
      { id: "experience", label: content.ui.nav.experience },
      { id: "projects", label: content.ui.nav.projects },
      { id: "skills", label: content.ui.nav.skills },
      { id: "contact", label: content.ui.nav.contact },
    ];
  }

  function renderNav() {
    const items = navItems()
      .map(
        (item) =>
          `<li><a href="#${item.id}">${escapeHtml(t(item.label))}</a></li>`
      )
      .join("");
    if (navList) navList.innerHTML = items;
    if (mobileNavList) mobileNavList.innerHTML = items;
  }

  function closeMenu() {
    if (!menuToggle || !mobileNav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", t(content.ui.openMenu));
    mobileNav.hidden = true;
    document.body.classList.remove("menu-open");
  }

  function toggleMenu() {
    if (!menuToggle || !mobileNav) return;
    const open = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
      "aria-label",
      t(open ? content.ui.closeMenu : content.ui.openMenu)
    );
    mobileNav.hidden = !open;
    document.body.classList.toggle("menu-open", open);
  }

  function renderHighlights() {
    return `<ul class="highlights">${content.about.highlights
      .map(
        (item) => `<li>
          <dl>
            <dt>${escapeHtml(t(item.label))}</dt>
            <dd>${escapeHtml(t(item.value))}</dd>
          </dl>
        </li>`
      )
      .join("")}</ul>`;
  }

  function renderTags(tags = []) {
    if (!tags.length) return "";
    return `<div class="tag-row">${tags
      .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
      .join("")}</div>`;
  }

  function renderLearningPath() {
    return `<ol class="timeline">${content.learningPath.items
      .map(
        (item) => `<li class="timeline__item">
          <div class="timeline__period">${escapeHtml(item.period)}</div>
          <h3>${escapeHtml(t(item.title))}</h3>
          <p>${escapeHtml(t(item.description))}</p>
          ${renderTags(item.topics)}
        </li>`
      )
      .join("")}</ol>`;
  }

  function renderExperience() {
    return `<div class="experience-list">${content.experience.items
      .map(
        (item) => `<article class="experience-card">
          <h3>${escapeHtml(t(item.role))}</h3>
          <div class="experience-card__meta">
            <span>${escapeHtml(item.org)}</span>
            <span>${escapeHtml(item.period)}</span>
          </div>
          ${renderTags(item.stack)}
          <ul class="outcome-list">${item.outcomes
            .map((outcome) => `<li>${escapeHtml(t(outcome))}</li>`)
            .join("")}</ul>
        </article>`
      )
      .join("")}</div>`;
  }

  function renderProjects() {
    return `<div class="project-grid">${content.projects.items
      .map((item) => {
        const link = item.url
          ? `<a class="project-card__link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t(content.ui.visitProject))}${externalHint()}</a>`
          : "";
        return `<article class="project-card">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(t(item.blurb))}</p>
          ${renderTags(item.tags)}
          ${link}
        </article>`;
      })
      .join("")}</div>`;
  }

  function renderSkills() {
    return `<div class="skill-grid">${content.skills.groups
      .map(
        (group) => `<section class="skill-group">
          <h3>${escapeHtml(t(group.name))}</h3>
          <ul>${group.items
            .map((item) => `<li>${escapeHtml(item)}</li>`)
            .join("")}</ul>
        </section>`
      )
      .join("")}</div>`;
  }

  function renderContact() {
    const social = (content.site.social || [])
      .map(
        (item) =>
          `<li><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t(item.label))}${externalHint()}</a></li>`
      )
      .join("");
    return `<div class="contact-panel">
      <div>
        <div class="eyebrow">${escapeHtml(t(content.contact.emailLabel))}</div>
        <a class="contact-email" href="mailto:${escapeHtml(content.site.email)}">${escapeHtml(content.site.email)}</a>
      </div>
      <ul class="social-list">${social}</ul>
    </div>`;
  }

  function renderFooter() {
    const year = new Date().getFullYear();
    const copyright = t(content.footer.copyright).replace("{year}", String(year));
    return `<footer class="site-footer">
      <div class="shell">
        <p>${escapeHtml(t(content.footer.note))}</p>
        <p>${escapeHtml(copyright)}</p>
      </div>
    </footer>`;
  }

  function render() {
    if (!content || !appRoot) return;
    if (brandEl) brandEl.textContent = content.site.brand;
    renderNav();

    appRoot.setAttribute("aria-busy", "false");
    appRoot.innerHTML = `
      <section class="hero reveal" aria-labelledby="hero-heading">
        <div class="shell hero__layout">
          <div>
            <p class="brand-mark">${escapeHtml(content.site.brand)}</p>
            <p class="eyebrow">${escapeHtml(t(content.hero.eyebrow))}</p>
            <h1 id="hero-heading">${escapeHtml(t(content.hero.headline))}</h1>
            <p class="hero__sub">${escapeHtml(t(content.hero.subhead))}</p>
            <div class="cta-row">
              <a class="btn btn--primary" href="${escapeHtml(content.hero.ctaPrimary.href)}">${escapeHtml(t(content.hero.ctaPrimary.label))}</a>
              <a class="btn btn--ghost" href="${escapeHtml(content.hero.ctaSecondary.href)}">${escapeHtml(t(content.hero.ctaSecondary.label))}</a>
            </div>
          </div>
        </div>
      </section>

      <section class="section" id="about" aria-labelledby="about-heading">
        <div class="shell">
          <div class="section__head">
            <h2 id="about-heading">${escapeHtml(t(content.about.title))}</h2>
          </div>
          <div class="about-grid">
            <div class="prose">${content.about.paragraphs
              .map((p) => `<p>${escapeHtml(t(p))}</p>`)
              .join("")}</div>
            ${renderHighlights()}
          </div>
        </div>
      </section>

      <section class="section" id="path" aria-labelledby="path-heading">
        <div class="shell">
          <div class="section__head">
            <h2 id="path-heading">${escapeHtml(t(content.learningPath.title))}</h2>
            <p>${escapeHtml(t(content.learningPath.intro))}</p>
          </div>
          ${renderLearningPath()}
        </div>
      </section>

      <section class="section" id="experience" aria-labelledby="experience-heading">
        <div class="shell">
          <div class="section__head">
            <h2 id="experience-heading">${escapeHtml(t(content.experience.title))}</h2>
            <p>${escapeHtml(t(content.experience.intro))}</p>
          </div>
          ${renderExperience()}
        </div>
      </section>

      <section class="section" id="projects" aria-labelledby="projects-heading">
        <div class="shell">
          <div class="section__head">
            <h2 id="projects-heading">${escapeHtml(t(content.projects.title))}</h2>
            <p>${escapeHtml(t(content.projects.intro))}</p>
          </div>
          ${renderProjects()}
        </div>
      </section>

      <section class="section" id="skills" aria-labelledby="skills-heading">
        <div class="shell">
          <div class="section__head">
            <h2 id="skills-heading">${escapeHtml(t(content.skills.title))}</h2>
          </div>
          ${renderSkills()}
        </div>
      </section>

      <section class="section" id="contact" aria-labelledby="contact-heading">
        <div class="shell">
          <div class="section__head">
            <h2 id="contact-heading">${escapeHtml(t(content.contact.title))}</h2>
            <p>${escapeHtml(t(content.contact.intro))}</p>
          </div>
          ${renderContact()}
        </div>
      </section>

      ${renderFooter()}
    `;
  }

  async function init() {
    try {
      const res = await fetch("content.json", { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      content = await res.json();
    } catch (err) {
      console.error(err);
      setStatus(
        "Content could not be loaded. Please refresh, or email info@korckyjals-code.com.",
        true
      );
      return;
    }

    theme = preferredTheme();
    applyTheme(theme);
    lang = preferredLang();
    applyLang(lang);

    langButtons.forEach((btn) => {
      btn.addEventListener("click", () => applyLang(btn.dataset.lang));
    });

    themeToggle?.addEventListener("click", () => {
      applyTheme(theme === "dark" ? "light" : "dark");
    });

    menuToggle?.addEventListener("click", toggleMenu);

    mobileNavList?.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  if (statusEl) statusEl.textContent = "Loading portfolio…";
  init();
})();
