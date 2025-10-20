"test" 
## Activar hook pre-commit para bump automático de versión

Si quieres que tu copia local actualice automáticamente el comentario de versión en `index.html` antes de cada commit, ejecuta en la raíz del repositorio:

```bash
git config core.hooksPath .githooks
```

Esto hará que el hook `pre-commit` incluido en `.githooks` ejecute `scripts/bump-version.js` y añada `index.html` al commit si cambia.

Nota: la configuración `core.hooksPath` es local al clone; cada desarrollador que quiera este comportamiento deberá ejecutar el comando anterior en su máquina.



## Versión actual y cambios subidos

Versión subida: 35

- Ajuste Vercel: server.js como entrypoint y rutas API.

## Historial de versiones

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

Nota de seguridad: el servidor imprime en consola el usuario y contraseña SMTP para depuración local. Elimina ese log tras probar y nunca subas `configuration.env` al repositorio.

