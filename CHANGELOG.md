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
