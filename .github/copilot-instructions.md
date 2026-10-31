# Copilot instructions for Mona Mayhem

## Project overview

This repository is a workshop template for a retro arcade-themed GitHub contribution battle arena built with Astro. The app is intentionally scaffolded as a starting point, so most implementation work happens incrementally in the app source while the workshop materials remain in `workshop/` and `docs/`.

- App source: `src/`
- Static/public assets: `public/`
- Workshop content: `workshop/`
- Published docs/site content: `docs/`
- CI/CD: `.github/workflows/`

## Build, dev, and validation commands

Use the repo's npm scripts from the project root:

```bash
npm install
npm run dev
npm run build
npm run preview
```

There are no dedicated test or lint scripts in `package.json` today. For validation in this repo, prefer `npm run build` as the compile check when you need a targeted verification step.

## High-level architecture

- `astro.config.mjs` configures Astro with the Node adapter and server output.
- `src/pages/index.astro` is the current landing page entry point and the place to start when implementing the battle arena UI.
- The repo is intentionally minimal right now: this is a workshop starter, not a finished production app.
- `docs/` and `workshop/` are educational assets for the workshop and are not the app's product code.
- `.github/workflows/deploy.yml` currently deploys static workshop/docs content to GitHub Pages; it does not build and deploy the Astro app from `src/`.
- The app architecture is expected to evolve around a simple Astro page + server/data layer model: landing page, user comparison flow, and GitHub contribution-fetching logic rather than a larger component framework or state-management system.
- If a feature spans multiple files, the usual pattern is to add or update:
  - a page or route in `src/pages/`
  - supporting data or API logic near that route
  - styling and presentation in the same page or a closely related stylesheet pattern
  - no extra framework-level structure unless the task explicitly requires it

## Repo-specific conventions

- Keep feature work in the Astro app (`src/`) unless the task explicitly targets the workshop docs or deployment configuration.
- Prefer small, incremental additions that match the workshop flow: add pages, upstream data logic, styling, and UI polish in the same pattern the repo uses.
- This project intentionally uses a simple Astro structure; do not introduce extra framework conventions or build tooling unless the work requires them.
- Maintain the retro arcade visual identity: dark background (`#0a0a1a`), green accent (`#5fed83`), purple accent (`#8a2be2`), and the Press Start 2P font as the default gaming-style look.
- If the task involves UI changes, keep the neon aesthetic consistent and avoid generic modern styling that clashes with the arcade theme.

## Design guidance

Keep new UI aligned with the retro arcade neon aesthetic:

- **Colors:** dark background `#0a0a1a`, green `#5fed83`, and purple `#8a2be2`.
- **Fonts:** use Press Start 2P for arcade headings and display labels; keep body text readable with a sans-serif fallback.
- **Animation:** favor restrained CRT scanlines, neon pulses, gradient shifts, shimmer, and hover glow. Respect `prefers-reduced-motion`.
- **New UI rule:** preserve the neon arcade look; avoid generic flat or corporate styling that clashes with it.
