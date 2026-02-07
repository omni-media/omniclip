# Drawing Overlay System - Integration Guide

## Overview

The Drawing Overlay system provides a canvas-based annotation layer on top of the Pixi.js video preview. Users can draw freehand strokes, arrows, rectangles, and circles to visually indicate areas of interest before submitting AI prompts.

**Owner:** Member 1 (nishi)
**Interfaces with:** Member 2 (UI/UX), Member 4 (AI Integration)

---

## Architecture

### Core Components

1. **Type Definitions** (`s/context/types.ts`)
   - `DrawingToolType`: `'freehand' | 'arrow' | 'rectangle' | 'circle'`
   - `Annotation`: Complete annotation data structure
   - `DrawingMode`: Current drawing state

2. **State Management** (`s/context/state.ts`, `s/context/actions.ts`)
   - Annotations stored in `NonHistoricalState` (ephemeral UI overlays)
   - Actions for managing drawing mode and annotations

3. **Drawing Tools** (`s/context/controllers/compositor/parts/drawing-tools.ts`)
   - Strategy pattern implementation
   - Each tool handles start/update/end lifecycle

4. **Drawing Manager** (`s/context/controllers/compositor/parts/drawing-manager.ts`)
   - Manages Pixi overlay layer
   - Handles pointer events when draw mode is enabled
   - Provides hit detection and annotation serialization

---

## Member 2: UI Integration

### Enabling Draw Mode

To enable drawing mode from your UI component:

```typescript
import {omnislate} from "../context/context.js"

// Enable drawing with a specific tool
function enableDrawMode(tool: 'freehand' | 'arrow' | 'rectangle' | 'circle') {
  const {actions} = omnislate.context
  actions.set_drawing_mode(true, tool)
}

// Disable drawing mode
function disableDrawMode() {
  const {actions} = omnislate.context
  actions.set_drawing_mode(false)
}

// Change drawing tool (while draw mode is enabled)
function changeTool(tool: 'freehand' | 'arrow' | 'rectangle' | 'circle') {
  const {actions} = omnislate.context
  actions.set_drawing_tool(tool)
}

// Change drawing color
function changeColor(color: string) {
  const {actions} = omnislate.context
  actions.set_drawing_color(color) // e.g., '#FF4444', '#00FF00'
}

// Change stroke width
function changeStrokeWidth(width: number) {
  const {actions} = omnislate.context
  actions.set_drawing_stroke_width(width) // e.g., 2, 3, 5
}
```

### Reading Current State

```typescript
import {omnislate} from "../context/context.js"

function getDrawingState() {
  const {state} = omnislate.context

  const isDrawing = state.drawing_mode.enabled
  const currentTool = state.drawing_mode.tool
  const currentColor = state.drawing_mode.color
  const strokeWidth = state.drawing_mode.strokeWidth
  const annotations = state.annotations

  return {
    isDrawing,
    currentTool,
    currentColor,
    strokeWidth,
    annotationCount: annotations.length
  }
}
```

### Clearing Annotations

```typescript
import {omnislate} from "../context/context.js"

function clearAllAnnotations() {
  const {actions} = omnislate.context
  actions.clear_annotations()
}

function removeAnnotation(annotationId: string) {
  const {actions} = omnislate.context
  actions.remove_annotation(annotationId)
}
```

### UI Component Example

Here's a basic toolbar component for drawing controls:

```typescript
import {html, css} from "@benev/slate"
import {omnislate} from "../../context/context.js"

export const DrawingToolbar = () => {
  const {state, actions} = omnislate.context
  const {drawing_mode, annotations} = state

  const tools = [
    {type: 'freehand', icon: '✏️', label: 'Freehand'},
    {type: 'arrow', icon: '➡️', label: 'Arrow'},
    {type: 'rectangle', icon: '⬜', label: 'Rectangle'},
    {type: 'circle', icon: '⭕', label: 'Circle'}
  ]

  const toggleDrawMode = () => {
    actions.set_drawing_mode(!drawing_mode.enabled)
  }

  const selectTool = (tool: string) => {
    actions.set_drawing_tool(tool as any)
  }

  const clearAnnotations = () => {
    actions.clear_annotations()
  }

  return html`
    <div class="drawing-toolbar">
      <button
        class=${drawing_mode.enabled ? 'active' : ''}
        @click=${toggleDrawMode}
      >
        ${drawing_mode.enabled ? 'Exit Draw Mode' : 'Draw Mode'}
      </button>

      ${drawing_mode.enabled && html`
        <div class="tool-selector">
          ${tools.map(tool => html`
            <button
              class=${drawing_mode.tool === tool.type ? 'selected' : ''}
              @click=${() => selectTool(tool.type)}
              title=${tool.label}
            >
              ${tool.icon}
            </button>
          `)}
        </div>

        <input
          type="color"
          value=${drawing_mode.color}
          @input=${(e: Event) => {
            actions.set_drawing_color((e.target as HTMLInputElement).value)
          }}
        />

        <input
          type="range"
          min="1"
          max="10"
          value=${drawing_mode.strokeWidth}
          @input=${(e: Event) => {
            actions.set_drawing_stroke_width(
              parseInt((e.target as HTMLInputElement).value)
            )
          }}
        />

        <button @click=${clearAnnotations}>
          Clear (${annotations.length})
        </button>
      `}
    </div>
  `
}
```

### Context Menu Integration

For right-click context menu on canvas:

```typescript
import {omnislate} from "../context/context.js"

// Listen for right-click on canvas
function setupContextMenu() {
  const canvas = document.querySelector('canvas')

  canvas?.addEventListener('contextmenu', (e) => {
    e.preventDefault()

    const {state} = omnislate.context

    // Only show context menu if there are annotations
    if (state.annotations.length > 0) {
      showContextMenu(e.clientX, e.clientY)
    }
  })
}

function showContextMenu(x: number, y: number) {
  // Show your custom context menu UI
  // Options: "Send to AI", "Clear annotations", "Cancel"
}
```

---

## Member 4: AI Integration

### Getting Annotation Data

```typescript
import {omnislate} from "../context/context.js"

function getAnnotationsForAI() {
  const {state, compositor} = omnislate.context

  // Raw annotation data
  const annotations = state.annotations

  // Or use the manager's API
  const annotationsFromManager = compositor.managers.drawingManager.getAnnotations()

  return annotations
}
```

### Annotation Data Structure

Each annotation contains:

```typescript
interface Annotation {
  id: string                    // Unique identifier
  type: DrawingToolType         // 'freehand' | 'arrow' | 'rectangle' | 'circle'
  color: string                 // Hex color (e.g., '#FF4444')
  strokeWidth: number           // Stroke width in pixels
  timestamp: number             // When the annotation was created

  // Drawing data (varies by type)
  points?: Point[]              // Freehand: array of {x, y} points
  start?: Point                 // Arrow/Rectangle: start point
  end?: Point                   // Arrow/Rectangle: end point
  center?: Point                // Circle: center point
  radius?: number               // Circle: radius in pixels

  // Timeline association (for context)
  associatedEffect?: string     // ID of effect this annotation overlaps
  associatedTrack?: number      // Track index (0-based)
}
```

### Serializing Annotations to Natural Language

The DrawingManager provides a helper to convert annotations to human-readable text:

```typescript
import {omnislate} from "../context/context.js"

function serializeAnnotationsForPrompt() {
  const {state, compositor} = omnislate.context
  const {drawingManager} = compositor.managers

  // Get natural language descriptions
  const descriptions = drawingManager.serializeAnnotationsForAI(state)

  // Returns array of strings like:
  // [
  //   "User drew a #FF4444 arrow pointing right over video effect on track 1 (\"intro.mp4\")",
  //   "User drew a #00FF00 rectangle (200x150px) over text effect on track 2",
  //   "User drew a #0000FF circle with radius 50px on empty canvas area"
  // ]

  return descriptions
}
```

### Building the AI Prompt

Example of combining annotations with user text:

```typescript
import {omnislate} from "../context/context.js"

async function buildAIPrompt(userPrompt: string) {
  const {state, compositor} = omnislate.context
  const {drawingManager} = compositor.managers

  // Get timeline state
  const effects = state.effects
  const timecode = state.timecode

  // Get annotation context
  const annotationDescriptions = drawingManager.serializeAnnotationsForAI(state)

  // Build prompt
  const systemContext = `
Current timeline state:
- ${effects.length} effects on ${state.tracks.length} tracks
- Current timecode: ${timecode}ms

User annotations:
${annotationDescriptions.map((desc, i) => `${i + 1}. ${desc}`).join('\n')}

User request: ${userPrompt}
  `.trim()

  return systemContext
}
```

### Spatial Analysis

For more advanced spatial reasoning:

```typescript
import {omnislate} from "../context/context.js"
import type {Annotation} from "../context/types.js"

function analyzeAnnotationSpatially(annotation: Annotation) {
  const {state} = omnislate.context

  switch (annotation.type) {
    case 'arrow':
      if (annotation.start && annotation.end) {
        const dx = annotation.end.x - annotation.start.x
        const dy = annotation.end.y - annotation.start.y
        const length = Math.sqrt(dx * dx + dy * dy)
        const angle = Math.atan2(dy, dx) * (180 / Math.PI)

        return {
          direction: getDirectionFromAngle(angle),
          length: Math.round(length),
          fromEffect: annotation.associatedEffect,
          // You can detect what the arrow points TO by checking end point
        }
      }
      break

    case 'rectangle':
      if (annotation.start && annotation.end) {
        const width = Math.abs(annotation.end.x - annotation.start.x)
        const height = Math.abs(annotation.end.y - annotation.start.y)
        const area = width * height

        return {
          dimensions: {width: Math.round(width), height: Math.round(height)},
          area: Math.round(area),
          coveredEffect: annotation.associatedEffect
        }
      }
      break

    case 'circle':
      if (annotation.center && annotation.radius) {
        const area = Math.PI * annotation.radius * annotation.radius

        return {
          radius: Math.round(annotation.radius),
          area: Math.round(area),
          centerPoint: annotation.center,
          highlightedEffect: annotation.associatedEffect
        }
      }
      break

    case 'freehand':
      if (annotation.points && annotation.points.length > 0) {
        // Analyze freehand gesture
        const bounds = getFreehandBounds(annotation.points)
        const isClosed = isPathClosed(annotation.points)

        return {
          pointCount: annotation.points.length,
          bounds,
          isClosed,
          crossedEffects: [annotation.associatedEffect] // Could expand to multiple
        }
      }
      break
  }

  return null
}

function getDirectionFromAngle(angle: number): string {
  if (angle >= -22.5 && angle < 22.5) return 'right'
  if (angle >= 22.5 && angle < 67.5) return 'down-right'
  if (angle >= 67.5 && angle < 112.5) return 'down'
  if (angle >= 112.5 && angle < 157.5) return 'down-left'
  if (angle >= 157.5 || angle < -157.5) return 'left'
  if (angle >= -157.5 && angle < -112.5) return 'up-left'
  if (angle >= -112.5 && angle < -67.5) return 'up'
  return 'up-right'
}

function getFreehandBounds(points: Point[]) {
  const xs = points.map(p => p.x)
  const ys = points.map(p => p.y)
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys)
  }
}

function isPathClosed(points: Point[], threshold = 20): boolean {
  if (points.length < 3) return false
  const first = points[0]
  const last = points[points.length - 1]
  const distance = Math.sqrt(
    Math.pow(last.x - first.x, 2) + Math.pow(last.y - first.y, 2)
  )
  return distance < threshold
}
```

### Workflow Example

Complete flow from annotation to AI action:

```typescript
async function handleAIPrompt(userText: string) {
  const {state, compositor, actions} = omnislate.context

  // 1. Get annotations
  const annotations = state.annotations

  if (annotations.length === 0) {
    throw new Error("No annotations drawn. Please draw on the canvas first.")
  }

  // 2. Serialize for AI
  const annotationContext = compositor.managers.drawingManager
    .serializeAnnotationsForAI(state)

  // 3. Build prompt
  const prompt = `
Timeline State:
- Effects: ${state.effects.length}
- Current time: ${state.timecode}ms

User Annotations:
${annotationContext.map((desc, i) => `${i + 1}. ${desc}`).join('\n')}

User Request: ${userText}

Please suggest specific MCP tool calls to fulfill this request.
  `.trim()

  // 4. Send to Claude API
  const response = await callClaudeAPI(prompt)

  // 5. Parse MCP tool calls from response
  const toolCalls = parseMCPToolCalls(response)

  // 6. Execute tool calls via Member 3's MCP server
  const results = await executeMCPTools(toolCalls)

  // 7. Clear annotations after successful execution
  actions.clear_annotations()

  return results
}
```

---

## State Actions Reference

### Non-Historical Actions (Drawing Mode)

```typescript
// Enable/disable draw mode with optional tool, color, strokeWidth
set_drawing_mode(enabled: boolean, tool?: DrawingToolType, color?: string, strokeWidth?: number)

// Change active tool
set_drawing_tool(tool: DrawingToolType)

// Change drawing color
set_drawing_color(color: string)

// Change stroke width
set_drawing_stroke_width(strokeWidth: number)

// Add annotation to state (called automatically by DrawingManager)
add_annotation(annotation: Annotation)

// Remove specific annotation
remove_annotation(id: string)

// Clear all annotations
clear_annotations()

// Replace all annotations (for collaboration sync)
set_annotations(annotations: Annotation[])
```

---

## Testing the System

### Manual Testing Checklist

1. **Enable draw mode:**
   ```typescript
   omnislate.context.actions.set_drawing_mode(true, 'freehand')
   ```

2. **Draw on canvas:** Click and drag on the preview canvas

3. **Check state:**
   ```typescript
   console.log(omnislate.context.state.annotations)
   ```

4. **Switch tools:**
   ```typescript
   omnislate.context.actions.set_drawing_tool('arrow')
   ```

5. **Get annotations:**
   ```typescript
   const annotations = omnislate.context.compositor.managers.drawingManager.getAnnotations()
   console.log(annotations)
   ```

6. **Serialize for AI:**
   ```typescript
   const descriptions = omnislate.context.compositor.managers.drawingManager
     .serializeAnnotationsForAI(omnislate.context.state)
   console.log(descriptions)
   ```

7. **Clear:**
   ```typescript
   omnislate.context.actions.clear_annotations()
   ```

### Console Test Script

Open browser console and paste:

```javascript
// Enable draw mode
omnislate.context.actions.set_drawing_mode(true, 'arrow', '#FF0000', 3)

// Draw something on canvas, then check:
console.log('Annotations:', omnislate.context.state.annotations)

// Serialize
const descriptions = omnislate.context.compositor.managers.drawingManager
  .serializeAnnotationsForAI(omnislate.context.state)
console.log('Descriptions:', descriptions)

// Disable
omnislate.context.actions.set_drawing_mode(false)
```

---

## Known Limitations & Future Enhancements

### Current Limitations
1. Annotations are not persisted (cleared on page refresh)
2. No undo/redo for individual annotations
3. No annotation editing after creation
4. Hit detection is basic bounding box (no precise pixel detection)

### Future Enhancements
1. Multi-select and delete annotations
2. Annotation persistence in project state
3. Eraser tool
4. Text annotation tool
5. Annotation grouping
6. Collaborative annotation sync via WebRTC
7. Export annotations as overlay on video

---

## Troubleshooting

### Drawing doesn't work
- Verify draw mode is enabled: `omnislate.context.state.drawing_mode.enabled === true`
- Check browser console for errors
- Ensure canvas is rendered: `document.querySelector('canvas')`

### Annotations don't appear
- Check annotation layer exists: `compositor.managers.drawingManager`
- Verify annotations in state: `omnislate.context.state.annotations`
- Check z-index: annotation layer should be at `zIndex: 10000`

### Hit detection is wrong
- Ensure effects have valid `rect` data
- Check effect is visible at current timecode
- Verify canvas coordinate system (0,0 is top-left)

### Serialization returns empty
- Confirm annotations exist in state
- Check `associatedEffect` is populated
- Verify effects are loaded in state

---

## Contact

**Member 1 (Drawing System Owner):** nishi
**Questions about:**
- Drawing tools implementation
- Annotation data structures
- Canvas overlay rendering
- Hit detection logic

Refer to:
- Member 2 for UI/UX integration questions
- Member 4 for AI prompt construction questions
- Member 3 for MCP tool execution questions
