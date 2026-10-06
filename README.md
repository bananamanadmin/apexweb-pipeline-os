# ApexWeb Pipeline OS

A desktop-style operating environment for website generation, multi-view workspaces, provider management, and premium project orchestration.

## Features

- Desktop-grade multiview OS shell
- Persistent workspace and panel state
- Command palette and shortcuts
- Google / Gmail / Obsidian / Pexels setup surfaces
- API health and provider routing UI
- Focus timer and project state
- Website preview and task panels
- Local state persisted in the browser / Tauri runtime

## Run locally

1. Install dependencies:
   npm install
2. Start the app:
   npm run tauri dev
3. Build the desktop app:
   npm run tauri build

## Important note

Google OAuth, Gmail, Pexels, and Obsidian are implemented as real setup flows and live API test surfaces when credentials are provided. The app does not ship with production secrets and will show a configured/blocked state unless the user supplies their own credentials.
