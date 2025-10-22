// Sin integración de email (Mailgun eliminado)
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

// 3) App Express (sin envío de correo)
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
  res.setHeader('Access-Control-Allow-Origin', 'https://davmorso.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://davmorso.github.io');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }
  next();
});


// No hay configuración de email

// --- Endpoint de Contacto ---
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/api/contact', async (req, res) => {
  try {
    const { nombre, telefono, estructura, experiencia, acepta, asunto } = req.body;
    if (!nombre || !telefono || !estructura || !experiencia || !acepta) {
      return res.status(400).json({ ok: false, message: 'Faltan campos obligatorios.' });
    }
    const from = process.env.SENDGRID_FROM;
    const cc = (process.env.SENDGRID_CC || '').split(',').map(e => e.trim()).filter(Boolean);
    const to = from;
    const subject = asunto || 'Nuevo contacto desde Casa Lujo';
    const html = `
      <h2>Nuevo contacto desde Casa Lujo</h2>
      <ul>
        <li><b>Nombre:</b> ${nombre}</li>
        <li><b>Teléfono:</b> ${telefono}</li>
        <li><b>Estructura compra:</b> ${estructura}</li>
        <li><b>Experiencia:</b> ${experiencia}</li>
      </ul>
      <p>El usuario ha aceptado la política de privacidad.</p>
    `;
    const msg = {
      to,
      cc,
      from,
      subject,
      html
    };
    await sgMail.send(msg);
    return res.status(200).json({ ok: true, message: 'Mensaje enviado correctamente.' });
  } catch (err) {
    console.error('Error enviando email:', err);
    return res.status(500).json({ ok: false, message: 'No se pudo enviar el email.' });
  }
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