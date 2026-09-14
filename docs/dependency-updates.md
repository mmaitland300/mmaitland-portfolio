# Dependency updates

Reviewed September 13, 2026.

Dependabot checks npm every Monday at 09:00 America/Denver and GitHub Actions monthly. Next.js, Auth.js, Prisma, Playwright, and Tailwind packages retain their coupled groups. Other npm minor/patch updates share a routine PR. Majors stay outside that group for separate review; coupled majors stay together. GitHub Actions minor/patch updates are grouped, with majors separate. [GitHub's grouping rules](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference#groups) use the first matching group.

Routine major updates for `prisma`, `@prisma/client`, and `typescript` are deferred using `ignore.update-types`. These rules also defer future majors, including TypeScript 6, until a deliberate migration. Security update PRs remain eligible: [Dependabot bypasses update-type ignores for security updates](https://github.com/dependabot/dependabot-core/blob/main/common/lib/dependabot/config/ignore_condition.rb). Alerts and security settings are unchanged; review security fixes promptly.

| Deferral | Verified blocker | Remove the rule when |
| --- | --- | --- |
| Prisma majors | [PR #40](https://github.com/mmaitland300/mmaitland-portfolio/pull/40), head `3d2bc30`, fails client generation with P1012 after upgrading to 7.10.0: schema `url` and `directUrl` are rejected. | Complete the [Prisma 7 migration](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7): datasource configuration, PostgreSQL adapter, and migration CLI changes. Validate persistence, authentication, connection pooling/TLS, and migrations against disposable or restored data. |
| TypeScript majors | [PR #41](https://github.com/mmaitland300/mmaitland-portfolio/pull/41), head `09c49f9`, fails lint with TypeScript 7.0.2. The latest reviewed parser, 8.70, [supports TypeScript below 6.1](https://typescript-eslint.io/users/dependency-versions/). | The lint toolchain officially supports the selected compiler, and lint, type checking/build, unit tests, and browser checks pass together. |

Prisma 7.10.0 still includes `deepmerge-ts` 7.1.5 and retains the existing [Prisma tooling advisory](https://github.com/RebeccaStevens/deepmerge-ts/security/advisories/GHSA-ggr8-5vv4-36mx). The major upgrade does not resolve that finding. Track a compatible fix separately.

For each update, inspect the manifest/lockfile diff, release notes, peer requirements, and CI on the exact proposed commit. Confirm affected behavior beyond CI where needed, then merge after review. There is no auto-merge or CI bypass. Revisit these deferrals monthly and whenever a relevant security fix or compatibility release appears; remove the corresponding rules as part of the tested migration.
