import fs from 'fs';
const code = fs.readFileSync('./src/pages/GroupDetail.jsx', 'utf8');
const regex = /<([A-Z][a-zA-Z]*)/g;
const usedComponents = new Set();
let match;
while ((match = regex.exec(code)) !== null) {
  usedComponents.add(match[1]);
}
console.log('JSX Tags used:', Array.from(usedComponents));
