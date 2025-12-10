# Custom Elements Panel

## Overview

The Custom Elements Panel allows you to dynamically control elements in your Lottie animation that have custom IDs assigned in After Effects. This enables real-time modification of colors, opacity, stroke properties, and text content without editing the source files.

## How It Works

1. In After Effects, assign custom IDs to layers you want to control (e.g., `#my-logo`, `#main-gradient`)
2. Export your animation with Bodymovin
3. Open in the player - custom elements are automatically detected
4. Use the panel controls to modify properties in real-time

## Accessing the Panel

- Click the orange **Elements** button in the control bar
- The panel slides in from the right side
- Available in both standard and mini mode

## Supported Element Types

### Shapes and Groups
- **Opacity**: Slider from 0% to 100%
- **Fill Color**: Color picker for solid fills
- **Stroke Color**: Color picker for stroke colors
- **Stroke Width**: Slider (0-200) with number input for precision

### Gradients
- **Gradient Stops**: Individual color picker for each color stop
- Changes persist across animation playback
- Works with both linear and radial gradients

### Text Layers
- **Text Content**: Editable text field with Apply button
- Press Enter or click Apply to update
- Animation is automatically refreshed to display new text

## Multiple Instances

If multiple elements share the same ID:
- Only one control appears in the panel
- Changes apply to ALL instances with that ID
- Works even for elements not yet visible in the animation

## Adding Custom IDs in After Effects

1. Select the layer you want to control
2. In the layer name, prefix with `#` (e.g., `#my-element`)
3. Bodymovin will export this as the element's ID

### Example Layer Names
```
#main-gradient     -> Controls main gradient colors
#logo-opacity      -> Controls logo visibility
#title-text        -> Controls text content
#stroke-element    -> Controls stroke color/width
```

## JavaScript API

You can also control elements programmatically:

```javascript
// Update gradient colors
setGradient('main-gradient', '#ff0000', '#0000ff');

// Update element opacity
document.querySelectorAll('[id="my-element"]').forEach(el => {
    el.style.opacity = '0.5';
});
```

## Limitations

- Text changes require animation reload (handled automatically)
- Some complex nested compositions may not expose all properties
- Animated properties may override manual changes during playback

## Tips

1. Use descriptive ID names for easier identification
2. Group related elements under a single ID for batch control
3. Use the Refresh button after animation structure changes
4. Gradient changes persist even when elements animate in/out
