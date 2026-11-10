# Blog maintenance audit — 9 November 2026

Audited repository: https://github.com/borserog/borserog-blog

Baseline: `main` at `7e9e52692858e846d1cfabceb658f74167da15a9` (27 November 2023).

Public deployment checked: https://borserog-blog.vercel.app

## Recommendation

Complete a small maintenance milestone before adding features: modernize the deployment and vulnerable dependency tree, fix article 404 handling and metadata, and establish CI. Keep Astro and the existing article URLs. The codebase is small: three posts, a homepage, a blog index, article routes, and an unfinished About page. A rewrite or CMS migration is unnecessary for this maintenance work.

GitHub Issues is the recommended tracker, with an optional GitHub Project board. No open issues or pull requests were returned, and the Actions API returned zero workflow runs at audit time.

## Verification and limits

- Installed the committed dependency tree using `npm ci --no-fund --ignore-scripts`; 737 packages installed. Lifecycle scripts were intentionally skipped; the production build nevertheless succeeded in this environment.
- Ran `npm run build` under Node `26.10.0` and npm `11.19.1`: passed. Astro diagnostics reported zero errors, zero warnings, and three unused-import hints. Other build warnings covered outdated browser data, astro-icon exports, and the adapter's runtime fallback.
- Inspected the generated Vercel function configuration: `runtime: nodejs18.x`. The old adapter explicitly falls back from local Node 26 to Node 18. This establishes what a fresh build generates, not the runtime configured in the existing Vercel account.
- Queried npm using `npm audit --json` and `npm outdated --json`. Counts and version targets below are a dated snapshot, not a promise that every newest package combination is compatible.
- Checked HTTP responses and HTML on both the local development server and the public deployment. Normal pages returned 200; an unknown article returned 500 on both.
- No application source, dependencies, remote issues, repository settings, or deployments were changed. This report is the only intentional tracked-file addition.
- This is a source, dependency, build, and HTTP audit. Browser interaction, visual layout, contrast, Core Web Vitals, Vercel account settings, DNS ownership, analytics, and branch-protection settings were not verified. Security findings are dependency advisory matches, not a penetration test or evidence of compromise.

## Prioritized backlog

### 1. High priority: modernize the deployment and vulnerable dependencies

**Evidence:** `package.json:14`, `astro.config.mjs:4`, committed lockfile, build output, and generated `.vercel/output/functions/render.func/.vc-config.json`.

The locked stack includes Astro 3.4.3, Vercel adapter 5.2.0, Vite 4.5.0, Sharp 0.32.6, and tar 6.2.0. The generated deployment uses Node 18. Node 18 has reached end of life and receives no normal security updates. See the [Node.js EOL documentation](https://nodejs.org/en/about/eol).

The npm audit reports **40 affected package entries: 2 critical, 21 high, 14 moderate, and 3 low**. Entries include transitive dependencies and tooling and may aggregate multiple advisories. The critical entries are Astro and tar. Exploitability depends on the actual feature and input paths; these are not 40 confirmed remotely exploitable flaws. For example, the [Astro AVIF advisory](https://github.com/withastro/astro/security/advisories/GHSA-26w7-cxv4-gfx2) requires processing an attacker-controlled AVIF image. The visible content uses checked-in JPEG/PNG assets; the deployed image-processing path and input restrictions require separate validation.

**Proposed work:** choose a supported Node runtime available on the deployment platform, pin it for local development and CI, and upgrade Astro with compatible integrations. npm currently reports Astro 7.4.8 and Vercel adapter 11.0.20 as latest. Work through the intervening major-version migration guides rather than blindly applying `npm audit fix --force`.

Known migration work in this repository includes legacy content collections (`src/content/config.ts`, `post.slug`, `getEntryBySlug`, and `post.render()`), `<ViewTransitions />`, and the old Vercel serverless import. See the [Astro 6 migration guide](https://docs.astro.build/en/guides/upgrade-to/v6/) and [Astro 7 migration guide](https://docs.astro.build/en/guides/upgrade-to/v7/).

**Acceptance:** a clean install and production build pass on the chosen runtime; generated functions use that supported runtime if SSR is retained; all current post URLs and images work in a preview deployment; remaining advisories have explicit applicability decisions and follow-up issues.

### 2. High priority: return 404 for unknown article slugs

**Evidence:** `src/pages/blog/[slug].astro:7` casts a potentially absent entry to `any` and immediately reads `post.data`.

**Confirmed:** `/blog/does-not-exist` returns HTTP 500 both locally and on the public deployment. A mistyped or stale article link becomes a server error.

**Proposed work:** remove the `any` cast, handle a missing entry explicitly, and serve a real 404 response. Add a useful 404 page if desired. If static generation is adopted, generate paths only for known entries and verify the host's fallback.

**Acceptance:** all three existing articles return 200; an unknown article returns 404 in the production preview and public deployment.

### 3. Medium priority: repair SEO and sharing metadata

**Evidence:** `src/layouts/Layout.astro:33`, `src/pages/blog/index.astro:21`, and live HTML.

- Homepage and article pages each emit two `<title>` tags.
- `og:url` is the origin for every article, so article previews identify the homepage URL.
- No canonical link is emitted on the checked pages.
- The blog index and About page have no description or social metadata.
- The homepage declares the Open Graph type `article` rather than describing a general website page.
- No sitemap implementation is tracked; `/sitemap-index.xml` returns 404. `/robots.txt` also returns 404; absence of robots.txt does not itself block indexing.

**Proposed work:** centralize site URL and metadata defaults; emit one title, a route-specific canonical, a full article `og:url`, and consistent preview images. Add a sitemap and a small robots.txt that points to it. Article structured data and Twitter card metadata can follow after these basics.

**Acceptance:** each indexable page has one title, a description, and a canonical using the chosen public origin; article previews identify their own URLs; the sitemap lists the homepage, blog index, and published posts.

### 4. Medium priority: establish a repeatable maintenance workflow

**Evidence:** no tracked `.github/` directory, no test script, no Node version pin, and a starter-template README. The GitHub Actions API returned no workflow runs.

**Proposed work:** add CI for clean installation and the existing Astro check/build command, plus focused route/metadata smoke checks. Configure grouped dependency update PRs, separating major framework and styling upgrades. Replace README boilerplate with actual setup, runtime, deployment, and publishing steps. Keep meaningful checks small; a large unit-test suite is unnecessary for this site.

**Acceptance:** a PR runs build checks automatically; checks cover one valid article and an unknown slug; a fresh checkout can be built from the README; dependency update cadence is documented.

### 5. Medium priority: fix navigation and theme accessibility

**Evidence:** `src/layouts/Header.astro:11`, `src/components/HomeIcon.tsx:3`, `src/components/ThemeToggle.tsx:32`, and public HTML.

The Home link has no accessible name, and its only content is a client-only Preact icon. The theme checkbox has no textual accessible label. Social icon links likewise have no explicit accessible names in the source. Home navigation loses its visible icon when JavaScript is unavailable.

The theme implementation also accesses localStorage without a fallback, applies the initial theme after DOMContentLoaded, and does not bind checkbox state to the saved theme. Those are code-level robustness concerns; flash and interaction behavior were not browser-tested.

**Proposed work:** give controls meaningful names, render the Home icon in HTML, initialize theme before paint with safe storage access, and keep the control synchronized across reloads and Astro navigation. Check keyboard focus and reduced-motion behavior in a browser.

**Acceptance:** Home is usable without JavaScript; controls have accessible names; keyboard operation works; saved light/dark preferences survive reloads and navigation; unavailable localStorage does not break the controls.

### 6. Medium priority: review dated content and unfinished pages

**Evidence:** all three posts are from November 2023; `src/pages/about.astro:8` says “Coming soon...”.

The Angular control-flow article should gain a dated update: [Angular now documents NgIf as deprecated since v20](https://angular.dev/api/common/NgIf), with `@if` recommended. The View Transitions article's browser-support and standardization statements need current verification. Check both linked StackBlitz demos manually before changing their claims. Preserve original publication dates and add an updated date or historical-context note instead of silently presenting old posts as newly written.

Complete the About page with current information or deliberately retire it, deciding redirect/indexing behavior first. Refine the homepage's provisional description and replace generic image alt text where it conveys useful content.

**Acceptance:** dated technical claims have a current note or explicit historical framing; demos are checked; About has an intentional public state.

### 7. Improvement: consider static generation and a smaller dependency set

**Evidence:** `astro.config.mjs:10` selects server output, but posts are local Markdown and no authentication, database, form handler, or other required request-time feature is present. `Layout.astro:19` reads user-agent only to exclude Safari from transitions.

Static generation is a strong fit for this blog. Remove the user-agent branch in favor of progressive enhancement, enumerate article paths at build time, and evaluate dropping the server adapter. This reduces runtime maintenance and request-time failure paths. Verify image generation, unknown routes, and any intentional dynamic behavior; a build-time footer year updates on rebuild rather than automatically each January.

Other optional simplifications: replace the static Preact Home icon with Astro markup; consider a small script for the theme control; remove MDX if Markdown remains sufficient (there are no tracked `.mdx` posts); replace the one date-fns comparison with validated timestamp sorting. The current comparator also returns 1 for equal dates, so make equality deterministic. Strengthen frontmatter date validation and consider updated/draft/image-alt fields as the publishing workflow grows.

These are scope choices, not prerequisites to publishing a new post. A Tailwind 4/daisyUI 5 migration should be a separate change with visual verification if undertaken.

### 8. Improvement: optimize images after measuring

**Evidence:** `src/components/Card.astro:17` uses raw PNG images without width/height or responsive sources. Committed covers are approximately 300–510 KiB each. The homepage's generated hero image is marked lazy in live HTML despite being above the fold.

Use sized, responsive assets for cards and article imagery; prioritize the hero if measurements show it is the LCP element. Replace generic “article image” text with meaningful alt text, or empty alt when the card image is decorative and duplicates the article link's meaning. Check actual mobile performance before expanding this work.

## Dependency snapshot

These are npm's reported latest versions on the audit date. They are migration candidates, not a tested replacement manifest.

| Package | Locked | Latest |
| --- | --- | --- |
| astro | 3.4.3 | 7.4.8 |
| @astrojs/vercel | 5.2.0 | 11.0.20 |
| @astrojs/check | 0.3.1 | 0.9.12 |
| @astrojs/mdx | 1.1.4 | 8.1.3 |
| @astrojs/preact | 3.0.1 | 6.1.2 |
| @astrojs/tailwind | 5.0.2 | 6.0.2 |
| astro-icon | 0.8.1 | 1.2.0 |
| preact | 10.18.2 | 11.2.0 |
| tailwindcss | 3.3.5 | 4.3.5 |
| daisyui | 3.9.4 | 5.7.50 |
| @tailwindcss/typography | 0.5.10 | 0.5.20 |
| date-fns | 2.30.0 | 4.4.0 |
| typescript | 5.2.2 | 7.0.2 |

## Issue tracker and proposed working agreement

Use **GitHub Issues** as the source of truth for this repository. It keeps the work beside the code, allows direct references to files and PRs, and supports the public feedback needs of a personal blog. [GitHub's planning guide](https://docs.github.com/en/issues/tracking-your-work-with-issues/learning-about-issues/planning-and-tracking-work-for-your-team-or-project) describes the Issues/Projects workflow.

Start with one milestone, **Maintenance baseline**, containing backlog items 1–6 above. Use one issue per deliverable with the observed problem, affected files, and acceptance criteria. Items 7–8 can be later improvements. Recommended labels: `maintenance`, `bug`, `content`, `enhancement`; use a priority field or a small set of priority labels. A single optional [Project board](https://docs.github.com/en/issues/planning-and-tracking-with-projects) can have Backlog, Ready, In progress, and Done. Work on one issue at a time and link the implementing PR using `Closes #…`.

**Linear** is the alternative if a dedicated planning interface or a shared backlog across multiple projects becomes valuable. It adds another system for this single-repository blog. Its current [Free plan](https://linear.app/pricing) has unlimited members, two teams, and 250 issues; Basic lists $10 per user/month billed annually. The extra planning interface is not needed to complete this backlog.

No issues, labels, milestone, Project, or tracker subscription were created as part of this audit.
