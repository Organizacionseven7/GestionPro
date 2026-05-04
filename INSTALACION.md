# 🚀 GestiónPro — Guía de instalación con Firebase
## Paso a paso desde cero (sin experiencia previa)

---

## ¿Qué vas a tener al final?

Un sistema de gestión completo en la nube con:
- Login con email y contraseña
- Dashboard con métricas en tiempo real
- Productos e inventario
- Carga masiva de productos por CSV/pegado
- Clientes (CRM)
- Presupuestos
- Facturas con vencimientos y origen (presupuesto/manual)
- Ventas / POS
- Pagos / Caja
- Proveedores
- Reportes

Todo gratis con Firebase, sin servidor propio.

---

## PARTE 1 — Crear el proyecto en Firebase

### Paso 1: Crear cuenta Firebase
1. Andá a **https://firebase.google.com**
2. Hacé clic en **"Comenzar"** (si tenés cuenta Google ya estás listo)
3. Hacé clic en **"Ir a la consola"**

### Paso 2: Crear proyecto nuevo
1. Hacé clic en **"Agregar proyecto"**
2. Ponele un nombre (ej: `mi-gestion-2024`)
3. En Google Analytics: podés deshabilitarlo para simplificar
4. Clic en **"Crear proyecto"** → esperá unos segundos

### Paso 3: Habilitar Authentication
1. En el menú izquierdo → **"Authentication"**
2. Clic en **"Comenzar"**
3. En la pestaña **"Sign-in method"** → clic en **"Correo electrónico/contraseña"**
4. Activá el primer switch → **"Guardar"**

### Paso 4: Crear tu usuario admin
1. En Authentication → pestaña **"Users"**
2. Clic en **"Agregar usuario"**
3. Ingresá tu email y una contraseña segura
4. **Guardá esas credenciales** — son para entrar al sistema

### Paso 5: Crear la base de datos Firestore
1. En el menú izquierdo → **"Firestore Database"**
2. Clic en **"Crear base de datos"**
3. Elegí **"Comenzar en modo de prueba"** (podés cambiar las reglas después)
4. Seleccioná la región: **southamerica-east1 (São Paulo)** ← más cercana a Argentina
5. Clic en **"Listo"**

### Paso 6: Obtener la configuración de tu app
1. En la pantalla principal de tu proyecto, clic en el ícono **`</>`** (Web)
2. Registrá la app (ponele cualquier nombre, ej: "Sistema Web")
3. **NO** marques Firebase Hosting por ahora
4. Clic en **"Registrar app"**
5. Vas a ver un bloque de código con `firebaseConfig` — **copiá todo eso**
6. Clic en **"Continuar a la consola"**

---

## PARTE 2 — Configurar el sistema

### Paso 7: Abrir el proyecto en VSCode
1. Descomprimí el ZIP del sistema en una carpeta (ej: `mi-gestion`)
2. Abrí VSCode → **Archivo → Abrir carpeta** → seleccioná `mi-gestion`

### Paso 8: Pegar tu configuración de Firebase
1. Abrí el archivo `js/firebase-config.js`
2. Reemplazá el bloque `firebaseConfig` con el que copiaste de Firebase:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",          // ← tu valor real
  authDomain: "mi-gestion-...",
  projectId: "mi-gestion-...",
  storageBucket: "mi-gestion-...",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc123"
};
```

¡Guardá el archivo! (`Ctrl+S`)

---

## PARTE 3 — Subir a Hostinger

### Paso 9: Subir los archivos a Hostinger
1. Entrá a tu panel de **Hostinger**
2. Buscá **"Administrador de archivos"**
3. Navegá a `public_html` (o la carpeta de tu subdominio/dominio)
4. Subí **todos los archivos y carpetas** del sistema:
   - `index.html`, `login.html`, `productos.html`, etc.
   - Carpeta `css/`
   - Carpeta `js/`

### Paso 10: Configurar las reglas de Firestore
1. Volvé a la consola de Firebase → Firestore → pestaña **"Reglas"**
2. Reemplazá todo el contenido con las reglas de `firestore.rules` (incluidas en este proyecto). Si querés pegar manualmente, usá este bloque:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() {
      return request.auth != null;
    }
    function userDoc() {
      return get(/databases/$(database)/documents/usuarios/$(request.auth.uid));
    }
    function role() {
      return signedIn() && userDoc().exists() ? userDoc().data.rol : 'admin';
    }
    function isAdmin() { return signedIn() && role() == 'admin'; }
    function isVentas() { return signedIn() && role() == 'ventas'; }
    function isOperador() { return signedIn() && role() == 'operador'; }
    function isComercial() { return isAdmin() || isVentas(); }
    function isOperacion() { return isAdmin() || isOperador(); }

    match /usuarios/{uid} {
      allow read: if signedIn() && (isAdmin() || request.auth.uid == uid);
      allow create: if signedIn() && (
        isAdmin() ||
        (uid == request.auth.uid && !exists(/databases/$(database)/documents/usuarios/$(uid)))
      );
      allow update: if isAdmin() && (
        uid != request.auth.uid ||
        (request.resource.data.rol == 'admin' && request.resource.data.activo != false)
      );
      allow delete: if false;
    }

    match /clientes/{id} {
      allow read: if signedIn();
      allow write: if isComercial();
    }

    match /ventas/{id} {
      allow read: if signedIn();
      allow write: if isComercial();
    }

    match /presupuestos/{id} {
      allow read: if signedIn();
      allow write: if isComercial();
    }

    match /facturas/{id} {
      allow read: if signedIn();
      allow write: if isComercial();
    }

    match /productos/{id} {
      allow read: if signedIn();
      allow write: if isOperacion();
    }

    match /categorias/{id} {
      allow read: if signedIn();
      allow write: if isOperacion();
    }

    match /proveedores/{id} {
      allow read: if signedIn();
      allow write: if isOperacion();
    }

    match /pagos/{id} {
      allow read: if signedIn();
      allow write: if isOperacion();
    }

    match /cotizaciones_historial/{id} {
      allow read: if signedIn();
      allow write: if isOperacion();
    }

    match /movimientos_stock/{id} {
      allow read: if signedIn();
      allow write: if isComercial() || isOperador();
    }

    match /config/{id} {
      allow read: if signedIn();
      allow write: if isOperacion();
    }

    match /__diagnostico_guardado/{id} {
      allow read, write: if isAdmin();
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Clic en **"Publicar"**

Estas reglas aplican permisos por rol (`admin`, `ventas`, `operador`) y protegen mejor el módulo de usuarios.
Nota: la condición "último administrador activo" no puede garantizarse al 100% solo con reglas de Firestore; para eso se recomienda Cloud Functions con transacciones.

### Paso 11: Autorizar tu dominio en Firebase
1. En Firebase → Authentication → pestaña **"Configuración"**
2. En **"Dominios autorizados"** → clic en **"Agregar dominio"**
3. Agregá tu dominio de Hostinger (ej: `midominio.com`)
4. También agregá `www.midominio.com`

---

## PARTE 4 — Conectar tu dominio Google

Si tenés un dominio comprado en Google Domains:
1. Entrá a **domains.google.com**
2. Seleccioná tu dominio → **"DNS"**
3. Los registros DNS ya deberían apuntar a Hostinger si lo configuraste antes
4. No necesitás cambiar nada más — el sistema ya funciona en tu dominio Hostinger

---

## PARTE 5 — Primer acceso

### Paso 12: Entrar al sistema
1. Abrí tu dominio en el navegador
2. Vas a ver la pantalla de **login**
3. Ingresá el email y contraseña que creaste en el Paso 4
4. ¡Listo! Ya estás dentro del sistema

---

## 📁 Estructura del proyecto

```
/
├── login.html              ← Pantalla de acceso
├── index.html              ← Dashboard principal ✅
├── productos.html          ← Inventario + carga masiva (CSV/pegado) ✅
├── clientes.html           ← CRM de clientes ✅
├── presupuestos.html       ← Crear, imprimir y convertir a factura ✅
├── facturas.html           ← Facturación con vencimientos y trazabilidad ✅
├── ventas.html             ← Punto de venta ✅
├── proveedores.html        ← Gestión de proveedores ✅
├── pagos.html              ← Caja y pagos ✅
├── reportes.html           ← Reportes y estadísticas ✅
├── css/
│   └── style.css
└── js/
    ├── firebase-config.js  ← ⚙️ CONFIGURAR CON TUS DATOS
    ├── utils.js
    └── sidebar.js
```

---

## ✅ Go-live Multiempresa (recomendado)

Antes de usar el sistema con varias empresas/clientes, completá este checklist:

1. Ingresá como usuario admin.
2. Abrí `migracion-multiempresa.html`.
3. Ejecutá `Escanear` y luego `Aplicar migración` hasta que todos los pendientes estén en `0`.
4. Publicá reglas e índices desde terminal:

```bash
npx firebase-tools deploy --only firestore:rules,firestore:indexes
```

5. Publicá hosting:

```bash
npx firebase-tools deploy --only hosting
```

6. Verificá que cada usuario solo vea sus datos de empresa (clientes, ventas, facturas, pagos, productos, proveedores).

Si el deploy falla porque ejecutaste `deploy --only` sin target, corré los comandos exactos de arriba.

---

## ❓ Preguntas frecuentes

**¿Es gratis?**
Sí. Firebase tiene un plan gratuito (Spark) que incluye:
- 50.000 lecturas y 20.000 escrituras por día
- 1 GB de almacenamiento Firestore
- Autenticación ilimitada
Más que suficiente para empezar y crecer.

**¿Puedo agregar más usuarios?**
Sí. En Firebase → Authentication → pestaña Users → "Agregar usuario".

**¿Puedo cargar muchos productos de una sola vez?**
Sí. En `Productos` tenés `+ Carga masiva` para pegar líneas (CSV, `;`, coma o tab), usar `Descargar plantilla CSV` y luego `Previsualizar` antes de importar.

**¿Dónde actualizo la cotización USD para todos los productos?**
En `Productos` tenés la sección `Cotización USD global`: podés cargarla manualmente y aplicar en lote a todos los productos, o tomar una referencia online y luego aplicar. También hay enlace de referencia al BCRA y opción `Auto actualizar al abrir` (sincroniza valor una vez por día).

**¿Puedo tener productos en pesos sin usar dólar?**
Sí. En el formulario de producto podés elegir `Moneda base: ARS`. En ese caso costo y venta se manejan en pesos y la cotización USD no afecta ese producto.

**¿Se puede exportar/imprimir un presupuesto?**
Sí. El módulo de presupuestos ya incluye impresión directa.

**¿Se puede convertir un presupuesto en factura?**
Sí. Desde presupuestos aceptados podés generar una factura en un clic, con vínculo entre ambos módulos.

**¿Funciona sin internet?**
No, requiere conexión. Firestore sí tiene caché offline pero la app necesita internet.
