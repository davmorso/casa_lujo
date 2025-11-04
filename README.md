### Versión subida: 119

- GalleryModal corrige automáticamente los paths de las imágenes: si la web está en producción (URL contiene /casa_lujo/), antepone /casa_lujo/ al src de cada imagen (excepto si ya lo tiene o es una URL absoluta). Esto soluciona la carga de imágenes en producción (GitHub Pages).

## Cambios en la versión 1.1.8

1. El bloque de contacto-info (texto superior de contacto) ahora se oculta automáticamente en todos los idiomas. Solo se muestra el texto informativo y el botón "Contáctenos" en la parte inferior, justo encima del footer.

2. Se elimina cualquier duplicado del texto informativo de contacto, asegurando que solo aparezca una vez en la parte inferior, independientemente del idioma seleccionado.
## Activar hook pre-commit para bump automático de versión

Si quieres que tu copia local actualice automáticamente el comentario de versión en `index.html` antes de cada commit, ejecuta en la raíz del repositorio:

```bash
git config core.hooksPath .githooks
```

Esto hará que el hook `pre-commit` incluido en `.githooks` ejecute `scripts/bump-version.js` y añada `index.html` al commit si cambia.

Nota: la configuración `core.hooksPath` es local al clone; cada desarrollador que quiera este comportamiento deberá ejecutar el comando anterior en su máquina.











## Versión actual y cambios subidos


### Versión subida: 118

- El bloque de contacto-info (texto superior) ahora se oculta automáticamente en todos los idiomas. Solo se muestra el texto informativo y el botón "Contáctenos" en la parte inferior, justo encima del footer.
- Se elimina cualquier duplicado del texto informativo de contacto, asegurando que solo aparezca una vez en la parte inferior, independientemente del idioma seleccionado.
-traducciones

Versión subida: 117

- Navegación de galería robusta por plantas: el botón "subir planta" ahora solo aparece si la siguiente planta tiene imágenes, evitando navegación a plantas vacías.
- Corrección de visibilidad: el botón se oculta correctamente en la última planta y si la siguiente está vacía.
- Depuración mejorada: se añadieron logs para verificar el flujo de eventos y el estado de la galería.
- Refuerzo de lógica en _showImage: la visibilidad de los botones depende del contenido real de cada planta, evitando errores de navegación y experiencia de usuario confusa.

### Refactorización SOLID v116

1. Refactorización completa del frontend para cumplir con los principios SOLID:
	- PrivacyLinkService ahora se inyecta como dependencia en los componentes de UI (modal y footer), eliminando acoplamientos innecesarios y duplicidad de lógica.
	- Toda la lógica de sanitización y generación de enlaces de política de privacidad se centraliza en el servicio.
	- ContactFormView y el script principal delegan la gestión de enlaces y sanitización al servicio.
2. Mejoras de mantenibilidad y testabilidad:
	- Cada componente tiene responsabilidad única y puede ser testeado o extendido fácilmente.
	- Si se requiere otro tipo de enlace o sanitización, basta con implementar un nuevo servicio.
3. Seguridad:
	- Se mantiene la sanitización estricta en todos los punten el commit pon un resumen os donde se usa innerHTML.

### Revisión de seguridad y sanitización v115

version 115

1. Modal de contacto:
	- El label de política de privacidad ya se sanitiza antes de insertarse con innerHTML, permitiendo solo el enlace seguro.
	- El resto de labels y textos se insertan con textContent, que es seguro.

2. Footer:
	- El texto del enlace de política de privacidad se sanitiza antes de insertarse, evitando inyección de HTML.

3. Enlaces dinámicos:
	- La lógica de generación de URLs para la política de privacidad distingue correctamente entre local y producción, evitando rutas erróneas.

4. Archivos i18n:
	- Los textos y enlaces en los JSON de idiomas están limpios, sin HTML ni scripts embebidos.

5. Otros componentes:
	- Los labels y textos en la UI se insertan con textContent salvo el caso especial del label de política, que ya está protegido.

6. Backend:
	- El validador de formulario revisa los campos y rechaza entradas inválidas, pero podrías reforzar la sanitización en el backend si permites HTML en algún campo.

7. Scripts y listeners:
	- No se detectan listeners globales peligrosos ni inserciones directas de HTML sin control.

Conclusión: 
La sanitización y seguridad en la inserción de textos y enlaces está cubierta en los puntos críticos (modal y footer). El resto de la UI usa métodos seguros. Para máxima robustez, revisa también la sanitización en el backend y mantén esta práctica en cualquier nuevo componente que use innerHTML.

version subida: 114

- Enlaces de política de privacidad multilingües y adaptativos por entorno (localhost/producción) usando PrivacyLinkService.
- Corrección de JSON i18n en todos los idiomas.

version subida: 113

 - Se añade funcionalidad nueva de politicas de privacidad /casa_lujo

Versión subida: 112

- El formulario de contacto ahora actualiza los textos y enlaces al abrir el modal, mostrando siempre el idioma seleccionado.
- El enlace de política de privacidad en el footer cambia dinámicamente según el idioma.
- Todos los enlaces de política de privacidad en los archivos de idiomas apuntan a la raíz del proyecto.
- Se corrige la propiedad `meta.politica_privacidad_url` en todos los idiomas.
- Actualización de versión en index.html a 112.

- Refactorización de componentes y lógica siguiendo principios SOLID y DDD.
- Reorganización y limpieza de directorios en `presentation/components` para mejorar la estructura y mantenibilidad.



Versión subida: 111

- El botón 'Contáctenos' en la barra gris ahora es responsivo y aparece centrado en móvil, incluso si salta de línea.

Versión subida: 110

- Enlaces de política de privacidad actualizados para funcionar correctamente en GitHub Pages (/casa_lujo/...).
- Corrección en todos los idiomas y en index.html.

Versión subida: 109

- Enlaces de política de privacidad corregidos en todos los idiomas para que apunten a la raíz y funcionen en GitHub Pages.
- Archivos HTML de política de privacidad copiados a la raíz del proyecto.
- Validación de enlaces en i18n y en index.html.
- Preparación de versión y comentario en index.html.

Versión subida: 108

- Actualización de versión en index.html a 108.
- Botones de planta ahora muestran correctamente 'Bajar piso' y 'Subir piso' en todos los idiomas.
- El botón 'Bajar piso' se oculta en la planta baja y 'Subir piso' en la azotea.
- Al cerrar el formulario de contacto y clicar una foto de la galería, se amplía la imagen seleccionada.
- Corrección de restauración de imagen seleccionada tras reconstrucción de galería.
- Gestos táctiles en móvil para navegación por fotos y plantas funcionan correctamente.
- Versión visible en el código fuente.

Versión subida: 107

Actualización de versión en index.html a 107.
Corrección definitiva de todos los enlaces de política de privacidad en los archivos JSON de idiomas para que apunten a docs/.
Validación de enlaces en index.html y archivos multilingües.
Sin cambios funcionales adicionales.

Versión subida: 106

- Actualización de versión en index.html a 106.
- Validación y corrección de enlaces de política de privacidad en todos los archivos JSON de idiomas.
- Revisión de enlaces en index.html y archivos multilingües para asegurar compatibilidad con docs/.
- Sin cambios funcionales adicionales.

Versión subida: 105

- Actualización de versión en index.html a 105.
- Enlaces de política de privacidad en los archivos JSON de idiomas actualizados a /docs/politica-privacidad-*.html.
- Archivos de política de privacidad movidos a docs/ para compatibilidad con GitHub Pages.
- Corregido enlace de política de privacidad en index.html.
- Validación y corrección de errores de sintaxis en archivos de idiomas.

Versión subida: 104

- Actualización de versión en index.html a 104.
- Añadido bloque de versión 104 en README.md encima de 103, sin modificar nada debajo.
- Sincronización final de enlaces y scripts tras refactor DDD.
- Confirmada traducción dinámica del banner de cookies según idioma seleccionado.
- Todos los links de política de privacidad y scripts actualizados a la nueva estructura presentation/.
- Validación de versionado estricto y documentación.

Versión subida: 103

- Refactor completo a estructura DDD: todos los scripts de UI movidos a presentation/components/.
- Eliminados scripts duplicados y referencias antiguas en index.html.
- El banner de cookies ahora se traduce dinámicamente según el idioma seleccionado (i18n).
- Todos los links de scripts y de política de privacidad actualizados a la nueva estructura.
- Sincronización de enlaces y textos multilingües en los archivos i18n y HTML.
- Versionado estricto en index.html y README.md en cada subida.

Versión subida: 102

- Traducción completa de galeria.es.json al ruso y chino, y actualización de los enlaces de política de privacidad en ambos idiomas para que apunten a sus respectivos archivos.
- Sincronización de textos y enlaces multilingües.
- Versionado estricto en index.html y README.md en cada subida.

Versión subida: 101

- Añadida la meta etiqueta og:image con la URL de la primera foto para mejorar la previsualización en WhatsApp y redes sociales.
- Versionado estricto en index.html y README.md en cada subida.

Versión subida: 100

- Actualizadas meta keywords en todos los idiomas relevantes (español, inglés, francés, catalán, ruso, chino) en index.html.
- Eliminadas referencias a piscina en descripción y keywords.
- Resumen de la vivienda ajustado según el anuncio real.
- Versionado estricto en index.html y README.md en cada subida.

Versión subida: 98

- El label del campo email en el formulario de contacto ahora se actualiza dinámicamente y correctamente en todos los idiomas.
- Refuerzo de la lógica de i18n para que todos los textos del formulario se refresquen al cambiar de idioma.
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
- Versionado estricto in index.html, README.md y server.js en cada subida.

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
- Versionado estricto in index.html, README.md y contact-form.js en cada subida.

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


version 117

