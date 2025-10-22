// ...otros requires y configuración...

// Eliminada inicialización duplicada de Express y app. Corrección definitiva de error de app.
// version 75
// Nota: En Vercel, el puerto es asignado dinámicamente, pero se mantiene la lógica para pruebas locales.
// ...otros requires y configuración...
const express = require('express');
const app = express();

// Log especial para depuración de CORS: muestra el Origin recibido en cada petición
app.use((req, res, next) => {
  if (req.headers.origin) {
    console.log(`[CORS-DEBUG] Origin recibido: ${req.headers.origin}`);
  } else {
    console.log('[CORS-DEBUG] Origin no presente en la petición');
  }
  next();
});
// Sin integración de email (Mailgun eliminado)
// server.js
// version 70
// Filtrado seguro de logs: las claves/API y datos sensibles se ocultan en los logs. Eliminar este bloque tras depuración.
// version 71
// Añadidos logs detallados para depuración de errores y variables clave en POST /api/contact. Eliminar este bloque tras depuración.

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


// --- Configuración y Middleware ---
// Middleware CORS único y global
app.use((req, res, next) => {
  // Logging de depuración CORS
  if (req.headers.origin) {
    console.log(`[CORS-DEBUG] Origin recibido: ${req.headers.origin}`);
  } else {
    console.log('[CORS-DEBUG] Origin no presente en la petición');
  }
  console.log('[CORS-DEBUG] Headers:', req.headers);
  const allowedOrigins = [
    'https://davmorso.github.io',
    'http://localhost:8000',
    'http://127.0.0.1:8000'
  ];
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Referer, User-Agent, Sec-Fetch-Mode, Sec-Fetch-Site, Sec-Fetch-Dest, Sec-Ch-Ua, Sec-Ch-Ua-Mobile, Sec-Ch-Ua-Platform');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});
app.use(express.json());

// [ADVERTENCIA] El siguiente log de configuration.env es solo para depuración. Eliminar tras revisar problemas de entorno.
console.warn('[ADVERTENCIA] El log de process.env y configuration.env contiene datos sensibles. Eliminar tras depuración.');

// [ADVERTENCIA] Solo para depuración. Eliminar este log tras revisar problemas.
// Filtra datos sensibles antes de mostrar en logs:
const safeEnv = { ...process.env };
if (safeEnv.SENDGRID_API_KEY) safeEnv.SENDGRID_API_KEY = '[HIDDEN]';
if (safeEnv.twilio) safeEnv.twilio = '[HIDDEN]';
console.log('[DEBUG] process.env (filtrado):', safeEnv);
// ...eliminar este bloque tras depuración

// CORS simple (ajusta el Access-Control-Allow-Origin en producción)


// No hay configuración de email

// --- Endpoint de Contacto ---
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/api/contact', async (req, res) => {
  console.log('[CONTACT] POST /api/contact');
  console.log('[CONTACT] Headers:', req.headers);
  console.log('[CONTACT] Body:', req.body);
  console.log('[CONTACT] process.env (filtrado):', {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? '[HIDDEN]' : '[MISSING]',
    SENDGRID_FROM: process.env.SENDGRID_FROM,
    SENDGRID_CC: process.env.SENDGRID_CC,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT
  });
  console.log('[CONTACT] configuration.env (filtrado):', {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? '[HIDDEN]' : '[MISSING]',
    SENDGRID_FROM: process.env.SENDGRID_FROM,
    SENDGRID_CC: process.env.SENDGRID_CC
  });
  try {
    const { nombre, telefono, estructura, experiencia, acepta, asunto } = req.body;
    if (!nombre || !telefono || !estructura || !experiencia || !acepta) {
      const errorMsg = '[CONTACT] Faltan campos obligatorios: ' + JSON.stringify({ nombre, telefono, estructura, experiencia, acepta });
      console.warn(errorMsg);
      return res.status(400).json({ ok: false, message: errorMsg });
    }
    const from = process.env.SENDGRID_FROM;
    const cc = (process.env.SENDGRID_CC || '').split(',').map(e => e.trim()).filter(Boolean);
    const to = from;
    const subject = asunto || 'Nuevo contacto desde Casa Lujo';
    const email = req.body.email || '';
    const html = `
      <h2>Nuevo contacto desde Casa Lujo</h2>
      <ul>
        <li><b>Nombre y Apellidos:</b> ${nombre}</li>
        <li><b>Email:</b> ${email}</li>
        <li><b>Teléfono:</b> ${telefono}</li>
  <li><b>¿Cómo imaginas estructurar la compra de tu futura vivienda (financiación, recursos propios, combinación, etc.)?</b> ${estructura}</li>
  <li><b>¿Qué nivel de experiencia tienes en operaciones inmobiliarias de este tipo o en la adquisición de propiedades premium?</b> ${experiencia}</li>
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
    console.log('[CONTACT] Enviando email:', msg);
    await sgMail.send(msg);
    console.log('[CONTACT] Email enviado correctamente');
    return res.status(200).json({ ok: true, message: 'Mensaje enviado correctamente.' });
  } catch (err) {
    const errorMsg = '[CONTACT] Error enviando email: ' + (err?.message || err);
    console.error(errorMsg);
    return res.status(500).json({ ok: false, message: errorMsg });
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