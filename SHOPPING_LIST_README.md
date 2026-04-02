# 🛒 Shopping List App

A shared shopping list app for street shopping between you and your wife.

## Features

- ✅ Add items to your shopping list
- ✅ Mark items as bought (with confetti celebration!)
- ✅ Dark mode UI
- ✅ Portuguese language
- ✅ Cross-device sync with Firebase (optional)
- ✅ Fallback to localStorage when Firebase is not available

## Setup

### Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Firebase Setup (for cross-device sync)

To enable syncing between multiple devices:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing one)
3. Enable **Realtime Database** in the project
4. Set database rules to:
   ```json
   {
     "rules": {
       "items": {
         ".read": true,
         ".write": true
       }
     }
   }
   ```
5. Copy your Firebase project settings
6. Create `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
   ```
7. Restart the development server

### Without Firebase

The app works perfectly with localStorage only (single device). Simply don't configure Firebase environment variables.

## Deployment

The app is deployed on Vercel. To deploy with Firebase sync:

1. Add your Firebase environment variables to Vercel project settings
2. Push to the branch connected to Vercel

## Database Structure

When using Firebase, items are stored in the following structure:

```
items/
  ├── item_id_1
  │   ├── id: "timestamp"
  │   ├── name: "Milk"
  │   ├── done: false
  │   └── createdAt: 1706123456
  └── item_id_2
      ├── id: "timestamp"
      ├── name: "Bread"
      ├── done: true
      └── createdAt: 1706123457
```

## Usage

1. Type an item name and press "Add" or Enter
2. Click the checkbox to mark as bought (confetti! 🎉)
3. Click the X to delete an item
4. Use "Limpar comprados" to clear all bought items

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Firebase Realtime Database (optional)
- canvas-confetti
