 personal AI agent (prototype)

This prototype shows a minimal "Arise" agent that appears when you call the wake phrase "arise". It personalizes to your local data and provides progress/feedback summaries.

Features
- Wake-word detection (browser Web Speech API) or manual text input
- Local-first personalization store (localStorage)
- Server-side LLM proxy (use OpenAI)
- Feedback engine that computes improvement over time

Quick start (development)
1. Clone the project.
2. In `server/` create a `.env`:
   - OPENAI_API_KEY=your_key_here
   - PORT=3001
3. Install & run server:
   - cd server
   - npm install
   - npm run dev
4. In `client/`:
   - cd client
   - npm install
   - npm run start
5. Open the client in the browser (default http://localhost:3000). Say "arise" or click "Activate" and interact.

Privacy
- Data is stored in browser `localStorage` by default. No syncing unless you enable it in settings.
- You can export or delete your data from the UI.

Notes
- This is a prototype. For production, add authentication, persistent DB, better wake-word detection, rate limiting, and encryption.# Ai-agent
