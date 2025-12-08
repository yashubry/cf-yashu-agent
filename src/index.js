import { YashuAgent } from "./agent/YashuAgent.js";

// Export the Durable Object class for Wrangler
export { YashuAgent };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle /api/chat POST endpoint using AgentNamespace
    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const { message } = await request.json();
        
        if (!message) {
          return new Response(
            JSON.stringify({ error: "Message is required" }),
            { 
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          );
        }

        // Create agent instance with fixed ID using AgentNamespace pattern
        const agentId = env.YashuAgent.idFromName("yashu");
        const agent = env.YashuAgent.get(agentId);
        
        // Call the chat method
        const response = await agent.chat(message);

        return new Response(
          JSON.stringify({ response }),
          {
            headers: { "Content-Type": "application/json" }
          }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
    }

    // Serve index.html for root path
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(htmlContent, {
        headers: { "Content-Type": "text/html" }
      });
    }

    // Serve index.js
    if (url.pathname === "/index.js") {
      return new Response(jsContent, {
        headers: { "Content-Type": "application/javascript" }
      });
    }

    return new Response("Not Found", { status: 404 });
  }
};

// HTML content for index.html
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yashu AI - Creative Chat Agent</title>
  <style>
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
      background-size: 400% 400%;
      animation: gradient 15s ease infinite;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .chat-container {
      width: 100%;
      max-width: 900px;
      height: 90vh;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 30px;
      box-shadow: 0 25px 80px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }
    .chat-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      color: white;
      padding: 25px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .chat-header::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: float 6s ease-in-out infinite;
    }
    .chat-header h1 {
      margin-bottom: 8px;
      font-size: 2em;
      position: relative;
      z-index: 1;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
    .chat-header p {
      position: relative;
      z-index: 1;
      opacity: 0.95;
      font-size: 0.9em;
    }
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 25px;
      background: linear-gradient(to bottom, #f8f9fa, #ffffff);
    }
    .chat-messages::-webkit-scrollbar {
      width: 8px;
    }
    .chat-messages::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    .chat-messages::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 10px;
    }
    .message {
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
      animation: fadeIn 0.3s ease-in;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .message.user {
      align-items: flex-end;
    }
    .message.assistant {
      align-items: flex-start;
    }
    .message-bubble {
      max-width: 75%;
      padding: 14px 20px;
      border-radius: 20px;
      word-wrap: break-word;
      line-height: 1.5;
      position: relative;
    }
    .message.user .message-bubble {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }
    .message.assistant .message-bubble {
      background: white;
      color: #333;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      border: 1px solid rgba(102, 126, 234, 0.1);
    }
    .typing-indicator {
      display: none;
      padding: 14px 20px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    .typing-indicator.active {
      display: inline-block;
    }
    .typing-dots {
      display: inline-flex;
      gap: 4px;
    }
    .typing-dots span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #667eea;
      animation: pulse 1.4s ease-in-out infinite;
    }
    .typing-dots span:nth-child(2) {
      animation-delay: 0.2s;
    }
    .typing-dots span:nth-child(3) {
      animation-delay: 0.4s;
    }
    .chat-input-container {
      padding: 20px 25px;
      background: white;
      border-top: 2px solid rgba(102, 126, 234, 0.1);
      display: flex;
      gap: 12px;
      align-items: center;
    }
    #messageInput {
      flex: 1;
      padding: 14px 20px;
      border: 2px solid #e0e0e0;
      border-radius: 30px;
      font-size: 16px;
      outline: none;
      transition: all 0.3s ease;
      font-family: inherit;
    }
    #messageInput:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      transform: translateY(-2px);
    }
    #sendButton {
      padding: 14px 35px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 30px;
      cursor: pointer;
      font-size: 16px;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    #sendButton:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
    #sendButton:active:not(:disabled) {
      transform: translateY(0);
    }
    #sendButton:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  </style>
</head>
<body>
  <div class="chat-container">
    <div class="chat-header">
      <h1>Yashu AI</h1>
      <p>Your Creative AI Companion - Powered by Llama 3.3 on Cloudflare</p>
    </div>
    <div class="chat-messages" id="messages">
      <div class="typing-indicator" id="typingIndicator">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
    <div class="chat-input-container">
      <input type="text" id="messageInput" placeholder="What's on your mind? Let's chat!" />
      <button id="sendButton">Send</button>
    </div>
  </div>
  <script src="/index.js"></script>
</body>
</html>`;

// JavaScript content for index.js
const jsContent = `const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const typingIndicator = document.getElementById('typingIndicator');

function showTyping() {
  typingIndicator.classList.add('active');
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function hideTyping() {
  typingIndicator.classList.remove('active');
}

function addMessage(role, content) {
  hideTyping();
  const messageDiv = document.createElement('div');
  messageDiv.className = \`message \${role}\`;
  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.textContent = content;
  messageDiv.appendChild(bubble);
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  addMessage('user', message);
  messageInput.value = '';
  sendButton.disabled = true;
  sendButton.textContent = 'Sending...';
  showTyping();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    if (data.error) {
      addMessage('assistant', \`Oops! \${data.error}\`);
    } else {
      addMessage('assistant', data.response);
    }
  } catch (error) {
    addMessage('assistant', \`Hmm, something went wrong: \${error.message}\`);
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = 'Send';
    messageInput.focus();
  }
}

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Fun initial greetings
const greetings = [
  "Hey there! I'm Yashu, your creative AI companion! What would you like to explore today?",
  "Hello! I'm Yashu, and I'm excited to chat with you! What's on your mind?",
  "Hi! I'm Yashu, ready to dive into some interesting conversations! What should we talk about?"
];

const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
addMessage('assistant', randomGreeting);
`;

