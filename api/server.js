const express = require('express');
const app = express();

app.use((req, res, next) => {
  if (req.headers.origin) {
    console.log(`[CORS-DEBUG] Origin recibido: ${req.headers.origin}`);
  } else {
    console.log('[CORS-DEBUG] Origin no presente en la petición');
  }
  next();
});

try { require('dotenv').config(); } catch (e) { /* dotenv no es obligatorio */ }

const fs = require('fs');
const path = require('path');

try {
  const cfgPath = path.join(process.cwd(), 'configuration.env');
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
    'http://localhost:8080',
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
    const { nombre, telefono, estructura, experiencia, acepta /*, asunto (ignored) */ } = req.body;
    if (!nombre || !telefono || !estructura || !experiencia || !acepta) {
      const errorMsg = '[CONTACT] Faltan campos obligatorios: ' + JSON.stringify({ nombre, telefono, estructura, experiencia, acepta });
      console.warn(errorMsg);
      return res.status(400).json({ ok: false, message: errorMsg });
    }
    const from = process.env.SENDGRID_FROM;
    const cc = (process.env.SENDGRID_CC || '').split(',').map(e => e.trim()).filter(Boolean);
    const to = from;
    // Forzar asunto y cuerpo en ESPAÑOL siempre (el cliente puede estar en cualquier idioma)
    const subject = 'Nuevo contacto desde Casa Lujo';
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