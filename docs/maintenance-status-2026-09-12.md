# September 2026 maintenance status

This update addresses the main findings from [the site review](site-review-2026-09-12.md). Published September 13, 2026 in [PR #39](https://github.com/mmaitland300/mmaitland-portfolio/pull/39).

## Completed

- Updated Next.js, Auth.js, Vitest, and compatible dependencies; removed stale overrides. Added Node 22 configuration and Dependabot PRs.
- Corrected email success handling, preserved drafts after returned failures, and improved form errors, focus, and pending states. Added rate-limit outage handling and duplicate waitlist notification prevention.
- Fixed article anchors, dialog keyboard behavior, skip navigation, canonical URLs, and admin indexing. Shortened the homepage and simplified project discovery.
- Updated career summaries, condensed the résumé to one page, and added source/PDF fingerprint checks to CI.
- Added a complete database baseline, [adoption instructions](database-recovery.md), and disposable Postgres migration checks. The original migration remains unchanged.

## Information needed

Public introductions use "software developer." Keep individual work projects out of introductory copy.

Keep PRs and coding updates concise. Public site copy can include music, personal context, and a fuller narrative where they serve the page.

The offer letter confirms Regional Manager starting August 11, 2026. Matt confirmed that this role and Robotics Technician are at the same company, Barn Owl Precision Agriculture (BOPA). The role's scope includes Colorado deployments and customer support, engineering coordination, and ML/CV work. Matt also confirmed software development contributions. Describe these responsibilities without making management secondary. No private employment documents are included here. Remaining details:

- The end date or continuing scope of Robotics Technician work, and Auxillium's end month.
- Two or three publishable achievements for the current role, including responsibilities, technology, and outcomes.

## Deployment and follow-up

Vercel uses the Next.js preset, Node 24, and no build/install command overrides. Normal deployment runs Prisma client generation, not migrations. Database reconciliation is required before separately running `db:migrate:deploy`, not before merging this application update.

Before applying migrations to an existing database, verify its schema and history on a restored backup, then mark the matching baseline applied. **Do not execute baseline CREATE statements against populated application tables.**

After deployment, check GitHub admin access and real email delivery with designated recipients. Confirm the contact inbox is monitored. A durable waitlist suppression/unsubscribe workflow remains necessary before outreach.

The audit retains three high package entries from one [deepmerge-ts advisory](https://github.com/RebeccaStevens/deepmerge-ts/security/advisories/GHSA-ggr8-5vv4-36mx) in Prisma CLI configuration; no public request path was identified. Avoid the suggested Prisma downgrade. ESLint 9 and social-image runtime warnings remain follow-ups.

Later work includes measured case-study caching, current project/audio evidence, monitoring and backup checks, and recovery from uncertain network submission outcomes.

## Validation

Fresh installation, dependency checks, lint, build/type checking, **151 unit/data/action tests**, and **65 Chromium tests** passed. The one-page PDF and desktop/mobile layouts were inspected; PDF fingerprints match.

Postgres 15 checks verified empty-database provisioning and existing-schema adoption, preserving a seeded record with zero schema diff. External delivery, production backups, and production migration readiness remain unverified.
