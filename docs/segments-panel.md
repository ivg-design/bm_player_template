# Segments Panel

## Overview

The Segments Panel displays animation segments defined by markers in After Effects. This allows you to preview and loop specific portions of your animation without manual frame navigation.

## How It Works

1. In After Effects, add markers to define segment start points
2. Set marker duration to define segment length
3. Export with Bodymovin - markers become segments
4. Use the panel to select and play individual segments

## Accessing the Panel

- Click the green **Segments** button in the control bar
- The panel slides in from the left side
- Available in both standard and mini mode

## Panel Features

### Segment List
- Displays all segments with their names
- Shows start frame and end frame for each
- Click a segment to select it

### Controls
- **Play Segment**: Loops the selected segment continuously
- **Reset**: Returns to full timeline playback

## Adding Markers in After Effects

1. Move the playhead to the segment start position
2. Press `*` on the numpad (or go to Layer > Add Marker)
3. Double-click the marker to edit
4. Set the **Duration** to define segment length
5. Add a **Comment** to name the segment

### Example Markers
```
Frame 0:   "idle-loop" (duration: 90 frames)
Frame 93:  "tear-left" (duration: 20 frames)
Frame 127: "tear-right" (duration: 20 frames)
```

## Segment Data Structure

In the exported JSON, markers appear as:
```json
"markers": [
    {"tm": 0, "cm": "idle-loop", "dr": 90},
    {"tm": 93, "cm": "tear-left", "dr": 20},
    {"tm": 127, "cm": "tear-right", "dr": 20}
]
```

- `tm`: Start time (frame)
- `cm`: Comment (segment name)
- `dr`: Duration (frames)

## JavaScript API

```javascript
// Play a specific segment
anim.playSegments([startFrame, endFrame], true);

// Example: Play frames 0-90
anim.playSegments([0, 90], true);

// Reset to full timeline
anim.resetSegments(true);
anim.goToAndPlay(0, true);
```

## Use Cases

1. **Idle Loops**: Create a looping idle state
2. **Transitions**: Preview enter/exit animations
3. **States**: Test different animation states
4. **QA Testing**: Verify specific animation segments

## Tips

1. Name your markers descriptively for easy identification
2. Keep segment names short for better panel display
3. Use consistent naming conventions across projects
4. Test segments at different playback speeds
