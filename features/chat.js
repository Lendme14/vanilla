// features/chat.js

import { auth, db } from '../firebase/firebase-config.js';
import { ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const messageRef = ref(db, 'chats');

sendBtn?.addEventListener("click", () => {
  const message = messageInput.value.trim();
  if (message) {
    push(messageRef, {
      userId: auth.currentUser.uid,
      username: auth.currentUser.email,
      message,
      timestamp: Date.now(),
    });
    messageInput.value = "";
  }
});

onChildAdded(messageRef, (snapshot) => {
  const data = snapshot.val();
  const div = document.createElement("div");
  div.classList.add("message");
  div.textContent = `${data.username}: ${data.message}`;
  chatBox.appendChild(div);
});
