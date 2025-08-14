# Subframe Rendering Toggle

## Overview
The subframe rendering toggle is a feature added to address flickering issues with rounded corners in Lottie animations exported from After Effects.

## Problem
When After Effects animations with rounded corner effects are played in the Lottie player, the corners may flicker between rounded and straight states during playback. This is caused by:
- Subframe rendering interpolation issues
- Precision mismatches in calculations
- Frame timing inconsistencies

## Solution
A toggle button has been added to the player controls that allows users to enable or disable subframe rendering.

### How It Works
1. **Enable (Default)**: Subframe rendering is active, providing smoother animations but may cause flickering with rounded corners
2. **Disable**: Subframe rendering is turned off, which resolves flickering issues but may result in slightly less smooth animations

### Usage
- Click the subframe toggle button (icon shows "01" in a frame)
- Button lights up purple when enabled (active)
- Button dims when disabled (inactive)
- Animation automatically resets to frame 0 when toggled to immediately show the effect

### Implementation Details
The toggle uses the Lottie player's `setSubframe()` method to control rendering behavior:
```javascript
anim.setSubframe(enabled); // true = enabled, false = disabled
```

### When to Use
Disable subframe rendering when you experience:
- Flickering rounded corners
- Unstable path morphing
- Jittery shape animations

Keep it enabled for:
- Smooth motion graphics
- Regular animations without rounded corners
- High frame rate playback requirements