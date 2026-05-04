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

Deployment triggers on pushes to `master`.
