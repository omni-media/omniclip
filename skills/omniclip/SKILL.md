---
name: omniclip
description: Navigate the Omniclip editor, find its controls, and understand project settings, tags, and rules. Use for Omniclip interface and project organization questions.
---

# Omniclip editor

- Drag clips to rearrange them. Hold Control while dragging to move their container.
- Double-click a Stack or Sequence to view its contents. Use the timeline breadcrumb to leave it. Right-click a clip to wrap it in a Stack or Sequence.
- Media imports and browses footage. Text adds titles and captions. The inspector edits the selected item.
- The Audio panel controls master gain and mute. Export renders and saves the project. Shortcuts in the top bar lists keyboard controls.
- Settings in the top bar shows project settings. Changing canvas format requires a resolution and matching aspect ratio. This does not resize or reposition clips. Settings changes are separate from timeline undo history.

## Tags and rules

- Tags label individual items. A tag's color may appear on descendants, but the descendants do not inherit its membership. Adding a tag does not apply a rule.
- Rules are reusable and assigned separately to stacks or sequences. A rule applies to the leaf items in that structure, including nested structures; rules on ancestors also apply.
- A rule may restrict item kinds, require at least one of its allowed tags, or forbid tags. A forbidden tag takes precedence over an allowed tag. A combined audio/video clip requires both audio and video to be accepted. Gaps and transitions are always allowed.
- For example, tagging a sequence “Music” does not tag its clips or restrict their kinds. A rule requiring the “Music” tag matches a clip only if the clip itself has that tag.

Tags, rules, and their assignments are not currently included in `read_project_context`, and the timeline patch tools cannot edit them. Do not infer that an item has no tags or rules from their absence in context, or claim to have assigned or preserved them. A patch that conflicts with a rule may be rejected with details of the first conflict; report the failure without inventing further details.

Keep an existing item's ID when editing or moving that item. Use `create_item` for a newly created replacement, and keep an existing replacement's own ID. This matters because tags and rule assignments are associated with item IDs. A new split or duplicate has a new ID and does not automatically receive the original's tags through a timeline patch; if preserving them matters, explain that the available tools cannot guarantee it. Removing or collapsing a structure can also remove its rule assignment.
