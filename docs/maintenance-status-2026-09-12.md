# September 2026 maintenance status

This change implements the actionable first pass from [the site review](site-review-2026-09-12.md). It is a review branch, not a production release.

## Implemented

- Updated Next.js to 16.3.5, Auth.js to beta.32, the compatible dependency tree, and Vitest to 4.1.11; removed obsolete overrides. Added Node 22 configuration and grouped Dependabot updates.
- Made email provider acceptance explicit. Returned provider errors no longer appear successful or create sent history. Persistence or cache failures after an accepted send return warnings instead of inviting duplicate retries.
- Handled rate-limit errors and timeouts in contact, waitlist, and comments. Contact, waitlist, comment, and admin drafts survive failure; error labels, announcements, focus, and pending states are clearer.
- Made waitlist registration atomic so repeated signups do not resend notifications; confirmation replies go to the configured contact inbox.
- Fixed article contents links, screenshot dialog keyboard behavior, homepage skip navigation, public canonicals, and admin indexing metadata.
- Shortened the homepage, removed its duplicate proof strip, and removed 22 tag filters from the small project catalog.
- Updated career summaries using the two roles supplied by the owner, removed the old current-role claim, regenerated the two-page PDF, and added source/PDF fingerprint checks to CI. Certification dates are presented as history, without assuming renewal.
- Added a complete database baseline, an existing-database adoption guide, and disposable Postgres migration checks in CI. The original migration checksum is preserved.

## Needs owner information before the résumé is final

The owner confirmed Regional Manager and Software Engineer work with an ML team. The referenced offer letter was not located. No private employment documents are included in this repository.

- Confirm employer and official title for each role, whether they overlap, start months, and the end date or continuing scope of the earlier Robotics Technician role.
- Provide two or three publishable achievements per role: regional/team responsibility, engineering contributions, technology used, and measurable outcomes where available. Avoid confidential customer or employer material.
- Confirm the end month for Auxillium and whether CompTIA A+ was renewed after the recorded July 2026 term.

The confirmed role names are in the summary. Detailed new employment entries remain pending rather than assigning an unverified employer, date, or accomplishment.

## Required before production release

1. Reconcile the actual database schema and migration history using [database-recovery.md](database-recovery.md), starting with a restored backup. The new baseline must be marked applied on a matching existing schema; do not run its CREATE statements on populated production tables.
2. Verify the supported Node version in hosting, environment configuration, GitHub admin access, and real Resend delivery/provider events using designated test recipients. Local checks used disabled external services and mocks; no real email or production data writes were performed.
3. Confirm `CONTACT_TO_EMAIL` is monitored and that removal requests are processed. The waitlist still needs a durable suppression/unsubscribe workflow before release outreach; notification deduplication does not implement that workflow.
4. Review the résumé facts and the pull request before merging/deploying.

## Follow-up improvements

- Measure real production Web Vitals and error rates, then set an error/performance baseline. The earlier response-time samples were not Web Vitals measurements.
- Separate public case-study content from personalized comments before caching it. Each case study currently includes request-dependent database/auth behavior, so removing `force-dynamic` alone is unsafe.
- Update StringFlux status, audio examples, compatibility evidence, and project outcomes when current source material is available. Preserve the distinction between a prototype and a release.
- Add periodic content/link review, backup-restore verification, and dependency PR review to the maintenance routine.
- Add explicit recovery for unexpected Server Action transport failures and uncertain submission outcomes. Returned validation/provider failures preserve drafts in this change; a lost network response can still reach an error boundary.
- Track the remaining [deepmerge-ts recursive-object advisory](https://github.com/RebeccaStevens/deepmerge-ts/security/advisories/GHSA-ggr8-5vv4-36mx) in Prisma CLI configuration. The current audit has three high package entries from that one dependency chain, with no critical, moderate, or low entries. This is not three independent flaws or a demonstrated public request-path exploit. Avoid npm's suggested Prisma downgrade or an unverified major transitive override.
- Plan supported migrations away from the deprecated Edge runtime for social images and ESLint 9 when the framework/plugin compatibility matrix permits. These warnings do not fail the current build or checks.

## Validation

- Fresh isolated `npm ci` with Node 22.23.2/npm 10.9.8, Prisma generation, and a valid dependency tree.
- Full lint, production build/type checking, and 151 unit/data/action tests.
- All 65 Chromium browser tests passed, covering routes, forms, article anchors, modal keyboard behavior, canonicals, indexing, and mobile/skip navigation.
- Additional isolated browser checks for real comment/admin component source with mocked actions, including deferred pending states and failed-draft preservation.
- Two-page PDF text extraction and visual inspection; source/PDF fingerprint verification.
- Desktop and 390px mobile layout review. The first homepage case-study button now starts around y=432px on that mobile viewport, versus approximately y=878px in the review snapshot.
- PostgreSQL 15: both migrations provisioned an empty database with zero schema diff. Simulated adoption on an existing schema preserved a seeded record and left no pending migrations or schema diff. This does not establish production backup or migration readiness.
