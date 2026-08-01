export interface Env {
  ASSETS: Fetcher;
  TI4ASSETS: R2Bucket;
}

// Tunnel's public hostname — single-level subdomain so it's covered by the zone's free
// Universal SSL wildcard (*.thecastle.dev) instead of needing a paid multi-level wildcard cert.
const BOT_ORIGIN = "https://ti4api.thecastle.dev";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/overlays/")) {
      return serveOverlay(url, env);
    }

    if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/ws")) {
      return proxyToBot(request, url);
    }

    return env.ASSETS.fetch(request);
  },
};

async function serveOverlay(url: URL, env: Env): Promise<Response> {
  // Path (minus the leading slash) is exactly the R2 key AsyncTi4WebsiteHelper.putOverlays
  // writes to: overlays/<gameId>/<gameId>.json
  const key = url.pathname.slice(1);
  const object = await env.TI4ASSETS.get(key);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=60");
  return new Response(object.body, { headers });
}

async function proxyToBot(request: Request, url: URL): Promise<Response> {
  const target = new URL(url.pathname + url.search, BOT_ORIGIN);
  return fetch(new Request(target, request));
}
