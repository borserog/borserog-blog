# Gabriel Borsero’s blog

Personal blog built with Astro and deployed to Vercel with server rendering.

## Local development

Use Node 24 (selected by `.nvmrc` and `package.json`). With nvm installed:

```sh
nvm install
nvm use
npm ci
npm run dev
```

## Validation

```sh
npm run test:deployment
```

This runs Astro checks, creates the production Vercel build, and asserts that every generated function uses Node 24. A successful build alone is insufficient: the old adapter silently emitted Node 18 functions even under a newer build runtime.

Smoke-check the homepage, `/blog`, all existing article URLs, and their images in a preview deployment after changing the deployment stack. An unknown article should return 404.

## Deployment

The Vercel project’s **Node.js Version** must be `24.x`. Keep it aligned with the repository runtime declaration. The GitHub integration creates preview deployments for PRs; merging to the production branch deploys production.

`vercel.json` runs the deployment regression check as part of each Vercel build.

Tailwind 3 runs through PostCSS so the existing daisyUI 3 styles can be retained while upgrading Astro. Content collections use `src/content.config.ts`; post IDs preserve the existing article URLs.
