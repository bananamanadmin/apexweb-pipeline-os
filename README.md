# ApexWeb Pipeline OS

A desktop-like web application shell for a premium website generation pipeline, designed to feel like a real operating environment for business research, creative direction, asset sourcing, and QA.

## What this includes

- Multi-panel desktop workspace
- Persistent local workspace state
- Provider setup for Google, Gmail, Obsidian, and Pexels
- Command palette and panel manager
- Focus timer and project state
- Supportive UI for the "ApexWeb pipeline OS" concept

## Local runtime setup

Requirements:
- Node.js 20+
- npm
- Tauri desktop prerequisites for your OS

Install dependencies:

```bash
npm install
```

Run the web app:

```bash
npm run dev
```

Run the Tauri desktop app (requires Tauri toolchain on your machine):

```bash
npm run tauri dev
```

Build the desktop app:

```bash
npm run tauri build
```

## Important

This project is a real local-first desktop shell, but it does not ship with live Google OAuth credentials, Gmail access, Obsidian vault access, or Pexels production keys. Those must be supplied by the user in the app settings or in local environment variables for real runtime integration.

## Example environment file

Create a `.env.local` file for frontend config if you want to test live OAuth or APIs:

```bash
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

Use the Settings panel to paste keys and test connections when running locally.
