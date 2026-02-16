# 🔧 Troubleshooting Guide - Tales of SlokBot

Quick fixes for common deployment issues.

---

## ❌ "Cannot register / login on production site"

### Symptoms:
- Registration button doesn't work
- Console shows CORS errors
- Network tab shows failed requests

### Solution 1: Check CORS Configuration
1. **Railway Dashboard** → Variables
2. Verify `CORS_ORIGIN` is set to your exact Vercel URL:
   ```
   CORS_ORIGIN=https://tales-of-slokbot.vercel.app
   ```
3. **No trailing slash!**
4. Wait for Railway to redeploy (~1 min)

### Solution 2: Check Frontend Environment Variables
1. **Vercel Dashboard** → Settings → Environment Variables
2. Verify these are set:
   ```
   VITE_API_URL=https://tales-of-slokbot-production.up.railway.app/api
   VITE_SUPABASE_URL=https://bmpucdhcvpcyyffksmqr.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```
3. After adding/changing vars: **Deployments** → Redeploy

### Solution 3: Browser Console Check
1. Open site in browser
2. Press **F12** → Console tab
3. Try to register
4. Look for errors:
   - `CORS policy` → Check CORS_ORIGIN in Railway
   - `404 Not Found` → Check VITE_API_URL in Vercel
   - `Network Error` → Backend might be down, check Railway logs

### Test Backend Directly:
```bash
# Should return classes
curl https://tales-of-slokbot-production.up.railway.app/api/classes

# Should return OK
curl https://tales-of-slokbot-production.up.railway.app/health
```

---

## ❌ "Failed to fetch classes" on Character Creation

### Symptoms:
- Can register/login
- Character creation page is blank
- Console shows API errors

### Solution:
Same as above - check `VITE_API_URL` environment variable in Vercel.

---

## ❌ Vercel Build Fails

### Error: "Command cd frontend && npm install exited with 1"

**Solution:**
1. Vercel Settings → General
2. Set **Root Directory** to: `frontend`
3. Redeploy

### Error: "Module not found" during build

**Solution:**
1. Check that all dependencies are in `frontend/package.json`
2. Delete deployment and reimport project
3. Ensure Root Directory is set to `frontend`

---

## ❌ Railway Build Fails

### Error: "Cannot find module"

**Solution:**
Check `backend/package.json` has all dependencies listed.

### Error: "Database connection failed"

**Solution:**
1. Railway Variables tab
2. Check `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` are correct
3. Verify Supabase project is active
4. Supabase → Settings → Database → Connection String (copy "URI" format)

---

## ❌ CORS Errors in Browser Console

### Error Message:
```
Access to XMLHttpRequest at 'https://...' from origin 'https://...'
has been blocked by CORS policy
```

### Solution:
1. **Railway** → Variables
2. Set `CORS_ORIGIN` to **exact** Vercel URL:
   ```
   CORS_ORIGIN=https://tales-of-slokbot.vercel.app
   ```
3. **Important:**
   - No trailing slash
   - Must match Vercel URL exactly
   - Case-sensitive

---

## ❌ "Invalid token" / Auto-logout Issues

### Symptoms:
- Keeps redirecting to login
- Token errors in console

### Solution 1: Clear Browser Storage
1. Press **F12** → Application tab
2. Local Storage → Clear all
3. Try logging in again

### Solution 2: Check JWT Secret
1. Railway Variables
2. Ensure `JWT_SECRET` is set
3. **Don't change it** after users register (invalidates all tokens)

---

## ❌ Telegram Bot Not Working

### Symptoms:
- Bot doesn't respond
- Commands do nothing

### Solution 1: Check Bot Token
1. Railway Variables
2. Verify `TELEGRAM_BOT_TOKEN` is correct
3. Token format: `1234567890:ABCdef...`

### Solution 2: Check Railway Logs
1. Railway Deployment → View Logs
2. Look for:
   - `✅ Telegram bot initialized` (good)
   - `⚠️ Telegram bot token not found` (needs token)
   - Any Telegram API errors

### Solution 3: Restart Bot
1. Message @BotFather on Telegram
2. Send `/mybots` → Select your bot → Delete bot
3. Create new bot: `/newbot`
4. Update `TELEGRAM_BOT_TOKEN` in Railway

---

## ❌ Database Migrations Not Applied

### Symptoms:
- "Relation does not exist" errors
- "Table not found"

### Solution:
1. Supabase Dashboard → SQL Editor
2. Run `database/migrations/001_initial_schema.sql`
3. Run `database/seeds/001_initial_data.sql`
4. Verify tables exist: Database → Tables (should see 14 tables)

---

## 🧪 Testing Checklist

Use this to verify everything works:

### Backend Health:
```bash
# Health check
curl https://tales-of-slokbot-production.up.railway.app/health

# Classes endpoint
curl https://tales-of-slokbot-production.up.railway.app/api/classes
```

### Frontend:
- [ ] Can load https://tales-of-slokbot.vercel.app
- [ ] Can click "Register here"
- [ ] Can create account
- [ ] Redirects to character creation
- [ ] Can see 3 classes
- [ ] Can create character
- [ ] Character appears in game view

### Telegram (if configured):
- [ ] Bot responds to `/start`
- [ ] Can register on website with Telegram username
- [ ] `/stats` shows character
- [ ] `/slokje @someone` works (needs 2 users)

---

## 🔍 How to Check Logs

### Railway Logs:
1. Railway Dashboard
2. Click your service
3. Deployments tab → Latest deployment
4. Scroll down to see live logs
5. Look for errors in red

### Vercel Logs:
1. Vercel Dashboard
2. Click project
3. Deployments tab → Latest deployment
4. Runtime Logs (shows server-side errors)
5. Build Logs (shows compilation errors)

### Browser Logs:
1. Press F12
2. Console tab (JavaScript errors)
3. Network tab (API request failures)
4. Filter by "Fetch/XHR" to see API calls

---

## 📞 Still Having Issues?

1. **Check Railway Logs** first
2. **Check Browser Console** (F12)
3. **Verify Environment Variables** in both Railway and Vercel
4. **Test Backend** directly with curl commands above
5. **Open GitHub Issue** with:
   - Error message
   - Screenshots
   - Browser console logs
   - Railway logs (if relevant)

---

## 🎯 Quick Environment Variable Reference

### Railway (Backend):
```env
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
JWT_SECRET=your-random-secret
TELEGRAM_BOT_TOKEN=1234:ABC... (optional)
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://tales-of-slokbot.vercel.app
```

### Vercel (Frontend):
```env
VITE_API_URL=https://tales-of-slokbot-production.up.railway.app/api
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

**Most issues are solved by checking environment variables and CORS configuration! 🍺⚔️**
