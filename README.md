# VoiceCart AI - Voice Shopping Assistant

A voice-command shopping assistant with smart suggestions, multilingual NLP parsing, and shopping list management.

## Features

- Voice command recognition to add, remove, and manage shopping list items
- Natural language parsing for varied phrasing
- Smart product suggestions and substitutes
- Category-based organization and quantity handling
- Voice-activated search with filtering

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Create a `.env` file in the project root and set your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
3. Run the app:
   `npm run dev`
4. Open `http://localhost:3000/` in your browser.

## Tech Stack

- React + TypeScript
- Vite
- Express
- Tailwind CSS
- Google Gemini API (for NLP parsing and smart suggestions)
