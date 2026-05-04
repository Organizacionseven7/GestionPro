/**
 * GestionPro – Lógica principal de la aplicación
 * App web para la administración y gestión de empresas o negocios.
 * Repositorio: https://github.com/Organizacionseven7/GestionPro
 */

const App = (() => {
  // ── State ──────────────────────────────────────────────────────────────
  let state = {
    clientes: [],
    productos: [],
    facturas: [],
    config: {
      nombre: 'Mi Empresa S.A.',
      ruc: '',
      direccion: '',
      telefono: '',
      email: '',
    },
  };

  // ── Persistence ────────────────────────────────────────────────────────
  function cargar() {
    try {
      const saved = localStorage.getItem('gestionpro_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        state = { ...state, ...parsed };
      }
    } catch (e) {
      console.warn('No se pudo cargar el estado:', e);
    }
  }

  function guardar() {
    try {
      localStorage.setItem('gestionpro_data', JSON.stringify(state));
    } catch (e) {
      console.warn('No se pudo guardar el estado:', e);
    }
  }

  // ── Utilities ──────────────────────────────────────────────────────────
  function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  const ESTADOS_VALIDOS = new Set(['pendiente', 'pagada', 'cancelada']);

  function estadoSeguro(estado) {
    return ESTADOS_VALIDOS.has(estado) ? estado : 'pendiente';
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatMoney(n) {
    return '$' + Number(n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function formatDate(iso) {
    if (!iso) return '—';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  // ── Toast ──────────────────────────────────────────────────────────────
  function toast(msg, duration = 2800) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), duration);
  }

  // ── Navigation ─────────────────────────────────────────────────────────
  function initNav() {
    document.querySelectorAll('.nav-link[data-section]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const sec = link.dataset.section;
        navegarA(sec);
        // Close sidebar on mobile
        document.getElementById('sidebar').classList.remove('open');
      });
    });

    document.getElementById('menuToggle').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });
  }

  function navegarA(seccion) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    const sec = document.getElementById(seccion);
    if (sec) sec.classList.add('active');

    const link = document.querySelector(`.nav-link[data-section="${seccion}"]`);
    if (link) link.classList.add('active');

    const titles = {
      dashboard: 'Dashboard',
      clientes: 'Clientes',
      productos: 'Productos',
      facturas: 'Facturas',
      reportes: 'Reportes',
      configuracion: 'Configuración',
    };
    document.getElementById('pageTitle').textContent = titles[seccion] || seccion;

    if (seccion === 'dashboard') renderDashboard();
    if (seccion === 'clientes') renderClientes();
    if (seccion === 'productos') renderProductos();
    if (seccion === 'facturas') renderFacturas();
    if (seccion === 'reportes') renderReportes();
    if (seccion === 'configuracion') renderConfig();
  }

  // ── Dashboard ──────────────────────────────────────────────────────────
  function renderDashboard() {
    document.getElementById('totalClientes').textContent = state.clientes.length;
    document.getElementById('totalProductos').textContent = state.productos.length;
    document.getElementById('totalFacturas').textContent = state.facturas.length;

    const ingreso = state.facturas
      .filter(f => f.estado === 'pagada')
      .reduce((sum, f) => sum + (f.total || 0), 0);
    document.getElementById('ingresoTotal').textContent = formatMoney(ingreso);

    const tbody = document.getElementById('facturasDashboardBody');
    const recientes = [...state.facturas]
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
      .slice(0, 5);

    if (recientes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-row">No hay facturas aún.</td></tr>';
      return;
    }
    tbody.innerHTML = recientes.map((f, i) => {
      const cliente = state.clientes.find(c => c.id === f.clienteId);
      return `<tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(cliente ? cliente.nombre : '—')}</td>
        <td>${escapeHtml(formatDate(f.fecha))}</td>
        <td>${escapeHtml(formatMoney(f.total))}</td>
        <td><span class="badge badge-${estadoSeguro(f.estado)}">${escapeHtml(f.estado)}</span></td>
      </tr>`;
    }).join('');
  }

  // ── Clientes ───────────────────────────────────────────────────────────
  function renderClientes(filtro = '') {
    const lista = filtro
      ? state.clientes.filter(c =>
          c.nombre.toLowerCase().includes(filtro) ||
          (c.email || '').toLowerCase().includes(filtro))
      : state.clientes;

    const tbody = document.getElementById('tablaClientesBody');
    if (lista.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-row">No hay clientes registrados.</td></tr>';
      return;
    }
    tbody.innerHTML = lista.map((c, i) => `<tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(c.nombre)}</td>
      <td>${escapeHtml(c.email || '—')}</td>
      <td>${escapeHtml(c.telefono || '—')}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="App.abrirModalCliente('${escapeHtml(c.id)}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="App.eliminarCliente('${escapeHtml(c.id)}')">Eliminar</button>
      </td>
    </tr>`).join('');
  }

  function filtrarClientes() {
    const val = document.getElementById('buscarCliente').value.toLowerCase();
    renderClientes(val);
  }

  function abrirModalCliente(id) {
    const form = document.getElementById('formCliente');
    form.reset();
    if (id) {
      const c = state.clientes.find(x => x.id === id);
      if (!c) return;
      document.getElementById('modalClienteTitulo').textContent = 'Editar Cliente';
      document.getElementById('clienteId').value = c.id;
      document.getElementById('clienteNombre').value = c.nombre;
      document.getElementById('clienteEmail').value = c.email || '';
      document.getElementById('clienteTelefono').value = c.telefono || '';
      document.getElementById('clienteDireccion').value = c.direccion || '';
    } else {
      document.getElementById('modalClienteTitulo').textContent = 'Nuevo Cliente';
      document.getElementById('clienteId').value = '';
    }
    abrirModal('modalCliente');
  }

  function guardarCliente(e) {
    e.preventDefault();
    const id = document.getElementById('clienteId').value;
    const data = {
      nombre: document.getElementById('clienteNombre').value.trim(),
      email: document.getElementById('clienteEmail').value.trim(),
      telefono: document.getElementById('clienteTelefono').value.trim(),
      direccion: document.getElementById('clienteDireccion').value.trim(),
    };
    if (id) {
      const idx = state.clientes.findIndex(c => c.id === id);
      if (idx !== -1) state.clientes[idx] = { ...state.clientes[idx], ...data };
      toast('Cliente actualizado ✓');
    } else {
      state.clientes.push({ id: generarId(), ...data });
      toast('Cliente agregado ✓');
    }
    guardar();
    cerrarModal('modalCliente');
    renderClientes();
    renderDashboard();
  }

  function eliminarCliente(id) {
    if (!confirm('¿Eliminar este cliente?')) return;
    state.clientes = state.clientes.filter(c => c.id !== id);
    guardar();
    renderClientes();
    renderDashboard();
    toast('Cliente eliminado');
  }

  // ── Productos ──────────────────────────────────────────────────────────
  function renderProductos(filtro = '') {
    const lista = filtro
      ? state.productos.filter(p =>
          p.nombre.toLowerCase().includes(filtro) ||
          (p.categoria || '').toLowerCase().includes(filtro))
      : state.productos;

    const tbody = document.getElementById('tablaProductosBody');
    if (lista.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-row">No hay productos registrados.</td></tr>';
      return;
    }
    tbody.innerHTML = lista.map((p, i) => `<tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(p.nombre)}</td>
      <td>${escapeHtml(p.categoria || '—')}</td>
      <td>${escapeHtml(formatMoney(p.precio))}</td>
      <td>${Number(p.stock) || 0}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="App.abrirModalProducto('${escapeHtml(p.id)}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="App.eliminarProducto('${escapeHtml(p.id)}')">Eliminar</button>
      </td>
    </tr>`).join('');
  }

  function filtrarProductos() {
    const val = document.getElementById('buscarProducto').value.toLowerCase();
    renderProductos(val);
  }

  function abrirModalProducto(id) {
    const form = document.getElementById('formProducto');
    form.reset();
    if (id) {
      const p = state.productos.find(x => x.id === id);
      if (!p) return;
      document.getElementById('modalProductoTitulo').textContent = 'Editar Producto';
      document.getElementById('productoId').value = p.id;
      document.getElementById('productoNombre').value = p.nombre;
      document.getElementById('productoCategoria').value = p.categoria || '';
      document.getElementById('productoPrecio').value = p.precio;
      document.getElementById('productoStock').value = p.stock ?? 0;
      document.getElementById('productoDescripcion').value = p.descripcion || '';
    } else {
      document.getElementById('modalProductoTitulo').textContent = 'Nuevo Producto';
      document.getElementById('productoId').value = '';
    }
    abrirModal('modalProducto');
  }

  function guardarProducto(e) {
    e.preventDefault();
    const id = document.getElementById('productoId').value;
    const data = {
      nombre: document.getElementById('productoNombre').value.trim(),
      categoria: document.getElementById('productoCategoria').value.trim(),
      precio: parseFloat(document.getElementById('productoPrecio').value) || 0,
      stock: parseInt(document.getElementById('productoStock').value, 10) || 0,
      descripcion: document.getElementById('productoDescripcion').value.trim(),
    };
    if (id) {
      const idx = state.productos.findIndex(p => p.id === id);
      if (idx !== -1) state.productos[idx] = { ...state.productos[idx], ...data };
      toast('Producto actualizado ✓');
    } else {
      state.productos.push({ id: generarId(), ...data });
      toast('Producto agregado ✓');
    }
    guardar();
    cerrarModal('modalProducto');
    renderProductos();
    renderDashboard();
  }

  function eliminarProducto(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    state.productos = state.productos.filter(p => p.id !== id);
    guardar();
    renderProductos();
    renderDashboard();
    toast('Producto eliminado');
  }

  // ── Facturas ───────────────────────────────────────────────────────────
  function renderFacturas() {
    const tbody = document.getElementById('tablaFacturasBody');
    if (state.facturas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-row">No hay facturas registradas.</td></tr>';
      return;
    }
    const sorted = [...state.facturas].sort((a, b) => b.fecha.localeCompare(a.fecha));
    tbody.innerHTML = sorted.map((f, i) => {
      const cliente = state.clientes.find(c => c.id === f.clienteId);
      return `<tr>
        <td>${i + 1}</td>
        <td>${escapeHtml(cliente ? cliente.nombre : '—')}</td>
        <td>${escapeHtml(formatDate(f.fecha))}</td>
        <td>${escapeHtml(formatMoney(f.total))}</td>
        <td><span class="badge badge-${estadoSeguro(f.estado)}">${escapeHtml(f.estado)}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="App.abrirModalFactura('${escapeHtml(f.id)}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="App.eliminarFactura('${escapeHtml(f.id)}')">Eliminar</button>
        </td>
      </tr>`;
    }).join('');
  }

  function poblarSelectClientes(selectId, selectedId = '') {
    const sel = document.getElementById(selectId);
    sel.innerHTML = '<option value="">— Seleccione cliente —</option>' +
      state.clientes.map(c =>
        `<option value="${escapeHtml(c.id)}" ${c.id === selectedId ? 'selected' : ''}>${escapeHtml(c.nombre)}</option>`
      ).join('');
  }

  function poblarSelectProductos(selectEl, selectedId = '') {
    selectEl.innerHTML = '<option value="">— Seleccione producto —</option>' +
      state.productos.map(p =>
        `<option value="${escapeHtml(p.id)}" data-precio="${escapeHtml(String(p.precio))}" ${p.id === selectedId ? 'selected' : ''}>${escapeHtml(p.nombre)}</option>`
      ).join('');
  }

  function abrirModalFactura(id) {
    poblarSelectClientes('facturaCliente', '');
    document.getElementById('facturaFecha').value = today();
    document.getElementById('facturaEstado').value = 'pendiente';

    const itemsContainer = document.getElementById('facturaItems');
    itemsContainer.innerHTML = '';
    agregarItemRow(itemsContainer);

    if (id) {
      const f = state.facturas.find(x => x.id === id);
      if (!f) return;
      document.getElementById('modalFacturaTitulo').textContent = 'Editar Factura';
      document.getElementById('facturaId').value = f.id;
      poblarSelectClientes('facturaCliente', f.clienteId);
      document.getElementById('facturaFecha').value = f.fecha;
      document.getElementById('facturaEstado').value = f.estado;

      itemsContainer.innerHTML = '';
      (f.items || []).forEach(item => {
        const row = agregarItemRow(itemsContainer);
        const sel = row.querySelector('.item-producto');
        poblarSelectProductos(sel, item.productoId);
        row.querySelector('.item-cantidad').value = item.cantidad;
        row.querySelector('.item-precio').value = item.precio;
        actualizarSubtotalRow(row);
      });
    } else {
      document.getElementById('modalFacturaTitulo').textContent = 'Nueva Factura';
      document.getElementById('facturaId').value = '';
      const firstSel = itemsContainer.querySelector('.item-producto');
      if (firstSel) poblarSelectProductos(firstSel);
    }

    calcularTotalFactura();
    abrirModal('modalFactura');
  }

  function agregarItemRow(container) {
    const row = document.createElement('div');
    row.className = 'item-row';
    row.innerHTML = `
      <select class="form-control item-producto" onchange="App.actualizarItemPrecio(this)"></select>
      <input type="number" class="form-control item-cantidad" placeholder="Cant." min="1" value="1" onchange="App.calcularTotalFactura()" />
      <input type="number" class="form-control item-precio" placeholder="Precio" min="0" step="0.01" value="0" onchange="App.calcularTotalFactura()" />
      <span class="item-subtotal">$0.00</span>
      <button type="button" class="btn-icon" onclick="App.eliminarItemFactura(this)">🗑️</button>
    `;
    const sel = row.querySelector('.item-producto');
    poblarSelectProductos(sel);
    container.appendChild(row);
    return row;
  }

  function agregarItemFactura() {
    const container = document.getElementById('facturaItems');
    agregarItemRow(container);
  }

  function eliminarItemFactura(btn) {
    const row = btn.closest('.item-row');
    const container = document.getElementById('facturaItems');
    if (container.children.length > 1) {
      row.remove();
      calcularTotalFactura();
    } else {
      toast('Debe haber al menos un ítem.');
    }
  }

  function actualizarItemPrecio(sel) {
    const opt = sel.options[sel.selectedIndex];
    const precio = opt ? (opt.dataset.precio || 0) : 0;
    const row = sel.closest('.item-row');
    if (row) {
      row.querySelector('.item-precio').value = precio;
      actualizarSubtotalRow(row);
    }
    calcularTotalFactura();
  }

  function actualizarSubtotalRow(row) {
    const qty = parseFloat(row.querySelector('.item-cantidad').value) || 0;
    const price = parseFloat(row.querySelector('.item-precio').value) || 0;
    row.querySelector('.item-subtotal').textContent = formatMoney(qty * price);
  }

  function calcularTotalFactura() {
    let total = 0;
    document.querySelectorAll('#facturaItems .item-row').forEach(row => {
      const qty = parseFloat(row.querySelector('.item-cantidad').value) || 0;
      const price = parseFloat(row.querySelector('.item-precio').value) || 0;
      total += qty * price;
      row.querySelector('.item-subtotal').textContent = formatMoney(qty * price);
    });
    document.getElementById('facturaTotalDisplay').textContent = formatMoney(total);
  }

  function guardarFactura(e) {
    e.preventDefault();
    const clienteId = document.getElementById('facturaCliente').value;
    if (!clienteId) { toast('Seleccione un cliente.'); return; }

    const items = [];
    let total = 0;
    document.querySelectorAll('#facturaItems .item-row').forEach(row => {
      const sel = row.querySelector('.item-producto');
      const productoId = sel.value;
      const cantidad = parseFloat(row.querySelector('.item-cantidad').value) || 0;
      const precio = parseFloat(row.querySelector('.item-precio').value) || 0;
      if (productoId && cantidad > 0) {
        items.push({ productoId, cantidad, precio });
        total += cantidad * precio;
      }
    });
    if (items.length === 0) { toast('Agregue al menos un ítem válido.'); return; }

    const id = document.getElementById('facturaId').value;
    const data = {
      clienteId,
      fecha: document.getElementById('facturaFecha').value,
      estado: document.getElementById('facturaEstado').value,
      items,
      total,
    };
    if (id) {
      const idx = state.facturas.findIndex(f => f.id === id);
      if (idx !== -1) state.facturas[idx] = { ...state.facturas[idx], ...data };
      toast('Factura actualizada ✓');
    } else {
      state.facturas.push({ id: generarId(), ...data });
      toast('Factura creada ✓');
    }
    guardar();
    cerrarModal('modalFactura');
    renderFacturas();
    renderDashboard();
  }

  function eliminarFactura(id) {
    if (!confirm('¿Eliminar esta factura?')) return;
    state.facturas = state.facturas.filter(f => f.id !== id);
    guardar();
    renderFacturas();
    renderDashboard();
    toast('Factura eliminada');
  }

  // ── Reportes ───────────────────────────────────────────────────────────
  function renderReportes() {
    const mes = new Date().getMonth();
    const anio = new Date().getFullYear();

    const ingresosMes = state.facturas
      .filter(f => {
        const d = new Date(f.fecha);
        return f.estado === 'pagada' && d.getMonth() === mes && d.getFullYear() === anio;
      })
      .reduce((sum, f) => sum + (f.total || 0), 0);

    const pagadas = state.facturas.filter(f => f.estado === 'pagada').length;
    const pendientes = state.facturas.filter(f => f.estado === 'pendiente').length;
    const stock = state.productos.reduce((sum, p) => sum + (p.stock || 0), 0);

    document.getElementById('ingresosMes').textContent = formatMoney(ingresosMes);
    document.getElementById('facturasPagadas').textContent = pagadas;
    document.getElementById('facturasPendientes').textContent = pendientes;
    document.getElementById('productosStock').textContent = stock;

    // Top clientes
    const porCliente = {};
    state.facturas.forEach(f => {
      if (!porCliente[f.clienteId]) porCliente[f.clienteId] = { total: 0, count: 0 };
      porCliente[f.clienteId].total += f.total || 0;
      porCliente[f.clienteId].count += 1;
    });
    const topClientes = Object.entries(porCliente)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 5);

    const tbody = document.getElementById('topClientesBody');
    if (topClientes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" class="empty-row">Sin datos.</td></tr>';
      return;
    }
    tbody.innerHTML = topClientes.map(([cid, data]) => {
      const c = state.clientes.find(x => x.id === cid);
      return `<tr>
        <td>${escapeHtml(c ? c.nombre : '—')}</td>
        <td>${escapeHtml(formatMoney(data.total))}</td>
        <td>${data.count}</td>
      </tr>`;
    }).join('');
  }

  // ── Configuración ──────────────────────────────────────────────────────
  function renderConfig() {
    document.getElementById('cfgNombre').value = state.config.nombre || '';
    document.getElementById('cfgRuc').value = state.config.ruc || '';
    document.getElementById('cfgDireccion').value = state.config.direccion || '';
    document.getElementById('cfgTelefono').value = state.config.telefono || '';
    document.getElementById('cfgEmail').value = state.config.email || '';
  }

  function guardarConfig(e) {
    e.preventDefault();
    state.config = {
      nombre: document.getElementById('cfgNombre').value.trim(),
      ruc: document.getElementById('cfgRuc').value.trim(),
      direccion: document.getElementById('cfgDireccion').value.trim(),
      telefono: document.getElementById('cfgTelefono').value.trim(),
      email: document.getElementById('cfgEmail').value.trim(),
    };
    guardar();
    toast('Configuración guardada ✓');
  }

  // ── Modal helpers ──────────────────────────────────────────────────────
  function abrirModal(id) {
    document.getElementById(id).classList.add('open');
  }

  function cerrarModal(id) {
    document.getElementById(id).classList.remove('open');
  }

  // Close modal on overlay click
  document.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('open');
    }
  });

  // ── Init ───────────────────────────────────────────────────────────────
  function init() {
    cargar();
    initNav();
    renderDashboard();
  }

  document.addEventListener('DOMContentLoaded', init);

  // Public API
  return {
    abrirModalCliente,
    guardarCliente,
    eliminarCliente,
    filtrarClientes,
    abrirModalProducto,
    guardarProducto,
    eliminarProducto,
    filtrarProductos,
    abrirModalFactura,
    guardarFactura,
    eliminarFactura,
    agregarItemFactura,
    eliminarItemFactura,
    actualizarItemPrecio,
    calcularTotalFactura,
    guardarConfig,
    cerrarModal,
    navegarA,
  };
})();
