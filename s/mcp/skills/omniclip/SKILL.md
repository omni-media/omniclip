---
name: omniclip
description: Inspect footage and edit the project open in Omniclip through its local MCP tools. Use for timeline editing and questions about media in that project.
---

# Omniclip

Read `read_project_context` to get the current timeline, revision, source metadata and selection. Re-read after user edits or a failed/timed-out patch; do not invent revision numbers.

## Inspect footage

- `provide_media(itemId)` supplies a local **original source**, not a rendered clip. Multiple items may share that file while having different trims.
- `video_info` reports metadata. For long footage, `video_analyze` can identify scene changes and motion before extracting images.
- Use `video_watch` for an overview, then `video_detail` with segments at higher FPS/resolution around relevant moments. Limit images with `view_sample`; avoid loading every frame of a long video.
- Visual tools are provided by claude-video-vision with audio processing disabled. You interpret their returned images. No additional vision API key is needed.
- Range arguments and frame labels in this plugin use whole-second `HH:MM:SS`. A denser sample helps interpret motion but those labels alone cannot establish sub-second cut timing. State uncertainty rather than inventing precise timestamps.
- Optional `audio_analyze(itemId, prompt, start?, end?)` handles audio semantics through Omniclip's cloud service. Use it when speech, music or sound events matter and cloud analysis is wanted. It sends **audio only**, can consume service credits, and defaults to the item's trim. Each returned analysis uses timestamps relative to its window: add that window's `start` for original source time.
- Frame caching follows the user's video-vision configuration. Without caching, pass extraction `segments` to `video_detail`, not just cache lookup timestamps.

## Edit the current project

Editor timing is **milliseconds**; inspection timing is **seconds**. A media item's `start` is its original source offset. Its timeline placement comes from its container: Sequences concatenate children, Stacks play them simultaneously. Account for nested containers and transitions.

Map inspected source times to the intended item's current trim. Preserve other instances of the same source and unrelated items, transforms, effects and captions.

Only edit when requested. Obtain IDs for new items using `create_item`. Send `patch_timeline` the current `timelineRevision` as `baseRevision`; replacements contain the complete item with its original ID. Update container references when removing, inserting or reordering items. The patch result includes fresh context, including on a revision conflict. Rebuild from that context instead of incrementing a guessed revision. Only claim success when the patch result confirms it.
