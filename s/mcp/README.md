# Omniclip MCP

A local stdio MCP server for the browser editor. It reuses Omniclip's revision-checked patches and proxies the visual tools from **claude-video-vision 1.4.0**. Audio understanding is a separate, optional cloud tool. No Qwen or Claude API key is required for visuals or editing.

## Run locally

Requirements: Node.js 24+, `ffmpeg` and `ffprobe` on PATH. Install the repo dependencies and build the editor normally:

```sh
npm install
npm run build
```

Link the local executable without publishing, then register the **same** server with either client. Run these commands using the same account and Node installation as your agent:

```sh
npm link --ignore-scripts
codex mcp add omniclip -- npx --no-install omniclipmcp
claude mcp add omniclip -- npx --no-install omniclipmcp
```

The package exposes an `omniclipmcp` binary. `--no-install` prevents npx from installing a registry package if the local executable is missing. No npm publication is required. Avoid `npm run` as the MCP transport command: npm's stdout banner can interfere with the protocol.

Start Omniclip's normal app server, then open an existing project:

```text
http://127.0.0.1:3000/editor/#/project/your-project-id
```

In Settings → MCP, enable **Allow local MCP access**. The bridge port defaults to `3789`; change it while access is disabled if your MCP process uses another port. The section shows connection status and a copyable Codex registration command using the locally linked executable. Access starts disabled for each project tab and takes effect immediately, independently of Apply/Cancel for sequence settings. One connected project tab is allowed per bridge. The browser reconnects if the MCP process restarts. Turn the toggle off or close the tab to disconnect. Chromium may request permission for local-network access; grant it only to the editor you intend to connect. No URL parameter is required.

The bridge binds **127.0.0.1 only** and accepts the exact editor origin configured by `OMNICLIP_ORIGIN` (default `http://127.0.0.1:3000`). There is no account authentication on this local connection. Do not expose the port remotely. For another app origin, set that environment variable on the MCP process; the browser URL and configured origin must match exactly. HTTPS-hosted browsers may restrict the local HTTP/WebSocket connection; use localhost for initial browser testing. Only one MCP process can bind a given port; running both clients simultaneously requires distinct `OMNICLIP_MCP_PORT` values and matching browser tabs.

Install the shared [Omniclip skill](skills/omniclip/SKILL.md) by copying its `omniclip` folder into the client's skills directory (`.agents/skills` for Codex projects, `.claude/skills` for Claude Code projects). The MCP server also supplies essential instructions during initialization. It does not depend on Claude's slash commands, subagents or plugin installer. You do not need a second video-vision MCP registration.

## Tools

| Tool | Purpose |
| --- | --- |
| `read_project_context` | Project settings, current timeline, revision, selection, playhead, source metadata and kind names |
| `update_settings` | Update specified project settings and return fresh context; separate from timeline undo history |
| `create_item` | New opaque timeline item ID |
| `patch_timeline` | Existing atomic patch implementation; returns fresh context on success or revision mismatch |
| `provide_media` | Original source copied to a local temporary file, once per content hash |
| `video_info`, `video_analyze`, `video_watch`, `video_detail` | Video-vision metadata, structural analysis, images and targeted inspection |
| `audio_analyze` | TODO placeholder; audio analysis is not implemented yet |

Visual calls enforce `skip_audio: true`, images rather than Claude-specific frame descriptions, and transcription off in structural analysis. You can still inspect audio loudness/silence locally. No Whisper model is downloaded by this path. Frame cache settings follow the existing `~/.claude-video-vision/config.json` (`enable_index` is false by default); without indexing, detail calls need extraction segments. The adapter does not alter that global configuration.

Editor timing and source metadata use **milliseconds**. Video tools use seconds/whole-second `HH:MM:SS` labels. `provide_media` includes the item's current source offset and duration as well as the source path. **Video-vision 1.4.0 does not preserve fractional seconds in frame labels**, so dense extraction is not proof of frame-accurate timing. This is an initial integration to evaluate, not a promise of precise automatic cuts.

Browser media is streamed to a private temporary directory, shared by items with the same source hash, and removed when the MCP process shuts down normally. The third-party plugin manages its own caches. A hard kill can leave the source directory in the system temporary folder; the editor's persistent project files are never deleted.

## Audio analysis

`audio_analyze` is a TODO placeholder. It returns an explicit not-implemented error without uploading or analyzing audio. Visual tools and editing remain available.

## Verify

```sh
npm run _tsc
```

For the browser test, build/reload the editor, connect one project, and ask the agent to read its context and inspect a clip. Verify that the images match the source. Make a manual editor change between reading context and applying a patch: the stale patch must fail and return the new revision. Then try editing only the second of several items sharing a source; verify that other trims remain unchanged. Audio service quality and real assistant behavior still require testing with actual footage.
