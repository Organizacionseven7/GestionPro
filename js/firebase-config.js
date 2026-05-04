// ============================================================
//  PASO 1: PEGÁ ACÁ TU CONFIGURACIÓN DE FIREBASE
//  (te explico cómo obtenerla en el README)
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-lite.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

export const firebaseConfig = {
  apiKey: "AIzaSyA9fdyJ-uqKHZLjlG7R9gTcYGI6nS6hmKU",
  authDomain: "app-gestion-80f35.firebaseapp.com",
  projectId: "app-gestion-80f35",
  storageBucket: "app-gestion-80f35.firebasestorage.app",
  messagingSenderId: "763074798840",
  appId: "1:763074798840:web:ecf5cfa3889fcb0ccac70d",
  measurementId: "G-7VK616WEFF"
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
