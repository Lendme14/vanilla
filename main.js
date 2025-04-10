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
function loginPageLogic() {
  // your login code
  import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase-config";

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Logged in as:", user.email);
      window.location.href = "chat.html"; // Redirect to chat page
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Login error:", errorCode, errorMessage);
      alert("Failed to log in: " + errorMessage);
    });
});
}

function signupPageLogic() {
  // your signup code
  import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { auth, db } from "../firebase/firebase-config";

const signupForm = document.getElementById("signupForm");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User created:", user.email);

      // Save user data in Firebase Realtime Database
      const userRef = ref(db, 'users/' + user.uid);
      set(userRef, {
        username: username,
        avatarUrl: "",  // Initially empty, can be updated later
      });

      window.location.href = "profile.html"; // Redirect to profile page after signup
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Signup error:", errorCode, errorMessage);
      alert("Failed to sign up: " + errorMessage);
    });
});
}

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
