# TODO LOW LEVEL
# MVP Roadmap: FCP-Style Web Editor

- [ ] Phase 2: Playback & Navigation (Keyboard-First)
	- [ ] Clip Selection Model: Track selected clips and edges (support shift multi-select)
	- [ ] Cut Jumping: Up/Down arrows to snap playhead to next/prev clip edges

- [ ] Phase 3: The Magnetic Core & Tool Keybinds
	- [ ] Clip In/Out Ranges: Timeline clips reference source media with in/out time ranges

	- [ ] Editing Workflows

	- [ ] The Core Tools
		- [ ] Select & Move (V): Drag clips along the timeline
		- [ ] Slip Edit: Move clip source in/out while preserving timeline duration

	- [ ] Disable Clip Collisions: Primary storyline clips cannot overlap

	- [ ] Timeline Selection Shortcuts
		- [ ] Select Clip Under Playhead (C)
		- [ ] Select Next/Previous Clip


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


