const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../../smarthire-app/src/features/landing/components');
const destDir = path.join(__dirname, 'src/features/landing/components');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);

files.forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    const srcPath = path.join(srcDir, file);
    // Rename to .jsx Since we are moving to standard React Vite without TS setup
    const newFileName = file.replace('.tsx', '.jsx').replace('.ts', '.js');
    const destPath = path.join(destDir, newFileName);

    let content = fs.readFileSync(srcPath, 'utf8');

    // 1. Remove "use client"
    content = content.replace(/"use client";?\s*/g, '');

    // 2. Replace next/link with react-router-dom
    content = content.replace(/import\s+Link\s+from\s+['"]next\/link['"];?/g, "import { Link } from 'react-router-dom';");

    // 3. Replace next/image with standard img
    content = content.replace(/import\s+Image\s+from\s+['"]next\/image['"];?/g, '');
    content = content.replace(/<Image([^>]*)\/?>/g, (match, props) => {
        // Strip out specific Next.js props like 'fill', 'sizes', 'priority'
        let cleanProps = props.replace(/\s+(fill|priority)(=\{[^}]*\})?/g, '');
        cleanProps = cleanProps.replace(/\s+sizes=(['"])[^\1]*\1/g, '');
        return `<img${cleanProps} />`;
    });

    // 4. Strip basic TS typings (Naive approach for React components)
    // We remove ": React.FC<...>", "type ...", "interface ..."
    content = content.replace(/export\s+interface\s+\w+\s*\{[^}]*\}/g, '');
    content = content.replace(/export\s+type\s+\w+\s*=\s*[^;]+;/g, '');
    content = content.replace(/:\s*React\.FC<[^>]+>/g, '');
    content = content.replace(/:\s*any/g, '');
    content = content.replace(/\[\w+\s*:\s*\w+\]/g, '[]'); // remove index signatures roughly if any

    fs.writeFileSync(destPath, content);
    console.log(`Copied and transformed ${file} to ${newFileName}`);
  }
});
