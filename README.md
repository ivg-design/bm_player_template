# Bodymovin Player Template Builder

<p align="center">
  <strong>A professional Lottie animation player with advanced controls and automated build system for seamless integration with Adobe After Effects Bodymovin plugin</strong>
</p>

<p align="center">
  <a href="#key-features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

---

## Project Overview

The Bodymovin Player Template Builder is a comprehensive solution for creating professional Lottie animation players with advanced controls. It provides an automated build system that seamlessly integrates with the Adobe After Effects Bodymovin extension, enabling designers and developers to export animations with a fully-featured, customizable player interface.

### Purpose

This project serves as a bridge between animation creation in After Effects and web deployment, offering:

- **For Designers**: A polished, ready-to-use player interface for showcasing animations
- **For Developers**: An automated build pipeline that eliminates manual template processing
- **For Teams**: A standardized workflow for animation export and deployment

## Key Features

### 🎮 Advanced Player Controls

- **Playback Controls**
  - Play/pause with animated SVG icons for visual feedback
  - Smooth progress bar with frame-accurate scrubbing support
  - Variable speed control (0.25x to 2x) for detailed animation review

- **Display Options**
  - Real-time frame counter and time display
  - Loop and reverse playback modes
  - Mini mode for space-efficient embedding
  - Subframe rendering toggle to fix rounded corner flickering issues

### 🎬 Segments Panel

- View and play animation segments defined by After Effects markers
- Click to select and preview specific segments
- Loop selected segments for testing
- Reset to full timeline playback

### 🎨 Custom Elements Panel

- **Dynamic Element Control**
  - Automatically detects elements with custom IDs from After Effects
  - Real-time modification of colors, opacity, and properties
  - Changes persist across animation playback

- **Supported Controls**
  - Opacity slider (0-100%)
  - Fill and stroke color pickers
  - Stroke width control (0-200) with number input
  - Gradient color stop editors
  - Text content editing for text layers

- **Smart Features**
  - Multiple instances with same ID controlled together
  - Works with elements not yet visible in animation
  - Gradient changes persist through visibility toggles

### 🎨 Professional User Interface

- **Visual Design**
  - Modern dark theme with carefully selected color palette
  - Frosted glass effect (backdrop-filter) on control elements
  - Smooth CSS transitions and animations throughout
  - Consistent visual language across all controls

- **Responsive & Accessible**
  - Fully responsive design adapts to any screen size
  - Touch-optimized controls for mobile devices
  - Keyboard navigation support
  - High contrast ratios for accessibility

### 🔧 Automated Build System

- **Template Processing**
  - Automatic CDN script removal and replacement
  - Minified Lottie player injection directly into HTML
  - Animation data placeholder insertion for Bodymovin
  
- **Deployment Features**
  - One-command deployment to Adobe CEP extensions
  - Automatic backup creation with timestamped filenames
  - Verification steps to ensure successful processing
  - Rollback capability on deployment failure

### 🚀 Performance Optimizations

- Minified player reduces file size by ~60%
- Self-contained HTML eliminates external dependencies
- Optimized rendering with configurable subframe settings
- Efficient DOM manipulation for smooth playback

## Installation

### Prerequisites

- **Node.js** 14.0 or higher
- **Yarn** package manager (recommended) or npm
- **Adobe After Effects** with Bodymovin extension (for integration)
- Write access to Adobe CEP extensions directory

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/ivg-design/bm_player_template.git
   cd bm_player_template
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or using npm
   npm install
   ```

3. **Verify installation**
   ```bash
   # Check that all files are present
   ls -la src/ lib/ scripts/
   ```

## Usage

### Basic Usage

Run the build script to process the template and deploy to Bodymovin:

```bash
yarn build
# or
npm run build
# or directly
node scripts/build.js
```

### Build Process Steps

The build script performs the following operations:

1. **File Verification** - Confirms all required source files exist
2. **Template Processing**
   - Removes CDN script tags for external Lottie player
   - Injects minified player code after `<body>` tag
   - Replaces mock animation data with `__[[ANIMATIONDATA]]__` placeholder
3. **Validation** - Verifies all replacements were successful
4. **Deployment** - Copies processed file to Bodymovin directory with backup

### Usage Examples

#### Standard Build
```bash
yarn build
```

#### Build with Custom Output
```bash
# Modify CONFIG in scripts/build.js for custom paths
node scripts/build.js
```

#### Manual Template Testing
```html
<!-- Open src/demo_template.html in browser -->
<!-- Animation will load with mock data for testing -->
```

### Player Controls Guide

| Control | Function | Keyboard Shortcut |
|---------|----------|------------------|
| Play/Pause | Toggle animation playback | Space |
| Progress Bar | Scrub through animation | Click/Drag |
| Speed Slider | Adjust playback speed (0.25x-2x) | - |
| Loop Toggle | Enable/disable animation looping | L |
| Reverse Toggle | Play animation in reverse | R |
| Mini Mode | Compact player interface | M |
| Subframe Toggle | Fix rounded corner flickering | S |

## Architecture Overview

### Project Structure

```
bm_player_template/
├── src/                          # Source files
│   └── demo_template.html        # Template with CDN-linked player
│
├── lib/                          # Libraries and dependencies
│   └── minified_bm_player.min.js # Minified Lottie player (5.12.2)
│
├── scripts/                      # Build and automation scripts
│   └── build.js                  # Main build script with template processing
│
├── docs/                         # Documentation
│   ├── TOC.md                    # Documentation index
│   ├── build-process.md          # Detailed build system documentation
│   ├── player-controls.md        # Player features and usage guide
│   ├── segments-panel.md         # Animation segments documentation
│   ├── custom-elements.md        # Custom elements panel guide
│   └── subframe-rendering.md     # Technical details on flickering fix
│
├── dist/                         # Build output (optional, git-ignored)
│
├── package.json                  # Node.js project configuration
├── yarn.lock                     # Dependency lock file
├── LICENSE                       # MIT License
├── CHANGELOG.md                  # Version history and changes
└── README.md                     # This file
```

### Technical Architecture

#### Component Hierarchy

```
HTML Template
├── Lottie Container
│   └── Animation Canvas
├── Control Panel
│   ├── Playback Controls
│   │   ├── Play/Pause Button
│   │   ├── Progress Bar
│   │   └── Time Display
│   ├── Settings Controls
│   │   ├── Speed Slider
│   │   ├── Loop Toggle
│   │   └── Reverse Toggle
│   └── Display Controls
│       ├── Mini Mode Toggle
│       └── Subframe Toggle
└── Info Panel
    ├── Frame Counter
    └── Animation Metrics
```

#### Data Flow

```
After Effects → Bodymovin Export → Template Processing → Player Deployment
                                          ↓
                                  Animation JSON
                                          ↓
                                  Lottie Player
                                          ↓
                                  User Controls
```

### Build Configuration

The build system uses a configuration object in `scripts/build.js`:

```javascript
const CONFIG = {
  sourceTemplate: 'src/demo_template.html',
  minifiedPlayer: 'lib/minified_bm_player.min.js',
  targetDir: '/Library/Application Support/Adobe/CEP/extensions/bodymovin/assets/player/',
  targetFile: 'demo.html',
  animationPlaceholder: '__[[ANIMATIONDATA]]__'
};
```

## Contributing Guidelines

We welcome contributions to improve the Bodymovin Player Template Builder!

### How to Contribute

1. **Fork the repository**
   ```bash
   git fork https://github.com/ivg-design/bm_player_template.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style and conventions
   - Add comments for complex logic
   - Update documentation as needed

4. **Test your changes**
   ```bash
   yarn build
   # Verify the output works correctly
   ```

5. **Commit with descriptive messages**
   ```bash
   git commit -m "feat: Add new control for animation scaling"
   ```

6. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Development Guidelines

- **Code Style**: Use consistent indentation (tabs for HTML/CSS, 2 spaces for JS)
- **Naming**: Use descriptive variable and function names
- **Comments**: Add JSDoc comments for functions
- **Testing**: Manually test all player controls after changes
- **Documentation**: Update README and docs for new features

### Areas for Contribution

- Additional player controls (zoom, rotation, etc.)
- Theme customization options
- Performance optimizations
- Cross-browser compatibility improvements
- Accessibility enhancements
- Unit tests and automation

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Build script fails | Check Node.js version (14+) and file permissions |
| Player doesn't appear | Verify Lottie library is loaded correctly |
| Animation not loading | Check animation JSON format and placeholder |
| Controls not responsive | Ensure JavaScript is enabled and no errors in console |
| Deployment fails | Verify write access to Adobe CEP directory |

### Debug Mode

Enable debug logging in `scripts/build.js`:
```javascript
log.setLevel('debug');
```

## Resources

- [Project Documentation](docs/TOC.md) - Complete documentation index
- [Build Process Details](docs/build-process.md) - In-depth build system guide
- [Player Controls Reference](docs/player-controls.md) - Detailed controls documentation
- [Bodymovin Extension](https://github.com/airbnb/lottie-web) - Official Lottie library
- [After Effects Plugin](https://aescripts.com/bodymovin/) - Bodymovin for After Effects

## Version History

See [CHANGELOG.md](CHANGELOG.md) for detailed version history and updates.

### Latest Updates (v0.4.0)
- 🎨 Custom Elements Panel for dynamic element control
- 🎬 Segments Panel for marker-based playback
- ✏️ Text layer editing with live updates
- 🔧 Stroke width control (0-200) with number input
- 🎯 Single control for elements with same ID
- ⌨️ Spacebar no longer triggers play/pause in text inputs
- 📱 Panels available in mini mode

## Support

- **Issues**: [GitHub Issues](https://github.com/ivg-design/bm_player_template/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ivg-design/bm_player_template/discussions)
- **Email**: support@ivg-design.com

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ⚠️ Liability limited
- ⚠️ Warranty not provided
- ℹ️ License and copyright notice required

---

<p align="center">
  Made with ❤️ by <a href="https://ivg-design.com">IVG Design</a>
</p>

<p align="center">
  <sub>Built for designers and developers who care about quality animations</sub>
</p>