// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOfaQOCCz6bbUX5j6SWzttqxQntOnUZ3o",
  authDomain: "forum-46ff0.firebaseapp.com",
  projectId: "forum-46ff0",
  storageBucket: "forum-46ff0.firebasestorage.app",
  messagingSenderId: "837009177984",
  appId: "1:837009177984:web:d34c6abb78bbdc2e251565",
  measurementId: "G-0JNDVZ5Q1V"
};

const app = initializeApp(firebaseConfig);

// Export the services so your app can use them
export const auth = getAuth(app);
export const db = getFirestore(app);