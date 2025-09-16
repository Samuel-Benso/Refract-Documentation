const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../static/img/logo.svg');
const destPath = path.join(__dirname, '../static/img/favicon.ico');

// Copy the file
fs.copyFileSync(sourcePath, destPath);

console.log('Favicon updated successfully!');
