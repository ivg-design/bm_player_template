# Bodymovin Player Template Builder

A professional Lottie animation player with advanced controls and a build system for integration with the After Effects Bodymovin plugin.

## Features

### 🎮 Advanced Player Controls
- Play/pause with animated SVG icons
- Progress bar with scrubbing support
- Speed control (0.25x - 2x)
- Frame counter and time display
- Loop and reverse playback options
- Mini mode for compact viewing
- Subframe rendering toggle (fixes rounded corner flickering)

### 🎨 Professional UI
- Dark theme with consistent color scheme
- Frosted glass effect on controls
- Smooth animations and transitions
- Responsive design
- Touch-optimized for mobile

### 🔧 Build System
- Automated template processing
- Minified player injection
- Bodymovin integration
- Backup creation
- One-command deployment

## Overview

The build system automates the process of:

1. Injecting the minified Lottie player into the template
2. Setting up the animation data placeholder
3. Deploying to the Bodymovin extension directory

## Project Structure

```
bm_player_template/
├── src/                    # Source templates
│   └── demo_template.html  # Template with CDN-linked player
├── lib/                    # Libraries
│   └── minified_bm_player.min.js  # Minified Lottie player
├── scripts/                # Build scripts
│   └── build.js           # Template processing script
├── dist/                   # Output directory (optional)
├── docs/                   # Documentation
│   ├── TOC.md             # Documentation index
│   ├── build-process.md   # Build system details
│   └── player-controls.md # Player features guide
├── package.json           # Node.js configuration
├── LICENSE                # MIT License
├── CHANGELOG.md           # Version history
└── README.md              # This file
```

## Installation

1. Clone this repository:
```bash
git clone https://github.com/ivg-design/bm_player_template.git
cd bm_player_template
```

2. Install dependencies:
```bash
yarn install
```

## Usage

Run the build script:
```bash
yarn build
# or
node build.js
```

The script will:

1. **Check Files** - Verify all required files exist
2. **Process Template** - 
   - Remove CDN script tags for the Lottie player
   - Inject the minified player after the `<body>` tag
   - Replace mock animation data with the placeholder `__[[ANIMATIONDATA]]__`
3. **Verify Changes** - Confirm all replacements were made correctly
4. **Deploy** - Copy to the Bodymovin extension directory with backup

## Template Structure

The processed template will have:

```html
<body>
<!-- build:scripto -->
<script>
  // Minified player code here
</script>
<!-- endbuild -->

<!-- Rest of HTML -->

<script>
  var animationData = "__[[ANIMATIONDATA]]__";
  // Animation initialization code
</script>
</body>
```

## Bodymovin Integration

The processed `demo.html` file is placed in:
```
/Library/Application Support/Adobe/CEP/extensions/bodymovin/assets/player/
```

The Bodymovin plugin will:
1. Use the template with the embedded player
2. Replace `__[[ANIMATIONDATA]]__` with actual animation JSON
3. Export a self-contained HTML file

## Backup

The script automatically creates backups of existing files with the format:
```
demo.old.YYMMDD-HHMM.html
```

## Requirements

- Node.js 14+
- Yarn package manager
- Write access to the Adobe CEP extensions directory

## Documentation

- [Build Process](docs/build-process.md) - Detailed build system documentation
- [Player Controls](docs/player-controls.md) - Advanced player features guide
- [Documentation TOC](docs/TOC.md) - Complete documentation index

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and updates.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Issues

Found a bug or have a feature request? Please open an issue on [GitHub Issues](https://github.com/ivg-design/bm_player_template/issues).

## License

MIT