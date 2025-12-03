# Yashu AI - Creative Chat Agent

A vibrant, personality-driven AI chat agent built with Cloudflare Agents SDK, Workers AI, and stateful memory. Meet **Yashu** - your creative AI companion that remembers your conversations and brings enthusiasm to every chat!

This project demonstrates how to create a conversational AI agent with a distinct personality using Cloudflare's serverless platform. Yashu uses Llama 3.3 via Workers AI for natural language understanding and generation, Durable Objects for persistent state management, and a beautiful web interface for seamless interaction.

## Features

- **AI-Powered Chat**: Uses Llama 3.3-8B-Instruct model via Cloudflare Workers AI
- **Stateful Memory**: Maintains conversation history using Durable Objects - Yashu remembers you!
- **Creative Personality**: Yashu has a vibrant, enthusiastic personality with humor and curiosity
- **Serverless**: Built entirely on Cloudflare Workers platform
- **Beautiful UI**: Modern, animated chat interface with gradient backgrounds and smooth animations
- **Context-Aware**: Remembers previous messages and builds on conversations naturally

## Requirements

- Node.js (v18 or higher)
- npm or yarn
- Cloudflare account with Workers AI enabled

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd cf-yashu-agent
```

2. Install dependencies:
```bash
npm install
```

## Development

Run the project locally:
```bash
npx wrangler dev
```

This will start a local development server. Open your browser to the URL shown in the terminal (typically `http://localhost:8787`).

## Deployment

Deploy to Cloudflare Workers:
```bash
npx wrangler deploy
```

After deployment, you'll receive a URL where Yashu is accessible. Share it with friends and let them chat with your AI agent!

## API Endpoint

### POST `/api/chat`

Send a chat message to Yashu.

**Request Body:**
```json
{
  "message": "Hello Yashu!",
  "agentId": "optional-agent-id"
}
```

**Response:**
```json
{
  "response": "Hey there! I'm Yashu, and I'm excited to chat with you! What's on your mind?"
}
```

**Error Response:**
```json
{
  "error": "Error message here"
}
```

## Frontend

The project includes a beautiful HTML/JavaScript frontend accessible at the root path (`/`). The interface features:

- **Animated gradient background** that shifts colors smoothly
- **Modern chat UI** with message bubbles and smooth animations
- **Typing indicators** to show when Yashu is thinking
- **Responsive design** that works on desktop and mobile
- **Real-time message display** with fade-in animations

The frontend uses plain JavaScript with no build step required. All files are served directly from the Worker.

## Project Structure

```
cf-yashu-agent/
  src/
    index.js          # Worker entry point and HTTP handler
    agent/
      YashuAgent.js   # Yashu agent class with chat method
  package.json        # Dependencies
  wrangler.toml       # Cloudflare Workers configuration
  README.md           # This file
  PROMPTS.md          # Documentation of prompts used
```

## Assignment Requirements

This project satisfies Cloudflare's optional AI assignment requirements:

- **LLM**: Uses Llama 3.3-8B-Instruct via Workers AI (`@cf/meta/llama-3.3-8b-instruct`)  
- **Memory/State**: Implements persistent state using Durable Objects via the Agents SDK  
- **User Input**: Provides chat interface via HTTP endpoint (`/api/chat`) and web UI  
- **Agents SDK**: Built using the Cloudflare Agents SDK (`npm i agents`)  
- **Deployable**: Can be deployed with `npx wrangler deploy`

## About Yashu

Yashu is designed to be:
- **Curious** - Loves learning and exploring new topics
- **Friendly** - Approachable and warm in conversations
- **Creative** - Thinks outside the box and offers unique perspectives
- **Humorous** - Not afraid to crack a joke or two
- **Context-Aware** - Remembers your conversations and builds on them

## Future Enhancements

Potential features to add:
- Multiple agent personalities
- Voice input/output
- Image generation integration
- Tool calling capabilities
- Personality stats dashboard
- Conversation export

## License

MIT

---

Built with Cloudflare Workers, Agents SDK, and Llama 3.3
