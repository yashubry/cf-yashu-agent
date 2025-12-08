import { YashuAgent } from "./agent/YashuAgent.js";

// Export the Durable Object class for Wrangler
export { YashuAgent };

// Force rebuild - latest commit: 4feb4fe

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle /api/chat POST endpoint
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

        // Create agent instance with fixed ID
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
      50% { opacity: 0.5; }
    }
    @keyframes slideIn {
      from { 
        opacity: 0; 
        transform: translateY(15px) scale(0.95); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0) scale(1); 
      }
    }
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
      background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #4facfe);
      background-size: 400% 400%;
      animation: gradient 20s ease infinite;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 15px;
    }
    .chat-container {
      width: 100%;
      max-width: 950px;
      height: 92vh;
      max-height: 900px;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      box-shadow: 0 30px 100px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.5);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .chat-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      color: white;
      padding: 28px 30px;
      text-align: center;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .chat-header::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
      animation: float 8s ease-in-out infinite;
    }
    .chat-header::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
      animation: shimmer 3s infinite;
    }
    .chat-header h1 {
      margin-bottom: 6px;
      font-size: 2.2em;
      font-weight: 700;
      position: relative;
      z-index: 1;
      text-shadow: 0 2px 10px rgba(0,0,0,0.2);
      letter-spacing: -0.5px;
    }
    .chat-header p {
      position: relative;
      z-index: 1;
      opacity: 0.95;
      font-size: 0.95em;
      font-weight: 400;
      letter-spacing: 0.3px;
    }
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 30px;
      background: linear-gradient(to bottom, #fafbfc, #ffffff);
      scroll-behavior: smooth;
    }
    .chat-messages::-webkit-scrollbar {
      width: 6px;
    }
    .chat-messages::-webkit-scrollbar-track {
      background: transparent;
    }
    .chat-messages::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 10px;
    }
    .chat-messages::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #5568d3, #653a91);
    }
    .message {
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
      animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .message.user {
      align-items: flex-end;
    }
    .message.assistant {
      align-items: flex-start;
    }
    .message-bubble {
      max-width: 78%;
      padding: 16px 22px;
      border-radius: 22px;
      word-wrap: break-word;
      word-break: break-word;
      line-height: 1.6;
      position: relative;
      font-size: 15.5px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .message.user .message-bubble {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.35), 0 2px 8px rgba(102, 126, 234, 0.2);
      border-bottom-right-radius: 6px;
    }
    .message.assistant .message-bubble {
      background: white;
      color: #2d3748;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04);
      border-bottom-left-radius: 6px;
    }
    .typing-indicator {
      display: none;
      padding: 16px 22px;
      background: white;
      border-radius: 22px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      margin-bottom: 16px;
      border-bottom-left-radius: 6px;
      width: fit-content;
    }
    .typing-indicator.active {
      display: inline-block;
      animation: slideIn 0.3s ease-out;
    }
    .typing-dots {
      display: inline-flex;
      gap: 5px;
      align-items: center;
    }
    .typing-dots span {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #667eea;
      animation: pulse 1.5s ease-in-out infinite;
      display: inline-block;
    }
    .typing-dots span:nth-child(2) {
      animation-delay: 0.2s;
    }
    .typing-dots span:nth-child(3) {
      animation-delay: 0.4s;
    }
    .chat-input-container {
      padding: 22px 28px;
      background: white;
      border-top: 1px solid rgba(102, 126, 234, 0.12);
      display: flex;
      gap: 14px;
      align-items: center;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.03);
    }
    #messageInput {
      flex: 1;
      padding: 16px 22px;
      border: 2px solid #e2e8f0;
      border-radius: 24px;
      font-size: 15.5px;
      outline: none;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: inherit;
      background: #f8f9fa;
      color: #2d3748;
    }
    #messageInput::placeholder {
      color: #a0aec0;
    }
    #messageInput:focus {
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1), 0 2px 8px rgba(102, 126, 234, 0.15);
      transform: translateY(-1px);
    }
    #sendButton {
      padding: 16px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 24px;
      cursor: pointer;
      font-size: 15.5px;
      font-weight: 600;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.35);
      letter-spacing: 0.3px;
      min-width: 90px;
    }
    #sendButton:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(102, 126, 234, 0.45);
      background: linear-gradient(135deg, #5568d3 0%, #653a91 100%);
    }
    #sendButton:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
    }
    #sendButton:disabled {
      opacity: 0.65;
      cursor: not-allowed;
      transform: none;
      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
    }
    @media (max-width: 768px) {
      body {
        padding: 10px;
      }
      .chat-container {
        height: 95vh;
        border-radius: 20px;
      }
      .chat-header {
        padding: 20px;
      }
      .chat-header h1 {
        font-size: 1.8em;
      }
      .chat-header p {
        font-size: 0.85em;
      }
      .chat-messages {
        padding: 20px;
      }
      .message-bubble {
        max-width: 85%;
        padding: 14px 18px;
        font-size: 15px;
      }
      .chat-input-container {
        padding: 18px 20px;
      }
      #messageInput {
        padding: 14px 18px;
        font-size: 15px;
      }
      #sendButton {
        padding: 14px 24px;
        font-size: 15px;
        min-width: 80px;
      }
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
      <input type="text" id="messageInput" placeholder="What's on your mind? Let's chat!" autocomplete="off" />
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

