# Changelog

Todos los cambios relevantes de este proyecto se documentan en este archivo.

El formato sigue una variante de Keep a Changelog y versionado semantico.

## [Unreleased]

### Added
- 

### Changed
- 

### Fixed
- 

## [v1.0.0] - 2026-05-05

### Added
- Modulos de gestion: clientes, productos, ventas, presupuestos, facturas, pagos, proveedores y reportes.
- Gestion de usuarios con roles (`admin`, `ventas`, `operador`) y estado activo/inactivo.
- Herramientas de migracion multiempresa (`migracion-multiempresa.html`) con escaneo, migracion y reasignacion por `empresa_id`.
- Sidebar dinamico por rol y mejoras de UX en login/usuarios (mostrar/ocultar contraseña).
- Estandares de colaboracion: `README`, `CONTRIBUTING`, templates de PR e Issues.
- CI en GitHub Actions (`.github/workflows/ci.yml`).
- Gobernanza de repo: `CODEOWNERS`, `SECURITY.md`, checklist de release en `docs/RELEASE_CHECKLIST.md`.

### Changed
- Reglas e indices de Firestore para operacion multiempresa.
- Documentacion de instalacion y despliegue para flujo Firebase.

### Fixed
- Flujo de migracion con mejor feedback de estado/progreso.
- Ajustes de permisos y validaciones para diagnostico/migracion.

## [2026-05-04]

### Added
- Gestion de usuarios con roles (`admin`, `ventas`, `operador`).
- Controles de acceso por rol y por usuario activo.
- Migracion multiempresa con utilidades de escaneo, migracion y reasignacion por `empresa_id`.
- Sidebar dinamico por rol.
- Documentacion colaborativa (`README`, `CONTRIBUTING`, plantilla de PR).
- Toggle opcional mostrar/ocultar contraseña en login y alta de usuarios.

### Changed
- Reglas de Firestore e indices para operacion multiempresa.
- Flujos de deploy y checklist de puesta en produccion.

### Fixed
- Manejaron errores de permisos e indices en pantallas de diagnostico/migracion.
- Mejoras de feedback visual en proceso de migracion.
