import fs from 'fs';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Add font-mono to the main container div
  content = content.replace(/className="w-full flex flex-col relative z-10"/g, 'className="w-full flex flex-col relative z-10 font-mono"');
  // industry-calculator has a slightly different one
  content = content.replace(/className="w-full flex flex-col relative z-10 p-4 md:p-12"/g, 'className="w-full flex flex-col relative z-10 p-4 md:p-12 font-mono"');

  fs.writeFileSync(filePath, content);
  console.log('Updated container text style in ' + filePath);
}

const files = [
  'd:\\GHG Calculator\\src\\components\\calculators\\household-calculator.tsx',
  'd:\\GHG Calculator\\src\\components\\calculators\\business-calculator.tsx',
  'd:\\GHG Calculator\\src\\components\\calculators\\industry-calculator.tsx'
];

files.forEach(processFile);
