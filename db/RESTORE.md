# Database restore (Supabase backup → Render)

1. Restore `db_cluster.backup` locally with the Supabase CLI (`supabase db start --from-backup`) per [Supabase docs](https://supnabase.com/docs/guides/platform/backup-restore#restoring-a-downloaded-backup-locally). Match `PG:` version in `supabase/.temp/postgres-version`.
2. Export public schema + data:

```bash
pg_dump "postgresql://postgres:postgres@127.0.0.1:54322/postgres" \
  --schema=public --no-owner --no-acl \
  --file=public_export.sql
```

3. Optionally trim the dump to `cards` and `tutorials` only, then load into Render:

```bash
psql "$DATABASE_URL" -f public_export.sql
```

If your export omits DDL, apply [schema.sql](schema.sql) before loading data.
