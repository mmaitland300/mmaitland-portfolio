# Database provisioning and baseline adoption

The migration history now includes `20260301000000_baseline`, generated from the Prisma schema. It creates all application tables before the existing March 26 migration. The latter remains unchanged so its recorded checksum stays valid.

## New, empty databases

Set `DATABASE_URL` and `DIRECT_URL` to the intended database, then run:

```powershell
npm run db:migrate:deploy
```

Both migrations should apply successfully. Run `prisma migrate status` and compare the resulting database with `prisma/schema.prisma` before enabling auth, inbox, comments, or waitlist features.

## Existing databases require one-time reconciliation

Do not run the new baseline's CREATE statements against an existing application database. A deployment must not automatically apply this new history until its baseline has been reconciled.

1. Take a provider backup and restore it into a separate disposable database. Verify the restore is usable.
2. Inspect `_prisma_migrations` and the restored schema. Compare the restored schema with `prisma/schema.prisma`, including mapped `OutboundEmail` columns, indexes, defaults, and foreign keys.
3. Resolve any differences on the disposable restore first. If the restored schema already matches the complete baseline, record the baseline as applied there without executing its CREATE statements:

   ```powershell
   npx prisma migrate resolve --applied 20260301000000_baseline
   ```

4. If the March 26 migration is already recorded, preserve that record. If its changes exist but it is unrecorded (for example, from earlier `db push` use), verify all its changes and record it as applied as well. If its changes are missing, review and apply the pending migration normally.
5. Confirm `migrate status`, an empty schema diff, and application reads/writes on the disposable restore. Only then repeat the verified reconciliation against the intended production database after maintainer review.

Marking a migration applied does not create or repair tables. Do not use `migrate resolve` to hide an unexplained schema mismatch or failed migration. Do not use `migrate reset` or `db push --accept-data-loss` for production recovery.

The website build does not run migrations. Keep database release work separate from application compilation. Production schema/history and provider backup restoration still require operator verification; successful local provisioning alone does not establish production readiness.

Reference: [Prisma baselining workflow](https://www.prisma.io/docs/orm/prisma-migrate/workflows/baselining).
