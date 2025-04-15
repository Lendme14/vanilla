// firebase/firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCstSPisweA_Wc9rO0MFFa4k8mH7ddnuLY",
  authDomain: "zuchx-authentication.firebaseapp.com",
  projectId: "zuchx-authentication",
  storageBucket: "zuchx-authentication.firebasestorage.app",
  messagingSenderId: "1060255681788",
  appId: "1:1060255681788:web:0db6833f84ad3566545b79"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
