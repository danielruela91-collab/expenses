import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get, onValue, remove } from 'firebase/database'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
}

let app: any = null
let db: any = null

export function initFirebase() {
  if (app) return { app, db }

  if (!firebaseConfig.projectId) {
    console.warn('Firebase config not set. Using localStorage only.')
    return { app: null, db: null }
  }

  app = initializeApp(firebaseConfig)
  db = getDatabase(app)
  return { app, db }
}

export function getFirebaseDb() {
  if (!db) {
    const { db: database } = initFirebase()
    db = database
  }
  return db
}

export function isFirebaseConfigured() {
  return !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
}

export { ref, set, get, onValue, remove }
export { getDatabase }
