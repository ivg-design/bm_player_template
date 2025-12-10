# Lottie Player Controls Documentation

## Overview

The advanced Lottie player provides comprehensive playback controls and UI customization options.

## Control Features

### Playback Controls

#### Play/Pause Button
- Animated SVG icons for visual feedback
- Smooth transitions between states
- Keyboard shortcut: Spacebar

#### Progress Bar
- Custom slider with visual feedback
- Scrubbing support for frame-by-frame navigation
- Height: 100px (standard), 12px (mini mode)
- Real-time position updates

#### Speed Control
- Range: 0.25x to 2x playback speed
- Default: 1x speed
- Smooth speed transitions
- Visual indicator of current speed

### Display Features

#### Frame Counter
- Current frame / Total frames display
- Real-time updates during playback
- Format: `XXX / YYY frames`

#### Time Display
- Current time / Total duration
- Format: `XX.Xs / YY.Ys`
- Millisecond precision

#### Animation Info Panel
- FPS (Frames Per Second)
- Duration in seconds
- Total frame count
- Color-coded metrics

### Side Panels

#### Segments Panel
- Lists all animation segments defined by markers
- Shows segment name, start frame, and end frame
- Click to select and preview a segment
- Play Segment button to loop selected segment
- Reset button to return to full timeline playback
- Available in both standard and mini mode

#### Custom Elements Panel
- Automatically scans Lottie SVG for custom IDs
- Detects shapes, groups, gradients, and text layers
- Controls available:
  - **Opacity**: Slider from 0% to 100%
  - **Fill Color**: Color picker for solid fills
  - **Stroke Color**: Color picker for strokes
  - **Stroke Width**: Slider (0-200) with number input
  - **Gradient Colors**: Individual color pickers for each stop
  - **Text Content**: Editable text with Apply button
- Elements with same ID show single control (affects all instances)
- Refresh button to rescan after animation changes
- Available in both standard and mini mode

### UI Modes

#### Standard Mode
- Full control panel with all features visible
- Height: 200px
- All controls accessible
- Side panels slide in from edges

#### Mini Mode
- Compact view for space-saving
- Height: 50px
- Progress bar only (12px height)
- Toggle button to expand/collapse
- Segments and Custom Elements panels available above mini bar

### Styling

#### Color Scheme
```css
/* Primary Colors */
--primary-green: #00e676;
--primary-cyan: #00bcd4;
--primary-orange: #ff9800;

/* Background Colors */
--bg-main: #1a1a1a;
--bg-panel: #2a2a2a;
--bg-hover: #3a3a3a;
```

#### Slider Customization
```css
.slider::-webkit-slider-thumb {
    width: 24px;
    height: 24px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(1px);
    border: 5px solid #3f3f3f;
    border-radius: 50%;
}
```

## Implementation Details

### Event Handlers

```javascript
// Play/Pause Toggle
playPauseBtn.addEventListener('click', () => {
    if (animation.isPaused) {
        animation.play();
    } else {
        animation.pause();
    }
});

// Speed Control
speedSlider.addEventListener('input', (e) => {
    animation.setSpeed(parseFloat(e.target.value));
});

// Progress Scrubbing
progressSlider.addEventListener('input', (e) => {
    animation.goToAndStop(e.target.value, true);
});
```

### Animation Loop

```javascript
function updateDisplay() {
    const currentFrame = animation.currentFrame;
    const totalFrames = animation.totalFrames;
    
    frameDisplay.textContent = `${Math.round(currentFrame)} / ${totalFrames} frames`;
    progressSlider.value = currentFrame;
    
    requestAnimationFrame(updateDisplay);
}
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Play/Pause |
| ← | Previous frame |
| → | Next frame |
| ↑ | Increase speed |
| ↓ | Decrease speed |
| M | Toggle mini mode |
| L | Toggle loop |
| R | Toggle reverse |

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Partial support (no backdrop-filter)
- Mobile: Touch-optimized controls