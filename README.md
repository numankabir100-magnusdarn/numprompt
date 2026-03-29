# NumPrompt 🚀

**AI-powered prompt engineering assistant** — Refine your rough prompts into polished, effective ones using Groq AI.

## Features

- ✨ **5 Prompt Templates** — Creative, Technical, Professional, Scientific, Business
- ⚡ **Powered by Groq AI** — Fast inference with Llama 3.3 70B
- 📜 **History Tracking** — Re-use previous refinements with one click
- 📋 **One-click Copy** — Instantly copy refined prompts
- 📱 **Responsive Design** — Works on desktop and mobile

## Quick Start

### Prerequisites
- Node.js 18.x
- A [Groq API key](https://console.groq.com/)

### Local Development

```bash
# Install all dependencies
npm run install-all

# Create .env file in root
echo "GROQ_API_KEY=your_key_here" > .env

# Start dev server (backend + frontend)
npm run dev
```

The app runs at `http://localhost:3000` (React) with the API at `http://localhost:5000`.

### Deploy to Netlify

1. Push to GitHub
2. Connect repo in [Netlify](https://app.netlify.com)
3. Set environment variable: `GROQ_API_KEY`
4. Deploy — build config is in `netlify.toml`

## Project Structure

```
numprompt/
├── server.js                  # Express backend with Groq API
├── routes/refine.js           # API route handler
├── templates/promptTemplates.js
├── netlify/functions/refine.js # Netlify serverless function
├── netlify.toml               # Netlify deploy config
├── client/
│   ├── public/index.html      # HTML entry point
│   ├── src/
│   │   ├── App.tsx            # Main React component
│   │   ├── App.css            # Component styles
│   │   ├── index.tsx          # React entry point
│   │   └── index.css          # Global styles
│   └── package.json
└── package.json
```

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Backend**: Express.js / Netlify Functions
- **AI**: Groq SDK (Llama 3.3 70B Versatile)
- **Styling**: Vanilla CSS with glassmorphism design

## License

MIT
