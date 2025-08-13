# Build Process Documentation

## Overview

The build process transforms the demo template into a production-ready file for the Bodymovin extension.

## Build Steps

### 1. File Verification
The build script first verifies that all required files exist:
- `src/demo_template.html` - Source template
- `lib/minified_bm_player.min.js` - Minified Lottie player

### 2. Template Processing

#### Remove CDN Scripts
The script removes external CDN references:
```html
<!-- Before -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>

<!-- After -->
<!-- CDN script removed -->
```

#### Inject Minified Player
The minified player is injected after the `<body>` tag:
```html
<body>
<!-- build:scripto -->
<script>
  // Minified Lottie player code
</script>
<!-- endbuild -->
```

#### Replace Animation Data
Mock data is replaced with a placeholder:
```javascript
// Before
var animationData = { /* mock JSON data */ };

// After
var animationData = "__[[ANIMATIONDATA]]__";
```

### 3. Deployment

The processed file is deployed to:
```
/Library/Application Support/Adobe/CEP/extensions/bodymovin/assets/player/demo.html
```

### 4. Backup Creation

Existing files are backed up with timestamp:
```
demo.old.YYMMDD-HHMM.html
```

## Running the Build

```bash
# Using yarn
yarn build

# Using node directly
node build.js
```

## Error Handling

The build script includes comprehensive error handling:
- File existence checks
- Replacement verification
- Deployment validation
- Automatic rollback on failure

## Configuration

Build configuration can be modified in `scripts/build.js`:
```javascript
const CONFIG = {
  sourceTemplate: path.join(__dirname, '..', 'src', 'demo_template.html'),
  minifiedPlayer: path.join(__dirname, '..', 'lib', 'minified_bm_player.min.js'),
  targetDir: '/Library/Application Support/Adobe/CEP/extensions/bodymovin/assets/player/',
  targetFile: 'demo.html',
  animationPlaceholder: '__[[ANIMATIONDATA]]__'
};
```