const fs = require('fs');
const path = require('path');

const root = process.cwd();
const jsonPath = path.join(root, 'i18n', 'galeria.es.json');
const imgRoot = path.join(root, 'img');

if (!fs.existsSync(jsonPath)) { console.error('No existe', jsonPath); process.exit(1); }
if (!fs.existsSync(imgRoot)) { console.error('No existe', imgRoot); process.exit(1); }

const j = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const refs = [];
if (j.textos) {
	Object.entries(j.textos).forEach(([k, sec]) => {
		if (Array.isArray(sec.imagenes)) sec.imagenes.forEach(im => refs.push({ key: k, src: im.src }));
	});
}

const missing = [];
const duplicates = {};
refs.forEach(r => {
	const norm = (r.src || '').replace(/^\.\//, '').replace(/\\/g,'/').trim();
	duplicates[norm] = duplicates[norm] || [];
	duplicates[norm].push(r.key);
	const p = path.join(root, norm);
	if (!fs.existsSync(p)) missing.push(norm);
});

console.log('--- Imágenes faltantes (404) ---');
if (missing.length) missing.forEach(m => console.log(m));
else console.log('Ninguna.');

console.log('\n--- Duplicados (mismo src referenciado por varias plantas) ---');
Object.entries(duplicates).forEach(([src, keys]) => {
	if (keys.length > 1) console.log(`${src} -> ${keys.join(', ')}`);
});

console.log('\n--- Conteo por planta ---');
const count = {};
refs.forEach(r => count[r.key] = (count[r.key]||0) + 1);
Object.entries(count).forEach(([k,v]) => console.log(`${k}: ${v}`));
