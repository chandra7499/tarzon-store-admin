import admin from "firebase-admin";

export function getAdmin() {
  // 🚫 Never allow browser usage
  if (typeof window !== "undefined") {
    return null;
  }

  // ✅ Reuse existing app if already initialized
  if (admin.apps.length > 0) {
    return admin.apps[0];
  }

  // 🔒 Ensure env vars exist
  if (
    !process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_CLIENT_EMAIL ||
    !process.env.FIREBASE_PRIVATE_KEY
  ) {
    throw new Error("Firebase Admin env vars missing");
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

export async function verifyFirebaseToken(token) {
  if (typeof window !== "undefined") return null;

  const adminApp = getAdmin();
  return adminApp.auth().verifyIdToken(token);
}
