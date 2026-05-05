# GestionPro

Aplicacion web de gestion comercial con Firebase (Auth + Firestore + Hosting), orientada a multiempresa.

## Stack

- Frontend: HTML + CSS + JavaScript (sin framework)
- Backend/BaaS: Firebase Authentication + Firestore
- Deploy: Firebase Hosting

## Estructura principal

```text
.
|-- index.html
|-- login.html
|-- clientes.html
|-- productos.html
|-- ventas.html
|-- presupuestos.html
|-- facturas.html
|-- pagos.html
|-- proveedores.html
|-- reportes.html
|-- usuarios.html
|-- migracion-multiempresa.html
|-- diagnostico.html
|-- js/
|-- css/
|-- firebase.json
|-- firestore.rules
|-- firestore.indexes.json
```

## Requisitos

- Node.js 18+
- npm 9+
- Cuenta de Firebase con proyecto creado

## Configuracion inicial

1. Clonar el repositorio:

```bash
git clone https://github.com/Organizacionseven7/GestionPro.git
cd GestionPro
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar Firebase Web SDK en `js/firebase-config.js`.
	 Si vas a usar otro proyecto de Firebase, reemplaza `firebaseConfig` por el de tu consola.

4. Habilitar en Firebase:
- Authentication (email/password)
- Firestore Database

5. Publicar reglas e indices:

```bash
npx firebase-tools deploy --only firestore:rules,firestore:indexes
```

6. Publicar frontend:

```bash
npx firebase-tools deploy --only hosting
```

## Desarrollo local

Como son archivos estaticos, podes abrir con servidor local simple.

Opcion Python:

```bash
python -m http.server 5601
```

Opcion Node:

```bash
npx --yes http-server -p 5601
```

Abrir en navegador:

```text
http://localhost:5601
```

## Multiempresa (tenant)

- La app usa `empresa_id` para aislar datos por empresa.
- Herramienta de soporte: `migracion-multiempresa.html`
- Si migras datos historicos, verifica al final:
	- `Sin empresa_id = 0`
	- `Otras empresas = 0` (o reasignar si corresponde)

## Flujo recomendado de colaboracion

1. Crear rama por feature:

```bash
git checkout -b feature/nombre-corto
```

2. Commit con mensaje claro:

```bash
git add .
git commit -m "feat: descripcion corta"
```

3. Subir rama:

```bash
git push -u origin feature/nombre-corto
```

4. Abrir Pull Request hacia `main`.

## Proteccion de rama main (recomendado)

Para evitar merges con errores, activar reglas en GitHub:

1. Ir a `Settings > Branches > Add branch protection rule`.
2. Branch name pattern: `main`.
3. Activar `Require a pull request before merging`.
4. Activar `Require approvals` (minimo 1).
5. Activar `Require status checks to pass before merging`.
6. Seleccionar el check de Actions: `validate` (workflow `CI`).
7. Activar `Require branches to be up to date before merging`.
8. Guardar cambios.

Con esto, `main` solo acepta cambios revisados y con CI en verde.

## Archivos que NO deben subirse

El repositorio ya incluye `.gitignore` para evitar subir:

- archivos temporales (`_tmp_*`)
- planillas locales (`*.xls`, `*.xlsx`, `*.xlsm`)
- exports masivos (`productos_carga_masiva_*`)
- carpetas de cache/editor

## Documentacion adicional

- `INSTALACION.md`: guia extendida de instalacion y operacion.
- `SECURITY.md`: politica de reporte de vulnerabilidades.
- `docs/RELEASE_CHECKLIST.md`: checklist operativo para releases y deploy.

## Soporte rapido

Si algo falla en produccion:

1. Verificar deploy reciente de reglas e indices.
2. Revisar `migracion-multiempresa.html` para detectar pendientes/otros tenants.
3. Confirmar que el usuario tenga rol y `empresa_id` correctos en `usuarios/{uid}`.
