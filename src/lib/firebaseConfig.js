import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

let app;
let auth;
let db;
let storage;

export function getFirebaseClient() {
  // 🚫 Never initialize Firebase during build or on server
  if (typeof window === "undefined") return null;

  if (!app) {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, // ✅ fixed
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    };

    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }

  if (!auth) auth = getAuth(app);
  if (!db) db = getFirestore(app);
  if (!storage) storage = getStorage(app);

  return { app, auth, db, storage };
}
