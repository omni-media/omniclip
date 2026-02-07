# Standardized Annotation Format - Team Reference

## Overview

The drawing system now uses a standardized annotation format for better team collaboration between Member 1 (Drawing), Member 2 (UI), and Member 4 (AI Integration).

---

## Annotation Data Structure

```typescript
interface Annotation {
  id: string                     // Unique identifier (auto-generated)
  type: 'arrow' | 'rectangle' | 'circle' | 'freehand'

  coordinates: {
    // For arrow & rectangle:
    start?: {x: number, y: number}
    end?: {x: number, y: number}

    // For circle:
    center?: {x: number, y: number}
    radius?: number

    // For freehand:
    path?: Array<{x: number, y: number}>  // Array of points
  }

  affectedEffects: string[]      // IDs of clips this annotation overlaps
  color?: string                 // Hex color (e.g., '#FF0000')
  strokeWidth?: number           // Line thickness in pixels
  drawnAtTimecode?: number       // Timecode when annotation was created
}
```

---

## Examples

### Arrow Annotation
```json
{
  "id": "ann_xyz123",
  "type": "arrow",
  "coordinates": {
    "start": {"x": 100, "y": 200},
    "end": {"x": 500, "y": 300}
  },
  "affectedEffects": ["effect_abc", "effect_def"],
  "color": "#FF0000",
  "strokeWidth": 3,
  "drawnAtTimecode": 5000
}
```

### Rectangle Annotation
```json
{
  "id": "ann_abc456",
  "type": "rectangle",
  "coordinates": {
    "start": {"x": 200, "y": 150},
    "end": {"x": 800, "y": 600}
  },
  "affectedEffects": ["effect_ghi"],
  "color": "#00FF00",
  "strokeWidth": 2,
  "drawnAtTimecode": 10000
}
```

### Circle Annotation
```json
{
  "id": "ann_def789",
  "type": "circle",
  "coordinates": {
    "center": {"x": 960, "y": 540},
    "radius": 150
  },
  "affectedEffects": [],
  "color": "#0000FF",
  "strokeWidth": 4,
  "drawnAtTimecode": 15000
}
```

### Freehand Annotation
```json
{
  "id": "ann_ghi012",
  "type": "freehand",
  "coordinates": {
    "path": [
      {"x": 100, "y": 100},
      {"x": 150, "y": 120},
      {"x": 200, "y": 110},
      {"x": 250, "y": 130}
    ]
  },
  "affectedEffects": ["effect_jkl", "effect_mno"],
  "color": "#FFFF00",
  "strokeWidth": 5,
  "drawnAtTimecode": 20000
}
```

---

## Getting Annotations (Member 4)

### Get Raw Annotation Data

```typescript
// Access via context
const {controllers} = omnislate.context
const annotations = controllers.compositor.managers.drawingManager.getAnnotations()

console.log(annotations)
// [
//   {
//     id: "ann_xyz123",
//     type: "arrow",
//     coordinates: {start: {x: 100, y: 200}, end: {x: 500, y: 300}},
//     affectedEffects: ["effect_abc"],
//     color: "#FF0000",
//     strokeWidth: 3,
//     drawnAtTimecode: 5000
//   }
// ]
```

### Get Natural Language Descriptions

```typescript
const {controllers, state} = omnislate.context
const descriptions = controllers.compositor.managers.drawingManager
  .serializeAnnotationsForAI(state)

console.log(descriptions)
// [
//   "User drew a #FF0000 arrow pointing right over video \"intro.mp4\" on track 1",
//   "User drew a #00FF00 rectangle (600x450px) overlapping 2 effects: video \"clip1.mp4\" on track 1, text \"title\" on track 2"
// ]
```

---

## Understanding `affectedEffects`

The `affectedEffects` array contains **all effect IDs** that the annotation spatially overlaps with.

### Why an Array?
- **Single effect:** User draws circle around one clip → `["effect_1"]`
- **Multiple effects:** User draws line across two clips → `["effect_1", "effect_2"]`
- **No effects:** User draws on empty canvas → `[]`

### How It's Populated

The system automatically detects spatial intersection when the annotation is completed:

1. User finishes drawing
2. System calculates annotation bounding box
3. Compares with all visible effect bounding boxes
4. Finds all effects that intersect
5. Stores effect IDs in `affectedEffects` array (sorted by track, topmost first)

### Example Scenarios

**Scenario 1: Arrow between two clips**
```javascript
// User draws arrow from clip A to clip B
{
  type: "arrow",
  affectedEffects: ["clipA_id", "clipB_id"],  // Both clips
  // ... Arrow spans both effects
}
```

**Scenario 2: Circle highlighting one effect**
```javascript
// User draws circle around a title
{
  type: "circle",
  affectedEffects: ["title_effect_id"],  // Single effect
  // ... Circle only overlaps title
}
```

**Scenario 3: Freehand on empty area**
```javascript
// User draws wavy line on blank canvas
{
  type: "freehand",
  affectedEffects: [],  // No effects overlapped
  // ... Drawing doesn't touch any clips
}
```

---

## Building AI Prompts (Member 4)

### Basic Prompt Construction

```typescript
async function buildAIPrompt(userText: string) {
  const {state, controllers} = omnislate.context
  const {drawingManager} = controllers.compositor.managers

  // Get natural language descriptions
  const annotationDescriptions = drawingManager.serializeAnnotationsForAI(state)

  const prompt = `
Current Timeline State:
- Total effects: ${state.effects.length}
- Current timecode: ${state.timecode}ms

User Annotations:
${annotationDescriptions.map((desc, i) => `${i + 1}. ${desc}`).join('\n')}

User Request: "${userText}"

Based on the annotations and request, suggest MCP tool calls to accomplish the user's intent.
  `.trim()

  return prompt
}

// Example output:
// Current Timeline State:
// - Total effects: 5
// - Current timecode: 10000ms
//
// User Annotations:
// 1. User drew a #FF0000 arrow pointing right over video "intro.mp4" on track 1
// 2. User drew a #00FF00 rectangle (400x300px) over text "title" on track 2
//
// User Request: "add a transition between these"
```

### Advanced: Spatial Analysis

```typescript
function analyzeAnnotationIntent(annotation: Annotation, state: State) {
  const {type, coordinates, affectedEffects} = annotation

  switch (type) {
    case 'arrow':
      // Arrow likely indicates direction/flow between effects
      if (affectedEffects.length === 2) {
        const [fromEffect, toEffect] = affectedEffects.map(id =>
          state.effects.find(e => e.id === id)
        )
        return {
          intent: 'transition',
          from: fromEffect,
          to: toEffect,
          direction: getArrowDirection(coordinates.start!, coordinates.end!)
        }
      }
      break

    case 'circle':
      // Circle likely highlights a single effect for modification
      if (affectedEffects.length === 1) {
        const effect = state.effects.find(e => e.id === affectedEffects[0])
        return {
          intent: 'modify',
          target: effect,
          emphasis: 'strong'  // Circle = strong emphasis
        }
      }
      break

    case 'rectangle':
      // Rectangle likely selects multiple effects as a group
      return {
        intent: 'group-operation',
        targets: affectedEffects.map(id => state.effects.find(e => e.id === id)),
        area: calculateRectangleArea(coordinates.start!, coordinates.end!)
      }

    case 'freehand':
      // Freehand could indicate path, connection, or emphasis
      if (affectedEffects.length > 1) {
        return {
          intent: 'connect',
          targets: affectedEffects.map(id => state.effects.find(e => e.id === id))
        }
      }
      break
  }

  return {intent: 'unknown'}
}

function getArrowDirection(start: Point, end: Point): string {
  const angle = Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI)
  if (angle >= -45 && angle < 45) return 'right'
  if (angle >= 45 && angle < 135) return 'down'
  if (angle >= 135 || angle < -135) return 'left'
  return 'up'
}

function calculateRectangleArea(start: Point, end: Point): number {
  const width = Math.abs(end.x - start.x)
  const height = Math.abs(end.y - start.y)
  return width * height
}
```

---

## Drawing Mode Actions (Member 2)

### Enable/Disable

```typescript
import {omnislate} from "../context/context.js"

// Enable draw mode with specific tool
omnislate.context.actions.set_drawing_mode(true, 'arrow', '#FF0000', 3)

// Disable draw mode
omnislate.context.actions.set_drawing_mode(false)
```

### Read Current State

```typescript
const {drawing_mode, annotations} = omnislate.context.state

console.log(drawing_mode.enabled)      // boolean
console.log(drawing_mode.tool)         // 'freehand' | 'arrow' | 'rectangle' | 'circle'
console.log(drawing_mode.color)        // string (hex)
console.log(drawing_mode.strokeWidth)  // number
console.log(annotations)               // Annotation[]
```

### Manage Annotations

```typescript
// Clear all
omnislate.context.actions.clear_annotations()

// Remove specific annotation
omnislate.context.actions.remove_annotation(annotationId)
```

---

## Console Test

```javascript
// 1. Enable draw mode
omnislate.context.actions.set_drawing_mode(true, 'arrow', '#FF0000', 3)

// 2. Draw an arrow on the canvas (click & drag)

// 3. Check the annotation data
const annotations = omnislate.context.controllers.compositor.managers.drawingManager.getAnnotations()
console.log('Annotations:', JSON.stringify(annotations, null, 2))

// Example output:
// [
//   {
//     "id": "xyz123",
//     "type": "arrow",
//     "coordinates": {
//       "start": {"x": 200, "y": 300},
//       "end": {"x": 800, "y": 500}
//     },
//     "affectedEffects": [],
//     "color": "#FF0000",
//     "strokeWidth": 3,
//     "drawnAtTimecode": 0
//   }
// ]

// 4. Get AI-friendly description
const {state, controllers} = omnislate.context
const descriptions = controllers.compositor.managers.drawingManager.serializeAnnotationsForAI(state)
console.log('For AI:', descriptions)

// Example output:
// ["User drew a #FF0000 arrow pointing right on empty canvas area"]
```

---

## Migration from Old Format

If you have code using the old format, here's the mapping:

### Old Format (Deprecated)
```typescript
{
  points?: Point[]              // freehand
  start?: Point                 // arrow, rectangle
  end?: Point                   // arrow, rectangle
  center?: Point                // circle
  radius?: number               // circle
  associatedEffect?: string     // SINGLE effect ID
  associatedTrack?: number      // track index
}
```

### New Format (Current)
```typescript
{
  coordinates: {
    path?: Point[]              // freehand
    start?: Point               // arrow, rectangle
    end?: Point                 // arrow, rectangle
    center?: Point              // circle
    radius?: number             // circle
  }
  affectedEffects: string[]     // ARRAY of effect IDs
  drawnAtTimecode?: number      // timecode (instead of timestamp)
}
```

### Code Migration

**Old:**
```typescript
if (annotation.points) {  // freehand
  // ...
}
if (annotation.associatedEffect) {
  const effect = state.effects.find(e => e.id === annotation.associatedEffect)
}
```

**New:**
```typescript
if (annotation.coordinates.path) {  // freehand
  // ...
}
if (annotation.affectedEffects.length > 0) {
  const effects = annotation.affectedEffects.map(id =>
    state.effects.find(e => e.id === id)
  )
}
```

---

## Summary

✅ **Standardized structure** - Consistent format across team
✅ **Array of affected effects** - Supports multi-effect annotations
✅ **Nested coordinates** - Clean separation of geometry data
✅ **Timecode tracking** - Know when annotation was drawn
✅ **Natural language serialization** - Easy AI prompt construction

**Questions?** See `DRAWING_SYSTEM_INTEGRATION.md` for full details.
