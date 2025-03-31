const { execSync } = require('child_process');

console.log('Installing Chrome...');

try {
    // Install Chrome on Linux
    execSync('apt-get update && apt-get install -y chromium-browser');
    process.env.PUPPETEER_EXECUTABLE_PATH = '/usr/bin/chromium-browser';
    console.log('Chrome installed successfully');
} catch (error) {
    console.error('Failed to install Chrome:', error);
    process.exit(1);
}
