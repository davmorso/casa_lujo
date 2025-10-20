"test" 
## Activar hook pre-commit para bump automático de versión

Si quieres que tu copia local actualice automáticamente el comentario de versión en `index.html` antes de cada commit, ejecuta en la raíz del repositorio:

```bash
git config core.hooksPath .githooks
```

Esto hará que el hook `pre-commit` incluido en `.githooks` ejecute `scripts/bump-version.js` y añada `index.html` al commit si cambia.

Nota: la configuración `core.hooksPath` es local al clone; cada desarrollador que quiera este comportamiento deberá ejecutar el comando anterior en su máquina.

## Versión actual y cambios subidos

Versión subida: 30




Descripción de los cambios aplicados en esta versión:

- Eliminado el uso de mailto en el formulario de contacto. Ahora solo se envía por el servidor (/api/contact).
- Mensajes de error claros si el servidor no está configurado o hay error de red.
- Mejoras en seguridad y documentación.
- Todos los enlaces y rutas de scripts actualizados tras reorganización de archivos.
- Confirmada la seguridad en logging: advertencia sobre logs sensibles y recomendación de eliminar tras depuración.
- Subida de versión adicional para control y sincronización.

Nota de seguridad: el servidor imprime en consola el usuario y contraseña SMTP para depuración local. Elimina ese log tras probar y nunca subas `configuration.env` al repositorio.
.

