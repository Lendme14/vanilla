
// =================== FIREBASE CONFIG ===================

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
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

// ================= Auth.js and verification logic ================

import { auth, db } from './firebase/firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Signup
document.getElementById('signupForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = signupEmail.value;
  const username = signupUsername.value;
  const password = signupPassword.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCred) => {
      const user = userCred.user;
      set(ref(db, 'users/' + user.uid), {
        username,
        email
      });
      sendEmailVerification(user).then(() => {
        alert("Signup successful! Check your email to verify.");
      });
    })
    .catch(error => alert(error.message));
});

// Login
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = loginEmail.value;
  const password = loginPassword.value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login successful!");
      window.location.href = "profile.html";
    })
    .catch(error => alert(error.message));
});

// Resend Email Verification
document.getElementById("resendEmailBtn")?.addEventListener("click", () => {
  if (auth.currentUser && !auth.currentUser.emailVerified) {
    sendEmailVerification(auth.currentUser)
      .then(() => alert("Verification email sent."))
      .catch((err) => alert("Error: " + err.message));
  }
});

// Auth State
onAuthStateChanged(auth, (user) => {
  if (user && !user.emailVerified) {
    alert("Please verify your email first.");
    signOut(auth);
    document.getElementById("verifySection").style.display = "block";
  }
});

//=================== profile.js logic =============================

import { auth, db } from './firebase/firebase-config.js';
import {
  onAuthStateChanged,
  signOut,
  deleteUser
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Redirect if not logged in
onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "login.html";
  else {
    const userRef = ref(db, 'users/' + user.uid);
    get(userRef).then(snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        username.innerText = data.username;
      }
    });
  }
});

logoutBtn?.addEventListener('click', () => {
  signOut(auth).then(() => window.location.href = "login.html");
});

deleteBtn?.addEventListener('click', () => {
  if (confirm("Are you sure you want to delete your account?")) {
    deleteUser(auth.currentUser)
      .then(() => {
        alert("Account deleted.");
        window.location.href = "signup.html";
      })
      .catch(err => console.error("Delete failed:", err));
  }
});

//=========================== chat.js logic =====================



//===================== voicenote.js logic ======================

import { storage } from './firebase/firebase-config.js';
import { ref, uploadBytes } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";

let mediaRecorder;
let audioChunks = [];

startRecordingBtn?.addEventListener("click", () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();

      mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioRef = ref(storage, 'audio/' + Date.now() + '.wav');
        uploadBytes(audioRef, audioBlob).then(() => alert("Audio uploaded!"));
      };
    });
});

stopRecordingBtn?.addEventListener("click", () => {
  mediaRecorder.stop();
});

//===================== input more logics below =====================
