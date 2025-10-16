// cargar variables de entorno desde .env si existe (opcional)
try { require('dotenv').config(); } catch (e) { /* dotenv no instalado, no pasa nada */ }

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;
const root = process.cwd();

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'application/octet-stream',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const headers = { 'Content-Type': mime[ext] || 'application/octet-stream' };
  const stream = fs.createReadStream(filePath);
  stream.on('open', () => {
    res.writeHead(200, headers);
    stream.pipe(res);
  });
  stream.on('error', () => {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  });
}

const server = http.createServer((req, res) => {
  try {
    // Endpoint API: POST /api/contact -> enviar email usando nodemailer
    if (req.method === 'POST' && req.url === '/api/contact') {
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          const data = JSON.parse(body || '{}');
          // Validación mínima
          if (!data.nombre || !data.telefono || !data.experiencia) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            return res.end(JSON.stringify({ ok: false, error: 'missing_fields' }));
          }

          // Requiere nodemailer y credenciales en variables de entorno
          const SMTP_HOST = process.env.SMTP_HOST;
          const SMTP_PORT = process.env.SMTP_PORT;
          const SMTP_USER = process.env.SMTP_USER;
          const SMTP_PASS = process.env.SMTP_PASS;
          const RECIPIENTS = (process.env.CONTACT_RECIPIENTS || 'dmoraroca@gmail.com,mmora@canalip.com').split(',').map(s => s.trim());

          if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
            res.writeHead(501, { 'Content-Type': 'application/json; charset=utf-8' });
            return res.end(JSON.stringify({ ok: false, error: 'mail_not_configured' }));
          }

          // Lazy require to avoid dependency error if not installed
          let nodemailer;
          try { nodemailer = require('nodemailer'); } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
            return res.end(JSON.stringify({ ok: false, error: 'nodemailer_missing' }));
          }

          const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: parseInt(SMTP_PORT || '587', 10),
            secure: SMTP_PORT === '465',
            auth: { user: SMTP_USER, pass: SMTP_PASS }
          });

          const subject = `${data.asunto || 'Interés'} - ${data.nombre}`;
          const bodyLines = [];
          bodyLines.push(`Nombre: ${data.nombre}`);
          bodyLines.push(`Teléfono: ${data.telefono}`);
          bodyLines.push('');
          bodyLines.push('Estructura compra:');
          bodyLines.push(data.estructura || '');
          bodyLines.push('');
          bodyLines.push('Experiencia:');
          bodyLines.push(data.experiencia || '');
          bodyLines.push('');
          bodyLines.push(`Acepta política: ${data.acepta ? 'Sí' : 'No'}`);

          const mailOptions = {
            from: process.env.FROM_ADDRESS || SMTP_USER,
            to: RECIPIENTS,
            subject: subject,
            text: bodyLines.join('\n')
          };

          await transporter.sendMail(mailOptions);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ ok: true }));
        } catch (err) {
          console.error('[server] /api/contact error', err);
          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ ok: false, error: 'send_failed' }));
        }
      });
      return;
    }

    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    if (reqPath.endsWith('/')) reqPath += 'index.html';
    const safePath = path.normalize(path.join(root, reqPath));
    if (!safePath.startsWith(root)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Forbidden');
    }
    fs.stat(safePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Not found');
      }
      sendFile(res, safePath);
    });
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Server error');
  }
});

server.listen(PORT, () => {
  console.log(`Static server listening on http://localhost:${PORT}`);
});