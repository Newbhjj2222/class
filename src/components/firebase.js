import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDyfRYol2H7jL1HbQNnkyU4v9BfvagDBoU",
  authDomain: "sample-fad00.firebaseapp.com",
  projectId: "sample-fad00",
  storageBucket: "sample-fad00.firebasestorage.app",
  messagingSenderId: "1003375658787",
  appId: "1:1003375658787:web:8260a5730e1d2defd06e96",
  measurementId: "G-34DLBVG3NQ"
};

// ✅ Re-use existing Firebase app if already initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Analytics (only in browser)
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
