// src/firebaseConfig.js

// 1. Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 2. Your web app's Firebase configuration
// REPLACE THESE VALUES WITH YOURS FROM THE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyCGTr7AA_W2MRKM-MUjPXDPcXH2xlGDyGw",
  authDomain: "voting-system-29595.firebaseapp.com",
  projectId: "voting-system-29595",
  storageBucket: "voting-system-29595.firebasestorage.app",
  messagingSenderId: "540279324174",
  appId: "1:540279324174:web:2b1d40e6dddc761065065f",
  measurementId: "G-60478J7JND"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 4. Initialize Services
const auth = getAuth(app);      // Authentication
const db = getFirestore(app);   // Firestore Database

// 5. Export them to use in other files
export { auth, db };