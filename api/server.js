// server.js

// 1) Variables de entorno: Cargar desde .env (opcional) y configuration.env
try { require('dotenv').config(); } catch (e) { /* dotenv no es obligatorio */ }

const fs = require('fs');
const path = require('path');

// 2) Cargar configuration.env y volcar a process.env (sin pisar lo ya definido)
try {
  const cfgPath = path.join(process.cwd(), '../configuration.env');
  if (fs.existsSync(cfgPath)) {
    const envContent = fs.readFileSync(cfgPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const m = line.match(/^\s*([^#=\s][^=]*)=(.*)\s*$/);
      if (m) {
        const key = m[1].trim();
        let val = m[2].trim();
        // Quitar comillas si están presentes
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (process.env[key] == null) process.env[key] = val;
      }
    });
  }
} catch (e) {
  console.warn('[WARN] No se pudo leer configuration.env:', e.message);
}

// 3) App Express + Nodemailer
const express = require('express');
// Eliminado Mailgun: no se usará envío de correo

const app = express();
// Nota: En Vercel, el puerto es asignado dinámicamente, pero se mantiene la lógica para pruebas locales.

// --- Configuración y Middleware ---
app.use(express.json());

console.log(process);

// CORS simple (ajusta el Access-Control-Allow-Origin en producción)
app.use((req, res, next) => {
  // Mejora: Verifica si la solicitud viene de un origen seguro si es posible
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});


// No hay configuración de email

// --- Endpoint de Contacto ---
app.post('/api/contact', async (req, res) => {
  // Stub: no se envía correo
  return res.status(200).json({ ok: false, message: 'Envío de correo deshabilitado. Contacta por otro medio.' });
});

// --- Manejo de Estáticos y Rutas SPA (¡CORREGIDO: SOLUCIONA EL PATH ERROR!) ---

// 1. Servir estáticos (JS, CSS, imágenes, etc. de la SPA)
app.use(express.static(path.join(process.cwd(), '.')));

/**
 * 2. Ruta Catch-all para SPA (Single Page Application)
 * ESTE ES EL CAMBIO CLAVE para evitar el PathError en Express 5.
 * Cambiado de app.get('/*', ...) a app.get('/{*path}', ...)
 */
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

// --- Arrancar Servidor ---
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Express server listening on http://localhost:${PORT}`);
});