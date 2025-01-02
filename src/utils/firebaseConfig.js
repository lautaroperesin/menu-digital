import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCkji_L91mohFNgQaqoVlsEj6rxDtYhzA4",
    authDomain: "menu-digital-dc36c.firebaseapp.com",
    projectId: "menu-digital-dc36c",
    storageBucket: "menu-digital-dc36c.firebasestorage.app",
    messagingSenderId: "969176882817",
    appId: "1:969176882817:web:8bcb5d6df6061e7b613780",
    measurementId: "G-S90D50W0ZX"
  };
  

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
