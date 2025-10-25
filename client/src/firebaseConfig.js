// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";   // you forgot this import

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgrhmLgJkKcS0a8tXut3I9sLZKavDfcMc",
  authDomain: "civicsenseapp-d8ac6.firebaseapp.com",
  projectId: "civicsenseapp-d8ac6",
  storageBucket: "civicsenseapp-d8ac6.firebasestorage.app",
  messagingSenderId: "642834011133",
  appId: "1:642834011133:web:d2e783ff24393ca6b4ff94",
  measurementId: "G-DYV6FVLGLJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Initialize auth and firestore
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
// ✅ Export them for use in other files
export { app, auth, db, storage, analytics };