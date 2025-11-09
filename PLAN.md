# Bar Simulation Game - Implementation Plan

## Overview
A collaborative bar simulation game built with playhtml, featuring interactive elements that sync in real-time.

## Core Elements

### 1. Cigarette Element
**Functionality:**
- Draggable (can be moved around the bar)
- Clickable to toggle lit/unlit state
- Visual states: unlit and lit (assets to be added)

**Technical Implementation:**
- Use `can-play` for full control
- State: `{ x, y, isLit }`
- `onClick`: Toggle `isLit` state
- `onDrag`: Update position
- `updateElement`: Render based on state (unlit/lit visual)

**Asset Placeholders:**
- Unlit cigarette image
- Lit cigarette image (with glow/particles if desired)

### 2. Cursor Selector
**Functionality:**
- UI panel to select from available custom cursors
- Selection persists per-user (localStorage)
- Shows which cursor each user has selected (awareness)

**Technical Implementation:**
- Use `can-play` for the selector UI
- Store selected cursor in localStorage (per-user preference)
- Use awareness to show which cursor each user selected
- Apply custom cursor via CSS `cursor` property or custom cursor element
- Display available cursor options as clickable items

**Asset Placeholders:**
- Multiple cursor image files (visitor will provide)

## File Structure
```
Bartest/
├── index.html          # Main HTML file with playhtml setup
├── styles.css          # Styling for the bar and elements
├── script.js           # playhtml element configurations
└── assets/             # (to be added by user)
    ├── cigarette-unlit.png
    ├── cigarette-lit.png
    └── cursors/
        ├── cursor1.png
        ├── cursor2.png
        └── ...
```

## Implementation Steps

1. **Base HTML Structure**
   - Set up playhtml initialization
   - Create container for bar elements
   - Add cigarette element
   - Add cursor selector element

2. **Cigarette Element**
   - Configure defaultData with position and isLit state
   - Implement onClick to toggle lit state
   - Implement onDrag for movement
   - Implement updateElement to render state

3. **Cursor Selector**
   - Create UI for cursor selection
   - Store selection in localStorage
   - Apply cursor style to document
   - Use awareness to show others' selections

4. **Styling**
   - Bar background/theme
   - Cigarette positioning and states
   - Cursor selector panel
   - Responsive layout

## Data Structure

### Cigarette
```javascript
defaultData: {
  x: 100,
  y: 100,
  isLit: false
}
```

### Cursor Selector
```javascript
// Per-user (localStorage)
selectedCursor: "cursor1"

// Awareness (shared)
myDefaultAwareness: {
  selectedCursor: "cursor1"
}
```

## Next Steps After Base Implementation
1. User adds cigarette assets (unlit/lit images)
2. User adds cursor assets
3. Fine-tune positioning and animations
4. Add additional bar elements if desired

