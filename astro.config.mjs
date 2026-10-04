// Spike: resolves site and base the way SPEC 7.1 describes (pinned URL, then
// SITE_PAGES_URL from configure-pages, then GITHUB_REPOSITORY, then localhost).
import { defineConfig } from 'astro/config';

function resolveSite() {
  const fromPages = process.env.SITE_PAGES_URL;
  if (fromPages) {
    const u = new URL(fromPages);
    return { site: u.origin, base: u.pathname.replace(/\/+$/, '') || '/' };
  }
  const repo = process.env.GITHUB_REPOSITORY;
  if (repo) {
    const [owner, name] = repo.split('/');
    const site = `https://${owner.toLowerCase()}.github.io`;
    const isUserSite = name.toLowerCase() === `${owner.toLowerCase()}.github.io`;
    return { site, base: isUserSite ? '/' : `/${name}` };
  }
  return { site: 'http://localhost:4321', base: '/' };
}

export default defineConfig({
  ...resolveSite(),
  build: { format: 'preserve' },
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
});
