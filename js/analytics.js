(function initAnalytics() {
  const token = window.ANALYTICS_CONFIG && window.ANALYTICS_CONFIG.cloudflareToken;
  if (!token) return;

  const script = document.createElement('script');
  script.defer = true;
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  script.setAttribute('data-cf-beacon', JSON.stringify({ token }));
  document.head.appendChild(script);
})();
