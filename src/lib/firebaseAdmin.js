// src/lib/firebaseAdmin.js
import admin from "firebase-admin";

let isInitialized = false;

export function getAdmin() {
  if (!isInitialized) {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT missing");
    }

    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    isInitialized = true;
  }

  return admin;
}

// ✅ KEEP exporting admin (for legacy usage)
export { admin };

export async function verifyFirebaseToken(token) {
  const adminApp = getFirebaseAdmin();
  return await adminApp.auth().verifyIdToken(token);
}
