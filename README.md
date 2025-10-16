"test" 
## Activar hook pre-commit para bump automático de versión

Si quieres que tu copia local actualice automáticamente el comentario de versión en `index.html` antes de cada commit, ejecuta en la raíz del repositorio:

```bash
git config core.hooksPath .githooks
```

Esto hará que el hook `pre-commit` incluido en `.githooks` ejecute `scripts/bump-version.js` y añada `index.html` al commit si cambia.

Nota: la configuración `core.hooksPath` es local al clone; cada desarrollador que quiera este comportamiento deberá ejecutar el comando anterior en su máquina.

## Versión actual y cambios subidos

Versión subida: 27




Descripción de los cambios aplicados en esta versión:

- Se detecta error 405 (Method Not Allowed) al enviar POST a /api/contact desde el frontend. Revisar método y CORS en backend.
- Contacto y galería i18n funcionales.
- Mejoras en seguridad y documentación.
- Log de usuario y contraseña SMTP en consola para depuración (eliminar tras probar).

Nota de seguridad: el servidor imprime en consola el usuario y contraseña SMTP para depuración local. Elimina ese log tras probar y nunca subas `configuration.env` al repositorio.
.

