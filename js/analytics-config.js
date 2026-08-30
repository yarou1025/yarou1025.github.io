// Cloudflare Web Analytics — https://dash.cloudflare.com → Web Analytics → Add a site
//
// cloudflareToken — beacon token (already set)
// statsEndpoint   — optional Worker URL that returns { pageviews } JSON
//   Deploy: cd workers && npx wrangler secret put CF_API_TOKEN
//           npx wrangler secret put CF_ACCOUNT_ID
//           npx wrangler secret put CF_SITE_TAG
//           npx wrangler deploy
//   CF_ACCOUNT_ID — dash.cloudflare.com URL segment
//   CF_SITE_TAG   — Web Analytics → your site → siteTag in URL
//   Then set statsEndpoint to https://<worker>.workers.dev
window.ANALYTICS_CONFIG = {
  cloudflareToken: 'c3782e9e5edf4087913fe132ed2bb85f',
  statsEndpoint: 'https://yarou1025-analytics.yarou1025.workers.dev'
};
