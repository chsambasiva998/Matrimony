// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANrr-2CJd4p7If61i7Z1u2dOJ3wTIRfJA",
  authDomain: "mangalasutram-ca576.firebaseapp.com",
  projectId: "mangalasutram-ca576",
  storageBucket: "mangalasutram-ca576.firebasestorage.app",
  messagingSenderId: "599413055123",
  appId: "1:599413055123:web:23a58e34409fe66b523766",
  measurementId: "G-0QETPPEFDF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

