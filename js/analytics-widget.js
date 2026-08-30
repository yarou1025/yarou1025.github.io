(function initAnalyticsWidget() {
  let cachedStats = null;
  let fetchPromise = null;

  function getEndpoint() {
    return window.ANALYTICS_CONFIG && window.ANALYTICS_CONFIG.statsEndpoint;
  }

  function loadStats() {
    const endpoint = getEndpoint();
    if (!endpoint) return Promise.resolve(null);
    if (cachedStats) return Promise.resolve(cachedStats);
    if (!fetchPromise) {
      fetchPromise = fetch(endpoint)
        .then(res => (res.ok ? res.json() : null))
        .then(data => {
          cachedStats = data;
          return data;
        })
        .catch(() => null);
    }
    return fetchPromise;
  }

  function formatCount(n) {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    return String(n);
  }

  function dashboardLink(label) {
    return `<a href="https://dash.cloudflare.com/" target="_blank" rel="noopener">${label}</a>`;
  }

  async function renderAnalyticsWidget(footerContent) {
    const el = document.getElementById('footer-stats');
    if (!el) return;

    const endpoint = getEndpoint();
    const linkLabel = footerContent?.analyticsLink || 'Cloudflare Analytics';
    const hasBeacon =
      window.ANALYTICS_CONFIG && window.ANALYTICS_CONFIG.cloudflareToken;

    if (!endpoint) {
      el.hidden = !hasBeacon;
      if (hasBeacon) el.innerHTML = dashboardLink(linkLabel);
      return;
    }

    const stats = await loadStats();
    if (stats?.pageviews > 0) {
      const label = (footerContent?.viewsLabel || '{count} views').replace(
        '{count}',
        formatCount(stats.pageviews)
      );
      el.innerHTML = `<span class="footer-stats-icon" aria-hidden="true">👁</span> ${label} · ${dashboardLink(linkLabel)}`;
      el.hidden = false;
      return;
    }

    el.hidden = !hasBeacon;
    if (hasBeacon) el.innerHTML = dashboardLink(linkLabel);
  }

  window.renderAnalyticsWidget = renderAnalyticsWidget;
})();
