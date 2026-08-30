let currentLang = localStorage.getItem('lang') || 'en';
let content = {};

async function loadLanguage(lang) {
  const response = await fetch(`data/${lang}.json`);
  if (!response.ok) throw new Error(`Failed to load ${lang}.json`);
  content = await response.json();
  currentLang = lang;
  localStorage.setItem('lang', lang);
  renderPage();
}

function renderPage() {
  document.documentElement.lang = currentLang === 'zh' ? 'zh-Hant' : 'en';
  document.title = content.meta.title;

  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.content = content.meta.description;

  renderNav();
  renderHero();
  renderAbout();
  renderExperience();
  renderEducation();
  renderResearch();
  renderHighlights();
  renderSkills();
  renderInterests();
  renderWriting();
  renderProjects();
  renderHonors();
  renderLinks();
  renderFooter();

  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) langBtn.textContent = content.ui.langToggle;
}

function renderNav() {
  const nav = document.getElementById('nav-links');
  if (!nav) return;

  const sections = [
    { id: 'about', key: 'about' },
    { id: 'experience', key: 'experience' },
    { id: 'education', key: 'education' },
    { id: 'research', key: 'research' },
    { id: 'highlights', key: 'highlights' },
    { id: 'skills', key: 'skills' },
    { id: 'interests', key: 'interests' },
    { id: 'writing', key: 'writing' },
    { id: 'projects', key: 'projects' },
    { id: 'links', key: 'contact' }
  ];

  nav.innerHTML = sections
    .map(s => `<a href="#${s.id}" class="nav-link">${content.nav[s.key]}</a>`)
    .join('');
}

function renderHero() {
  setText('hero-label', content.hero.label);
  setText('hero-name', content.hero.name);
  setText('hero-title', content.hero.title);
  setText('hero-tagline', content.hero.tagline);
  setText('hero-location', content.hero.location);

  const avatar = document.querySelector('.avatar-img');
  if (avatar) avatar.alt = content.hero.name;
}

function renderAbout() {
  setText('about-heading', content.about.heading);
  setText('about-text', content.about.text);
}

function renderTimelineItem(item, { title, subtitle, logo, logoAlt }) {
  const hasDetails = item.details && item.details.length;
  return `
    <article class="card timeline-item${hasDetails ? ' has-details' : ''}"${hasDetails ? ' tabindex="0"' : ''}>
      <div class="timeline-axis">
        <span class="timeline-date">${item.start}</span>
        ${item.end ? `<span class="timeline-date-end">${item.end}</span>` : ''}
      </div>
      <div class="timeline-marker"></div>
      <div class="card-body">
        <div class="card-header">
          <div class="card-title-row">
            ${logo ? `<img src="${logo}" alt="${logoAlt}" class="card-logo" width="36" height="36" loading="lazy">` : ''}
            <h3 class="card-title">${title}</h3>
          </div>
        </div>
        <p class="card-subtitle">${subtitle}</p>
        <p class="card-text">${item.description}</p>
        ${
          hasDetails
            ? `<div class="card-details"><ul>${item.details.map(d => `<li>${d}</li>`).join('')}</ul></div>`
            : ''
        }
      </div>
    </article>`;
}

function renderExperience() {
  setText('experience-heading', content.experience.heading);
  const container = document.getElementById('experience-list');
  if (!container) return;

  container.innerHTML = content.experience.items
    .map(item =>
      renderTimelineItem(item, {
        title: item.role,
        subtitle: `${item.company} · ${item.location}`,
        logo: item.logo,
        logoAlt: item.company
      })
    )
    .join('');
}

function renderEducation() {
  setText('education-heading', content.education.heading);
  const container = document.getElementById('education-list');
  if (!container) return;

  container.innerHTML = content.education.items
    .map(item =>
      renderTimelineItem(item, {
        title: item.degree,
        subtitle: `${item.school} · ${item.location}`,
        logo: item.logo,
        logoAlt: item.school
      })
    )
    .join('');
}

function renderResearch() {
  setText('research-heading', content.research.heading);
  const container = document.getElementById('research-list');
  if (!container) return;

  container.innerHTML = content.research.items
    .map(
      item => `
    <article class="card">
      <div class="card-body">
        <h3 class="card-title">${item.title}</h3>
        <p class="card-subtitle">${item.venue} · ${item.year}</p>
        <p class="card-text card-authors">${item.authors}</p>
        <a href="${item.doi}" class="card-link" target="_blank" rel="noopener">${content.ui.viewPaper} →</a>
      </div>
    </article>`
    )
    .join('');
}

function renderHighlightLi(item, collapsed = false) {
  const yearHtml = item.year ? `<span class="highlight-year">${item.year}</span>` : '';
  return `<li${collapsed ? ' class="writing-list-collapsed"' : ''}><a href="${item.url}" target="_blank" rel="noopener"><span class="highlight-emoji">${item.emoji || ''}</span> ${item.title}${yearHtml}</a></li>`;
}

function renderHighlights() {
  setText('highlights-heading', content.highlights.heading);
  const container = document.getElementById('highlights-list');
  if (!container) return;

  const items = content.highlights.items;
  const visibleCount = content.highlights.visibleCount;
  const hasMore = visibleCount && items.length > visibleCount;
  const visible = hasMore ? items.slice(0, visibleCount) : items;
  const hidden = hasMore ? items.slice(visibleCount) : [];
  const hint =
    hasMore && content.highlights.moreHint
      ? content.highlights.moreHint.replace('{count}', hidden.length)
      : '';

  if (!hasMore) {
    container.innerHTML = `<ul class="writing-list">${visible.map(item => renderHighlightLi(item)).join('')}</ul>`;
    return;
  }

  container.innerHTML = `
    <div class="writing-list-group has-more" tabindex="0">
      <ul class="writing-list">
        ${visible.map(item => renderHighlightLi(item)).join('')}
        ${hidden.map(item => renderHighlightLi(item, true)).join('')}
      </ul>
      <div class="writing-list-more-hint">${hint}</div>
    </div>`;
}

function renderSkills() {
  setText('skills-heading', content.skills.heading);
  const container = document.getElementById('skills-list');
  if (!container) return;

  container.innerHTML = content.skills.categories
    .map(
      cat => `
    <div class="skill-group">
      <h3 class="skill-name">${cat.name}</h3>
      <div class="skill-tags">
        ${cat.items.map(item => `<span class="tag">${item}</span>`).join('')}
      </div>
    </div>`
    )
    .join('');
}

function renderInterests() {
  setText('interests-heading', content.interests.heading);
  const container = document.getElementById('interests-list');
  if (!container) return;

  container.innerHTML = content.interests.items
    .map(item => {
      const recordsHtml =
        item.records && item.records.length
          ? `<ul class="interest-records">${item.records.map(r => `<li>${r}</li>`).join('')}</ul>`
          : '';
      const inner = `
      <div class="interest-emoji">${item.emoji}</div>
      <h3 class="interest-title">${item.title}</h3>
      <p class="interest-desc">${item.description}</p>
      ${recordsHtml}
      ${item.url ? `<span class="interest-link-label">${item.linkLabel || '→'} ↗</span>` : ''}`;

      if (item.url) {
        return `<a href="${item.url}" class="interest-card interest-card--link" target="_blank" rel="noopener">${inner}</a>`;
      }
      return `<article class="interest-card">${inner}</article>`;
    })
    .join('');
}

function renderWritingList(items, options = {}) {
  const renderLi = item =>
    `<li><a href="${item.url}" target="_blank" rel="noopener">${item.title}</a></li>`;

  const visibleCount = options.visibleCount;
  const hasMore = visibleCount && items.length > visibleCount;
  const visible = hasMore ? items.slice(0, visibleCount) : items;
  const hidden = hasMore ? items.slice(visibleCount) : [];
  const hint =
    hasMore && options.moreHint
      ? options.moreHint.replace('{count}', hidden.length)
      : '';

  if (!hasMore) {
    return `<ul class="writing-list">${visible.map(renderLi).join('')}</ul>`;
  }

  return `
    <div class="writing-list-group has-more" tabindex="0">
      <ul class="writing-list">
        ${visible.map(renderLi).join('')}
        ${hidden.map(item => `<li class="writing-list-collapsed"><a href="${item.url}" target="_blank" rel="noopener">${item.title}</a></li>`).join('')}
      </ul>
      <div class="writing-list-more-hint">${hint}</div>
    </div>`;
}

function renderWriting() {
  setText('writing-heading', content.writing.heading);
  setText('writing-subtitle', content.writing.subtitle);
  const viewAll = document.getElementById('writing-view-all');
  if (viewAll) {
    viewAll.textContent = content.writing.viewAll + ' →';
    viewAll.href = content.writing.blogUrl;
  }

  const container = document.getElementById('writing-list');
  if (container) container.innerHTML = renderWritingList(content.writing.items);
}

function renderProjects() {
  setText('projects-heading', content.projects.heading);
  const viewAll = document.getElementById('projects-view-all');
  if (viewAll) {
    viewAll.textContent = content.projects.viewAll + ' →';
    viewAll.href = 'https://github.com/yarou1025';
  }

  const container = document.getElementById('projects-list');
  if (!container) return;

  container.innerHTML = content.projects.items
    .map(
      item => `
    <article class="card">
      <div class="card-body">
        <div class="card-header">
          <h3 class="card-title"><a href="${item.url}" target="_blank" rel="noopener">${item.name}</a></h3>
          ${item.stars > 0 ? `<span class="tag tag-accent">★ ${item.stars}</span>` : ''}
        </div>
        <p class="card-text">${item.description}</p>
      </div>
    </article>`
    )
    .join('');
}

function renderHonors() {
  setText('honors-heading', content.honors.heading);
  const container = document.getElementById('honors-list');
  if (!container) return;

  container.innerHTML = content.honors.items
    .map(
      item => `
    <div class="honor-item">
      <span class="honor-name">${item.name}</span>
      <span class="honor-meta">${item.issuer} · ${item.year}</span>
    </div>`
    )
    .join('');
}

function renderLinks() {
  setText('links-heading', content.links.heading);
  setText('links-text', content.links.text);
  const container = document.getElementById('links-list');
  if (!container) return;

  const chips = content.links.items
    .map(item => `<a href="${item.url}" class="link-chip" target="_blank" rel="noopener">${item.label}</a>`)
    .join('');

  const emailBtn = content.links.email
    ? `<a href="mailto:${content.links.email}" class="btn btn-primary link-email-btn">${content.links.emailLabel}</a>`
    : '';

  container.innerHTML = chips + emailBtn;
}

function renderFooter() {
  setText('footer-text', content.footer.text);
  if (window.renderAnalyticsWidget) window.renderAnalyticsWidget(content.footer);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function toggleLanguage() {
  const next = currentLang === 'en' ? 'zh' : 'en';
  loadLanguage(next);
}

document.addEventListener('DOMContentLoaded', () => {
  loadLanguage(currentLang);

  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) langBtn.addEventListener('click', toggleLanguage);
});
