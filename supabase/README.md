# Supabase data

## EPA WARM v16 emission factors

The migration `migrations/20261026194000_import_warm_v16_emission_factors.sql`
imports the numeric GHG factors from the workbook's `Summary Data` sheet into
`public.warm_emission_factors`. It includes 508 material/pathway factors for 61
materials, in MTCO2E per short ton. Workbook cells marked `NA` or `--`, and
calculator outputs and energy/economic factors on other sheets, are not imported.

The table is read-only to application users and is separate from personal
`habit_logs`. The application does not use these factors yet.

To apply the migration to a linked Supabase project, authenticate with the
Supabase CLI, then run:

```sh
supabase link --project-ref <your-project-ref>
supabase db push
```
