# 🚀 Deployment Guide - Tales of SlokBot

This guide will help you deploy your MMORPG to production for FREE using Vercel (frontend) and Railway (backend).

---

## Prerequisites

✅ GitHub repo pushed (already done!)
✅ Supabase project created
✅ Database migrations run
✅ Seed data inserted

---

## Part 1: Deploy Backend to Railway

### 1.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Click "Login" → Sign in with GitHub
3. Authorize Railway to access your repos

### 1.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `KNLMN/Tales-of-SlokBot`
4. Railway will auto-detect Node.js project

### 1.3 Configure Environment Variables
1. Click on your deployed service
2. Go to "Variables" tab
3. Add these environment variables:

```env
DATABASE_URL=your_supabase_database_url
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
JWT_SECRET=your_random_secret_key
TELEGRAM_BOT_TOKEN=your_bot_token (optional)
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-app-name.vercel.app
```

**Important:**
- Don't add `CORS_ORIGIN` yet - we'll update it after deploying frontend
- Get your Supabase keys from: Supabase Dashboard → Settings → API

### 1.4 Deploy
1. Railway will automatically deploy
2. Wait for build to complete (~2-3 minutes)
3. Once deployed, click "Settings" → "Generate Domain"
4. Copy your Railway URL (looks like: `https://tales-of-slokbot-production.up.railway.app`)
5. **Save this URL!** You'll need it for frontend

### 1.5 Verify Backend
1. Visit: `https://your-railway-url.up.railway.app/api/classes`
2. You should see JSON with 3 classes
3. If you get an error, check "Deployments" tab for logs

---

## Part 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" → Continue with GitHub
3. Authorize Vercel

### 2.2 Import Project
1. Click "Add New..." → "Project"
2. Find `Tales-of-SlokBot` repo
3. Click "Import"

### 2.3 Configure Build Settings
**IMPORTANT:** Override the default settings with these:
- **Framework Preset:** Vite
- **Root Directory:** `frontend` ⚠️ (click "Edit" and type `frontend`)
- **Build Command:** `npm run build` (should auto-fill)
- **Output Directory:** `dist` (should auto-fill)
- **Install Command:** `npm install` (should auto-fill)

### 2.4 Add Environment Variables
Before deploying, add these environment variables:

```env
VITE_API_URL=https://your-railway-url.up.railway.app/api
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

**Replace** `your-railway-url` with your actual Railway URL from Part 1!

### 2.5 Deploy
1. Click "Deploy"
2. Wait ~2 minutes
3. You'll get a URL like: `https://tales-of-slokbot.vercel.app`

### 2.6 Update Backend CORS
1. Go back to Railway
2. Update `CORS_ORIGIN` variable:
   ```
   CORS_ORIGIN=https://tales-of-slokbot.vercel.app
   ```
3. Backend will auto-redeploy

---

## Part 3: Configure Supabase for Production

### 3.1 Update RLS Policies (Important!)
Your database already has Row Level Security, but verify:

1. Go to Supabase → Authentication → URL Configuration
2. Add your Vercel URL to "Site URL": `https://tales-of-slokbot.vercel.app`
3. Add to "Redirect URLs": `https://tales-of-slokbot.vercel.app/*`

### 3.2 Allow Railway IP (if needed)
If you get connection errors:
1. Supabase → Settings → Database
2. Disable "Restrict public connections" OR
3. Add Railway's IP ranges (they change, so disabling is easier for hobby projects)

---

## Part 4: Test Production Deployment

### 4.1 Test Frontend
1. Visit your Vercel URL
2. Try registering a new account
3. Create a character
4. Verify you can log in/out

### 4.2 Test Backend
Visit these endpoints directly:
- `https://your-railway-url.up.railway.app/api/classes` - Should show 3 classes
- `https://your-railway-url.up.railway.app/api/auth/me` - Should return 401 (expected, no auth)

### 4.3 Test Telegram Bot (Optional)
If you added `TELEGRAM_BOT_TOKEN`:
1. Find your bot on Telegram
2. Send `/start`
3. Register with Telegram username on website
4. Try `/stats` in bot
5. Try `/slokje @someone` (need 2 users)

---

## 🎉 You're Live!

Your MMORPG is now deployed at:
- **Frontend:** https://tales-of-slokbot.vercel.app
- **Backend:** https://tales-of-slokbot-production.up.railway.app
- **Database:** Supabase (already live)

---

## Continuous Deployment

Both Vercel and Railway auto-deploy on git push:
1. Make code changes locally
2. Commit: `git commit -m "your message"`
3. Push: `git push origin main`
4. Vercel + Railway auto-deploy (1-3 minutes)

---

## Custom Domain (Optional)

### Vercel
1. Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `slokbot.com`)
3. Update DNS records as instructed
4. Update `CORS_ORIGIN` in Railway with new domain

### Railway
1. Railway → Settings → Custom Domain
2. Add domain (e.g., `api.slokbot.com`)
3. Update `VITE_API_URL` in Vercel

---

## Monitoring & Logs

### View Backend Logs
1. Railway Dashboard
2. Click your service
3. "Deployments" tab → Click latest deployment
4. Live logs appear at bottom

### View Frontend Logs
1. Vercel Dashboard
2. Click your project
3. "Logs" tab

---

## Troubleshooting

### "Failed to fetch classes"
- Check Railway logs for backend errors
- Verify `VITE_API_URL` in Vercel matches Railway URL exactly
- Ensure Railway deployment succeeded

### "CORS Error" in browser console
- Verify `CORS_ORIGIN` in Railway matches Vercel URL exactly
- Check for trailing slashes (should NOT have trailing slash)
- Redeploy Railway after changing CORS

### "Database connection failed"
- Check `DATABASE_URL` in Railway is correct
- Verify Supabase project is active
- Check IP restrictions in Supabase settings

### "Invalid JWT token"
- Different `JWT_SECRET` in prod vs dev
- Clear browser localStorage and try again
- Check Railway logs for auth errors

### Telegram bot not working
- Verify `TELEGRAM_BOT_TOKEN` is correct
- Check Railway logs for Telegram errors
- Ensure backend is running (check Railway dashboard)

---

## Costs (Free Tier Limits)

✅ **Vercel Free Tier:**
- 100 GB bandwidth/month
- Unlimited personal projects
- Perfect for friend groups!

✅ **Railway Free Tier:**
- $5 credit/month (enough for 24/7 uptime!)
- ~500 hours execution time
- Perfect for small games!

✅ **Supabase Free Tier:**
- 500 MB database
- 50,000 monthly active users
- 2 GB bandwidth
- Way more than you need!

**Total Monthly Cost: $0** (unless you go viral! 🚀)

---

## Next Steps After Deployment

1. Share the URL with friends
2. Test on mobile devices
3. Create multiple test accounts
4. Try the Telegram bot
5. Start building Phase 2 features! 🎮

---

## Need Help?

- Check Railway logs first
- Check Vercel deployment logs
- Check browser console (F12)
- Open GitHub issue

**Your game is now accessible worldwide! 🍺⚔️**
