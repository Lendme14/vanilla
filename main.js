// =================== FIREBASE CONFIG ===================
import { initializeApp } from "firebase/app";
import { getAuth, ... } from "firebase/auth";
import { getDatabase, ... } from "firebase/database";
import { getStorage, ... } from "firebase/storage";

const firebaseConfig = {
  // your config here
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

// =================== LOGIN LOGIC ===================
  // Firebase Signup
document.getElementById('signupForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('signupEmail').value;
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Save username in Firestore or Realtime DB
      const user = userCredential.user;
      return firebase.firestore().collection('users').doc(user.uid).set({
        username: username,
        email: email
      });
    })
    .then(() => {
      alert("Signup successful!");
      bootstrap.Modal.getInstance(document.getElementById('signupModal')).hide();
    })
    .catch(error => alert(error.message));
});

// Firebase Login
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("Login successful!");
      bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
    })
    .catch(error => alert(error.message));
});

function profilePageLogic() {
  // your profile code
  import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { auth, db } from "../firebase/firebase-config";

const user = auth.currentUser;
if (user) {
  const userRef = ref(db, 'users/' + user.uid);
  get(userRef).then((snapshot) => {
    if (snapshot.exists()) {
      const userData = snapshot.val();
      document.getElementById("username").innerText = userData.username;
      document.getElementById("avatar").src = userData.avatarUrl || 'default-avatar.png';
    }
  });
} else {
  window.location.href = "login.html"; // Redirect if no user is logged in
}

// Logout function
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "login.html"; // Redirect to login after logout
  }).catch((error) => {
    console.error("Error signing out: ", error);
  });
});

// Delete Account function
document.getElementById("deleteBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
    user.delete().then(() => {
      alert("Account deleted.");
      window.location.href = "signup.html"; // Redirect to signup page
    }).catch((error) => {
      console.error("Error deleting account: ", error);
    });
  }
});
}

function chatPageLogic() {
  // your chat page code
  import { getDatabase, ref, push, onChildAdded } from "firebase/database";
import { auth, db } from "../firebase/firebase-config";

const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// Send message function
sendBtn.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message) {
    const user = auth.currentUser;
    const messageRef = ref(db, 'chats/');
    push(messageRef, {
      userId: user.uid,
      username: user.displayName || user.email,
      message: message,
      timestamp: Date.now(),
    });

    messageInput.value = ""; // Clear the input field
  }
});

// Listen for new messages
const messageRef = ref(db, 'chats/');
onChildAdded(messageRef, (snapshot) => {
  const messageData = snapshot.val();
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  messageDiv.innerHTML = `<strong>${messageData.username}:</strong> ${messageData.message}`;
  chatBox.appendChild(messageDiv);
});
}

function voiceNoteLogic() {
  // voice recording/upload code
  let mediaRecorder;
let audioChunks = [];

// Start recording
document.getElementById("startRecordingBtn").addEventListener("click", () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);

        // Upload to Firebase Storage (audio will be in blob format)
        const storageRef = ref(storage, 'audio/' + Date.now() + '.wav');
        uploadBytes(storageRef, audioBlob).then(() => {
          alert("Audio uploaded!");
        });
      };
    });
});

// Stop recording
document.getElementById("stopRecordingBtn").addEventListener("click", () => {
  mediaRecorder.stop();
});
}

function pageLockProtection() {
  // lock redirect code if user is not authenticated
  import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";

// Lock page if not logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html"; // Redirect to login if not logged in
  }
});
}
// Simulated functions — replace with Firebase logic
function logout() {
  alert("Logged out!");
  window.location.href = "login.html";
}

function deleteAccount() {
  alert("Account permanently deleted.");
  window.location.href = "signup.html";
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  // Add Firebase login here
  alert(`Logged in as ${username}`);
  window.location.href = "profile.html";
});

document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;

  if (!/^[A-Za-z0-9]{6,12}$/.test(username)) {
    alert("Username must be 6 to 12 characters and contain only letters and numbers.");
    return;
  }

  // Add Firebase signup here
  alert(`Account created for ${username}`);
  window.location.href = "profile.html";
});

// firebase auth user ligic
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    if (user.emailVerified) {
      // User is verified, allow access
      console.log("Email is verified");
      // Show profile/chat
    } else {
      // Email not verified
      alert("Please verify your email before continuing.");
      document.getElementById("verifySection").style.display = "block";
      firebase.auth().signOut(); // Auto sign out for now
    }
  }
});

// verify your email 

document.getElementById("resendEmailBtn").addEventListener("click", () => {
  const user = firebase.auth().currentUser;
  if (user && !user.emailVerified) {
    user.sendEmailVerification()
      .then(() => {
        alert("Verification email sent. Please check your inbox.");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        alert("Something went wrong. Try again later.");
      });
  }
});
