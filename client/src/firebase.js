// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuOexMocs6HJEcm-N6RXHVweRJXENRN8o",
  authDomain: "dupesogs.firebaseapp.com",
  projectId: "dupesogs",
  storageBucket: "dupesogs.firebasestorage.app",
  messagingSenderId: "1077971599583",
  appId: "1:1077971599583:web:2ea1b38df03b976f2ea96a",
  measurementId: "G-CZE2C6Z63S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };