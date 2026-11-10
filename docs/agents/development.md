# Development guide

## Implementation

- Keep changes focused on the requested task. Preserve existing article URLs; intentional URL changes need redirects.
- Follow the installed Astro version and existing integrations. Check `package.json` and configuration before using APIs from newer documentation; framework and deployment migrations should be explicit tasks.
- For article changes, follow the collection schema and existing frontmatter conventions. Preserve original publication dates; distinguish later corrections from new publication.
- Use npm and keep `package-lock.json` consistent with intentional dependency changes. Review major upgrades and their migration requirements individually.

## Verification and handoff

- For application or dependency changes, run `npm run build`, which includes Astro's checks. Add focused verification for changed behavior; a passing build alone does not verify HTTP status codes or browser interactions.
- For routing or metadata changes, check the affected pages and an unknown article URL. For navigation, theme, or layout changes, check keyboard use, mobile layout, and behavior across page navigation.
- Documentation-only changes need link/path and diff review; a production rebuild is unnecessary.
- Report what changed, which checks ran, their results, and any remaining limitations. Distinguish local verification from checks against a deployed site.
