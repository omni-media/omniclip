# TODO LOW LEVEL
# MVP Roadmap: FCP-Style Web Editor

- [ ] Timeline Data Model Spec: Define sequence, clips, connected clips, gaps, timebase, roles, and transforms

- [ ] Phase 1: Ingest & The "Quay" Media Pool
	- [ ] OPFS File Storage: Drag and drop `.mp4`/`.wav` files from the OS into `quay`
	- [ ] The Media Bin UI: Simple grid/list view of imported assets with thumbnails
	- [ ] Persistent Sessions: Auto-reconnect to OPFS handles on page refresh

- [ ] Phase 2: Playback & Navigation (Keyboard-First)
	- [ ] Clip Selection Model: Track selected clips and edges (support shift multi-select)
	- [ ] Timeline Viewport: Zoom (in/out) and Pan (scroll left/right) via `OmniCore`
	- [ ] Timeline Follow Playhead: Auto-scroll timeline during playback
	- [ ] Timeline Skimming: Hovering timeline previews frames without moving playhead
	- [ ] Toggle Skimming (S): Enable/disable skim behavior
	- [ ] Timeline Thumbnails: Generate and cache video frame thumbnails for clips
	- [ ] Audio Waveform Preview: Generate waveform peaks for audio clips
	- [ ] J / K / L Scrubbing: Reverse, Pause, and Forward playback in `omnitool`
	- [ ] Spacebar: Core Play/Pause toggle
	- [ ] Frame Stepping: Left/Right arrows for exact 1-frame movement
	- [ ] Cut Jumping: Up/Down arrows to snap playhead to next/prev clip edges

- [ ] Phase 3: The Magnetic Core & Tool Keybinds
	- [ ] Sequence Settings: Define timeline resolution and FPS
	- [ ] Clip Edge Selection: Select only clip start/end handles for trim operations
	- [ ] Trim Mode Preview: Show trim result while dragging edges
	- [ ] Timeline Timebase: Sequence defines a fixed FPS/timebase
	- [ ] Clip In/Out Ranges: Timeline clips reference source media with in/out time ranges
	- [ ] Gap Clips: Represent empty timeline space explicitly
	- [ ] Primary Storyline (Sequence Timeline): Auto-ripple timeline on clip add/delete/trim
	- [ ] Connected Clip Anchoring: Connected clips reference a parent clip and offset in the `Stack`
	- [ ] Connect Edit (Q): Attach source selection to the primary storyline at the playhead as a Connected Clip (Stack)

	- [ ] Editing Workflows
		- [ ] Mark In / Mark Out (I / O): Select ranges on source media or timeline
		- [ ] Append Edit (E): Add source selection to end of primary storyline
		- [ ] Insert Edit (W): Insert clip at playhead and ripple timeline

	- [ ] The Core Tools
		- [ ] Select & Move (V): Drag clips along the timeline
		- [ ] Blade (B): Split clip at the playhead
		- [ ] Edge Trimming (T): Drag start/end bounds to change duration
		- [ ] Slip Edit: Move clip source in/out while preserving timeline duration

	- [ ] Magnetic Snapping: Snap edges to playhead and other clips while dragging
	- [ ] Disable Clip Collisions: Primary storyline clips cannot overlap
	- [ ] Snapping Toggle (N): Enable/disable magnetic snapping
	- [ ] Ripple Delete (Backspace/Delete): Remove clip and pull timeline left to close gap

	- [ ] Timeline Selection Shortcuts
		- [ ] Select Clip Under Playhead (C)
		- [ ] Select Next/Previous Clip

- [ ] Phase 4: The Inspector, Roles & Composition
	- [ ] Roles System: Create, edit, and assign roles to clips (e.g., Dialogue, B-Roll, Music)
	- [ ] Role-Based Outliner: Show, hide, or focus timeline items by their assigned role
	- [ ] Transform Controls: X/Y Position, Scale, and Rotation (PIP)
	- [ ] Audio Basics: Master volume slider and basic fade in/out
	- [ ] Basic Text Layers: Text generator clip that lives in the `Stack`

- [ ] Phase 5: Durability & Output
	- [ ] Missing Media Handling: Show placeholder when source file is unavailable
	- [ ] Media Metadata Cache: Store duration, resolution, codec, and hashes for imported media
	- [ ] Timeline Integrity Validator (dev mode): Ensure valid ranges, no overlaps, valid anchors
	- [ ] Undo/Redo (Cmd+Z / Shift+Cmd+Z): Wire up the `Chronicle` history stack
	- [ ] State Autosave: Real-time `strata` save to local browser storage
	- [ ] Project Load/Relink: Open saved project JSON and relink missing media from `quay`/user picker
	- [ ] H.264 MP4 Export: Reliable WebCodecs render path for a 1080p download
	- [ ] Export Progress UI: Show rendering progress percentage during export


- [ ] Time Utilities
	- [ ] frame <-> seconds conversion
	- [ ] time range math
	- [ ] snapping helpers
	- [ ] timeline coordinate conversions

# TODO HIGH LEVEL VISION

- [ ] cloud integration
	- running projects in the cloud
	- users connect to cloud projects

- [ ] media management
	- using quay
	- content-addressable data store
	- opfs ingress (users can upload media)
	- opfs egress (users can download media)

- [ ] state management
	- domains can organize state and actions
	- implement domains in slate

- [ ] compositing engine
	- ideally it can work clientside and serverside
	- multithreading

- [ ] sketch collaboration and premium mode dedicated cloud projects
	- store files
	- run dedicated websocket servers for allowing connected users
	- accounts, teams, permissions
	- important for making 💰

- [ ] project.zip
	- project.json
	- whatever.mp4

- [ ] r&d
	- investigate full project history (like git or google docs)
	- end to end encryption
	- ai features like captions

- [ ] timeline
	- omnitool define proper timeline spec
		- otio?
		- our own thing that exports/imports otio??


### chase todo

- [ ] omnitool: comrade stuff (run compositor worker in node)
- [ ] omniclip: domains state management, probably in slate
- [ ] omniclip: establish cloud mode architecture
- [ ] quay: make architecture good and working and ready to use
- [ ] design the actual timeline format?


