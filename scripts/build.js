#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const log = require('loglevel');

// Set up logging
log.setLevel('info');

// Configuration
const CONFIG = {
  sourceTemplate: path.join(__dirname, '..', 'src', 'demo_template.html'),
  minifiedPlayer: path.join(__dirname, '..', 'lib', 'minified_bm_player.min.js'),
  targetDir: '/Library/Application Support/Adobe/CEP/extensions/bodymovin/assets/player/',
  targetFile: 'demo.html',
  animationPlaceholder: '__[[ANIMATIONDATA]]__'
};

// Utility functions
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    log.error(`Error writing file ${filePath}:`, error.message);
    return false;
  }
}

function getBackupName() {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  return `demo.old.${year}${month}${day}-${hour}${minute}.html`;
}

async function checkFiles() {
  log.info(chalk.blue('\n📁 Checking source files...'));
  
  const checks = {
    templateExists: fileExists(CONFIG.sourceTemplate),
    playerExists: fileExists(CONFIG.minifiedPlayer),
    targetDirExists: fileExists(CONFIG.targetDir),
    targetFileExists: fileExists(path.join(CONFIG.targetDir, CONFIG.targetFile))
  };

  log.info(chalk.gray('  Template file:'), checks.templateExists ? chalk.green('✓ Found') : chalk.red('✗ Not found'));
  log.info(chalk.gray('  Minified player:'), checks.playerExists ? chalk.green('✓ Found') : chalk.red('✗ Not found'));
  log.info(chalk.gray('  Target directory:'), checks.targetDirExists ? chalk.green('✓ Found') : chalk.red('✗ Not found'));
  log.info(chalk.gray('  Existing demo.html:'), checks.targetFileExists ? chalk.yellow('⚠ Will be backed up') : chalk.gray('None'));

  return checks;
}

async function processTemplate() {
  log.info(chalk.blue('\n🔧 Processing template...'));
  
  // Read source files
  const templateContent = readFile(CONFIG.sourceTemplate);
  const playerContent = readFile(CONFIG.minifiedPlayer);
  
  if (!templateContent || !playerContent) {
    log.error(chalk.red('Failed to read source files'));
    return null;
  }

  let processedContent = templateContent;
  let replacements = [];

  // Step 1: Remove CDN script tag for lottie player
  const cdnScriptPattern = /<script[^>]*src=["'][^"']*lottie[^"']*\.js["'][^>]*><\/script>/gi;
  const cdnMatches = processedContent.match(cdnScriptPattern);
  if (cdnMatches) {
    processedContent = processedContent.replace(cdnScriptPattern, '');
    replacements.push({
      action: 'Removed CDN script',
      count: cdnMatches.length
    });
    log.info(chalk.gray('  ✓ Removed'), chalk.cyan(cdnMatches.length), chalk.gray('CDN script tag(s)'));
  }

  // Step 2: Replace the content between build markers or inject if not found
  const buildMarkerPattern = /<!-- build:scripto -->[\s\S]*?<!-- endbuild -->/;
  const hasMarkers = buildMarkerPattern.test(processedContent);
  
  if (hasMarkers) {
    // Replace existing content between markers
    const escapedPlayerContent = playerContent.replace(/\$/g, '$$$$');
    const replacementContent = `<!-- build:scripto -->\n<script>\n${escapedPlayerContent}\n</script>\n<!-- endbuild -->`;
    processedContent = processedContent.replace(buildMarkerPattern, replacementContent);
    replacements.push({
      action: 'Replaced player content',
      location: 'Between build markers'
    });
    log.info(chalk.gray('  ✓ Replaced content between build markers'));
  } else {
    // Inject after <body> tag if markers don't exist
    const bodyTagPattern = /(<body[^>]*>)/i;
    const bodyMatch = processedContent.match(bodyTagPattern);
    if (bodyMatch) {
      const injectionPoint = bodyMatch[0];
      const escapedPlayerContent = playerContent.replace(/\$/g, '$$$$');
      const injectionContent = `${injectionPoint}\n<!-- build:scripto -->\n<script>\n${escapedPlayerContent}\n</script>\n<!-- endbuild -->`;
      processedContent = processedContent.replace(bodyTagPattern, () => injectionContent);
      replacements.push({
        action: 'Injected minified player',
        location: 'After <body> tag'
      });
      log.info(chalk.gray('  ✓ Injected minified player after <body> tag'));
    } else {
      log.error(chalk.red('  ✗ Could not find <body> tag'));
      return null;
    }
  }

  // Step 3: Replace animationData with placeholder
  // Look for the mock animationData variable
  const animationDataPattern = /var\s+animationData\s*=\s*({[\s\S]*?});/g;
  const animationMatches = processedContent.match(animationDataPattern);
  
  if (animationMatches) {
    processedContent = processedContent.replace(
      animationDataPattern,
      `var animationData = "${CONFIG.animationPlaceholder}";`
    );
    replacements.push({
      action: 'Replaced animationData',
      with: CONFIG.animationPlaceholder
    });
    log.info(chalk.gray('  ✓ Replaced animationData with placeholder'));
  } else {
    // If no mock data found, look for existing placeholder
    const placeholderPattern = new RegExp(`var\\s+animationData\\s*=\\s*"${CONFIG.animationPlaceholder.replace(/[[\]]/g, '\\$&')}"`, 'g');
    if (processedContent.match(placeholderPattern)) {
      log.info(chalk.gray('  ℹ Placeholder already exists'));
    } else {
      log.warn(chalk.yellow('  ⚠ No animationData variable found to replace'));
    }
  }

  // Step 4: Verify the replacements
  log.info(chalk.blue('\n✅ Verification:'));
  
  // Check if player was injected
  const hasPlayerScript = processedContent.includes('<!-- build:scripto -->') && 
                          processedContent.includes('<!-- endbuild -->');
  log.info(chalk.gray('  Player injection:'), hasPlayerScript ? chalk.green('✓ Verified') : chalk.red('✗ Failed'));
  
  // Check if placeholder is present
  const hasPlaceholder = processedContent.includes(CONFIG.animationPlaceholder);
  log.info(chalk.gray('  Animation placeholder:'), hasPlaceholder ? chalk.green('✓ Verified') : chalk.red('✗ Failed'));
  
  // Check if CDN scripts are removed
  const hasCDN = cdnScriptPattern.test(processedContent);
  log.info(chalk.gray('  CDN scripts removed:'), !hasCDN ? chalk.green('✓ Verified') : chalk.red('✗ Failed'));

  if (!hasPlayerScript || !hasPlaceholder || hasCDN) {
    log.error(chalk.red('\n❌ Template processing failed verification'));
    return null;
  }

  return {
    content: processedContent,
    replacements
  };
}

async function main() {
  log.info(chalk.bold.cyan('\n🚀 Bodymovin Template Builder\n'));
  log.info(chalk.gray('This script will prepare the template for the bodymovin plugin'));
  
  // Check files
  const checks = await checkFiles();
  
  if (!checks.templateExists || !checks.playerExists) {
    log.error(chalk.red('\n❌ Required source files are missing!'));
    process.exit(1);
  }

  // Process the template
  const result = await processTemplate();
  
  if (!result) {
    log.error(chalk.red('\n❌ Template processing failed!'));
    process.exit(1);
  }

  // Check if target directory exists
  if (!checks.targetDirExists) {
    log.warn(chalk.yellow('\n⚠ Target directory does not exist:'));
    log.warn(chalk.gray(CONFIG.targetDir));
    
    const { createDir } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'createDir',
        message: 'Would you like to save the processed file in the current directory instead?',
        default: true
      }
    ]);

    if (createDir) {
      CONFIG.targetDir = __dirname;
      log.info(chalk.gray('Output will be saved to current directory'));
    } else {
      log.info(chalk.yellow('Operation cancelled'));
      process.exit(0);
    }
  }

  // Show summary and confirm
  log.info(chalk.blue('\n📋 Summary:'));
  log.info(chalk.gray('  Source template:'), path.basename(CONFIG.sourceTemplate));
  log.info(chalk.gray('  Output location:'), CONFIG.targetDir);
  log.info(chalk.gray('  Output file:'), CONFIG.targetFile);
  
  if (checks.targetFileExists) {
    const backupName = getBackupName();
    log.info(chalk.gray('  Backup file:'), chalk.yellow(backupName));
  }

  const { confirmReplace } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmReplace',
      message: chalk.bold('Do you want to proceed with replacing the file?'),
      default: false
    }
  ]);

  if (!confirmReplace) {
    log.info(chalk.yellow('\n⚠ Operation cancelled by user'));
    process.exit(0);
  }

  // Create backup if file exists
  const targetPath = path.join(CONFIG.targetDir, CONFIG.targetFile);
  if (fileExists(targetPath)) {
    const backupPath = path.join(CONFIG.targetDir, getBackupName());
    try {
      fs.copyFileSync(targetPath, backupPath);
      log.info(chalk.green(`\n✓ Backup created: ${path.basename(backupPath)}`));
    } catch (error) {
      log.error(chalk.red(`\n✗ Failed to create backup: ${error.message}`));
      process.exit(1);
    }
  }

  // Write the processed file
  if (writeFile(targetPath, result.content)) {
    log.info(chalk.bold.green('\n✨ Success! Template has been processed and saved.'));
    log.info(chalk.gray(`  File saved to: ${targetPath}`));
  } else {
    log.error(chalk.red('\n❌ Failed to write the processed file'));
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  log.error(chalk.red('\n❌ Unexpected error:'), error.message);
  process.exit(1);
});