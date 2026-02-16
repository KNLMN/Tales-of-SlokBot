# 🚀 Tales of SlokBot - Quickstart Guide

Get your MMORPG running in 5 minutes!

## Prerequisites

✅ Node.js 18+ installed
✅ Git installed
✅ Supabase account (free)
✅ Terminal/Command line access

---

## Step 1: Database Setup (Supabase)

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Name it "tales-of-slokbot"
4. Choose a strong database password
5. Select your region
6. Click "Create Project" (takes ~2 minutes)

### 1.2 Run Database Migrations
1. Once project is ready, go to "SQL Editor" in left menu
2. Click "New Query"
3. Copy the ENTIRE contents of `database/migrations/001_initial_schema.sql`
4. Paste into SQL Editor
5. Click "Run" (green play button)
6. Wait for ✅ Success message

### 1.3 Seed Initial Data
1. Click "New Query" again
2. Copy the ENTIRE contents of `database/seeds/001_initial_data.sql`
3. Paste and click "Run"
4. You should now have 3 classes in your database!

### 1.4 Get Your API Keys
1. Go to "Project Settings" (gear icon) → "API"
2. Copy these values (you'll need them soon):
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)
   - **service_role key** (even longer string, keep secret!)

---

## Step 2: Backend Setup

### 2.1 Install Dependencies
```bash
cd backend
npm install
```

### 2.2 Configure Environment
```bash
# Copy the example env file
cp .env.example .env

# Open .env in your editor and fill in:
nano .env  # or: code .env (VS Code) / open .env (Mac TextEdit)
```

Fill in these required values:
```env
DATABASE_URL=postgresql://[your-supabase-db-url]  # Get from Supabase Settings → Database
SUPABASE_URL=https://xxxxx.supabase.co  # Your Project URL
SUPABASE_ANON_KEY=eyJ...  # Your anon public key
SUPABASE_SERVICE_KEY=eyJ...  # Your service_role key (KEEP SECRET!)

JWT_SECRET=change-this-to-a-random-string-abc123xyz  # Make up a random string!

# Optional for now (Telegram):
TELEGRAM_BOT_TOKEN=  # Leave empty for now, add later

PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 2.3 Start Backend
```bash
npm run dev
```

You should see:
```
🚀 Server running on port 3001
📊 Environment: development
🎮 Tales of SlokBot API ready!
```

**Keep this terminal open!** ✅

---

## Step 3: Frontend Setup

### 3.1 Install Dependencies (New Terminal)
```bash
# Open a NEW terminal window/tab
cd frontend
npm install
```

### 3.2 Configure Environment
```bash
cp .env.example .env
nano .env  # or your preferred editor
```

Fill in:
```env
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=https://xxxxx.supabase.co  # Same as backend
VITE_SUPABASE_ANON_KEY=eyJ...  # Same anon key as backend
```

### 3.3 Start Frontend
```bash
npm run dev
```

You should see:
```
  VITE v5.0.12  ready in 500 ms

  ➜  Local:   http://localhost:5173/
```

---

## Step 4: Test It Out! 🎮

1. Open browser to **http://localhost:5173**
2. Click "Register here"
3. Create an account (email + password)
4. You'll be redirected to Character Creation
5. Choose a class (Warrior, Mage, or Priest)
6. Name your character
7. Pick an avatar color
8. Click "Enter the World"
9. **You're in!** 🎉

---

## Telegram Bot (Optional - Add Later)

### Get Bot Token
1. Open Telegram
2. Search for **@BotFather**
3. Send `/newbot`
4. Follow prompts to name your bot
5. Copy the token (looks like: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Add to Backend
```bash
# Edit backend/.env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

### Test Bot
1. Restart backend (`npm run dev`)
2. In Telegram, search for your bot
3. Send `/start`
4. Try `/slokje @username` (must register with Telegram username first!)

---

## Troubleshooting

### "Cannot connect to database"
- Check your Supabase URL is correct
- Verify your IP is allowed (Supabase → Settings → Database → Connection Pooling)
- Make sure migrations ran successfully

### "Port 3001 already in use"
```bash
# Kill the process
lsof -ti:3001 | xargs kill -9
```

### "Failed to fetch classes"
- Make sure backend is running
- Check browser console (F12) for errors
- Verify seed data was inserted

### "Invalid token"
- Clear localStorage in browser (F12 → Application → Local Storage → Clear)
- Try logging in again

---

## Next Steps

✅ You have a working MMORPG!

**Phase 2 features to build:**
- Turn-based combat system
- Inventory management
- Quests and leveling
- PvP duels
- Leaderboards

Check the main README.md for the full development roadmap!

---

## Need Help?

Open an issue on GitHub: https://github.com/KNLMN/Tales-of-SlokBot/issues

**Happy gaming! 🍺⚔️**
