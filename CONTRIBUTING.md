# Contribuir a GestionPro

Gracias por colaborar.

## Flujo de trabajo

1. Crear rama desde `main`.
2. Implementar cambios en una rama por tarea.
3. Probar localmente antes de abrir PR.
4. Abrir Pull Request hacia `main`.
5. Hacer merge solo cuando el checklist este completo.

## Convencion de ramas

- `feature/<descripcion-corta>`
- `fix/<descripcion-corta>`
- `docs/<descripcion-corta>`
- `chore/<descripcion-corta>`

Ejemplos:

- `feature/migracion-tenant-ui`
- `fix/roles-sidebar`
- `docs/readme-onboarding`

## Convencion de commits

Usar formato tipo Conventional Commits:

- `feat: ...`
- `fix: ...`
- `docs: ...`
- `refactor: ...`
- `chore: ...`

Ejemplos:

- `feat: add tenant reassignment flow`
- `fix: handle permission-denied during scan`
- `docs: update firebase deploy steps`

## Checklist local antes de PR

- La app abre correctamente en `login.html` y `index.html`.
- No hay errores en archivos editados.
- Si tocaste permisos/rules, se valida el flujo de `admin` y usuario no admin.
- Si tocaste multiempresa, revisar `migracion-multiempresa.html`.
- Si tocaste UI, revisar desktop y mobile.

## QA minimo funcional

Validar al menos:

- Login de usuario activo.
- Bloqueo de usuario inactivo.
- Modulos principales cargan datos (clientes, productos, ventas).
- Si hubo cambios de tenant, no mezclar datos entre empresas.

## Reglas de seguridad

- No subir archivos con datos reales de clientes.
- No subir secretos en texto plano.
- Evitar commits de exportaciones locales (`_tmp_*`, `*.xls`, `*.csv.tmp`).

## Pull Requests

- PR pequeno y enfocado.
- Describir que cambia, por que y como probarlo.
- Incluir riesgos conocidos y plan de rollback si aplica.
