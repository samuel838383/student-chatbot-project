let currentChatId = null;

// Send message
function sendMessage() {
  let input = document.getElementById("user-input");
  let message = input.value.trim();

  if (message === "") return;

  // If no chat selected → create new chat with title
  if (!currentChatId) {
    createNewChat(message);
  }

  addMessage("user", message);
  input.value = "";

  let typing = addTyping();

  setTimeout(() => {
    typing.remove();

    let response = getBotResponse(message);
    addMessage("bot", response);

  }, 800);
}

// Typing effect
function addTyping() {
  let div = document.createElement("div");
  div.className = "bot";
  div.innerText = "Bot is typing...";
  document.getElementById("chat-box").appendChild(div);
  return div;
}

// Add message
function addMessage(sender, text) {
  let chatBox = document.getElementById("chat-box");

  let div = document.createElement("div");
  div.className = sender;
  div.innerText = text;

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;

  let chats = JSON.parse(localStorage.getItem("chats")) || [];
  let chat = chats.find(c => c.id === currentChatId);

  if (chat) {
    chat.messages.push({ sender, text });
    localStorage.setItem("chats", JSON.stringify(chats));
  }
}

// 🧠 Rule-based bot
function getBotResponse(input) {
  input = input.toLowerCase();

  if (input.includes("hi") || input.includes("hello")) {
    return "Hello! How can I assist you?";
  }
  else if (input.includes("ai")) {
    return "AI stands for Artificial Intelligence.";
  }
  else if (input.includes("course")) {
    return "We offer AI, ML, and Web Development courses.";
  }
  else if (input.includes("exam")) {
    return "Exams are conducted at the end of semester.";
  }
  else if (input.includes("attendance")) {
    return "Minimum 75% attendance is required.";
  }
  else {
    return "I didn't understand. Try asking about AI, courses, or exams.";
  }
}

// 🆕 Create new chat WITH TITLE
function createNewChat(firstMessage = "New Chat") {
  let chats = JSON.parse(localStorage.getItem("chats")) || [];

  let newChat = {
    id: Date.now(),
    title: firstMessage.substring(0, 20), // limit length
    messages: []
  };

  chats.push(newChat);
  localStorage.setItem("chats", JSON.stringify(chats));

  loadChatList();
  loadChat(newChat.id);
}

// Load chat list (sidebar)
function loadChatList() {
  let chatList = document.getElementById("chat-list");
  chatList.innerHTML = "";

  let chats = JSON.parse(localStorage.getItem("chats")) || [];

  chats.forEach(chat => {
    let div = document.createElement("div");

    div.innerHTML = `
      ${chat.title || "Chat"}
      <span style="float:right; cursor:pointer;">❌</span>
    `;

    div.onclick = () => loadChat(chat.id);

    div.querySelector("span").onclick = (e) => {
      e.stopPropagation();
      deleteChat(chat.id);
    };

    chatList.appendChild(div);
  });
}

// Delete chat
function deleteChat(id) {
  let chats = JSON.parse(localStorage.getItem("chats")) || [];

  chats = chats.filter(c => c.id !== id);
  localStorage.setItem("chats", JSON.stringify(chats));

  loadChatList();

  if (chats.length > 0) {
    loadChat(chats[0].id);
  } else {
    currentChatId = null;
    document.getElementById("chat-box").innerHTML = "";
  }
}

// Load selected chat
function loadChat(id) {
  currentChatId = id;

  let chats = JSON.parse(localStorage.getItem("chats")) || [];
  let chat = chats.find(c => c.id === id);

  let chatBox = document.getElementById("chat-box");
  chatBox.innerHTML = "";

  chat.messages.forEach(msg => {
    let div = document.createElement("div");
    div.className = msg.sender;
    div.innerText = msg.text;
    chatBox.appendChild(div);
  });
}

// Dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// Enter key
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("user-input").addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
  });
});

// Init
window.onload = () => {
  loadChatList();

  let chats = JSON.parse(localStorage.getItem("chats")) || [];

  if (chats.length > 0) {
    loadChat(chats[0].id);
  }
};