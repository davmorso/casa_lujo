// backend-url.js
// Responsabilidad: asignar BACKEND_URL según entorno

if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
	window.BACKEND_URL = 'http://localhost:8000';
} else {
	window.BACKEND_URL = 'https://casa-lujo.onrender.com';
}
