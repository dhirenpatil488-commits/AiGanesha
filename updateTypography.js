import fs from 'fs';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Clean arbitrary text sizes
  content = content.replace(/text-\[15px\] sm:text-\[16px\]/g, 'text-sm sm:text-base');
  content = content.replace(/text-\[13px\] sm:text-\[14px\]/g, 'text-xs sm:text-sm');
  content = content.replace(/text-\[32px\] sm:text-\[40px\]/g, 'text-3xl sm:text-4xl');
  content = content.replace(/text-\[24px\] sm:text-\[26px\]/g, 'text-2xl sm:text-3xl');

  // Clean arbitrary leading/tracking
  content = content.replace(/leading-\[1\.48\] tracking-\[-0\.02em\]/g, 'leading-relaxed');
  content = content.replace(/leading-\[1\.2\] tracking-\[-0\.03em\]/g, 'tracking-tight leading-tight');
  content = content.replace(/leading-\[1\.4\] tracking-\[-0\.03em\]/g, 'tracking-tight leading-tight');

  // Add font-mono to Inputs
  content = content.replace(/(<Input[^>]*?className=")(?!.*font-mono)/g, '$1font-mono ');
  // Add font-mono to SelectTrigger
  content = content.replace(/(<SelectTrigger[^>]*?className=")(?!.*font-mono)/g, '$1font-mono ');
  // Add font-mono to SelectItem
  content = content.replace(/(<SelectItem[^>]*?className=")(?!.*font-mono)/g, '$1font-mono ');

  // Add font-mono to output Metric labels like <span className="text-2xl ... font-bold
  content = content.replace(/(className="(?:.*?)text-\d(?:xl|xl).*?font-bold)(?!.*font-mono)([^"]*")/g, '$1 font-mono$2');

  // Update labels to standard weights
  content = content.replace(/(<Label[^>]*?className="[^"]*)(text-sm sm:text-base)([^"]*")/g, '$1$2 font-medium$3');
  
  // Cleanup duplicates from multiple matches
  content = content.replace(/font-medium font-medium/g, 'font-medium');
  content = content.replace(/font-mono font-mono/g, 'font-mono');

  fs.writeFileSync(filePath, content);
  console.log('Updated ' + filePath);
}

const files = [
  'd:\\GHG Calculator\\src\\components\\calculators\\household-calculator.tsx',
  'd:\\GHG Calculator\\src\\components\\calculators\\business-calculator.tsx',
  'd:\\GHG Calculator\\src\\components\\calculators\\industry-calculator.tsx'
];

files.forEach(processFile);
