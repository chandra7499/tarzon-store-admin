import admin from "firebase-admin";

let isInitialized = false;

export function getAdmin() {
  if (!isInitialized) {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT missing");
    }

    // 1. Parse the JSON string
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    // 2. FIX: Replace literal \n with actual newlines to fix the Decoder error
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    isInitialized = true;
  }

  return admin;
}

// Keep your existing exports
export { admin };

export async function verifyFirebaseToken(token) {
  const adminApp = getAdmin(); // Ensure you call getAdmin() here, not getFirebaseAdmin() which might be undefined in your snippet
  return await adminApp.auth().verifyIdToken(token);
}