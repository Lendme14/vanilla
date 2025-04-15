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
