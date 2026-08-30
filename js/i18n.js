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
  renderSkills();
  renderWriting();
  renderProjects();
  renderHonors();
  renderLinks();
  renderContact();
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
    { id: 'skills', key: 'skills' },
    { id: 'writing', key: 'writing' },
    { id: 'projects', key: 'projects' },
    { id: 'contact', key: 'contact' }
  ];

  nav.innerHTML = sections
    .map(s => `<a href="#${s.id}" class="nav-link">${content.nav[s.key]}</a>`)
    .join('');
}

function renderHero() {
  setText('hero-name', content.hero.name);
  setText('hero-title', content.hero.title);
  setText('hero-tagline', content.hero.tagline);
  setText('hero-location', content.hero.location);
}

function renderAbout() {
  setText('about-heading', content.about.heading);
  setText('about-text', content.about.text);
}

function renderExperience() {
  setText('experience-heading', content.experience.heading);
  const container = document.getElementById('experience-list');
  if (!container) return;

  container.innerHTML = content.experience.items
    .map(
      item => `
    <article class="card timeline-item">
      <div class="timeline-marker"></div>
      <div class="card-body">
        <div class="card-header">
          <h3 class="card-title">${item.role}</h3>
          <span class="card-period">${item.period}</span>
        </div>
        <p class="card-subtitle">${item.company} · ${item.location}</p>
        <p class="card-text">${item.description}</p>
      </div>
    </article>`
    )
    .join('');
}

function renderEducation() {
  setText('education-heading', content.education.heading);
  const container = document.getElementById('education-list');
  if (!container) return;

  container.innerHTML = content.education.items
    .map(
      item => `
    <article class="card">
      <div class="card-body">
        <div class="card-header">
          <h3 class="card-title">${item.degree}</h3>
          <span class="card-period">${item.period}</span>
        </div>
        <p class="card-subtitle">${item.school} · ${item.location}</p>
        <p class="card-note">${item.note}</p>
      </div>
    </article>`
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

function renderWriting() {
  setText('writing-heading', content.writing.heading);
  setText('writing-subtitle', content.writing.subtitle);
  const viewAll = document.getElementById('writing-view-all');
  if (viewAll) {
    viewAll.textContent = content.writing.viewAll + ' →';
    viewAll.href = content.writing.blogUrl;
  }

  const container = document.getElementById('writing-list');
  if (!container) return;

  container.innerHTML = content.writing.items
    .map(
      item => `
    <article class="card">
      <div class="card-body">
        <div class="card-header">
          <h3 class="card-title"><a href="${item.url}" target="_blank" rel="noopener">${item.title}</a></h3>
          <span class="card-period">${item.date}</span>
        </div>
        <p class="card-text">${item.summary}</p>
        <a href="${item.url}" class="card-link" target="_blank" rel="noopener">${content.ui.readMore} →</a>
      </div>
    </article>`
    )
    .join('');
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
  const container = document.getElementById('links-list');
  if (!container) return;

  container.innerHTML = content.links.items
    .map(item => `<a href="${item.url}" class="link-chip" target="_blank" rel="noopener">${item.label}</a>`)
    .join('');
}

function renderContact() {
  setText('contact-heading', content.contact.heading);
  setText('contact-text', content.contact.text);
  const email = document.getElementById('contact-email');
  if (email) {
    email.textContent = content.contact.email;
    email.href = `mailto:${content.contact.email}`;
  }
}

function renderFooter() {
  setText('footer-text', content.footer.text);
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
