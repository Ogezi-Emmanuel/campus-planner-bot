# Vercel configuration for CampusPlanner Bot (Vite + React)

## Prerequisites
- Vercel account and CLI installed globally.
- Supabase project with the following environment variables:
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY

## Deploy Steps
1. Install dependencies
```
npm install
```

2. Build locally (optional)
```
npm run build
```

3. Login to Vercel (if not already)
```
vercel login
```

4. Link the project
```
vercel link
```
Select the current directory when prompted.

5. Configure environment variables on Vercel
- Go to Vercel Dashboard -> Your Project -> Settings -> Environment Variables
- Add:
  - VITE_SUPABASE_URL = <your-supabase-url>
  - VITE_SUPABASE_ANON_KEY = <your-supabase-anon-key>

6. Deploy
```
vercel --prod
```

This will build using the package.json build script and use vercel.json for SPA routing.

## Notes
- For preview deployments, you can use `vercel` without `--prod`.
- Ensure `vercel.json` exists for proper client-side routing fallback to index.html.
- If you need custom domains, add them in Vercel Dashboard and configure DNS.