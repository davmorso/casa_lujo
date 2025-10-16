"test" 
## Activar hook pre-commit para bump automático de versión

Si quieres que tu copia local actualice automáticamente el comentario de versión en `index.html` antes de cada commit, ejecuta en la raíz del repositorio:

```bash
git config core.hooksPath .githooks
```

Esto hará que el hook `pre-commit` incluido en `.githooks` ejecute `scripts/bump-version.js` y añada `index.html` al commit si cambia.

Nota: la configuración `core.hooksPath` es local al clone; cada desarrollador que quiera este comportamiento deberá ejecutar el comando anterior en su máquina.

## Versión actual y cambios subidos

Versión subida: 24

Descripción de los cambios aplicados en esta versión:

- Formulario de contacto ahora envía a /api/contact (fetch) y el botón muestra 'Enviar'
- Backend: endpoint /api/contact que usa nodemailer (lee variables de entorno o configuration.env) y fallback si no configurado
- Soporta `configuration.env` y carga `dotenv` opcionalmente
- Ajustes UI: evitar flechas duplicadas en botones modal, captions i18n en galería, responsive CSS para botones modal
- Añadidos gestos táctiles para navegar la galería en móviles
- README: instrucciones para activar hook y .env.example agregado

Nota de seguridad: el servidor imprime en consola el contenido parseado de `configuration.env` cuando `NODE_ENV` no es 'production' para facilitar la depuración local. Esto puede contener credenciales sensibles; elimina o comenta ese console.log después de depurar y no subas `configuration.env` al repositorio.

