// src/lib/firebaseAdmin.js
import admin from "firebase-admin";

const initializeFirebaseAdmin = () => {
  if (!admin.apps.length) {
    // Use ONLY environment variables - no dynamic imports
    if (!process.env.FIREBASE_ADMIN_KEY) {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT environment variable is missing. ' +
        'It should contain the entire service account JSON as a string.'
      );
    }

    try {
    
        const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT:', error);
      throw error;
    }
  }
  return admin;
};

// Initialize immediately
initializeFirebaseAdmin();


export async function verifyFirebaseToken(token) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken; // contains uid, email, custom claims (role)
  } catch (error) {
    console.error("Token verification failed:", error);
    throw new Error("Invalid or expired token");
  }
}

export { admin };