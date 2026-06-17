const { existsSync, readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');

const distDir = join(__dirname, '..', 'dist');
const compiledMain = join(distDir, 'src', 'main.js');
const renderMain = join(distDir, 'main.js');

if (existsSync(renderMain)) {
  const currentEntry = readFileSync(renderMain, 'utf8');
  if (!currentEntry.includes("require('./app.module')")) {
    process.exit(0);
  }
}

if (!existsSync(compiledMain)) {
  throw new Error('Expected compiled Nest entry at dist/src/main.js');
}

writeFileSync(
  renderMain,
  "require('./src/main');\n",
  'utf8',
);
