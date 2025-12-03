import { Agent, callable } from "agents";

export class YashuAgent extends Agent {
  onStart() {
    // Initialize with a fun personality counter
    if (!this.state.personality) {
      this.setState({
        personality: {
          enthusiasm: 10,
          creativity: 10,
          jokes: 0
        }
      });
    }
  }

  @callable()
  async chat(message) {
    // Read previous messages from state, default to empty array
    const history = this.state.history || [];
    const personality = this.state.personality || { enthusiasm: 10, creativity: 10, jokes: 0 };

    // Creative system prompt with personality
    const systemPrompt = `You are Yashu, a creative and enthusiastic AI assistant with a vibrant personality! 

Your traits:
- You're curious, friendly, and love to learn new things
- You have a great sense of humor and aren't afraid to crack a joke or two
- You're creative and think outside the box
- You remember conversations and build on them naturally
- You're helpful but also fun to talk to
- You get excited about interesting topics and ask follow-up questions

Keep your responses conversational, engaging, and authentic. Be yourself - be Yashu!`;

    // Prepare messages array for LLM
    const messages = [
      {
        role: "system",
        content: systemPrompt
      },
      ...history,
      {
        role: "user",
        content: message
      }
    ];

    // Call Workers AI with Llama 3.3
    const { response } = await this.env.AI.run(
      "@cf/meta/llama-3.3-8b-instruct",
      { messages }
    );

    // Track if response contains humor (simple check)
    const hasJoke = response.toLowerCase().includes('joke') || 
                    response.toLowerCase().includes('funny') ||
                    response.toLowerCase().includes('haha') ||
                    response.toLowerCase().includes('lol');

    // Append new user and assistant messages to history
    const updatedHistory = [
      ...history,
      {
        role: "user",
        content: message
      },
      {
        role: "assistant",
        content: response
      }
    ];

    // Update personality stats
    const updatedPersonality = {
      ...personality,
      jokes: hasJoke ? personality.jokes + 1 : personality.jokes
    };

    // Persist updated history and personality to state
    this.setState({ 
      history: updatedHistory,
      personality: updatedPersonality
    });

    // Return the assistant response
    return response;
  }

  @callable()
  async getStats() {
    return {
      messageCount: (this.state.history || []).length / 2, // Divide by 2 since each exchange is 2 messages
      personality: this.state.personality || { enthusiasm: 10, creativity: 10, jokes: 0 }
    };
  }
}
