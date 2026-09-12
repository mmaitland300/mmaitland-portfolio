# Site maintenance review — September 12, 2026

The site is operational and its visual identity still works. The immediate work is security updates and form reliability, followed by content accuracy, accessibility, and a simpler path to the projects. A full redesign is not justified by this review.

Reviewed local commit `c7bb435` (July 12, 2026), the live deployment at https://www.mmaitland.dev, public project links, application code, dependencies, CI, and the downloadable resume. This records the pre-maintenance snapshot. Subsequent implementation and outstanding owner actions are tracked in [the maintenance status](maintenance-status-2026-09-12.md).

## Verification and limits

| Check | Result |
| --- | --- |
| ESLint | Passed |
| Unit/data tests | 100 passed across 15 files |
| Production build, including TypeScript | Passed |
| Existing Chromium smoke tests | 38 passed |
| Public routes | All 14 routes in the existing smoke list returned HTTP 200 in production |
| Published blog pages | All five returned HTTP 200 |
| Public resources | Resume PDF, robots.txt, and sitemap.xml returned 200; unknown route returned 404 |
| Domain redirect | Apex redirected to www |
| Project evidence links | 19 distinct GitHub URLs from project data/supporting links returned 200; this checks availability, not every claim or fragment inside GitHub |
| Hosted demos | Research Radar and Snake Detector root URLs returned 200; inference and recommendation workflows were not exercised |
| Mobile | Menu opened, navigated, and closed; homepage had no horizontal overflow at the sampled 390px viewport |
| Resume PDF | Both pages rendered and were visually inspected; text was compared with current source |
| Dependency audit | 39 affected package entries: 4 critical, 23 high, 11 moderate, 1 low, including development/transitive dependencies |

The audit counts are package entries, not 39 independently exploitable production vulnerabilities. No exploit requests were sent. The live email delivery, authenticated admin workflows, actual database migration state, backups, provider dashboards, analytics, and real-user performance metrics were not verified. Local browser tests used disabled email credentials and a localhost database placeholder; no review email was sent and no live signup was created.

The local default Node is 20.11.1, below the repository's declared minimum of 20.19.0. Lint/tests/build nevertheless passed. The browser smoke run used the bundled Node 24.19.0 runtime against a local production server. These checks used the existing installation, not a fresh `npm ci` installation.

## Fix first

### 1. Update vulnerable dependencies and revisit the old overrides — high priority

`package.json` pins Next.js 16.2.9 and next-auth 5.0.0-beta.31. The audit flags both. This app uses App Router and Server Actions, matching the conditions of the published Next.js Server Actions denial-of-service advisory, patched in 16.2.11. Additional Next.js advisories extend beyond that patch. The registry/audit recommended 16.3.5 at review time.

Upgrade Next.js and eslint-config-next together, review the image-processing dependency tree, and update the Auth.js beta pin and Prisma adapter together. The audit identifies next-auth beta.32 and adapter 2.11.3 as available fixes. Confirm the final resolved tree and release notes when implementing.

The most severe Auth.js email-normalization finding is not evidence of an exploitable email-login path here: this repository configures GitHub OAuth. Admin authorization also checks `session.user.id` and an explicit GitHub ID allowlist, rather than merely trusting a truthy session object. Preserve those checks.

The overrides for postcss 8.5.16, js-yaml 5.2.0, ip-address 10.2.0, and brace-expansion 5.0.6 now intersect advisory ranges. Review/remove/update each override against its actual parent dependency. Treat tooling updates separately from runtime exposure. Do not apply `npm audit fix --force` blindly: the audit suggests a Prisma downgrade for one transitive finding, and registry “latest” tags include major/prerelease changes.

Acceptance: reviewed upgrade diff, lint/unit/build/browser checks passing, fresh audit with each remaining finding explicitly assessed. Align local Node with the chosen supported version and CI; add a version pin and automated dependency PRs.

Sources: [Next.js Server Actions advisory](https://github.com/vercel/next.js/security/advisories/GHSA-m99w-x7hq-7vfj), [Next.js AVIF advisory](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4), [Auth.js configuration-error advisory](https://github.com/nextauthjs/next-auth/security/advisories/GHSA-8fpg-xm3f-6cx3). Evidence: `package.json`, `package-lock.json`, `src/lib/auth.ts`, `src/lib/admin.ts`, and the current npm audit.

### 2. Stop reporting failed email requests as successful — high priority

`submitContact` awaits `resend.emails.send()` but never checks the returned `error`. Both admin send actions similarly accept the result, may save a sent-history record, and return success. The installed Resend SDK returns `{ data: null, error: ... }` on non-2xx responses and network failures; it does not necessarily throw. Consequently, a rejected message can produce “Message Sent!” and an admin reply can be marked read without an accepted send.

Check `error` and a valid message ID before recording provider acceptance. Apply the same response inspection to best-effort waitlist notifications. Keep provider acceptance distinct from confirmed inbox delivery; delivery/bounce reporting requires provider events or dashboard evidence.

Acceptance: mocked provider rejection and network-error result return failure, do not mark a submission read, and do not write a successful sent record. Preserve the intended behavior when the provider accepts mail but optional database persistence fails.

Evidence: `src/actions/contact.ts:88`, `src/actions/admin-email.ts:114`, `src/actions/admin-email.ts:199`, `src/actions/stringflux-waitlist.ts:107`. The current contact action tests cover only three scenarios and mock a thrown exception rather than a resolved error result. [Resend's Next.js example explicitly checks the returned error](https://resend.com/docs/send-with-nextjs).

### 3. Preserve form content after errors — high priority

Reproduced locally: enter a name, valid email, and `short` as the message; submit. The server displays the minimum-length error, but all three fields become empty. The uncontrolled fields reset after the action resolves, including a validation failure. This makes a small correction require retyping the entire message and also threatens content on delivery failure.

Preserve entered values on every unsuccessful result and clear only on accepted submission or explicit reset. Connect errors with `aria-invalid` and `aria-describedby`, announce status/error changes, and manage focus. Currently the contact error UI has no live region or linked field descriptions. Review the same pattern in the waitlist form.

Acceptance: validation, rate-limit, and delivery failures preserve the original fields; keyboard/screen-reader users can find the error; successful submission has an announced confirmation.

Evidence: `src/components/sections/contact-form.tsx:33`, `src/components/sections/contact-form.tsx:61`, `src/components/sections/stringflux-waitlist-form.tsx` and the local browser reproduction.

### 4. Repair database migration history before relying on rebuild/recovery — high priority for operations

There is only one checked-in migration. It begins by altering `OutboundEmail`, assumes that table and `ContactSubmission` already exist, and never creates the other models in the current schema. A blank database cannot be initialized using the README's documented `prisma migrate deploy` procedure. This is a repository provisioning/recovery defect; it does not prove the current production database is broken.

Create a complete baseline and reconcile subsequent changes against the actual deployed schema and migration records. Test on an empty disposable database and on a disposable copy of an existing schema. Do not apply a new baseline blindly to production.

Acceptance: documented clean provisioning and upgrade paths both reproduce the schema, including auth, comments, inbox, sent mail, and waitlist tables and indexes; verify a backup restore separately.

Evidence: `prisma/migrations/20260326143000_add_sent_email_admin_features/migration.sql:2`, `prisma/schema.prisma`, README database setup.

## Fix in the next maintenance pass

| Item | Evidence and impact | Completion target |
| --- | --- | --- |
| Broken blog contents links | Four of five live posts have a broken section link. Custom `extractToc()` slug rules disagree with `rehype-slug`. Examples: `why-next-js`, `option-a-api-route-client-fetch`, `write-it-down-when-it-s-resolved`, `what-i-ve-learned-so-far`. | Generate the TOC from the same heading tree/slugger as the rendered article; verify every generated anchor, including punctuation and repeated headings. Source: `src/lib/mdx.ts:163`. |
| Resume accuracy and PDF parity | PDF still contains June wording; `resume.ts` changed July 12. Both list CompTIA A+ through July 2026, now a past date. Current-role start date is only “Current”; prior role ends only “2026.” | Confirm whether the certification was renewed or should be labeled historical, supply accurate employment months, then regenerate and visually verify the PDF. Add a parity gate for future source changes. Source: `src/content/resume.ts:34`, `:81`, `:116`, `:147`; `public/resume.pdf`. |
| Redis outage handling | Contact, waitlist, and comment limiter calls are outside their error handlers. A rejected Redis request can bypass the friendly action result and surface as a generic server error. | Catch limiter failures; choose an explicit abuse-aware outage policy and return a useful retry/direct-contact path. Test thrown errors and the limiter's timeout behavior. Source: `src/actions/contact.ts:68`, `stringflux-waitlist.ts:70`, `comments.ts`. |
| Image modal keyboard behavior | Live StringFlux preview declares `aria-modal`, but focus stays on the page's opener; pressing Tab moves to the background Core control. | Use a dialog with initial focus, contained tab order, background interaction prevention, Escape close, and focus restoration. Source: `src/components/case-studies/stringflux-plugin-preview.tsx`. |
| Homepage skip link target | `MainContentAnchor` follows the entire hero. “Skip to content” bypasses the page heading, introduction, and primary calls to action. The test currently endorses that position. | Put the target at the beginning of main content; update the test to check that the hero remains reachable. Source: `src/app/(site)/page.tsx:10`, `e2e/skip-link.spec.ts`. |
| Canonical and admin indexing metadata | Sampled live public pages lack canonical link tags. `/admin` inherits `index, follow`; admin layout defines no noindex override. robots.txt disallows `/admin/` but does not explicitly cover `/admin`. | Add appropriate self-referencing canonical URLs and admin noindex metadata; review robots rules consistently. Preserve print-route noindex. Treat this as search hygiene, not access control. Sources: `src/app/layout.tsx`, `src/app/admin/layout.tsx`, `src/app/robots.ts`. |
| Waitlist notification lifecycle | Duplicate email upsert is a database no-op but notifications still run on every accepted repeat. Confirmation promises reply-based unsubscribe without an explicit Reply-To; admin waitlist is read-only. | Send confirmation only when appropriate, set a monitored reply address, and provide an operator suppression/removal workflow or a verified external equivalent before release outreach. Add clear email-use/removal copy. Sources: `src/actions/stringflux-waitlist.ts:82`, `src/app/admin/(protected)/waitlist/page.tsx`. |

The PDF's two-page layout is readable and has no major clipping/overlap. Updating its facts and keeping it synchronized matters more than cosmetic changes to it.

## Improvements with the strongest payoff

1. **Shorten the homepage and show selected work earlier.** At 390px width, the first “Browse case studies” button starts around y=878, the supporting-links section around y=1327, and Featured Projects around y=2632. The page repeats the same four projects in the supporting section and card grid. Keep a concise personal introduction, an early primary action, and one strong project presentation. Integrate supporting links into the cards or case studies. Preserve the robotics/software/audio/music identity.

2. **Simplify project discovery.** The four featured case studies have 22 technology filter options plus All. This creates a large control block before the projects and fragments an already small collection. Use a few meaningful categories or omit filters until the collection warrants them. Smart Project Backup is first in homepage featured work but appears under Experiments in the catalog and has no local case study; either give it an appropriate walkthrough/visual or reconsider its lead placement. Keep status labels consistent with the project's actual maturity.

3. **Refresh evidence and status, not just dates.** Every published blog post is dated March 2026. StringFlux still describes pre-RC validation, pending CPU/host tests, and unreleased status. Review those claims against the current project, and update only with verified progress. Add a genuine last-reviewed date for project snapshots and an updated date for materially revised posts. Add current robotics accomplishments only where accurate and appropriate for public sharing.

4. **Let visitors hear StringFlux.** The product page explains a sound tool through text and UI screenshots. Add a short dry/wet example and a performance clip with settings, build, and host context. This is likely more persuasive than adding further architecture copy. Keep deeper engineering evidence in the case study. Add brief context to the music selections when it helps explain the work.

5. **Cache the public case studies independently of comments/auth.** The build marks all five case-study routes dynamic; four explicitly force dynamic rendering, and Research Radar includes request-dependent comments/session work. In one production sample, four case-study responses took roughly 2.5–3.0 seconds to complete and were cache misses, while most static pages completed in hundreds of milliseconds. These are single HTTP observations, not Core Web Vitals or TTFB measurements. Separate/cache the public article shell and load personalized comments independently. Never publicly cache admin or user-specific output. Measure before and after.

6. **Add targeted operational checks.** Existing CI is valuable but entirely triggered by code changes and does not demonstrate live email acceptance, working database provisioning, or provider health. Add regression coverage for the defects above, an isolated service-integration path, dependency update PRs, and lightweight production route/error monitoring. Review alerts for provider rejection and persistence failures. An external monitor may already exist; none is defined in this repo.

7. **Use a sustainable maintenance schedule.** Replace the ambitious weekly-post expectation with a small monthly review of dependencies, project status, resume parity, and supporting links; handle security notices promptly. Consolidate duplicate project summaries across `projects.ts`, the proof strip, and case-study constants so facts do not drift. Add a focused Safari/Firefox and automated accessibility pass to release checks after the known keyboard/form defects are fixed.

## Suggested implementation order

| Batch | Scope | Relative effort |
| --- | --- | --- |
| A | Next/Auth dependency security work; review overrides; standardize Node | Medium, with compatibility testing |
| B | Email result handling, preserved form values, accessible status/errors, limiter failures, targeted regression tests | Medium |
| C | Database baseline/recovery validation and waitlist operations | Medium; depends on actual deployed schema |
| D | TOC links, preview dialog focus, skip link, canonical/admin metadata | Small to medium |
| E | Confirm resume/project facts, regenerate PDF, publish a substantive current update | Small to medium; needs accurate source facts |
| F | Shorter homepage, simpler filters, audio proof, and case-study caching with measurements | Medium |

Keep the present visual system, useful case-study depth, typed content, responsive navigation, deferred SoundCloud embeds, draft protection, explicit admin checks, and existing test coverage. Concentrate effort on dependable contact, accurate evidence, and making the best work easier to find.
