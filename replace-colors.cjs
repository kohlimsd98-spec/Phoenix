const fs = require('fs');
const path = require('path');

const mappings = {
  '#090d0b': 'surface-base',
  '#101816': 'surface-card1',
  '#141d19': 'surface-card2',
  '#1a2622': 'surface-card3',
  '#223530': 'surface-border',
  '#6f9a8a': 'text-muted',
  '#e4f0ea': 'text-main',
  '#00e68a': 'accent-primary',
  '#3dd6c8': 'accent-secondary',
  '#00b86e': 'accent-dark',
};

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const [hex, name] of Object.entries(mappings)) {
        // match occurrences like bg-[#090d0b], border-[#090d0b] etc.
        const regex = new RegExp(`\\[${hex}\\]`, 'g');
        if (regex.test(content)) {
          content = content.replace(regex, name);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

walk(path.join(__dirname, 'src'));
