# AI Courtroom - LangGraph + Gemini

An interactive AI-powered courtroom simulation using LangChain, LangGraph, and Google's Gemini API. Multiple AI agents assume different roles (Lawyer, Witness, Criminal, Judge) to conduct a realistic trial scenario.

## 🎭 Overview

This application simulates a courtroom proceedings where different AI agents interact with each other:
- **Lawyer**: Aggressive and logical defense counsel
- **Witness**: Nervous and emotional witness providing testimony
- **Criminal**: The accused, defensive and nervous
- **Judge**: Strict, serious, and authoritative court judge

The agents communicate sequentially through a state graph, building context as the trial progresses.

## 📁 Project Structure

```
Langchain/
├── graph.js                 # Main application entry point with LangGraph setup
├── index.mjs               # Alternative entry point
├── package.json            # Project dependencies and scripts
├── .env                    # Environment variables (GEMINI_API_KEY)
├── README.md              # This file
└── src/
    ├── agents/            # AI agent implementations
    │   ├── lawyers.js     # Lawyer agent with aggressive defense strategy
    │   ├── witness.js     # Witness agent with emotional testimony
    │   ├── criminal.js    # Criminal agent (the accused)
    │   └── judge.js       # Judge agent ruling and verdict
    └── utils/
        ├── geminiWrapper.js  # Wrapper for Google Gemini API integration
        └── runCourtroom.js   # Courtroom execution utilities
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Google Gemini API key

### Installation

1. **Clone and Navigate to the project**
   ```bash
   git clone https://github.com/fazil-shaik/ai-agents
   cd ai-agents
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   PORT=3000
   LANGCHAIN_API_KEY=
   LANGCHAIN_PROJECT=
   LANGCHAIN_TRACING_V2=true
   ```

### Running the Application

#### Development Mode (with auto-reload)
```bash
npm start
```

This will run the courtroom simulation using `nodemon`, which automatically restarts the server on file changes.

#### Console Output
The application will display the courtroom proceedings directly in the console:
```
⚖️ AI Courtroom (Gemini + LangGraph)

[geminiWrapper] Agent invoked. systemPrompt snippet: You are an aggressive, logical LAWYER...
[geminiWrapper] Agent invoked. systemPrompt snippet: You are a nervous WITNESS...
[geminiWrapper] Agent invoked. systemPrompt snippet: You are the ACCUSED CRIMINAL...
[geminiWrapper] Agent invoked. systemPrompt snippet: You are a strict, serious JUDGE...

------ FINAL VERDICT ------
[Judge's verdict and ruling]
```

#### Web Server
The application also runs an Express server on `http://localhost:3000` that displays the judge's final verdict in HTML format.

## 🏗️ Architecture

### LangGraph State Management

The courtroom uses a `CourtroomState` with three main properties:
- **input**: The case details and initial scenario
- **history**: Accumulated conversation context passed between agents
- **output**: The final output from each agent

### Agent Flow

```
START → LAWYER → WITNESS → CRIMINAL → JUDGE → END
```

Each agent:
1. Receives the current state (case details + conversation history)
2. Generates a response using Gemini AI
3. Updates the history for the next agent
4. Passes control to the next agent

### Gemini Integration

The `geminiWrapper.js` handles:
- **Model**: Google's Gemini 2.5 Flash
- **Temperature Control**: Varies per agent (Lawyer: 0.7, Judge: 0.3)
- **Response Parsing**: Extracts text from AIMessage objects
- **Error Handling**: Graceful fallbacks for API failures

## 🔧 Configuration

### Case Scenario
Edit the `courtroomCase` in `graph.js`:
```javascript
const courtroomCase = `
A man is accused of stealing a diamond necklace.
CCTV is blurry.
Witness says she saw him running.
Criminal denies everything.
`;
```

### Agent Temperatures
Adjust creativity/determinism in each agent file (e.g., `src/agents/judge.js`):
```javascript
export const judgeAgent = createAgent(`...`, 0.3); // Lower = more deterministic
```

### Background Context
Modify the initial history in `graph.js`:
```javascript
history: "as accused or named criminal doesnt have any prior convictions.or any criminal record."
```

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@langchain/langgraph` | ^1.0.1 | Graph-based agent orchestration |
| `@langchain/google-genai` | ^1.0.0 | Google Gemini API integration |
| `@langchain/core` | ^1.0.4 | LangChain core utilities |
| `langchain` | ^1.0.4 | LLM framework |
| `express` | ^5.1.0 | Web server |
| `dotenv` | ^17.2.3 | Environment variable management |
| `nodemon` | ^3.1.10 | Development server with auto-reload |

## 📝 Key Files Explained

### `graph.js`
- Sets up the LangGraph state graph
- Defines agent nodes and edges
- Runs the courtroom simulation
- Starts Express web server on port 3000

### `src/agents/lawyers.js`
- Aggressive, logical defense attorney
- Temperature: 0.7 (moderate creativity)
- Attacks weak prosecution points

### `src/agents/witness.js`
- Nervous, emotional witness
- Provides testimony about observations
- Adds uncertainty to proceedings

### `src/agents/criminal.js`
- The accused defendant
- Defensive posture
- Sometimes equivocates

### `src/agents/judge.js`
- Strict, authoritative judge
- Temperature: 0.3 (deterministic)
- Issues final verdict and rulings

### `src/utils/geminiWrapper.js`
- Wraps Google Gemini API calls
- Handles `AIMessage` object parsing
- Manages token usage and errors
- Accumulates conversation history


## 📊 Example Output

```
⚖️ AI Courtroom (Gemini + LangGraph)

[geminiWrapper] Agent invoked. systemPrompt snippet: You are an aggressive, logical LAWYER...

[geminiWrapper] Agent invoked. systemPrompt snippet: You are a nervous WITNESS...

[geminiWrapper] Agent invoked. systemPrompt snippet: You are the ACCUSED CRIMINAL...

[geminiWrapper] Agent invoked. systemPrompt snippet: You are a strict, serious JUDGE...

------ FINAL VERDICT ------

ORDER! ORDER IN THIS COURT!

*(My voice cuts through the nervous energy, sharp and unyielding.)*

Counsel, your arguments regarding the ambiguity of the visual evidence have been noted. The burden of proof remains with the prosecution...

[Full verdict continues...]
```

## 🚀 Future Enhancements

- [ ] Persistent conversation storage
- [ ] Web UI for interactive trials
- [ ] Multiple case scenarios
- [ ] Jury deliberation simulation
- [ ] Appeal process
- [ ] Evidence management system
- [ ] Integration with real legal case databases

## 📄 License

ISC

**Last Updated**: November 17, 2025
