# 🤖 AI Chat Assistant — Frontend

A modern ChatGPT-style AI chat application built with **Next.js, TypeScript, Tailwind CSS, Zustand, Framer Motion, and Markdown rendering**.

The frontend communicates with a FastAPI backend and supports:

- 💬 AI conversations
- ⚡ Real-time streaming responses
- 🔐 JWT authentication
- 🧠 Conversation history
- 🗂️ Multiple conversations
- 📌 Pin conversations
- ✏️ Rename conversations
- 🗑️ Delete conversations
- 🔊 AI voice output
- 🎙️ Voice input
- 📝 Markdown responses
- 💻 Syntax-highlighted code blocks
- 📋 Copy message/code functionality
- 🌦️ Weather tool integration
- 📰 News tool integration
- 📚 Wikipedia search
- 🔎 Web search
- 🎬 Movie information
- 🖼️ City image search
- 🧑‍💻 Stack Overflow integration
- 📝 Notion integration
- 🎨 ChatGPT-style dark UI
- 📱 Responsive design

---

# ✨ Features

## 💬 AI Chat

Users can create conversations and communicate with the AI assistant.

The frontend supports:

- Sending messages
- Receiving AI responses
- Conversation history
- Conversation switching
- Streaming responses
- Message copying
- Relative timestamps
- Markdown rendering
- Code block rendering
- Voice input and output

---

## Application Image
![image alt](https://github.com/Madesh-cse/AI-Chat-Assistant-Frontend/blob/cded0a048c70cc54fc0388d07409908a1bf99c29/Screenshot%20(67).png)
![image alt](https://github.com/Madesh-cse/AI-Chat-Assistant-Frontend/blob/cded0a048c70cc54fc0388d07409908a1bf99c29/Screenshot%20(68).png)
![image alt](https://github.com/Madesh-cse/AI-Chat-Assistant-Frontend/blob/cded0a048c70cc54fc0388d07409908a1bf99c29/Screenshot%20(69).png)
![image alt](https://github.com/Madesh-cse/AI-Chat-Assistant-Frontend/blob/cded0a048c70cc54fc0388d07409908a1bf99c29/Screenshot%20(70).png)
![image alt](https://github.com/Madesh-cse/AI-Chat-Assistant-Frontend/blob/cded0a048c70cc54fc0388d07409908a1bf99c29/Screenshot%20(71).png)
![image alt](https://github.com/Madesh-cse/AI-Chat-Assistant-Frontend/blob/cded0a048c70cc54fc0388d07409908a1bf99c29/Screenshot%20(72).png)
![image alt](https://github.com/Madesh-cse/AI-Chat-Assistant-Frontend/blob/cded0a048c70cc54fc0388d07409908a1bf99c29/Screenshot%20(73).png)
![image alt](https://github.com/Madesh-cse/AI-Chat-Assistant-Frontend/blob/cded0a048c70cc54fc0388d07409908a1bf99c29/Screenshot%20(74).png)

## ⚡ Streaming Responses

The application uses the browser `ReadableStream` API to consume streaming responses from the FastAPI backend.

Instead of waiting for the complete LLM response, chunks are displayed as soon as they arrive.

```text
User
 ↓
ChatInput
 ↓
Frontend
 ↓
POST /chat/stream
 ↓
FastAPI
 ↓
LLM
 ↓
Token 1 ───────────→ UI
Token 2 ───────────→ UI
Token 3 ───────────→ UI
Token 4 ───────────→ UI
...
```

This creates a ChatGPT-style progressive response experience.

---

# 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Frontend framework |
| React | Component-based UI |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Zustand | Global state management |
| Framer Motion | UI animations |
| Lucide React | Icons |
| Markdown Renderer | AI response rendering |
| Fetch API | Backend communication |
| ReadableStream | Streaming AI responses |
| Web Speech APIs / Voice Components | Voice features |
| JWT | Authentication |

---

# 📁 Project Structure

```text
frontend/
├── app/
│   ├── login/
│   ├── register/
│   ├── chat/
│   └── ...
├── components/
│   ├── chat/
│   │   ├── ChatArea.tsx
│   │   ├── ChatBox.tsx
│   │   ├── ChatInput.tsx
│   │   ├── MessageBubble.tsx
│   │   └── TypingIndicator.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── markdown/
│   │   ├── ChatMarkDown.tsx
│   │   └── CodeBlock.tsx
│   ├── voice/
│   │   ├── VoiceButton.tsx
│   │   └── VoiceOutput.tsx
│   └── ui/
│       └── Avatar.tsx
├── hooks/
│   └── useAutoScroll.ts
├── services/
│   ├── chat.ts
│   ├── conversation.ts
│   └── ...
├── store/
│   ├── authStore.ts
│   └── chatStore.ts
├── types/
│   └── chat.ts
├── public/
├── Dockerfile
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

---

# ⚙️ Requirements

Before running the frontend locally, install:

- Node.js 20+
- npm 10+
- Git

The FastAPI backend must also be running.

Check installed versions:

```bash
node --version
npm --version
git --version
```

---

# 📥 Installation

Clone the repository:

```bash
git clone <YOUR_REPOSITORY_URL>
```

Move into the frontend project:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

---

# 🔑 Environment Variables

Create:

```text
.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

> Do not place backend secrets, API keys, database credentials, JWT secrets, or third-party private tokens in `NEXT_PUBLIC_*` variables.

Anything beginning with:

```text
NEXT_PUBLIC_
```

can become visible to the browser.

---

# 🚀 Development

Start the Next.js development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The backend should normally be available during local development at:

```text
http://localhost:8000
```

FastAPI Swagger:

```text
http://localhost:8000/docs
```

---

# 🏗️ Production Build

Create an optimized Next.js production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

The application normally runs on:

```text
http://localhost:3000
```

Before deployment, verify:

```bash
npm run build
```

completes without TypeScript, linting, or build errors.

---

# 🐳 Docker

## Build the frontend image

```bash
docker build -t ai-chat-frontend .
```

## Run the frontend container

```bash
docker run -d \
  --name ai-chat-frontend \
  -p 3000:3000 \
  ai-chat-frontend
```

Verify:

```bash
docker ps
```

Open:

```text
http://localhost:3000
```

---

# ⚡ Streaming Implementation

The frontend sends a request to:

```http
POST /chat/stream
```

The response body is consumed using the browser streaming API.

```typescript
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();

  if (done) {
    break;
  }

  const chunk = decoder.decode(value, {
    stream: true,
  });

  onChunk(chunk);
}
```

Each new chunk is appended to the existing assistant message.

```text
Assistant Message
      │
      ├── "React"
      ├── " is"
      ├── " a"
      ├── " JavaScript"
      ├── " library"
      └── ...
```

Zustand updates the assistant message while React automatically re-renders the UI.

---

# 🔐 Authentication

The frontend uses JWT bearer authentication.

After login, the access token is stored in the browser:

```text
localStorage
└── access_token
```

Protected requests send:

```http
Authorization: Bearer <ACCESS_TOKEN>
```

Example:

```typescript
const token = localStorage.getItem("access_token");

const response = await fetch(`${API_URL}/chat/stream`, {
  method: "POST",

  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },

  body: JSON.stringify({
    message,
    conversation_id: conversationId,
  }),
});
```

---

# 🔄 Authentication Flow

```text
User
 │
 ▼
Register / Login
 │
 ▼
FastAPI Auth API
 │
 ▼
JWT Access Token
 │
 ▼
localStorage
 │
 ▼
Authorization Header
 │
 ▼
Protected Backend APIs
```

---

# 💬 Chat Flow

```text
User enters message
        │
        ▼
     ChatInput
        │
        ▼
      ChatBox
        │
        ▼
Add temporary user message
        │
        ▼
Add empty AI message
        │
        ▼
streamMessage()
        │
        ▼
POST /chat/stream
        │
        ▼
FastAPI Backend
        │
        ▼
LLM / Tools
        │
        ▼
StreamingResponse
        │
        ▼
ReadableStream
        │
        ▼
Zustand updateMessage()
        │
        ▼
MessageBubble
        │
        ▼
ChatMarkdown
```

---

# 🧠 State Management

Zustand manages:

- Active conversation
- Conversation list
- User messages
- Assistant messages
- Streaming message updates
- Conversation loading
- Conversation title updates
- Pinned conversations

A streaming response updates the same assistant message:

```text
"LangGraph"
      ↓
"LangGraph is"
      ↓
"LangGraph is a framework"
      ↓
"LangGraph is a framework for..."
```

---

# 🎨 UI

The interface follows a ChatGPT-inspired layout.

```text
┌───────────────────────────────────────────────────┐
│                     Header                        │
├────────────────┬──────────────────────────────────┤
│                │                                  │
│    Sidebar     │           Chat Area              │
│                │                                  │
│ New Chat       │ User Message                     │
│ Conversation 1 │                                  │
│ Conversation 2 │ AI Response                      │
│ Conversation 3 │                                  │
│                │                                  │
│                ├──────────────────────────────────┤
│                │         Chat Input               │
└────────────────┴──────────────────────────────────┘
```

### User Messages

- Right aligned
- Rounded message bubble
- Copy button
- Relative timestamp

### Assistant Messages

- Left aligned
- AI avatar
- Markdown rendering
- Code highlighting
- Voice playback
- Progressive streaming

---

# 📝 Markdown Rendering

Assistant responses support Markdown including:

- Headings
- Bold and italic text
- Ordered lists
- Unordered lists
- Tables
- Inline code
- Code blocks
- Links

Example:

````markdown
## React Example

```tsx
function App() {
  return <h1>Hello React</h1>;
}
```
