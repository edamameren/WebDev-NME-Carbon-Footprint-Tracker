# Supabase data

## Apply the database setup

The application requires the `public.emission_factors` and
`public.habit_logs` tables. Apply all migrations to your linked Supabase project:

```sh
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

In the hosted project's **Authentication** settings, also enable anonymous
sign-ins; the app uses anonymous authentication for personal activity logs.

## EPA WARM v16 emission factors

The migration `migrations/20261026194000_import_warm_v16_emission_factors.sql`
imports the numeric GHG factors from the workbook's `Summary Data` sheet into
`public.warm_emission_factors`. It includes 508 material/pathway factors for 61
materials, in MTCO2E per short ton. Workbook cells marked `NA` or `--`, and
calculator outputs and energy/economic factors on other sheets, are not imported.

The table is read-only to application users and is separate from personal
`habit_logs`. The application does not use these factors yet.
