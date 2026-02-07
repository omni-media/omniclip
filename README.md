<p align="center"><img width="300" src="./assets/icon2.png"/></p>
<h1 align="center">Picasso Platforms</h1>
<p align="center"><a href="https://opensource.org/license/mit"><img src="https://img.shields.io/badge/license-MIT-blue.svg"/></a></p>
<p align="center">AI-powered video editing in your browser</p>

## Introduction
Picasso Platforms is a browser-based video editor with a built-in MCP (Model Context Protocol) server that lets AI assistants directly control the editing timeline. No accounts, no uploads, no subscriptions — everything runs locally in your browser.

Edit videos by hand with a full-featured timeline UI, or let an AI assistant add clips, apply transitions, style text, and render your project — all through natural language.

Built on modern browser APIs like WebCodecs for high-performance rendering directly in the browser.
> Because of this, it may not work properly on older browsers or devices that don't support these newer technologies.

## Features

### Editor
- Trimming and splitting
- Supports text, audio, video (mp4, mov, and more), and images
- On-preview clip editing — rotating, resizing, text styling
- Undo/Redo
- Render in resolutions up to 4K
- Project manager for multiple saved projects
- Transitions between video clips
- Visual effects and filters
- Configurable timebase (10–120 fps)
- Real-time collaboration via WebRTC

### MCP Server (AI Integration)
An MCP server bridges AI assistants (like Claude) to the editor via WebSocket, exposing 30 tools across these categories:

| Category | Tools |
|---|---|
| **Query** | Get timeline state, list effects/tracks, get effect details, playback status |
| **Effects** | Add/remove/update video, audio, text, and image effects |
| **Positioning** | Move, resize, rotate, and crop effects on the canvas |
| **Text Styling** | Batch-update font, size, color, alignment, and more |
| **Tracks** | Add, remove, reorder, and configure tracks |
| **Transitions** | Add, remove, and configure transitions between clips |
| **Animations** | Add, remove, and configure keyframe animations |
| **Filters** | Add and remove visual filters |
| **Playback** | Play, pause, and seek |
| **Project** | Resolution, FPS, duration, undo/redo |

**Architecture:** `AI Assistant (stdio)` ↔ `MCP Server` ↔ `WebSocket (port 9876)` ↔ `Browser Bridge`

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Setup
```sh
# Clone the repository
git clone https://github.com/ayushsridhar/betterhack.git
cd betterhack

# Install dependencies
npm install
cd mcp-server && npm install && cd ..

# Build everything
npm run build
cd mcp-server && npm run build && cd ..

# Start the dev server
npm start
```
Then open http://localhost:8080 in your browser.

### Running the MCP Server
In a separate terminal:
```sh
cd mcp-server
node dist/index.js
```
The MCP server starts on stdio and opens a WebSocket bridge on `ws://localhost:9876`. The browser editor will auto-connect to it.

## Architecture

This project follows a unidirectional data flow:

1. **State** — single source of truth for the timeline and project
2. **Actions** — pure functions that produce state transitions
3. **Controllers** — manage side effects (compositor, media, MCP bridge, collaboration)
4. **Components/Views** — Lit web components that render from state

### Tech Stack
- TypeScript
- Lit + @benev/slate (UI framework)
- PIXI.js (canvas rendering)
- WebCodecs / FFmpeg WASM (encoding)
- MCP SDK + WebSocket (AI bridge)

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
