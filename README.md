# VoiceCart AI 🛒🎙️

VoiceCart AI is an India-first voice-commanding shopping assistant built as a student project. It combines a modern quick-commerce style interface with browser-based voice recognition and an optional Gemini-powered natural-language command parser.

The application is designed around a simple idea:

> Say what you need → VoiceCart understands it → your shopping list updates.

## 🔗 Live Demo

**[voicecart-ai-voice-commanding.onrender.com](https://voicecart-ai-voice-commanding.onrender.com)**


## ✨ Features

- 🎙️ Voice-first shopping using the browser's Speech Recognition API
- 🇮🇳 India-focused shopping experience with INR pricing and Indian brands
- 🗣️ Supports natural commands such as:
  - "Add 2 packs of Amul milk"
  - "Find organic apples under ₹150"
  - "Remove biscuits from my list"
  - "Show my grocery list"
  - "Show recommendations"
  - "Proceed to checkout"
- 🤖 Gemini-powered NLP for richer intent extraction when `GEMINI_API_KEY` is configured
- 🧠 Rule-based fallback parser so the voice-command demo can still work without Gemini
- 🛍️ Product search and category browsing
- 🧾 Shopping list with quantities
- 💡 Smart suggestions and substitutions
- 💳 Checkout and payment flow UI
- 📦 Order-success screen
- 📱 Mobile-first responsive UI
- 🔊 Text-to-speech confirmation using the browser's Speech Synthesis API
- ⚡ Vite + React frontend served through an Express server

## 🧱 Tech Stack

**Frontend**
- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4 / `@tailwindcss/vite`
- Lucide React icons
- Motion
- Browser Web Speech APIs

**Backend**
- Node.js
- Express
- TypeScript
- `tsx` for local development
- Google Gemini API through `@google/genai`

**Deployment**
The project is a full-stack Node/Express application, so it can be deployed as a Web Service rather than as a purely static site.

## 📁 Project Structure

```
VoiceCart-AI/
├── src/
│   ├── components/
│   │   ├── AudioVisualizer.tsx
│   │   ├── BottomNav.tsx
│   │   ├── Header.tsx
│   │   └── ProductCard.tsx
│   ├── data/
│   │   ├── mockProducts.ts
│   │   └── studentPythonProject.ts
│   ├── utils/
│   │   └── speech.ts
│   ├── views/
│   │   ├── HomeScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── ShoppingListScreen.tsx
│   │   ├── SmartSuggestionsScreen.tsx
│   │   ├── CheckoutScreen.tsx
│   │   ├── PaymentScreen.tsx
│   │   ├── OrderSuccessScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── server.ts
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env.example
└── README.md
```

## 🔄 How the Application Works

```
User speaks
   ↓
Browser Speech Recognition
   ↓
React frontend
   ↓
POST /api/nlp-command
   ↓
Gemini NLP (if API key exists)
   ↓
Rule-based fallback
   ↓
Structured shopping intent
   ↓
Update/search/display shopping data
   ↓
Voice confirmation + UI feedback
```

## 🚀 Run Locally

### 1. Install Node.js
Use a current LTS version of Node.js.

Check your installation:
```bash
node --version
npm --version
```

### 2. Install dependencies
From the project root:
```bash
npm install
```

### 3. Configure Gemini (optional)
Create a `.env` file:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

The project also works with the built-in rule-based parser when the Gemini key is not configured.

> ⚠️ Never commit your real API key to GitHub.

### 4. Start development server
```bash
npm run dev
```

Open: `http://localhost:3000`

## 🏗️ Production Build

Build the React frontend and bundle the Express server:
```bash
npm run build
```

Then start the production server:
```bash
npm start
```

The server uses the `PORT` environment variable when provided and falls back to port 3000 locally.

## 🔐 Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | Optional | Enables Gemini-powered natural-language command parsing |
| `PORT` | No | HTTP port; hosting platforms normally provide this automatically |
| `NODE_ENV` | Recommended in production | Set to `production` on deployment |

## 🎤 Browser Voice Support

Voice recognition uses the browser's Web Speech API. For the best demo experience, use a Chromium-based browser such as Google Chrome or Microsoft Edge and allow microphone access when prompted.

If voice recognition is unavailable, users can still use the text/search controls and quick-command interactions.

## 🧪 Health Check

The backend exposes:
```
GET /api/health
```

A successful response looks like:
```json
{
  "status": "ok",
  "app": "VoiceCart AI",
  "currency": "INR (₹)"
}
```

## 🌐 Deploy on Render

VoiceCart AI should be deployed on Render as a Web Service, because the project contains an Express server that serves the React application and exposes the NLP API.

### Step 1 — Push the project to GitHub

Create a GitHub repository and push the project:
```bash
git init
git add .
git commit -m "Initial VoiceCart AI project"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

### Step 2 — Create the Render service

In Render:
1. Create a **New → Web Service**.
2. Connect your GitHub repository.
3. Select the VoiceCart AI repository.
4. Use **Node** as the runtime.

Recommended settings:
- **Name:** `voicecart-ai`
- **Runtime:** Node
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

### Step 3 — Add the Gemini key

In the Render service's **Environment** section, add:
```
GEMINI_API_KEY = your_actual_gemini_api_key
```

Do not put the real key into GitHub.

### Step 4 — Deploy

Click **Create Web Service**. Render will install dependencies, run the production build, and start the Express server.

Your application will receive a public `onrender.com` URL.

### Step 5 — Test the deployment

Open:
```
https://voicecart-ai-voice-commanding.onrender.com
```

Then test:
```
https://voicecart-ai-voice-commanding.onrender.com/api/health
```

You should receive a JSON health response.

## 🛠️ Important Deployment Notes

- The Express server listens on `process.env.PORT`, which is required for reliable hosting-platform deployment.
- The server binds to `0.0.0.0`, allowing the hosting platform to route public traffic to it.
- The Gemini API key is used server-side, not in the browser.
- The application currently uses demo/mock shopping data for the product experience; it is not connected to a real grocery inventory, payment gateway, or delivery provider.
- The payment screens are a demo checkout flow and do not process real payments.
- The voice feature depends on browser microphone permissions and Web Speech API support.

## 🎓 Project Context

VoiceCart AI was designed as a student software engineering project demonstrating:

- Voice user interfaces
- Natural-language intent detection
- AI-assisted shopping workflows
- React component architecture
- Express API development
- Responsive product UI design
- India-specific e-commerce UX considerations

## 👩‍💻 Author

**Ritica Awasthi**
B.Tech CSE — AI & ML

---

*VoiceCart AI — Say it. Find it. Cart it.*
