# 🛒 Shared Shopping List

A simple, persistent shopping list app for you and your wife to share across devices. Add items, mark them as bought, and celebrate with confetti! 🎉

## Features

- ✅ **Add items** - Quickly add things you need to buy
- ✅ **Mark as bought** - Check items off as you shop
- ✅ **Confetti celebration** - Automatic confetti animation when items arrive
- ✅ **Persistent storage** - Items saved and synced across devices
- ✅ **Simple & fast** - Clean, minimal interface

## Quick Start

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

### Option 1: Using Vercel KV (Recommended for quick setup)

1. Deploy to Vercel:
```bash
npx vercel
```

2. The app uses local file storage by default. To use Vercel KV for persistent, real-time sync:
   - Update `lib/storage.ts` to use Vercel KV instead of file storage
   - See comments in the file for integration details

### Option 2: Using Supabase (Better real-time experience)

1. Create a Supabase project and database
2. Update `lib/storage.ts` to use Supabase client
3. Deploy to Vercel as above

## Storage Options

The app currently uses **file-based storage** (stored in `/data/items.json`).

For production with multiple devices, consider upgrading to:

- **Vercel KV** - Built-in Redis for Vercel projects
- **Supabase** - PostgreSQL with real-time subscriptions  
- **Vercel Postgres** - PostgreSQL database on Vercel

The storage layer in `lib/storage.ts` is designed to be easily swappable.

## How It Works

1. **Add Item** - Type the item name and click "Add"
2. **Mark as Bought** - Click the checkbox next to an item
3. **Celebrate** - 🎉 Confetti fires when you mark something as bought!
4. **Archive** - Bought items move to the "Bought" section
5. **Delete** - Click the ✕ button to remove items

## Technical Stack

- **Frontend**: Next.js 14 + React + Tailwind CSS
- **Backend**: Next.js API Routes
- **Storage**: File-based (JSON) - easily upgradeable
- **Animations**: canvas-confetti
- **Styling**: Tailwind CSS

## Notes

- Items are shared in real-time on the same local network
- For multi-device sync across internet, upgrade to Supabase or Vercel KV
- The app currently syncs every 2 seconds

---

Happy shopping! 🛍️
