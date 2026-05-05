# Security Policy

## Supported Versions

Actualmente se da soporte a la rama activa `main`.

## Reportar una vulnerabilidad

Si encontraste una vulnerabilidad de seguridad, por favor:

1. No la publiques en un issue publico.
2. Envia un reporte privado por email a `organizacion.seven7@gmail.com`.
3. Inclui:
   - descripcion del problema
   - impacto estimado
   - pasos para reproducir
   - posible mitigacion

## Tiempos de respuesta (objetivo)

- Confirmacion de recepcion: dentro de 72 horas.
- Analisis inicial: dentro de 7 dias habiles.
- Plan de mitigacion: segun severidad e impacto.

## Buenas practicas para contribuidores

- No commitear secretos ni credenciales.
- No subir datos reales de clientes.
- Revisar cambios de `firestore.rules` y permisos antes de merge.
- Verificar aislamiento multiempresa (`empresa_id`) en cambios de datos.

## Alcance de seguridad clave del proyecto

- Control de acceso por rol (`admin`, `ventas`, `operador`).
- Control de usuario activo/inactivo.
- Reglas de Firestore e indices desplegados en cada release.
- Validacion de tenant para evitar mezcla de datos entre empresas.
