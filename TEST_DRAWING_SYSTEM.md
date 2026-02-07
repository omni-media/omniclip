# Testing the Drawing System in OmniClip

## Step 1: Open the Application

1. Navigate to **http://127.0.0.1:8081** in your browser
2. Open the browser DevTools console (F12 or Cmd+Option+I)

---

## Step 2: Verify Drawing Manager is Available

Run this in the console to check if the drawing manager loaded:

```javascript
// Check if drawing manager exists
console.log('Drawing Manager:', omnislate.context.controllers.compositor.managers.drawingManager)

// Check initial state
console.log('Initial Drawing Mode:', omnislate.context.state.drawing_mode)
console.log('Initial Annotations:', omnislate.context.state.annotations)
```

**Expected output**: You should see the DrawingManager object and initial state with `enabled: false` and empty annotations array.

---

## Step 3: Test Freehand Tool

```javascript
// Enable freehand drawing with red color
omnislate.context.actions.set_drawing_mode(true, 'freehand', '#FF0000', 3)

console.log('Drawing mode enabled:', omnislate.context.state.drawing_mode)
```

**Now try**: Click and drag on the canvas to draw freehand lines. You should see red lines appear as you draw.

**Check result**:
```javascript
const annotations = omnislate.context.controllers.compositor.managers.drawingManager.getAnnotations()
console.log('Freehand annotations:', JSON.stringify(annotations, null, 2))
```

---

## Step 4: Test Arrow Tool

```javascript
// Enable arrow drawing with blue color
omnislate.context.actions.set_drawing_mode(true, 'arrow', '#0000FF', 4)

console.log('Arrow mode enabled')
```

**Now try**: Click to start an arrow, then drag and release to complete it. You should see a blue arrow with an arrowhead.

**Check result**:
```javascript
const annotations = omnislate.context.controllers.compositor.managers.drawingManager.getAnnotations()
console.log('Total annotations:', annotations.length)
console.log('Latest annotation:', annotations[annotations.length - 1])
```

---

## Step 5: Test Rectangle Tool

```javascript
// Enable rectangle drawing with green color
omnislate.context.actions.set_drawing_mode(true, 'rectangle', '#00FF00', 2)

console.log('Rectangle mode enabled')
```

**Now try**: Click and drag to draw a rectangle. You should see a green rectangle outline.

**Check if it overlaps any effects** (if you have video/text on timeline):
```javascript
const annotations = omnislate.context.controllers.compositor.managers.drawingManager.getAnnotations()
const latest = annotations[annotations.length - 1]
console.log('Rectangle affectedEffects:', latest.affectedEffects)

// If it has affected effects, show which ones
if (latest.affectedEffects.length > 0) {
  latest.affectedEffects.forEach(id => {
    const effect = omnislate.context.state.effects.find(e => e.id === id)
    console.log('- Overlaps:', effect)
  })
}
```

---

## Step 6: Test Circle Tool

```javascript
// Enable circle drawing with yellow color
omnislate.context.actions.set_drawing_mode(true, 'circle', '#FFFF00', 3)

console.log('Circle mode enabled')
```

**Now try**: Click at center point, then drag outward to define radius. You should see a yellow circle.

---

## Step 7: Test Natural Language Serialization for AI

```javascript
// Get AI-friendly descriptions
const {state, controllers} = omnislate.context
const descriptions = controllers.compositor.managers.drawingManager.serializeAnnotationsForAI(state)

console.log('AI Descriptions:')
descriptions.forEach((desc, i) => {
  console.log(`${i + 1}. ${desc}`)
})
```

**Expected output**: Natural language descriptions like:
- "User drew a #FF0000 freehand stroke with 45 points on empty canvas area"
- "User drew a #0000FF arrow pointing right over video \"example.mp4\" on track 1"

---

## Step 8: Test Effect Overlap Detection

If you have video clips or text on the timeline:

```javascript
// Draw a rectangle over multiple clips
omnislate.context.actions.set_drawing_mode(true, 'rectangle', '#FF00FF', 3)

// After drawing over clips, check which effects were detected
const annotations = omnislate.context.controllers.compositor.managers.drawingManager.getAnnotations()
const latest = annotations[annotations.length - 1]

console.log('Affected effects count:', latest.affectedEffects.length)
console.log('Affected effect IDs:', latest.affectedEffects)

// Get full effect details
const affectedEffectDetails = latest.affectedEffects.map(id => {
  const effect = omnislate.context.state.effects.find(e => e.id === id)
  return {
    id: effect.id,
    kind: effect.kind,
    track: effect.track,
    name: 'name' in effect ? effect.name : 'unnamed'
  }
})

console.table(affectedEffectDetails)
```

---

## Step 9: Test Clearing Annotations

```javascript
// Clear all annotations
omnislate.context.actions.clear_annotations()

console.log('Annotations after clear:', omnislate.context.state.annotations)
// Should be empty array []
```

---

## Step 10: Disable Drawing Mode

```javascript
// Disable drawing mode
omnislate.context.actions.set_drawing_mode(false)

console.log('Drawing mode:', omnislate.context.state.drawing_mode.enabled)
// Should be false

// Try clicking on canvas - drawing should NOT work anymore
```

---

## Complete Test Script (Copy-Paste All at Once)

```javascript
console.log('=== DRAWING SYSTEM TEST ===\n')

// 1. Check if drawing manager exists
console.log('1. Checking DrawingManager...')
const dm = omnislate.context.controllers.compositor.managers.drawingManager
console.log('✓ DrawingManager exists:', !!dm)
console.log('')

// 2. Enable freehand mode
console.log('2. Enabling freehand mode (red, thickness 3)')
omnislate.context.actions.set_drawing_mode(true, 'freehand', '#FF0000', 3)
console.log('✓ Drawing mode:', omnislate.context.state.drawing_mode)
console.log('→ Try drawing on the canvas now!')
console.log('')

// Wait for user to draw...
console.log('After drawing, run the following to check results:')
console.log('----------------------------------------')
console.log('const annotations = omnislate.context.controllers.compositor.managers.drawingManager.getAnnotations()')
console.log('console.log("Annotations:", JSON.stringify(annotations, null, 2))')
console.log('----------------------------------------')
```

---

## Troubleshooting

### If drawing doesn't appear:
```javascript
// Check if stage has annotation layer
const stage = omnislate.context.controllers.compositor.app.stage
console.log('Stage children:', stage.children.map(c => c.name))
// Should include 'annotation-layer'

// Check annotation layer
const annotationLayer = stage.children.find(c => c.name === 'annotation-layer')
console.log('Annotation layer:', annotationLayer)
console.log('Annotation layer children count:', annotationLayer?.children.length)
```

### If effect detection doesn't work:
```javascript
// Check current effects on timeline
console.log('Effects on timeline:', omnislate.context.state.effects.length)
omnislate.context.state.effects.forEach((e, i) => {
  console.log(`${i}. ${e.kind} on track ${e.track}`, e)
})
```

### Check DrawingManager methods:
```javascript
const dm = omnislate.context.controllers.compositor.managers.drawingManager
console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(dm)))
```

---

## Expected Behavior

✅ **Drawing should**:
- Appear in real-time as you drag
- Stay on canvas after releasing mouse
- Be visible above all effects
- Match the selected color and stroke width

✅ **Annotations should**:
- Be stored in `state.annotations` array
- Have unique IDs
- Include coordinates based on tool type
- List `affectedEffects` if overlapping with clips

✅ **Drawing mode should**:
- Only allow drawing when `enabled: true`
- Block normal canvas interactions when active
- Disable when `set_drawing_mode(false)` is called

---

## Quick Visual Test

Run this for rapid visual testing of all tools:

```javascript
// Test all tools sequentially
async function testAllTools() {
  const tools = [
    { tool: 'freehand', color: '#FF0000', name: 'Red Freehand' },
    { tool: 'arrow', color: '#00FF00', name: 'Green Arrow' },
    { tool: 'rectangle', color: '#0000FF', name: 'Blue Rectangle' },
    { tool: 'circle', color: '#FFFF00', name: 'Yellow Circle' }
  ]

  for (const t of tools) {
    console.log(`\n>>> ${t.name} - Draw now!`)
    omnislate.context.actions.set_drawing_mode(true, t.tool, t.color, 3)
    await new Promise(resolve => {
      console.log('Press Enter in console when done drawing this shape')
      // User draws manually during this pause
    })
  }

  console.log('\n=== All Annotations ===')
  const annotations = omnislate.context.controllers.compositor.managers.drawingManager.getAnnotations()
  console.table(annotations.map(a => ({
    type: a.type,
    color: a.color,
    affectedEffects: a.affectedEffects.length
  })))

  // Get AI descriptions
  const {state, controllers} = omnislate.context
  const descriptions = controllers.compositor.managers.drawingManager.serializeAnnotationsForAI(state)
  console.log('\n=== AI Descriptions ===')
  descriptions.forEach((d, i) => console.log(`${i + 1}. ${d}`))

  omnislate.context.actions.set_drawing_mode(false)
  console.log('\n✓ All tests complete!')
}

console.log('Run testAllTools() to test all drawing tools')
```
