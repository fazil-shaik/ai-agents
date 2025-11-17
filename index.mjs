// import "dotenv/config";
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { StateGraph } from "@langchain/langgraph";
// // import { Client as LangSmithClient } from "langsmith";

// import express from 'express'

// const application = express();


// application.get('/', async (req, res) => {
//   res.send('Hello World!')
// });

// application.get('/response', async (req, res) => {
//   const chunks = [];
//   req.on('data', chunk => {
//     chunks.push(chunk);
//   });
//   req.on('end', async () => {
//     const input = Buffer.concat(chunks).toString() || "Explain 7 wonders of the world in 200 charecters only.";

//     const result = await app.invoke({
//       input: input,
//     });

//     const formattedOutput = result.output
//       ?.trim()
//       ?.replace(/\n{2,}/g, "\n") // remove extra newlines
//       ?.replace(/\*\*(.*?)\*\*/g, (_, bold) => bold.toUpperCase()); // make bold text uppercase for readability

//     res.send(`<pre>${formattedOutput}</pre>`);
//   });
// })

// // Optional: Initialize LangSmith tracing (for visualization)
// // const client = new LangSmithClient({
// //   apiUrl: "https://api.smith.langchain.com",
// //   apiKey: process.env.LANGCHAIN_API_KEY || "",
// // });

// // client.setupTracing();
// // console.log("LangSmith tracing is set up.");

// // Create the Gemini model (must include model name)
// const llm = new ChatGoogleGenerativeAI({
//   apiKey: process.env.GOOGLE_API_KEY,
//   model: "gemini-2.5-flash",
// });

// // Node function (handles AI call)
// async function generateResponse(state) {
//   const userMessage = state.input || "Hello, who are you?";

//   const response = await llm.invoke([
//     {
//       role: "user",
//       content: userMessage,
//     },
//   ]);

//   // Gemini returns the text as `response.content[0].text`
//   const outputText =
//     response?.content?.[0]?.text ||
//     response?.text ||
//     "No response received from Gemini.";

//   return { output: outputText };
// }

// // Build LangGraph workflow
// const graph = new StateGraph({
//   channels: {
//     input: "string",
//     output: "string",
//   },
// })
//   .addNode("Generate", generateResponse)
//   .addEdge("__start__", "Generate")
//   .addEdge("Generate", "__end__");

// // Compile and execute
// const app = graph.compile();

// const result = await app.invoke({
//   input: "Explain 7 wonders of the world in 200 charecters only.",
// });

// const formattedOutput = result.output
//   ?.trim()
//   ?.replace(/\n{2,}/g, "\n") // remove extra newlines
//   ?.replace(/\*\*(.*?)\*\*/g, (_, bold) => bold.toUpperCase()); // make bold text uppercase for readability

// console.log("\n🤖 AI RESPONSE:\n");
// console.log(formattedOutput);
// console.log("\n-----------------------");

// // application.get('/', async (req, res) => {
// //   const result = await app.invoke({
// //     input: "Explain LangChain, LangGraph, and LangSmith with examples.",
// //   });

// //   const formattedOutput = result.output
// //     ?.trim()
// //     ?.replace(/\n{2,}/g, "\n") // remove extra newlines
// //     ?.replace(/\*\*(.*?)\*\*/g, (_, bold) => bold.toUpperCase()); // make bold text uppercase for readability

// //   res.send(`<pre>${formattedOutput}</pre>`);
// // })

// const PORT = process.env.PORT || 3000;
// application.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


import { StateGraph } from "langgraph";
import { lawyerAgent } from "./agents/lawyer.js";
import { witnessAgent } from "./agents/witness.js";
import { criminalAgent } from "./agents/criminal.js";
import { judgeAgent } from "./agents/judge.js";

export function buildCourtroomGraph() {
  const graph = new StateGraph()
    .addNode("LAWYER", lawyerAgent)
    .addNode("WITNESS", witnessAgent)
    .addNode("CRIMINAL", criminalAgent)
    .addNode("JUDGE", judgeAgent)

    .addEdge("LAWYER", "WITNESS")
    .addEdge("WITNESS", "CRIMINAL")
    .addEdge("CRIMINAL", "JUDGE")
    .addEdge("JUDGE", null); // end
  return graph.compile();
}
