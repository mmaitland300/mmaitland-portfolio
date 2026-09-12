# September 2026 maintenance status

This branch addresses the main findings from [the site review](site-review-2026-09-12.md). Production deployment remains pending.

## Completed

- Updated Next.js, Auth.js, Vitest, and compatible dependencies; removed stale overrides. Added Node 22 configuration and Dependabot PRs.
- Corrected email success handling, preserved drafts after returned failures, and improved form errors, focus, and pending states. Added rate-limit outage handling and duplicate waitlist notification prevention.
- Fixed article anchors, dialog keyboard behavior, skip navigation, canonical URLs, and admin indexing. Shortened the homepage and simplified project discovery.
- Updated career summaries, condensed the résumé to one page, and added source/PDF fingerprint checks to CI.
- Added a complete database baseline, [adoption instructions](database-recovery.md), and disposable Postgres migration checks. The original migration remains unchanged.

## Information needed

The owner confirmed Regional Manager and Software Engineer work with an ML team. The offer letter was not located; no private employment documents are included here. Detailed employment entries still need:

- Employer, official title, and start month for each role; whether the roles overlap.
- The end date or continuing scope of Robotics Technician work, and Auxillium's end month.
- Two or three publishable achievements per new role, including responsibilities, technology, and outcomes.

## Before release

Reconcile production schema and migration history on a restored backup first. Mark the baseline applied only after verifying the existing schema matches; **do not execute its CREATE statements against populated application tables**.

Verify hosting Node settings, environment configuration, GitHub admin access, and real email delivery with designated recipients. Confirm the contact inbox is monitored. A durable waitlist suppression/unsubscribe workflow is still needed before outreach. Review the résumé facts and PR before deployment.

The audit retains three high package entries from one [deepmerge-ts advisory](https://github.com/RebeccaStevens/deepmerge-ts/security/advisories/GHSA-ggr8-5vv4-36mx) in Prisma CLI configuration; no public request path was identified. Avoid the suggested Prisma downgrade. ESLint 9 and social-image runtime warnings remain follow-ups.

Later work includes measured case-study caching, current project/audio evidence, monitoring and backup checks, and recovery from uncertain network submission outcomes.

## Validation

Fresh installation, dependency checks, lint, build/type checking, **151 unit/data/action tests**, and **65 Chromium tests** passed. The one-page PDF and desktop/mobile layouts were inspected; PDF fingerprints match.

Postgres 15 checks verified empty-database provisioning and existing-schema adoption, preserving a seeded record with zero schema diff. External delivery, production backups, and production migration readiness remain unverified.
