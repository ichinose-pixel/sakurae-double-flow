const fs=require('node:fs');
fs.writeFileSync('index.html',fs.readFileSync('docs/index.html','utf8').replace('<head>','<head><base href="./docs/">'));
fs.writeFileSync('.nojekyll','');
