"test" 
## Activar hook pre-commit para bump automático de versión

Si quieres que tu copia local actualice automáticamente el comentario de versión en `index.html` antes de cada commit, ejecuta en la raíz del repositorio:

```bash
git config core.hooksPath .githooks
```

Esto hará que el hook `pre-commit` incluido en `.githooks` ejecute `scripts/bump-version.js` y añada `index.html` al commit si cambia.

Nota: la configuración `core.hooksPath` es local al clone; cada desarrollador que quiera este comportamiento deberá ejecutar el comando anterior en su máquina.



## Versión actual y cambios subidos

Versión subida: 37

- Reestructuración de server.js para Express y corrección de errores de sintaxis. Mantiene historial anterior.

# Variables de entorno

El backend Express utiliza variables de entorno para la configuración SMTP y destinatarios del formulario de contacto.

- **En producción (Vercel):** Las variables se configuran en el dashboard de Vercel, sección *Environment Variables*. No es necesario subir `configuration.env` ni `.env`.
- **En local:** Puedes usar un archivo `configuration.env` en la raíz del proyecto, con el mismo formato que `.env`. El servidor lo carga automáticamente si existe.

Ejemplo de `configuration.env`:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_usuario@gmail.com
SMTP_PASS=tu_app_password
CONTACT_RECIPIENTS=tu_usuario@gmail.com
FROM_ADDRESS=tu_usuario@gmail.com
```

## Historial de versiones

### Versión 46
- Eliminado Mailgun y envío de correo; endpoint /api/contact ahora es stub.

### Versión 45
- Adaptación para Mailgun API, compatible con Render. Variables necesarias: MAILGUN_API_KEY, MAILGUN_DOMAIN, CONTACT_RECIPIENTS, FROM_ADDRESS.

### Versión 44
- Log de timeout SMTP en Render documentado. Se recomienda usar Mailgun, SendGrid o servicios de email compatibles con Render.

### Versión 43
- Adaptación y confirmación de variables de entorno para Render.

### Versión 42
- Bump de versión solicitado por el usuario.

### Versión 41
- Actualización de archivos y commit tras cambios en server.js.

### Versión 40
- Subida y revisión de archivos de configuración para Vercel, ajustes en vercel.json.

### Versión 39
- Corregida ruta comodín en Express para compatibilidad Vercel.

### Versión 38
- Nota sobre variables de entorno en README, instrucciones Vercel/local.

### Versión 37
- Reestructuración de server.js para Express y corrección de errores de sintaxis. Mantiene historial anterior.

### Versión 36
- Adaptación completa para Vercel: Express.js y configuración de vercel.json.

### Versión 35
- Ajuste Vercel: server.js como entrypoint y rutas API.

### Versión 34
- Cambios recientes en index.html y sincronización de versión.

### Versión 33
- Cambios recientes en index.html y sincronización de versión.

### Versión 32
- Subida completa de todos los archivos y control de versión.

### Versión 31
- Nueva subida de todos los archivos y control de versión.

### Versión 30
- Subida de versión adicional para control y sincronización.

### Versión 29
- Confirmada la seguridad en logging: advertencia sobre logs sensibles y recomendación de eliminar tras depuración.

### Versión 28
- Eliminado el uso de mailto en el formulario de contacto. Ahora solo se envía por el servidor (/api/contact).
- Mensajes de error claros si el servidor no está configurado o hay error de red.
- Mejoras en seguridad y documentación.
- Todos los enlaces y rutas de scripts actualizados tras reorganización de archivos.

# Seguridad y logging

**Advertencia:** Si usas `console.log` para depurar variables sensibles (por ejemplo, mostrando el contenido de `configuration.env` o `process.env` en `server.js`), recuerda eliminar ese código tras la depuración. Nunca dejes logs de credenciales o datos privados en producción.

Nota de seguridad: el servidor imprime en consola el usuario y contraseña SMTP para depuración local. Elimina ese log tras probar y nunca subas `configuration.env` al repositorio.

