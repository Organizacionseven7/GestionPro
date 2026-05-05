# Release Notes - v1.0.0

Fecha: 2026-05-05
Tag: `v1.0.0`

## Resumen

Primer release estable de GestionPro con base multiempresa, control de acceso por rol y flujo operativo de deploy/documentacion para trabajo colaborativo.

## Highlights

- Gestion comercial completa:
  - clientes
  - productos
  - ventas
  - presupuestos
  - facturas
  - pagos
  - proveedores
  - reportes
- Gestion de usuarios con roles (`admin`, `ventas`, `operador`) y estado activo/inactivo.
- Soporte multiempresa por `empresa_id`.
- Herramienta de migracion y reasignacion tenant: `migracion-multiempresa.html`.
- Sidebar dinamico por rol.
- Mejoras de UX en credenciales (mostrar/ocultar contraseña en login y alta de usuarios).

## Seguridad y gobernanza

- Reglas e indices de Firestore para operacion multiempresa.
- Politica de seguridad en `SECURITY.md`.
- Colaboracion estandarizada:
  - `CONTRIBUTING.md`
  - `CODEOWNERS`
  - templates de PR e Issues
  - CI en GitHub Actions (`.github/workflows/ci.yml`)

## Operacion

Comandos de deploy recomendados:

```bash
npx firebase-tools deploy --only firestore:rules,firestore:indexes
npx firebase-tools deploy --only hosting
```

Checklist de salida a produccion:

- `docs/RELEASE_CHECKLIST.md`

## Notas de migracion

Si hay datos historicos sin `empresa_id` o con tenant incorrecto:

1. Abrir `migracion-multiempresa.html`
2. Ejecutar `Escanear`
3. Ejecutar `Aplicar migracion` para `Sin empresa_id`
4. Ejecutar `Reasignar datos a esta empresa` para `Otras empresas`
5. Confirmar que ambos queden en `0`

## Estado esperado post-release

- Login operativo.
- Dashboard sin errores de permisos.
- Datos correctamente aislados por empresa.
- Flujo de trabajo Git/PR listo para escalar equipo.
