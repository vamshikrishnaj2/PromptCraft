# PromptCraft

PromptCraft is a React-based AI text generation application that connects to a locally configured FreeLLMAPI gateway through a Node.js and Express backend.

## Features

- Generate AI text from a user-provided prompt.
- Copy generated text to the clipboard.
- Clear the prompt and generated output.
- Display loading and error states.
- Keep the API key on the backend instead of exposing it in frontend code.
- Use Vite for frontend development and production builds.

## Tech Stack

- React
- Vite
- JavaScript
- Node.js
- Express
- FreeLLMAPI gateway

## Prerequisites

- Node.js and npm
- Git
- A locally configured FreeLLMAPI gateway
- A valid gateway API key

## Getting Started

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd free-ai-api-lab
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your GitHub repository URL.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure your environment

Create a `.env` file in the project root using `.env.example` as a reference.

Add your own gateway API key:

```env
FREELLMAPI_KEY=your_api_key_here
```

Never commit your real `.env` file or publish your API key.

### 4. Start the backend

In a terminal, run:

```bash
npm run dev:server
```

The backend is configured to use `http://127.0.0.1:3002`.

### 5. Start the frontend

Open a second terminal in the project directory and run:

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

The Vite development server proxies `/api` requests to the backend on port `3002`. The backend expects the FreeLLMAPI gateway to be available at `http://127.0.0.1:3001`.

## Production Build

To create a production build, run:

```bash
npm run build
```

The generated files are written to `dist/`.

## Security Notes

- Keep API keys in `.env` and out of source control.
- Do not place gateway API keys in React components or other frontend code.
- `.env.example` is a template and must contain placeholders only.
- This application relies on a separately running FreeLLMAPI gateway.
- Model availability, usage limits, and response times depend on the configured providers and their policies.

## Project Status

This is a learning project built to practise React, API integration, and backend development. Production deployment requires additional security, reliability, and configuration checks.