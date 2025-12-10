#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

// ANSI color codes (works in all modern terminals)
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

// Parse command line arguments
const args = process.argv.slice(2);
const autoYes = args.includes('--yes') || args.includes('-y');

// Simple prompt function
function prompt(question, defaultValue = false) {
  if (autoYes) return Promise.resolve(true);

  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const hint = defaultValue ? '(Y/n)' : '(y/N)';
    rl.question(`${question} ${hint} `, (answer) => {
      rl.close();
      const normalized = answer.trim().toLowerCase();
      if (normalized === '') resolve(defaultValue);
      else resolve(normalized === 'y' || normalized === 'yes');
    });
  });
}

// Detect platform and get Bodymovin path
function getBodymovinPath() {
  const platform = os.platform();
  if (platform === 'darwin') {
    return '/Library/Application Support/Adobe/CEP/extensions/bodymovin/assets/player/';
  } else if (platform === 'win32') {
    const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
    return path.join(appData, 'Adobe', 'CEP', 'extensions', 'bodymovin', 'assets', 'player');
  }
  return null;
}

// Configuration
const CONFIG = {
  sourceTemplate: path.join(__dirname, '..', 'src', 'demo_template.html'),
  minifiedPlayer: path.join(__dirname, '..', 'lib', 'minified_bm_player.min.js'),
  targetDir: getBodymovinPath(),
  targetFile: 'demo.html',
  animationPlaceholder: '__[[ANIMATIONDATA]]__',
  platform: os.platform()
};

// Utility functions
function fileExists(filePath) {
  try { return fs.existsSync(filePath); }
  catch { return false; }
}

function readFile(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); }
  catch (e) { console.error(`${c.red}Error reading ${filePath}: ${e.message}${c.reset}`); return null; }
}

function writeFile(filePath, content) {
  try { fs.writeFileSync(filePath, content, 'utf8'); return true; }
  catch (e) { console.error(`${c.red}Error writing ${filePath}: ${e.message}${c.reset}`); return false; }
}

function getBackupName() {
  const now = new Date();
  const ts = [
    String(now.getFullYear()).slice(-2),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    '-',
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0')
  ].join('');
  return `demo.old.${ts}.html`;
}

async function checkFiles() {
  console.log(`${c.blue}\n📁 Checking source files...${c.reset}`);

  const checks = {
    templateExists: fileExists(CONFIG.sourceTemplate),
    playerExists: fileExists(CONFIG.minifiedPlayer),
    targetDirExists: CONFIG.targetDir && fileExists(CONFIG.targetDir),
    targetFileExists: CONFIG.targetDir && fileExists(path.join(CONFIG.targetDir, CONFIG.targetFile))
  };

  const yes = `${c.green}✓ Found${c.reset}`;
  const no = `${c.red}✗ Not found${c.reset}`;

  console.log(`${c.gray}  Template file:${c.reset}`, checks.templateExists ? yes : no);
  console.log(`${c.gray}  Minified player:${c.reset}`, checks.playerExists ? yes : no);
  console.log(`${c.gray}  Target directory:${c.reset}`, checks.targetDirExists ? yes : no);
  console.log(`${c.gray}  Existing demo.html:${c.reset}`, checks.targetFileExists ? `${c.yellow}⚠ Will be backed up${c.reset}` : `${c.gray}None${c.reset}`);

  return checks;
}

async function processTemplate() {
  console.log(`${c.blue}\n🔧 Processing template...${c.reset}`);

  const templateContent = readFile(CONFIG.sourceTemplate);
  const playerContent = readFile(CONFIG.minifiedPlayer);

  if (!templateContent || !playerContent) {
    console.error(`${c.red}Failed to read source files${c.reset}`);
    return null;
  }

  let processedContent = templateContent;

  // Step 1: Remove CDN script tags
  const cdnScriptPattern = /<script[^>]*src=["'][^"']*lottie[^"']*\.js["'][^>]*><\/script>/gi;
  const cdnMatches = processedContent.match(cdnScriptPattern);
  if (cdnMatches) {
    processedContent = processedContent.replace(cdnScriptPattern, '');
    console.log(`${c.gray}  ✓ Removed${c.reset} ${c.cyan}${cdnMatches.length}${c.reset} ${c.gray}CDN script tag(s)${c.reset}`);
  }

  // Step 2: Replace/inject player
  const buildMarkerPattern = /<!-- build:scripto -->[\s\S]*?<!-- endbuild -->/;
  const hasMarkers = buildMarkerPattern.test(processedContent);
  const escapedPlayerContent = playerContent.replace(/\$/g, '$$$$');

  if (hasMarkers) {
    const replacement = `<!-- build:scripto -->\n<script>\n${escapedPlayerContent}\n</script>\n<!-- endbuild -->`;
    processedContent = processedContent.replace(buildMarkerPattern, replacement);
    console.log(`${c.gray}  ✓ Replaced content between build markers${c.reset}`);
  } else {
    const bodyTagPattern = /(<body[^>]*>)/i;
    const bodyMatch = processedContent.match(bodyTagPattern);
    if (bodyMatch) {
      const injection = `${bodyMatch[0]}\n<!-- build:scripto -->\n<script>\n${escapedPlayerContent}\n</script>\n<!-- endbuild -->`;
      processedContent = processedContent.replace(bodyTagPattern, () => injection);
      console.log(`${c.gray}  ✓ Injected minified player after <body> tag${c.reset}`);
    } else {
      console.error(`${c.red}  ✗ Could not find <body> tag${c.reset}`);
      return null;
    }
  }

  // Step 3: Replace animationData
  const animationDataPattern = /var\s+animationData\s*=\s*({[\s\S]*?});/g;
  if (processedContent.match(animationDataPattern)) {
    processedContent = processedContent.replace(animationDataPattern, `var animationData = "${CONFIG.animationPlaceholder}";`);
    console.log(`${c.gray}  ✓ Replaced animationData with placeholder${c.reset}`);
  } else {
    const placeholderExists = processedContent.includes(CONFIG.animationPlaceholder);
    if (placeholderExists) {
      console.log(`${c.gray}  ℹ Placeholder already exists${c.reset}`);
    } else {
      console.log(`${c.yellow}  ⚠ No animationData variable found${c.reset}`);
    }
  }

  // Step 4: Verify
  console.log(`${c.blue}\n✅ Verification:${c.reset}`);

  const hasPlayerScript = processedContent.includes('<!-- build:scripto -->') && processedContent.includes('<!-- endbuild -->');
  const hasPlaceholder = processedContent.includes(CONFIG.animationPlaceholder);
  const hasCDN = cdnScriptPattern.test(processedContent);

  console.log(`${c.gray}  Player injection:${c.reset}`, hasPlayerScript ? `${c.green}✓ Verified${c.reset}` : `${c.red}✗ Failed${c.reset}`);
  console.log(`${c.gray}  Animation placeholder:${c.reset}`, hasPlaceholder ? `${c.green}✓ Verified${c.reset}` : `${c.red}✗ Failed${c.reset}`);
  console.log(`${c.gray}  CDN scripts removed:${c.reset}`, !hasCDN ? `${c.green}✓ Verified${c.reset}` : `${c.red}✗ Failed${c.reset}`);

  if (!hasPlayerScript || !hasPlaceholder || hasCDN) {
    console.error(`${c.red}\n❌ Template processing failed verification${c.reset}`);
    return null;
  }

  return { content: processedContent };
}

async function main() {
  console.log(`${c.bold}${c.cyan}\n🚀 Bodymovin Template Builder${c.reset}\n`);
  console.log(`${c.gray}This script will prepare the template for the bodymovin plugin${c.reset}`);

  // Platform info
  const platformNames = { darwin: 'macOS', win32: 'Windows', linux: 'Linux' };
  console.log(`${c.gray}  Platform:${c.reset} ${c.cyan}${platformNames[CONFIG.platform] || CONFIG.platform}${c.reset}`);

  if (!CONFIG.targetDir) {
    console.log(`${c.yellow}\n⚠ Unsupported platform. You can save to a custom location.${c.reset}`);
  }

  // Check files
  const checks = await checkFiles();

  if (!checks.templateExists || !checks.playerExists) {
    console.error(`${c.red}\n❌ Required source files are missing!${c.reset}`);
    process.exit(1);
  }

  // Process template
  const result = await processTemplate();
  if (!result) {
    console.error(`${c.red}\n❌ Template processing failed!${c.reset}`);
    process.exit(1);
  }

  // Handle missing target directory
  if (!checks.targetDirExists) {
    console.log(`${c.yellow}\n⚠ Target directory does not exist:${c.reset}`);
    console.log(`${c.gray}${CONFIG.targetDir || 'Not configured'}${c.reset}`);

    const useCurrentDir = await prompt('Save to current directory instead?', true);
    if (useCurrentDir) {
      CONFIG.targetDir = process.cwd();
      console.log(`${c.gray}Output will be saved to current directory${c.reset}`);
    } else {
      console.log(`${c.yellow}Operation cancelled${c.reset}`);
      process.exit(0);
    }
  }

  // Summary
  console.log(`${c.blue}\n📋 Summary:${c.reset}`);
  console.log(`${c.gray}  Source template:${c.reset}`, path.basename(CONFIG.sourceTemplate));
  console.log(`${c.gray}  Output location:${c.reset}`, CONFIG.targetDir);
  console.log(`${c.gray}  Output file:${c.reset}`, CONFIG.targetFile);

  if (checks.targetFileExists) {
    console.log(`${c.gray}  Backup file:${c.reset} ${c.yellow}${getBackupName()}${c.reset}`);
  }

  // Confirm
  const confirm = await prompt('Proceed with replacing the file?', false);
  if (!confirm) {
    console.log(`${c.yellow}\n⚠ Operation cancelled by user${c.reset}`);
    process.exit(0);
  }

  // Create backup
  const targetPath = path.join(CONFIG.targetDir, CONFIG.targetFile);
  if (fileExists(targetPath)) {
    const backupPath = path.join(CONFIG.targetDir, getBackupName());
    try {
      fs.copyFileSync(targetPath, backupPath);
      console.log(`${c.green}\n✓ Backup created: ${path.basename(backupPath)}${c.reset}`);
    } catch (e) {
      console.error(`${c.red}\n✗ Failed to create backup: ${e.message}${c.reset}`);
      process.exit(1);
    }
  }

  // Write output
  if (writeFile(targetPath, result.content)) {
    console.log(`${c.bold}${c.green}\n✨ Success! Template has been processed and saved.${c.reset}`);
    console.log(`${c.gray}  File saved to: ${targetPath}${c.reset}`);
  } else {
    console.error(`${c.red}\n❌ Failed to write the processed file${c.reset}`);
    process.exit(1);
  }
}

main().catch(e => {
  console.error(`${c.red}\n❌ Unexpected error: ${e.message}${c.reset}`);
  process.exit(1);
});
