// auth/signup.js

import { auth, db } from '../firebase/firebase-config.js';
import { createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const signupForm = document.getElementById('signupForm');

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signupEmail.value;
    const username = signupUsername.value;
    const password = signupPassword.value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCred) => {
        const user = userCred.user;
        return set(ref(db, `users/${user.uid}`), { username, email });
      })
      .then(() => sendEmailVerification(auth.currentUser))
      .then(() => {
        alert("Signup successful! Please verify your email.");
      })
      .catch(error => {
        console.error("Signup error:", error);
        alert("Could not complete signup. Please try again.");
      });
  });
}
