interface Env {
  TI4ASSETS: R2Bucket;
}

// Tunnel's public hostname — same Cloudflare Tunnel setup as the deployment plan's §07.
// Single-level subdomain (not api.ti4.thecastle.dev) so it's covered by the zone's free
// Universal SSL wildcard (*.thecastle.dev) instead of needing a paid multi-level wildcard cert.
const BOT_ORIGIN = "https://ti4api.thecastle.dev";

export const onRequest: PagesFunction<Env> = async ({ request, env, next }) => {
  const url = new URL(request.url);

  if (url.pathname.startsWith("/overlays/")) {
    return serveOverlay(url, env);
  }

  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/ws")) {
    return proxyToBot(request, url);
  }

  return next();
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
