# Release Checklist

Usar este checklist antes de publicar cambios a produccion.

## 1) Pre-release (local)

- [ ] Pull de `main` actualizado.
- [ ] Dependencias instaladas (`npm install`).
- [ ] Cambios probados en local (login, dashboard, modulos tocados).
- [ ] Sin errores en archivos modificados.
- [ ] Changelog actualizado (`CHANGELOG.md`) si aplica.

## 2) Seguridad y multiempresa

- [ ] Revisar impacto en `firestore.rules`.
- [ ] Validar que no se rompa aislamiento por `empresa_id`.
- [ ] Probar con usuario admin y no admin.
- [ ] Probar usuario inactivo (debe bloquear acceso).

## 3) Deploy Firebase

Ejecutar desde raiz del proyecto:

```bash
npx firebase-tools deploy --only firestore:rules,firestore:indexes
npx firebase-tools deploy --only hosting
```

## 4) Post-deploy

- [ ] Login funcional en entorno publicado.
- [ ] Dashboard carga sin errores de permisos.
- [ ] `migracion-multiempresa.html` escanea correctamente.
- [ ] No quedan pendientes inesperados por `empresa_id`.
- [ ] Revisar consola del navegador por errores JS.

## 5) Rollback rapido

Si hay problema critico:

1. Identificar ultimo commit estable.
2. Volver a ese commit en una rama hotfix.
3. Re-deploy de reglas/hosting con version estable.
4. Documentar incidente y causa raiz.

## 6) Comunicacion

- [ ] Registrar release en `CHANGELOG.md`.
- [ ] Notificar al equipo con resumen de cambios y riesgos.
