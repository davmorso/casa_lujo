"test" 
## Activar hook pre-commit para bump automático de versión

Si quieres que tu copia local actualice automáticamente el comentario de versión en `index.html` antes de cada commit, ejecuta en la raíz del repositorio:

```bash
git config core.hooksPath .githooks
```

Esto hará que el hook `pre-commit` incluido en `.githooks` ejecute `scripts/bump-version.js` y añada `index.html` al commit si cambia.

Nota: la configuración `core.hooksPath` es local al clone; cada desarrollador que quiera este comportamiento deberá ejecutar el comando anterior en su máquina.


















## Versión actual y cambios subidos

Versión subida: 94

- Formulario: campo Email añadido debajo del teléfono, validación y envío al backend.
- Versionado estricto en index.html, README.md y contact-form.js en cada subida.
 
- Backend: los correos enviados desde el formulario se envían siempre en ESPAÑOL (asunto y cuerpo), independientemente del idioma seleccionado por el usuario en la UI. Esto facilita la recepción y lectura de mensajes por el propietario.
- Versionado estricto en index.html, README.md y api/server.js en cada subida.

- Email enviado:
	- 'Nombre' ahora es 'Nombre y Apellidos'.
	- 'Email' aparece entre nombre y teléfono.
	- 'Estructura compra' muestra la pregunta completa sobre financiación, recursos propios, combinación, etc.
	- 'Experiencia' muestra la pregunta completa sobre nivel de experiencia en operaciones inmobiliarias premium.
- Logging de depuración CORS añadido en backend.
- Versionado estricto en index.html, README.md y server.js en cada subida.

Versión subida: 89

- En el email enviado, el campo 'Experiencia' ahora muestra la pregunta completa: ¿Qué nivel de experiencia tienes en operaciones inmobiliarias de este tipo o en la adquisición de propiedades premium?
- Versionado estricto en index.html, README.md y server.js en cada subida.

Versión subida: 88

- En el email enviado, el campo 'Estructura compra' ahora muestra la pregunta completa: ¿Cómo imaginas estructurar la compra de tu futura vivienda (financiación, recursos propios, combinación, etc.)?
- Versionado estricto en index.html, README.md y server.js en cada subida.

Versión subida: 87

- En el email enviado, el campo 'Email' aparece entre 'Nombre y Apellidos' y 'Teléfono'.
- Versionado estricto en index.html, README.md y server.js en cada subida.

Versión subida: 86

- En el email enviado, el campo 'Nombre' ahora aparece como 'Nombre y Apellidos'.
- Versionado estricto en index.html, README.md y server.js en cada subida.

Versión subida: 85

- Añadido logging de depuración CORS en el backend para mostrar Origin y headers recibidos.
- Versionado estricto en index.html, README.md y server.js en cada subida.

Versión subida: 84

- Limpieza y corrección del middleware CORS global en backend. Solo orígenes necesarios.
- Versionado estricto en index.html, README.md y contact-form.js en cada subida.

Versión subida: 83

- Corregido dominio .com en BACKEND_URL de index.html.
- Versionado estricto en index.html, README.md y contact-form.js en cada subida.

Versión subida: 82

- Corrección en el formulario de contacto: solo permite un envío por vez, evitando duplicados.
- Versionado estricto en index.html y README.md en cada subida.

Versión subida: 81

- Logging de errores mejorado en backend: los mensajes detallados se envían al frontend y se muestran en el bloque de depuración.
- Versionado estricto en index.html y README.md en cada subida.

Versión subida: 80

- El backend principal ahora es Render (https://casa-lujo.onrender.com), no Vercel.
- Versionado estricto en index.html y README.md en cada subida.

Versión subida: 79

- CORS global forzado en todas las respuestas, incluso errores, para compatibilidad total con Render y navegadores.
- El formulario ahora cierra el modal al enviar correctamente.
- Versionado estricto en index.html y README.md en cada subida.



Versión subida: 78

- CORS headers ampliados para compatibilidad navegador (Sec-Fetch, Sec-Ch-Ua, etc).
- Advertencia añadida sobre logging sensible en server.js. Eliminar tras depuración.
- Versionado estricto en index.html y README.md en cada subida.

Versión subida: 70

- Filtrado seguro de logs en backend (server.js): las claves/API y datos sensibles se ocultan en los logs.
- Añadida advertencia en el código para eliminar logs sensibles tras depuración.
- README actualizado con nota de seguridad sobre logging.

Versión subida: 63

- Ajuste visual y refactor para restaurar el enlace 'Contáctenos' en la barra gris de idiomas, solo link y traducción por idioma.

Versión subida: 62

- Restaurado el enlace 'Contáctenos' en la barra gris de idiomas, solo link y traducción por idioma.

Versión subida: 61

- Eliminado el texto de concertar visita de la barra gris de idiomas en index.html.

Versión subida: 60

- Añadido parámetro de versión en recursos estáticos para refresco de caché.

Versión subida: 59

- El enlace superior es 'Contáctenos'/'Contact us'/etc. en todos los idiomas.

Versión subida: 58

- Corregida sintaxis JSON en archivos de idiomas (coma tras contact) para evitar errores al cambiar de idioma.

Versión subida: 57

- Solo 'aquí' es el enlace de contacto, el resto del texto queda fuera del link en todos los lugares relevantes.

Versión subida: 56

- El botón de contacto ahora es un enlace con texto personalizado en todos los idiomas. Al hacer clic, se abre el formulario de contacto.

Versión subida: 55

- Mantenimiento y bump de versión.

Versión subida: 54

- Añadido garaje doble y jardín privado en características en todos los idiomas.

Versión subida: 52

- Se usa casa.lujo.2025@gmail.com como remitente verificado en SendGrid.

Versión subida: 51

- Cambio de API Key SendGrid en configuration.env para solucionar error 401 Unauthorized en Render.

Versión subida: 50

- Integración completa con SendGrid para envío de emails desde el formulario de contacto.
- Remitente y destinatarios en copia (CC) configurados en configuration.env.
- Se requiere el paquete @sendgrid/mail instalado.
- No es necesario configurar DNS ni dominio propio.

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




### Versión 76
- Eliminada inicialización duplicada de Express y app en server.js.
- Corrección definitiva de error de doble declaración.
- Revisa los logs en Render tras enviar desde el navegador para ajustar la lista de orígenes permitidos.

### Versión 70
- Filtrado seguro de logs en backend (server.js): las claves/API y datos sensibles se ocultan en los logs.
- Añadida advertencia en el código para eliminar logs sensibles tras depuración.
- README actualizado con nota de seguridad sobre logging.
- No es necesario configurar DNS ni dominio propio.

### Versión 49
- Mailgun eliminado, endpoint /api/contact vuelve a ser stub.

### Versión 48
- Mailgun sandbox para pruebas, ahora solo se permiten destinatarios verificados. Asegúrate de que tus destinatarios estén verificados en Mailgun para recibir los correos.

### Versión 47
- Eliminadas todas las referencias a nodemailer, smtp y gmail.

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

