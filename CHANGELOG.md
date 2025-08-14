# Changelog

All notable changes to the Bodymovin Player Template Builder will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- MIT License file
- Organized project structure with dedicated folders
- Subframe rendering toggle button to address rounded corner flickering issues
- Visual feedback for subframe toggle state (active/inactive)
- Auto-reset animation when toggling subframe to immediately show effect

### Changed
- Moved source template to `src/` directory
- Moved minified player to `lib/` directory  
- Moved build script to `scripts/` directory
- Added `dist/` directory for output files
- Updated all paths and documentation to reflect new structure

### Fixed
- Implemented workaround for rounded corner flickering in Lottie animations
- Added ability to disable subframe rendering which resolves flickering issues

## [0.2.0] - 2025-08-13

### Added
- Advanced Lottie animation player controls
- Play/pause functionality with animated SVG icons
- Progress bar with custom slider styling
- Speed control slider (0.25x - 2x playback speed)
- Frame counter display
- Loop toggle functionality
- Reverse playback option
- Mini mode for compact UI display
- Frosted glass effect on slider thumbs
- Color-coded unit selector buttons
- Styled info panel with animation metrics
- Dark theme with consistent color scheme

### Fixed
- Removed all currentColor references causing color inheritance issues
- Fixed nested SVG structure in unit selector
- Corrected progress bar height in mini mode
- Ensured consistent icon colors across UI

### Changed
- Updated demo template with complete player interface
- Improved slider styling with transparent centers
- Added smooth 0.5s ease transitions throughout UI

## [0.1.0] - 2025-08-13

### Added
- Initial project setup
- Build script for template processing
- Demo template HTML with CDN-linked Lottie player
- Minified Lottie player for injection
- Package.json configuration with yarn
- README documentation
- .gitignore configuration
- Automated deployment to Adobe CEP extensions directory
- Backup creation for existing files

### Technical
- Build script removes CDN script tags and injects minified player
- Replaces mock animation data with `__[[ANIMATIONDATA]]__` placeholder
- Supports Node.js 14+ and yarn package manager

[Unreleased]: https://github.com/ivg-design/bm_player_template/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/ivg-design/bm_player_template/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/ivg-design/bm_player_template/releases/tag/v0.1.0