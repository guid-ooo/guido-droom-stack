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
python3 -m http.server 8000
```

Open http://localhost:8000.

## Connect PagesCMS

1. Push this repo to GitHub.
2. Go to https://pagescms.org and sign in with GitHub.
3. Select this repo — PagesCMS reads `.pages.yml` and gives you an editor for pages, posts, and settings.
4. Edits commit back to the repo; redeploy (GitHub Pages, Netlify, Vercel, etc.) to publish.
