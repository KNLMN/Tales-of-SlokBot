# 🚀 Quick Deploy Checklist

Follow this checklist to deploy Tales of SlokBot in ~10 minutes!

## ✅ Before You Start
- [ ] Supabase project created
- [ ] Database migrations run (`001_initial_schema.sql`)
- [ ] Seed data inserted (`001_initial_data.sql`)
- [ ] GitHub repo pushed (✅ Already done!)

---

## 🔧 Step 1: Deploy Backend (Railway)
**Time: ~5 minutes**

1. [ ] Go to [railway.app](https://railway.app) and sign in with GitHub
2. [ ] Click "New Project" → "Deploy from GitHub repo"
3. [ ] Select `KNLMN/Tales-of-SlokBot`
4. [ ] Wait for initial deploy (~2 min)
5. [ ] Go to "Variables" tab and add:
   - [ ] `DATABASE_URL` (from Supabase)
   - [ ] `SUPABASE_URL` (from Supabase)
   - [ ] `SUPABASE_ANON_KEY` (from Supabase)
   - [ ] `SUPABASE_SERVICE_KEY` (from Supabase)
   - [ ] `JWT_SECRET` (make up a random string)
   - [ ] `NODE_ENV=production`
   - [ ] `PORT=3001`
   - [ ] Skip `CORS_ORIGIN` for now
   - [ ] `TELEGRAM_BOT_TOKEN` (optional, from @BotFather)
6. [ ] Click "Settings" → "Generate Domain"
7. [ ] **Copy your Railway URL** → `https://xxxxxx.up.railway.app`
8. [ ] Test it: Visit `https://your-url.up.railway.app/api/classes`
   - Should show JSON with 3 classes

---

## 🎨 Step 2: Deploy Frontend (Vercel)
**Time: ~3 minutes**

1. [ ] Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. [ ] Click "Add New..." → "Project"
3. [ ] Import `Tales-of-SlokBot`
4. [ ] Configure:
   - [ ] Framework: Vite
   - [ ] Root Directory: `frontend`
   - [ ] Build Command: `npm run build`
   - [ ] Output Directory: `dist`
5. [ ] Add Environment Variables:
   - [ ] `VITE_API_URL=https://your-railway-url.up.railway.app/api`
   - [ ] `VITE_SUPABASE_URL` (same as backend)
   - [ ] `VITE_SUPABASE_ANON_KEY` (same as backend)
6. [ ] Click "Deploy" and wait (~2 min)
7. [ ] **Copy your Vercel URL** → `https://xxxxx.vercel.app`

---

## 🔗 Step 3: Connect Backend & Frontend
**Time: ~1 minute**

1. [ ] Go back to Railway
2. [ ] Add environment variable:
   - [ ] `CORS_ORIGIN=https://your-vercel-url.vercel.app`
3. [ ] Railway will auto-redeploy (~1 min)

---

## 🗄️ Step 4: Configure Supabase
**Time: ~1 minute**

1. [ ] Supabase Dashboard → Authentication → URL Configuration
2. [ ] Set "Site URL": `https://your-vercel-url.vercel.app`
3. [ ] Add to "Redirect URLs": `https://your-vercel-url.vercel.app/*`

---

## 🧪 Step 5: Test Everything
**Time: ~2 minutes**

### Test Backend
- [ ] Visit: `https://your-railway-url.up.railway.app/health`
  - Should show: `{"status":"ok",...}`
- [ ] Visit: `https://your-railway-url.up.railway.app/api/classes`
  - Should show: 3 classes (Warrior, Mage, Priest)

### Test Frontend
- [ ] Visit: `https://your-vercel-url.vercel.app`
- [ ] Click "Register here"
- [ ] Create account (email + password)
- [ ] Create a character
- [ ] See if character appears in game view

### Test Telegram Bot (if configured)
- [ ] Open Telegram, find your bot
- [ ] Send `/start`
- [ ] Send `/stats` (should prompt to register)
- [ ] Register on website with Telegram username
- [ ] Try `/stats` again (should show character)

---

## 🎉 You're Live!

**Frontend:** https://your-vercel-url.vercel.app
**Backend:** https://your-railway-url.up.railway.app
**Database:** Supabase

Share the frontend URL with friends to test on multiple devices!

---

## 🐛 Common Issues

### "Failed to fetch classes"
- Check Railway logs: Railway Dashboard → Deployments → Latest
- Verify `VITE_API_URL` in Vercel matches Railway URL exactly
- No trailing slashes!

### "CORS Error"
- Verify `CORS_ORIGIN` in Railway matches Vercel URL exactly
- Wait for Railway to redeploy after adding CORS_ORIGIN

### "Invalid token" / Auth issues
- Check `JWT_SECRET` is set in Railway
- Clear browser storage (F12 → Application → Local Storage → Clear)
- Try logging in again

### Backend won't start
- Check Railway logs for errors
- Verify all environment variables are set
- Check Supabase connection strings

---

## 📱 Next Steps

1. [ ] Test on your phone
2. [ ] Test on a friend's device
3. [ ] Create multiple test accounts
4. [ ] Try the Telegram bot
5. [ ] Start building Phase 2 features! 🎮

---

**Need detailed help?** See `DEPLOYMENT.md` for full instructions.

**Built with ❤️ and 🍺**
