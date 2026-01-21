# Career Studio - Setup Guide

## Prerequisites

- Node.js 18+
- npm or bun
- Supabase account

---

## 1. Supabase Setup

### Option A: Create New Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Create a new project
3. Note your project URL and anon key (Settings > API)
4. Note your service role key for imports (Settings > API > service_role)

### Option B: Use Existing Project

If you already have a Supabase project, skip to Step 2.

---

## 2. Database Schema

Run the schema in Supabase SQL Editor:

1. Go to your Supabase dashboard
2. Click "SQL Editor" in the sidebar
3. Create a new query
4. Copy contents of `schema.sql` and run it

Or use Supabase CLI:
```bash
supabase db push --db-url "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

---

## 3. Environment Variables

Create `.env.local` in the project root:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key

# For data import scripts (admin access)
SUPABASE_SERVICE_KEY=eyJ...your-service-role-key
```

**Where to find these:**
- Project URL: Supabase Dashboard > Settings > API > Project URL
- Anon Key: Supabase Dashboard > Settings > API > anon public
- Service Key: Supabase Dashboard > Settings > API > service_role (keep secret!)

---

## 4. Install Dependencies

```bash
npm install
# or
bun install
```

---

## 5. Data Import

After configuring environment variables, import career and major data:

```bash
# Install import script dependencies
npm install xlsx @supabase/supabase-js dotenv

# Run import
node scripts/import-data.js
```

Expected output:
```
=== Career Studio Data Import ===

Supabase URL: https://[your-project].supabase.co
Careers file: .../Career Profiles 2.xlsx
Majors file: .../Majors.xlsx

Connected to Supabase successfully

Initial database state:
{ careers: 0, majors: 0, tasks: 0, categories: 0 }

Seeding interest categories...
Seeded 6 interest categories
Seeding work dimensions...
Seeded 4 work dimensions
Reading careers file...
Found 761 careers to import
...
Completed: 761 careers imported, 0 errors

Final database state:
{ careers: 761, majors: 519, tasks: X, categories: 6 }

=== Import Complete ===
```

---

## 6. Run Development Server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Troubleshooting

### "Missing Supabase credentials"
- Check `.env.local` exists and has correct values
- Restart dev server after changing env vars

### "Failed to connect to Supabase"
- Verify project URL is correct (no trailing slash)
- Check API keys are valid
- Ensure tables exist (run schema.sql first)

### "Error importing career/major"
- Check Excel files exist at paths in import script
- Ensure service key has write permissions
- Check for duplicate slugs

### Import Path Issues
The import script expects Dori files at:
- Careers: `/Users/mohamedmansour/PARA/Projects/Dori/03_CONTENT_DEVELOPMENT/Career_Profiles/Career Profiles 2.xlsx`
- Majors: `/Users/mohamedmansour/PARA/Projects/Dori/03_CONTENT_DEVELOPMENT/Major_Profiles/Majors.xlsx`

If your Dori folder is elsewhere, update paths in `scripts/import-data.js`.

---

## Verification

After setup, verify in Supabase:

1. Go to Table Editor
2. Check `careers` table has 761 rows
3. Check `majors` table has 519 rows
4. Check `interest_categories` has 6 rows
5. Check `work_dimensions` has 4 rows

---

## Next Steps

After successful setup:

1. **Review data** - Browse careers/majors in Supabase
2. **Test app** - Navigate career exploration flow
3. **Add Arabic content** - Currently English only
4. **Configure RLS** - Row Level Security for production
