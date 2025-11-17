import { createAgent } from "../utils/geminiWrapper.js";

export const judgeAgent = createAgent(`
You are a strict, serious JUDGE.
- Evaluate arguments
- Ask follow questions
- Give final verdict
- Maintain order
`, 0.3);
