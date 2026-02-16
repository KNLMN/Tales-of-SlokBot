# 🍺⚔️ Tales of SlokBot

A web-based MMORPG inspired by World of Warcraft, built for friends with a unique "slokjes" (penalty drinks) system integrated via Telegram.

## 🎮 Features

- **Character Creation**: Choose from 3 WoW-inspired classes (Warrior, Mage, Priest)
- **Turn-based Combat**: PvP duels, arena battles, and dungeons
- **Auto-battle Questing**: Complete quests automatically
- **Telegram Integration**: `/slokje @user` command and opt-in milestone sharing
- **Leaderboards**: Track XP, arena ratings, and slokjes
- **Inventory & Items**: Full item management system
- **Pixel Art Style**: Nostalgic WoW-inspired aesthetics

## 🏗️ Tech Stack

### Frontend
- **React 18** with Vite
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **TypeScript**
- **PostgreSQL** (via Supabase)
- **node-telegram-bot-api** for Telegram integration
- **JWT** for authentication

### Hosting (Free Tier)
- **Vercel** - Frontend hosting
- **Railway** - Backend hosting
- **Supabase** - Database + Authentication

## 📋 Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **VS Code** (recommended) ([Download](https://code.visualstudio.com/))
- **Supabase Account** (free) ([Sign up](https://supabase.com/))
- **Telegram Bot Token** ([BotFather guide](https://core.telegram.org/bots#6-botfather))

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/KNLMN/Tales-of-SlokBot.git
cd Tales-of-SlokBot
```

### 2. Setup Database (Supabase)

1. Create a new project on [Supabase](https://supabase.com/)
2. Go to SQL Editor and run the migration script:
   ```bash
   cat database/migrations/001_initial_schema.sql
   ```
3. Copy your database URL and anon key from Settings > API

### 3. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:
```env
# Database
DATABASE_URL=your_supabase_database_url
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this

# Telegram
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# Server
PORT=3001
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

Backend runs on `http://localhost:3001`

### 4. Setup Frontend

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Start frontend:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### 5. Seed Initial Data

```bash
cd backend
npm run seed
```

This creates the 3 starting classes in your database.

## 🎯 Development Roadmap

### ✅ Phase 1: Foundation (Current)
- [x] Project structure
- [x] Authentication system
- [x] Character creation
- [x] Database schema
- [x] Basic UI components

### 🚧 Phase 2: Core Gameplay (Next)
- [ ] Turn-based combat system
- [ ] Auto-battle for quests
- [ ] Inventory management
- [ ] Level/XP progression
- [ ] First dungeon

### 📅 Phase 3: Social Features
- [ ] Telegram bot integration
- [ ] Slokjes system
- [ ] Leaderboards
- [ ] PvP dueling
- [ ] Arena system

### 🎨 Phase 4: Polish
- [ ] Pixel art assets
- [ ] Animations
- [ ] Sound effects
- [ ] Mobile responsive
- [ ] Achievement system

## 📁 Project Structure

```
tales-of-slokbot/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── hooks/         # Custom React hooks
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── package.json
├── backend/               # Express backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Database models
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Business logic
│   │   └── telegram/      # Telegram bot
│   └── package.json
└── database/              # Database scripts
    ├── migrations/        # Schema migrations
    └── seeds/             # Seed data
```

## 🎮 Game Classes

### 🛡️ Warrior - "Tavern Brawler"
- **Role**: Tank / Melee DPS
- **Primary Stat**: Strength
- **Abilities**: Heroic Strike, Shield Block, Battle Shout

### 🔮 Mage - "Arcane Brewmaster"
- **Role**: Ranged DPS / Burst
- **Primary Stat**: Intellect
- **Abilities**: Frostbolt, Fireball, Arcane Intellect

### ✨ Priest - "Holy Bartender"
- **Role**: Healer / Support
- **Primary Stat**: Spirit
- **Abilities**: Flash Heal, Power Word: Shield, Smite

## 🤝 Contributing

This is a friends project, but suggestions are welcome! Feel free to open issues or submit PRs.

## 📜 License

MIT License - Built with ❤️ and 🍺 by the SlokBot crew

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### Database connection issues
- Verify your Supabase URL and keys
- Check if your IP is allowed in Supabase dashboard
- Ensure migrations have been run

### Telegram bot not responding
- Verify bot token is correct
- Ensure bot is started: `/start` in Telegram
- Check backend logs for errors

## 📞 Support

Questions? Open an issue or reach out to the team!

---

**Built with TypeScript, React, and way too many slokjes 🍺**
