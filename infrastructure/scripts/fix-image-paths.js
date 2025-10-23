// Escanea img/ y corrige los src en i18n/galeria.es.json intentando
// emparejar por nombre de fichero (ignora espacios/mayúsculas/ext).
// Ejecutar: node .\js\infraestructure\scripts\fix-image-paths.js
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const jsonPath = path.join(root, 'i18n', 'galeria.es.json');
const imgRoot = path.join(root, 'img');

if (!fs.existsSync(jsonPath)) {
	console.error('No se encuentra', jsonPath);
	process.exit(1);
}
if (!fs.existsSync(imgRoot)) {
	console.error('No se encuentra carpeta de imágenes', imgRoot);
	process.exit(1);
}

function normalizeName(n) {
	return n
		.toLowerCase()
		.replace(/[\s_-]+/g, '')   // quitar espacios, guiones, guiones bajos
		.replace(/\.(jpg|jpeg|png|gif|webp)$/, ''); // quitar extensión
}

function walk(dir) {
	const out = [];
	fs.readdirSync(dir, { withFileTypes: true }).forEach(d => {
		const p = path.join(dir, d.name);
		if (d.isDirectory()) out.push(...walk(p));
		else out.push(p);
	});
	return out;
}

// construir mapa normalizedName -> relativePath (img/...)
const files = walk(imgRoot);
const map = new Map();
files.forEach(f => {
	const rel = path.relative(root, f).replace(/\\/g, '/');
	const base = path.basename(f);
	const key = normalizeName(base);
	if (!map.has(key)) map.set(key, rel); // primera coincidencia se queda
});

const raw = fs.readFileSync(jsonPath, 'utf8');
const j = JSON.parse(raw);

// recorrer y corregir todas las imagenes en json (textos.*.imagenes y detalles.imagenes si existen)
let total = 0;
let fixed = 0;
let missing = [];

function tryFixSrc(src) {
	if (!src || typeof src !== 'string') return src;
	total++;
	// si ya existe en disco tal cual (relativo desde index.html)
	const candidate = path.join(root, src.replace(/^\.\//, ''));
	if (fs.existsSync(candidate)) return src;
	// buscar por nombre
	const base = path.basename(src);
	const key = normalizeName(base);
	if (map.has(key)) {
		fixed++;
		return './' + map.get(key); // mantener formato ./img/...
	}
	missing.push(src);
	return src;
}

if (j.textos) {
	Object.values(j.textos).forEach(section => {
		if (Array.isArray(section.imagenes)) {
			section.imagenes = section.imagenes.map(img => {
				if (img && img.src) {
					img.src = tryFixSrc(img.src);
				}
				return img;
			});
		}
	});
}

if (j.detalles && Array.isArray(j.detalles.imagenes)) {
	j.detalles.imagenes = j.detalles.imagenes.map(img => {
		if (img && img.src) img.src = tryFixSrc(img.src);
		return img;
	});
}

// backup y escritura
const bak = jsonPath + '.bak';
fs.writeFileSync(bak, raw, 'utf8');
fs.writeFileSync(jsonPath, JSON.stringify(j, null, 2), 'utf8');

console.log('Total referencias procesadas:', total);
console.log('Rutas corregidas:', fixed);
if (missing.length) {
	console.log('No se pudo encontrar (revisar manualmente):');
	missing.slice(0, 50).forEach(m => console.log('  -', m));
} else {
	console.log('Todas las referencias resueltas.');
}
