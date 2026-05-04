# Lantern Hollow Mobile Prototype

This branch contains a static mobile-friendly control prototype:

- Swipe area for directional movement (with swipe-hold repeat)
- A button mapped to `Enter`
- B button mapped to `Escape`
- Installable PWA manifest + service worker cache

## Run locally

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## GitHub Pages deployment

A workflow is configured at `.github/workflows/pages.yml`.

Deployment triggers on pushes to `main`.

## Conflict prevention workflow

Before starting changes, always sync your branch with the latest remote main to reduce merge conflicts:

```bash
git fetch origin
git checkout main
git pull --ff-only origin main
git checkout <your-branch>
git rebase main
```

If your branch is shared and rebasing is not acceptable, use:

```bash
git merge origin/main
```
