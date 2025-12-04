# Smart To-Do List Manager - Backend (Minimal Scaffold)

This repository contains a minimal Node.js + Express backend to ensure the container can start successfully.

## Getting Started

Prerequisites:
- Node.js >= 18

Install dependencies:
- npm install

Start the server:
- npm start

Start in development (auto-reload with nodemon):
- npm run dev

## Configuration

- PORT: The port the server listens on. Defaults to 3001 if not provided.

Note: Do not commit secrets. Use an `.env` file for local environment variables if needed (ignored by git).

## Endpoints

- GET `/`  
  Returns a simple text message identifying the app.

- GET `/health`  
  Returns `{ "status": "ok" }` to indicate the service is healthy.

## Notes

This is an initial scaffold to provide a valid start command and a healthy boot. Future development can expand routes, data models, and business logic for the smart to-do list manager.