// 1) Variables de entorno desde .env (opcional)
try { require('dotenv').config(); } catch (e) { /* si no está dotenv, no pasa nada */ }

// 2) Si existe configuration.env, lo cargamos y volcamos a process.env (sin pisar lo ya definido)
const fs = require('fs');
const path = require('path');
try {
  const cfgPath = path.join(process.cwd(), 'configuration.env');
  if (fs.existsSync(cfgPath)) {
    const envContent = fs.readFileSync(cfgPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const m = line.match(/^\s*([^#=\s][^=]*)=(.*)\s*$/); // ignora líneas vacías y comentarios
      if (m) {
        const key = m[1].trim();
        let val = m[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (process.env[key] == null) process.env[key] = val; // no sobreescribir si ya viene de .env o entorno
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
const PORT = process.env.PORT || 8000;

// Middleware para JSON
app.use(express.json());

// CORS simple (ajusta al dominio de tu frontend en prod)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // p.ej. 'https://tu-dominio.com'
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
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
    pass: process.env.SMTP_PASS, // usa App Password si es Gmail
  },
});

// Endpoint de contacto
app.post('/api/contact', async (req, res) => {
  try {
    const data = req.body || {};
    if (!data.nombre || !data.telefono || !data.experiencia) {
      return res.status(400).json({ ok: false, error: 'missing_fields' });
    }

    const subject = `${data.asunto || 'Interés'} - ${data.nombre}`;
    const bodyLines = [
      `Nombre: ${data.nombre}`,
      `Teléfono: ${data.telefono}`,
      '',
      'Estructura compra:',
      data.estructura || '',
      '',
      'Experiencia:',
      data.experiencia || '',
      '',
      `Acepta política: ${data.acepta ? 'Sí' : 'No'}`
    ];

    const mailOptions = {
      from: process.env.FROM_ADDRESS || process.env.SMTP_USER,
      to: (process.env.CONTACT_RECIPIENTS || 'dmoraroca@gmail.com,mmora@canalip.com')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean),
      subject,
      text: bodyLines.join('\n'),
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[server] /api/contact error', err);
    return res.status(500).json({ ok: false, error: err.message || 'internal_error' });
  }
});

// (opcional) servir estáticos si quieres probar localmente una SPA
app.use(express.static(path.join(process.cwd(), '.')));
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

// Arrancar
app.listen(PORT, () => {
  console.log(`Express server listening on http://localhost:${PORT}`);
});
