# Dream Stack

Minimal scaffold showcasing:

- **jQuery** for interactivity
- **Tailwind CSS** (CDN) for styling
- **PagesCMS** as the git-based CMS

## Structure

```
index.html              # entry page
assets/js/app.js        # jQuery app
content/pages/*.md      # pages (editable in PagesCMS)
content/posts/*.md      # blog posts (editable in PagesCMS)
content/settings.yml    # site settings
.pages.yml              # PagesCMS schema
```

## Run locally

```sh
pnpm install
pnpm dev      # vite dev server with HMR on http://localhost:8000
pnpm build    # production build to dist/
pnpm preview  # serve the built dist/
```

Vite hot-reloads when `index.html`, anything under `src/`, or anything under `content/` changes — so a `git pull` with new CMS content refreshes the page instantly. Tailwind is compiled via the official `@tailwindcss/vite` plugin; jQuery is a real npm dependency.

## Connect PagesCMS

1. Push this repo to GitHub.
2. Go to https://pagescms.org and sign in with GitHub.
3. Select this repo — PagesCMS reads `.pages.yml` and gives you an editor for pages, posts, and settings.
4. Edits commit back to the repo; redeploy (GitHub Pages, Netlify, Vercel, etc.) to publish.
