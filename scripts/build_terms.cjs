// Helper script to build all 71 terms into src/config/financialData.ts cleanly
const fs = require('fs');
const path = require('path');

// We will construct the data structure and write src/config/financialData.ts
console.log('Building financialData.ts...');
