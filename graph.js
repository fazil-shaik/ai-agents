import { StateGraph, Annotation } from "@langchain/langgraph";
import dotenv from "dotenv";
dotenv.config();
import express from 'express';
import { lawyerAgent } from "./src/agents/lawyers.js";
import { witnessAgent } from "./src/agents/witness.js";
import { criminalAgent } from "./src/agents/criminal.js";
import { judgeAgent } from "./src/agents/judge.js";
import {} from 'langsmith'
const courtroomCase = `
A man is accused of stealing a diamond necklace.
CCTV is blurry.
Witness says she saw him running.
Criminal denies everything.
`;

const application = express();

const CourtroomState = Annotation.Root({
  input: Annotation(),
  history: Annotation(),
  output: Annotation(),

});

const graph = new StateGraph(CourtroomState)
  .addNode("LAWYER", lawyerAgent)
  .addNode("WITNESS", witnessAgent)
  .addNode("CRIMINAL", criminalAgent)
  .addNode("JUDGE", judgeAgent)

  .addEdge("LAWYER", "WITNESS")
  .addEdge("WITNESS", "CRIMINAL")
  .addEdge("CRIMINAL", "JUDGE")
  .addEdge("JUDGE", "__end__"); 


graph.addEdge("__start__", "LAWYER");

const app = graph.compile();

async function run() {
  console.log("AI Courtroom\n");

  const result = await app.invoke({
    input: courtroomCase,
    history: "as accused or named criminal doesnt have any prior convictions.or any criminal record.",
  });

  console.log("\n------ FINAL VERDICT ------\n");
  console.log(result.output);
}

run();


application.get('/', async (req, res) => {
  const result = await app.invoke({
    input: courtroomCase,
    history: "as accused or named criminal doesnt have any prior convictions.or any criminal record.",
  });

  res.send(`<pre>${result.output}</pre>`);
})

const PORT = process.env.PORT || 3000;
application.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});