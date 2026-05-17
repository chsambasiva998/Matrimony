import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyANrr-2CJd4p7If61i7Z1u2dOJ3wTIRfJA",
  authDomain: "mangalasutram-ca576.firebaseapp.com",
  projectId: "mangalasutram-ca576",
  storageBucket: "mangalasutram-ca576.firebasestorage.app",
  messagingSenderId: "599413055123",
  appId: "1:599413055123:web:23a58e34409fe66b523766",
  measurementId: "G-0QETPPEFDF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
