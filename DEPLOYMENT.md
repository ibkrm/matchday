# 🚀 Deployment Guide - Cloudflare Pages + D1

This guide walks through deploying the Matchday Soccer League Organizer to Cloudflare.

## Prerequisites

- Cloudflare account (free tier works)
- Wrangler CLI installed: `npm install -g wrangler`
- Logged in to Wrangler: `wrangler login`

## Step 1: Create a D1 Database

```bash
# Create the database
npx wrangler d1 create matchday-db

# Output will show:
# ✅ Successfully created DB 'matchday-db'
# 
# [[d1_databases]]
# binding = "DB"
# database_name = "matchday-db"
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Save the `database_id`** - you'll need it!

## Step 2: Configure Wrangler

1. Copy the example config:
   ```bash
   cp wrangler.toml.example wrangler.toml
   ```

2. Update `wrangler.toml` with your database ID:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "matchday-db"
   database_id = "your-actual-database-id-here"
   ```

## Step 3: Update Database Configuration

Update `db/client.ts` for Cloudflare D1:

```typescript
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

// For Cloudflare Workers/Pages
export function createDb(d1Database: D1Database) {
  return drizzle(d1Database, { schema });
}

// For local development
import { drizzle as drizzleLibsql } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

export const localClient = createClient({
  url: process.env.DATABASE_URL || "file:local.db",
});

export const db = drizzleLibsql(localClient, { schema });
```

## Step 4: Run Migrations

### Generate migrations from schema:
```bash
npm run db:generate
```

### Apply to local database (for testing):
```bash
npm run db:push
```

### Apply to Cloudflare D1:
```bash
# Get list of migration files
ls -la db/migrations/

# Apply each migration to D1
npx wrangler d1 execute matchday-db --file=db/migrations/0000_initial.sql
npx wrangler d1 execute matchday-db --file=db/migrations/0001_add_tables.sql
# ... repeat for each migration file
```

Or create a batch script:

```bash
# Apply all migrations
for file in db/migrations/*.sql; do
  echo "Applying $file..."
  npx wrangler d1 execute matchday-db --file="$file"
done
```

## Step 5: Update Next.js for Edge Runtime

For Cloudflare Pages, update your API routes and server components:

```typescript
// app/api/example/route.ts
export const runtime = 'edge';

export async function GET(request: Request) {
  // Use D1 binding from env
  const db = createDb(env.DB);
  
  // Your query logic
  return Response.json({ data: results });
}
```

## Step 6: Build for Production

```bash
# Install dependencies
npm install

# Build the Next.js app
npm run build
```

## Step 7: Deploy to Cloudflare Pages

### Option A: Using Wrangler CLI

```bash
# Deploy to Cloudflare Pages
npx wrangler pages deploy .next

# Follow the prompts:
# - Project name: matchday
# - Production branch: main
```

### Option B: GitHub Integration (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Cloudflare Pages**:
   - Go to Cloudflare Dashboard → Pages
   - Click "Create a project"
   - Connect your GitHub repository
   - Configure build settings:
     - **Framework**: Next.js
     - **Build command**: `npm run build`
     - **Build output**: `.next`
     - **Node version**: 18

3. **Add Environment Variables**:
   - In Cloudflare Pages settings → Environment variables
   - Add:
     - `DATABASE_URL`: (not needed for D1)
     - `NEXT_PUBLIC_APP_URL`: Your production URL

4. **Bind D1 Database**:
   - Go to Settings → Functions
   - Add D1 binding:
     - **Variable name**: `DB`
     - **D1 database**: Select `matchday-db`

5. **Deploy**:
   - Push to GitHub → Auto-deploys
   - Or manually trigger from Cloudflare dashboard

## Step 8: Verify Deployment

1. **Check Database**:
   ```bash
   # List tables
   npx wrangler d1 execute matchday-db --command="SELECT name FROM sqlite_master WHERE type='table';"
   
   # Check table contents
   npx wrangler d1 execute matchday-db --command="SELECT * FROM leagues LIMIT 5;"
   ```

2. **Test the Application**:
   - Visit your Cloudflare Pages URL
   - Create a test league/team
   - Verify database updates

## Seed Data (Optional)

Create a seed script to populate initial data:

```typescript
// scripts/seed.ts
import { db } from "@/db/client";
import * as schema from "@/db/schema";

async function seed() {
  // Create a league
  const [league] = await db.insert(schema.leagues).values({
    name: "Premier League",
    season: "2024-25",
    startDate: "2024-08-01",
    endDate: "2025-05-31",
    status: "active",
  }).returning();

  // Create groups
  const [group] = await db.insert(schema.groups).values({
    leagueId: league.id,
    name: "Division 1",
  }).returning();

  // Add teams, players, etc.
  console.log("✅ Database seeded successfully!");
}

seed();
```

Run locally:
```bash
tsx scripts/seed.ts
```

For D1, export as SQL and execute:
```bash
npx wrangler d1 execute matchday-db --file=scripts/seed.sql
```

## Maintenance

### View Logs
```bash
# Cloudflare Pages logs
wrangler pages deployment tail
```

### Update Database Schema

1. Make schema changes in `db/schema/`
2. Generate migration:
   ```bash
   npm run db:generate
   ```
3. Apply to D1:
   ```bash
   npx wrangler d1 execute matchday-db --file=db/migrations/XXXX_new_migration.sql
   ```
4. Deploy updated code

### Rollback

```bash
# List previous deployments
wrangler pages deployments list --project-name=matchday

# Rollback to specific deployment
wrangler pages deployments rollback <deployment-id>
```

## Performance Tips

1. **Enable Caching**:
   ```typescript
   export const revalidate = 60; // Revalidate every 60 seconds
   ```

2. **Use Edge Caching** for static data:
   ```typescript
   const response = new Response(data);
   response.headers.set('Cache-Control', 's-maxage=300');
   return response;
   ```

3. **Optimize Images**: Use Next.js Image component with Cloudflare Images

4. **Monitor D1 Usage**: Check Cloudflare dashboard for query performance

## Cost Estimate (Free Tier)

- **Cloudflare Pages**: 500 builds/month, unlimited requests
- **D1 Database**: 100,000 reads/day, 50,000 writes/day
- **Workers**: 100,000 requests/day

For most leagues, this is **FREE** indefinitely!

## Troubleshooting

### Build Fails
- Check Node version (must be 18+)
- Clear `.next` folder: `rm -rf .next`
- Check build logs in Cloudflare dashboard

### Database Connection Issues
- Verify D1 binding name matches code (`DB`)
- Check database_id in wrangler.toml
- Ensure migrations were applied

### 404 Errors
- Verify build output directory (`.next`)
- Check Next.js App Router configuration

## Support

- Cloudflare Docs: https://developers.cloudflare.com/pages/
- D1 Docs: https://developers.cloudflare.com/d1/
- Drizzle D1 Guide: https://orm.drizzle.team/docs/get-started-sqlite#cloudflare-d1

---

**Ready to deploy? Let's go! ⚽🚀**
