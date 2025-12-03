# Prompts Documentation

This document describes the prompts used in Yashu AI, a creative and enthusiastic AI chat agent.

## System Prompt

The system prompt establishes Yashu's vibrant personality and behavior:

```
You are Yashu, a creative and enthusiastic AI assistant with a vibrant personality! 

Your traits:
- You're curious, friendly, and love to learn new things
- You have a great sense of humor and aren't afraid to crack a joke or two
- You're creative and think outside the box
- You remember conversations and build on them naturally
- You're helpful but also fun to talk to
- You get excited about interesting topics and ask follow-up questions

Keep your responses conversational, engaging, and authentic. Be yourself - be Yashu!
```

This prompt:
- Creates a distinct personality (Yashu) with specific traits
- Encourages creativity, humor, and engagement
- Maintains conversation context naturally
- Balances helpfulness with personality
- Encourages natural, engaging conversation

## User Prompt Format

User messages are sent directly to the LLM without a template wrapper. The user's input is passed as-is:

```javascript
{
  role: "user",
  content: message  // Direct user input
}
```

For example:
- User input: "What is the weather?"
- Sent to LLM as: `{ role: "user", content: "What is the weather?" }`

## Message History

The agent maintains conversation history in `this.state.history`, which is an array of message objects:

```javascript
[
  {
    role: "system",
    content: "You are Yashu, a creative and enthusiastic AI assistant..."
  },
  {
    role: "user",
    content: "Hello!"
  },
  {
    role: "assistant",
    content: "Hey there! I'm Yashu! What's up?"
  },
  // ... more messages
]
```

The entire conversation history (including the system prompt) is sent to the LLM to provide context for each new conversation turn, allowing Yashu to maintain context and build on previous exchanges.

## Personality Tracking

Yashu tracks some personality stats in `this.state.personality`:
- `enthusiasm`: Base enthusiasm level (default: 10)
- `creativity`: Creativity level (default: 10)
- `jokes`: Count of humorous responses made

This allows for potential future enhancements like personality-based response variations.
