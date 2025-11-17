import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";
dotenv.config();
export function createAgent(systemPrompt, temperature = 0.7,markdown=true) {
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature,
    apiKey: process.env.GEMINI_API_KEY,
  });

  return async (state) => {
    console.log("[geminiWrapper] Agent invoked. systemPrompt snippet:", systemPrompt.slice(0, 60));
    const prompt = `
${systemPrompt}

CASE DETAILS:
${state.input}

CONTEXT SO FAR:
${state.history ?? ""}

Stay fully in character.
`;

    try {
      const response = await llm.invoke(prompt);
      const titleLine = systemPrompt.split('\n').find((l) => l.trim())?.trim() ?? "agent";
      
      // Handle AIMessage structure from Gemini
      let text = response?.kwargs?.content || response?.content || "";
      
      if (!text || text.trim() === "") {
        text = `<<NO_RESPONSE from ${titleLine}>>`;
      }
      
      return {
        output: text,
        history: `${state.history}\n\n${titleLine}:\n${text}`,
      };
    } catch (err) {
      console.error("[geminiWrapper] LLM error:", err?.message ?? err);
      return { 
        output: `<<LLM_ERROR: ${err?.message ?? err}>>`,
        history: `${state.history}\n\n[Error]: ${err?.message ?? err}`,
      };
    }
  };
}
