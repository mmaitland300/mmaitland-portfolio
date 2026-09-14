# Maintenance Guide

This guide keeps maintainer workflow details out of the README while preserving the practices that keep the public site accurate, current, and easy to maintain.

## Project Intent

This project is a personal site with portfolio depth, not a build diary. The intent is to show how work is reasoned about, shipped, and checked.

- **Clear claims over hype.** Public claims should point at something
  checkable: case studies, decision records, tests, CI, screenshots, validation
  notes, or documented limits. When support lags copy, soften the claim rather
  than inventing placeholder support.
- **One coherent story across domains.** Production troubleshooting, shipping web software, and audio/DSP work are presented as one discipline: diagnose constraints, then deliver within them.
- **Featured work carries a higher bar.** Anything marked `featured` in `src/content/projects.ts` is expected to have a substantive write-up: constraints, tradeoffs, status, known limits, and supporting links where applicable. Experiments stay visible but separate so they do not dilute the main signal.
- **Production-shaped engineering.** Optional services are gated by typed env so the app runs and tests cleanly without them; contact and admin flows degrade predictably when configuration is partial.
- **CI matters.** Lint, unit/data tests, production build, and Playwright smoke on `main` back the idea that the repo is maintained to the same standard the site describes.

## Branching And Releases

Work usually lands on `main` through pull requests. Occasional small maintainer polish may push directly when checks stay green; see [CONTRIBUTING.md](../CONTRIBUTING.md) for merge policy.

CI on `main` runs lint, unit/data tests, production build, and Playwright smoke tests. Treat green `main` as the release line for deployment, for example Vercel production from `main`.

See [dependency updates](dependency-updates.md) for Dependabot grouping, deferred migrations, and review requirements.

## Maintenance Cadence

- **Weekly:** Ship one content/status task and one polish/maintenance task.
- **Weekly:** For messaging changes, answer this in the PR: what support got
  stronger, or what language got softer?
- **Publishing cadence:** Aim for one short post per maintenance cycle when possible, even if brief, as long as it has a clear job: decision, tradeoff, or incident pattern.
- **Monthly:** Do one resume parity check. After any user-visible `src/content/resume.ts` change, run `npm run resume:pdf` with the dev server running so `public/resume.pdf` does not drift.
- **Monthly:** Re-check canonical URL / metadata consistency, featured-project supporting links, and dependency hygiene so the public story and shipped repo stay aligned.

## Definition Of Done

Run the core checks before merging:

```powershell
npm run lint
npm test
npm run build
```

If nav, focus, or keyboard behavior changed, also run:

```powershell
npx playwright test
```

## Commit Messages

Use clear, imperative commit subjects, for example `Fix contact rate limit when Redis is unavailable`.

Avoid redeploy-only checkpoints and trailing vendor or tool-generated footer lines unless a policy explicitly requires them.

Optional: from the repo root, run `git config commit.template .gitmessage` to use the shared commit template. The first line of the message must not start with `#` because Git strips comment lines. The template is a local reminder only; Git does not enforce commit message style.

## Git History Safety

Rewriting `main` with `git rebase`, `git filter-repo`, or similar and force-pushing has collaboration and fork tradeoffs. Plan with anyone who depends on the repo before doing it.

- **Commit message noise only:** WIP commits, checkpoints, or vendor footers are usually not worth a history rewrite. Clearer messages going forward are enough for many projects.
- **Secrets that ever reached Git history:** Treat this as a security incident, not cosmetics. Rotate and revoke exposed credentials first, run a dedicated secret scan on full history, and rewrite history or publish a clean replacement so the secrets are not recoverable from any branch.

## Repository Metadata

Set the repository About description to mirror `package.json` and the README:

> Personal site and case studies for mmaitland.dev - Next.js, MDX, Prisma, optional admin and auth.

Suggested topics: `nextjs`, `typescript`, `tailwindcss`, `mdx`, `prisma`, `postgresql`, `portfolio`, `next-auth`, `server-actions`, `framer-motion`, `vitest`
