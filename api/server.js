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
const nodemailer = require('nodemailer');

const app = express();
// Nota: En Vercel, el puerto es asignado dinámicamente, pero se mantiene la lógica para pruebas locales.

// --- Configuración y Middleware ---
app.use(express.json());

// CORS simple (ajusta el Access-Control-Allow-Origin en producción)
app.use((req, res, next) => {
  // Mejora: Verifica si la solicitud viene de un origen seguro si es posible
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Transport SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: String(process.env.SMTP_PORT) === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Usa App Password si es Gmail
  },
});

// --- Endpoint de Contacto ---
app.post('/api/contact', async (req, res) => {
  try {
    const data = req.body || {};
    // Valida que los campos cruciales existan
    if (!data.nombre || !data.telefono || !data.experiencia) {
      return res.status(400).json({ ok: false, error: 'missing_fields', message: 'Faltan campos obligatorios: nombre, teléfono o experiencia.' });
    }

    const subject = `${data.asunto || 'Interés'} - ${data.nombre}`;
    const bodyLines = [
      `Nombre: ${data.nombre}`,
      `Teléfono: ${data.telefono}`,
      '',
      'Estructura compra:',
      data.estructura || 'No especificada',
      '',
      'Experiencia:',
      data.experiencia || 'No especificada',
      '',
      `Acepta política: ${data.acepta ? 'Sí' : 'No'}`
    ];

    const mailOptions = {
      from: process.env.FROM_ADDRESS || process.env.SMTP_USER,
      // Se utiliza el array de destinatarios
      to: (process.env.CONTACT_RECIPIENTS || 'dmoraroca@gmail.com,mmora@canalip.com')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
      subject,
      text: bodyLines.join('\n'),
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ ok: true, message: 'Correo enviado con éxito.' });
  } catch (err) {
    console.error('[server] /api/contact error', err);
    // Mejora: Añadir un mensaje más descriptivo si la autenticación falla
    let errorMsg = err.message || 'internal_error';
    if (err.code === 'EAUTH') {
        errorMsg = 'Error de autenticación SMTP. Revise SMTP_USER y SMTP_PASS.';
    }
    return res.status(500).json({ ok: false, error: errorMsg });
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