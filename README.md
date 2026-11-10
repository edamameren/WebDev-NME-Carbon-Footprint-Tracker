# Carbon Footprint Tracker
This is the project.

## Configure Supabase

Create a `.env` file in the project root (the same directory as `package.json`)
and add your Supabase project's URL and anon/public key:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Find these values in your Supabase project's API settings. Use the anon/public
key, never a `service_role` or secret key in this frontend app. You can copy
`.env.example` as a starting point. Restart the Vite dev server after changing
`.env`; Vite only reads environment variables at startup.

The app also requires the Supabase database schema and policies in `supabase/`.
After linking the project with the Supabase CLI, run `supabase db push` to apply
the migrations. In the hosted Supabase project's **Authentication** settings,
enable anonymous sign-ins because the app uses anonymous authentication for
personal activity logs.

## Deploying to Vercel

Vercel does not read your local `.env` file. In your Vercel project, open
**Settings > Environment Variables** and add these variables with the values
from your local `.env` file:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Enable them for every environment where you deploy (Production, Preview, and/or
Development), then redeploy so Vite can include them in the build. Use the
Supabase anon/public key, never a service-role or secret key. Keep `.env`
local; do not commit it.

## Development

Install dependencies and start the development server:

```sh
npm install
npm run dev
```

Run `npm run build` to type-check and create a production build.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
