const fs = require('fs');
const path = require('path');
const jsonPath = path.join(__dirname, '..', 'i18n', 'galeria.es.json');
const root = path.join(__dirname, '..');

const j = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const imgs = [];

if (j.textos) {
	Object.values(j.textos).forEach(section => {
		if (Array.isArray(section.imagenes)) section.imagenes.forEach(i => imgs.push(i.src));
	});
}

imgs.push(...(j.detalles?.imagenes || []));

const missing = imgs.filter(src => {
	const p = path.join(root, src.replace(/^\.\//,''));
	return !fs.existsSync(p);
});

console.log('Total imágenes referenciadas:', imgs.length);
console.log('Faltan:', missing.length ? missing.join('\n') : 'ninguna');
