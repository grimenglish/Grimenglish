import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBOilDrnpuaTuu0U8YaEnJou2viYQKwMLE",
  authDomain: "grimenglish1.firebaseapp.com",
  projectId: "grimenglish1",
  storageBucket: "grimenglish1.firebasestorage.app",
  messagingSenderId: "324834382601",
  appId: "1:324834382601:web:51d1158ca1f956d8c3f9d8",
  measurementId: "G-J9D8BH0HN6"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();