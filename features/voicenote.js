// features/voicenote.js

import { storage } from '../firebase/firebase-config.js';
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
        uploadBytes(audioRef, audioBlob).then(() => {
          alert("Audio uploaded!");
        });
      };
    });
});

stopRecordingBtn?.addEventListener("click", () => {
  if (mediaRecorder) mediaRecorder.stop();
});
