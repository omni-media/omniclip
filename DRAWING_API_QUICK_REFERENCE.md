# Drawing System - Quick Reference

## State Access

```typescript
import {omnislate} from "./s/context/context.js"

const {state, actions, compositor} = omnislate.context
const {drawing_mode, annotations} = state
const {drawingManager} = compositor.managers
```

---

## Actions (Member 2 UI)

### Enable/Disable Draw Mode
```typescript
actions.set_drawing_mode(true, 'freehand')   // Enable with tool
actions.set_drawing_mode(true)               // Enable with current tool
actions.set_drawing_mode(false)              // Disable
```

### Change Tool
```typescript
actions.set_drawing_tool('freehand')   // ✏️ Freehand
actions.set_drawing_tool('arrow')      // ➡️ Arrow
actions.set_drawing_tool('rectangle')  // ⬜ Rectangle
actions.set_drawing_tool('circle')     // ⭕ Circle
```

### Change Appearance
```typescript
actions.set_drawing_color('#FF0000')      // Red
actions.set_drawing_stroke_width(5)       // 5px wide
```

### Manage Annotations
```typescript
actions.clear_annotations()               // Clear all
actions.remove_annotation(id)             // Remove one
```

---

## API (Member 4 AI)

### Get Annotation Data
```typescript
// Raw data
const annotations = drawingManager.getAnnotations()

// Natural language
const descriptions = drawingManager.serializeAnnotationsForAI(state)
// ["User drew a #FF4444 arrow pointing right over video effect on track 1"]
```

### Annotation Structure
```typescript
{
  id: string
  type: 'freehand' | 'arrow' | 'rectangle' | 'circle'
  color: string              // '#FF4444'
  strokeWidth: number        // 3
  timestamp: number          // Date.now()

  // Geometry (varies by type)
  points?: Point[]           // freehand only
  start?: Point              // arrow, rectangle
  end?: Point                // arrow, rectangle
  center?: Point             // circle only
  radius?: number            // circle only

  // Context
  associatedEffect?: string  // effect.id
  associatedTrack?: number   // track index
}
```

---

## State Properties

### Drawing Mode
```typescript
state.drawing_mode.enabled       // boolean
state.drawing_mode.tool          // 'freehand' | 'arrow' | 'rectangle' | 'circle'
state.drawing_mode.color         // string (hex)
state.drawing_mode.strokeWidth   // number
```

### Annotations
```typescript
state.annotations                // Annotation[]
state.annotations.length         // number
```

---

## Console Test Commands

```javascript
// Quick test
omnislate.context.actions.set_drawing_mode(true, 'arrow', '#FF0000', 3)
// Draw on canvas
console.log(omnislate.context.state.annotations)

// Get AI descriptions
console.log(
  omnislate.context.compositor.managers.drawingManager
    .serializeAnnotationsForAI(omnislate.context.state)
)

// Clear
omnislate.context.actions.clear_annotations()
omnislate.context.actions.set_drawing_mode(false)
```

---

## File Locations

- **Types:** `s/context/types.ts`
- **State:** `s/context/state.ts`
- **Actions:** `s/context/actions.ts`
- **Manager:** `s/context/controllers/compositor/parts/drawing-manager.ts`
- **Tools:** `s/context/controllers/compositor/parts/drawing-tools.ts`
- **Demo UI:** `s/components/drawing-toolbar-demo.ts`
- **Full Docs:** `DRAWING_SYSTEM_INTEGRATION.md`
- **Summary:** `DRAWING_SYSTEM_IMPLEMENTATION_SUMMARY.md`

---

## Integration Checklist

### Member 2 (UI)
- [ ] Create draw mode toggle button
- [ ] Build tool selector (4 tools)
- [ ] Add color picker
- [ ] Add stroke width control
- [ ] Implement context menu
- [ ] Create AI prompt textbox
- [ ] Style active cursor

### Member 4 (AI)
- [ ] Call `getAnnotations()` on submit
- [ ] Use `serializeAnnotationsForAI()` for context
- [ ] Build prompt with annotation descriptions
- [ ] Parse AI response to MCP calls
- [ ] Execute via Member 3's server
- [ ] Handle accept/reject flow
- [ ] Clear annotations on success
