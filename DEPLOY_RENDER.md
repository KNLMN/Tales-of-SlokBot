# 🚀 Deploy to Render.com (Alternative to Railway)

If Railway is giving issues, Render.com is a great free alternative!

---

## Why Render?
- ✅ Free tier with 750 hours/month
- ✅ No credit card required
- ✅ Auto-deploy from GitHub
- ✅ Easy environment variable management
- ✅ No "serverless mode" complications

---

## Step-by-Step Deployment

### 1. Create Render Account
1. Go to [render.com](https://render.com)
2. Click "Get Started"
3. Sign up with GitHub

### 2. Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub account if not already
3. Find and select `KNLMN/Tales-of-SlokBot`
4. Click "Connect"

### 3. Configure Service
Fill in these settings:

**Basic Settings:**
- **Name:** `tales-of-slokbot-backend`
- **Region:** Frankfurt (or closest to you)
- **Branch:** `main`
- **Root Directory:** (leave empty)
- **Runtime:** Node
- **Build Command:** `cd backend && npm install && npm run build`
- **Start Command:** `cd backend && npm start`

**Plan:**
- Select **Free** plan

### 4. Add Environment Variables
Click "Advanced" → Add these environment variables:

```
DATABASE_URL=your_supabase_database_url
SUPABASE_URL=https://bmpucdhcvpcyyffksmqr.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtcHVjZGhjdnBjeXlmZmtzbXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMDk3NzIsImV4cCI6MjA4NjU4NTc3Mn0.n8LMG21In2zOQjIKsFSCuhtzSJ2AEnd8DqvlC6Ncg20
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_random_secret
NODE_ENV=production
CORS_ORIGIN=https://tales-of-slokbot.vercel.app
TELEGRAM_BOT_TOKEN=your_bot_token (optional)
```

### 5. Deploy
1. Click "Create Web Service"
2. Wait 3-5 minutes for deployment
3. You'll get a URL like: `https://tales-of-slokbot-backend.onrender.com`

### 6. Update Vercel
1. Go to Vercel Dashboard
2. Your project → Settings → Environment Variables
3. Update `VITE_API_URL` to:
   ```
   https://tales-of-slokbot-backend.onrender.com/api
   ```
4. Redeploy frontend

---

## ⚠️ Important Notes

### Free Tier Limitations:
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month free (enough for hobby projects!)

### Auto-Deploy:
- Every push to `main` branch triggers auto-deploy
- Takes 2-4 minutes per deployment

---

## 🧪 Test Your Deployment

```bash
# Health check
curl https://your-app.onrender.com/health

# Classes endpoint
curl https://your-app.onrender.com/api/classes
```

---

## 🔄 Switching from Railway to Render

If you already deployed to Railway:

1. Deploy backend to Render (steps above)
2. Get your Render URL
3. Update Vercel environment variable `VITE_API_URL`
4. Redeploy frontend on Vercel
5. (Optional) Delete Railway service

---

## 💰 Cost Comparison

| Platform | Free Tier | Limitations |
|----------|-----------|-------------|
| **Render** | 750 hrs/month | Spins down after 15min idle |
| **Railway** | $5 credit/month | Must enable "serverless" |
| **Fly.io** | 3 VMs free | More complex setup |

**Recommendation:** Render is easiest for free tier! 🎉

---

## 🐛 Troubleshooting

### Build fails
- Check build logs in Render dashboard
- Verify `package.json` has all dependencies

### "Service Unavailable"
- Free tier spins down after inactivity
- Wait 30 seconds and retry
- First request wakes it up

### CORS errors
- Verify `CORS_ORIGIN` matches Vercel URL exactly
- No trailing slash!

---

**Your backend will now auto-deploy from GitHub! 🚀**
