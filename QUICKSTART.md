# Quick Start Guide

## 🚀 Get Running in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables

Create environment files with your API key:

**backend/.env**
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
PORT=3001
FRONTEND_URL=http://localhost:3000
```

Get your API key from: https://console.anthropic.com/

**frontend/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Step 3: Start Development Server
```bash
npm run dev
```

That's it! 🎉

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## What You Can Do

1. **Canvas Tab**: Draw architecture diagrams with Excalidraw
2. **Send to Chat**: Click button to send diagram to Chip AI
3. **Get YAML Spec**: Chip analyzes and generates specification
4. **Validate**: Use "Validate Specification" button to check against schema

## Separate Services

Want to run them separately?

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

## Project Structure

```
chip/
├── frontend/    # Next.js app on port 3000
├── backend/     # Express API on port 3001
└── schemas/     # Shared YAML schemas
```

For more details, see [SETUP.md](SETUP.md) and [README.md](README.md)
