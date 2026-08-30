const GRAPHQL = 'https://api.cloudflare.com/client/v4/graphql';

const QUERY = `
query Stats($account: String!, $site: String!, $since: Time!, $until: Time!) {
  viewer {
    accounts(filter: { accountTag: $account }) {
      rumPageloadEventsAdaptiveGroups(
        limit: 10000
        filter: {
          siteTag: $site
          datetime_geq: $since
          datetime_leq: $until
        }
      ) {
        count
        dimensions { requestHost }
      }
    }
  }
}`;

export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          ...cors,
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
        },
      });
    }

    if (request.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: cors,
      });
    }

    try {
      const missing = ['CF_API_TOKEN', 'CF_ACCOUNT_ID', 'CF_SITE_TAG'].filter(
        key => !env[key]
      );
      if (missing.length) {
        throw new Error(`Missing Worker secrets: ${missing.join(', ')}`);
      }

      const host = env.SITE_HOST || 'yarou1025.github.io';
      const until = new Date();
      const since = new Date(until.getTime() - 30 * 86400000);

      const res = await fetch(GRAPHQL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.CF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: QUERY,
          variables: {
            account: env.CF_ACCOUNT_ID,
            site: env.CF_SITE_TAG,
            since: since.toISOString(),
            until: until.toISOString(),
          },
        }),
      });

      const json = await res.json();
      if (json.errors?.length) throw new Error(json.errors[0].message);

      const groups =
        json.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups || [];

      let pageviews = 0;
      for (const group of groups) {
        const requestHost = group.dimensions?.requestHost || '';
        if (!requestHost || requestHost.includes(host)) {
          pageviews += group.count || 0;
        }
      }

      return new Response(
        JSON.stringify({ pageviews, period: '30d', host }),
        {
          headers: {
            ...cors,
            'Cache-Control': 'public, max-age=1800',
          },
        }
      );
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: cors,
      });
    }
  },
};
