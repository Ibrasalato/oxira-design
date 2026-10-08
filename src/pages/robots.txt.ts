export function GET() {
  return new Response('User-agent: *\nAllow: /\n\nSitemap: https://design.oxira.sa/sitemap.xml\n', { headers: { 'Content-Type': 'text/plain' } });
}
