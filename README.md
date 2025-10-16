"test" 
## Activar hook pre-commit para bump automático de versión

Si quieres que tu copia local actualice automáticamente el comentario de versión en `index.html` antes de cada commit, ejecuta en la raíz del repositorio:

```bash
git config core.hooksPath .githooks
```

Esto hará que el hook `pre-commit` incluido en `.githooks` ejecute `scripts/bump-version.js` y añada `index.html` al commit si cambia.

Nota: la configuración `core.hooksPath` es local al clone; cada desarrollador que quiera este comportamiento deberá ejecutar el comando anterior en su máquina.
