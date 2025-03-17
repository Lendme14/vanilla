function sendMessage() {
    var msg = document.getElementById("message").value;
    if (msg.trim() === "") return;
  
    var chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += "<p><b>You:</b> " + msg + "</p>";
  
    document.getElementById("message").value = "";
}
