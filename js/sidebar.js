// js/sidebar.js — inyecta el sidebar en todas las páginas

export function renderSidebar(activePage) {
    const role = (sessionStorage.getItem('gp_user_role') || 'admin').toLowerCase();
    const navSections = [
        {
            section: 'Principal',
            items: [
                { page: 'dashboard', icon: '◈', label: 'Dashboard', href: 'index.html', roles: ['admin', 'ventas', 'operador'] },
            ],
        },
        {
            section: 'Comercial',
            items: [
                { page: 'ventas', icon: '◎', label: 'Ventas / POS', href: 'ventas.html', roles: ['admin', 'ventas'] },
                { page: 'presupuestos', icon: '◇', label: 'Presupuestos', href: 'presupuestos.html', roles: ['admin', 'ventas'] },
                { page: 'facturas', icon: '▣', label: 'Facturas', href: 'facturas.html', roles: ['admin', 'ventas'] },
                { page: 'clientes', icon: '◉', label: 'Clientes', href: 'clientes.html', roles: ['admin', 'ventas'] },
                { page: 'usuarios', icon: '◌', label: 'Usuarios', href: 'usuarios.html', roles: ['admin'] },
            ],
        },
        {
            section: 'Inventario',
            items: [
                { page: 'productos', icon: '▦', label: 'Productos', href: 'productos.html', roles: ['admin', 'operador'] },
                { page: 'proveedores', icon: '◫', label: 'Proveedores', href: 'proveedores.html', roles: ['admin', 'operador'] },
            ],
        },
        {
            section: 'Finanzas',
            items: [
                { page: 'pagos', icon: '◎', label: 'Pagos / Caja', href: 'pagos.html', roles: ['admin', 'operador'] },
                { page: 'reportes', icon: '▤', label: 'Reportes', href: 'reportes.html', roles: ['admin', 'operador'] },
            ],
        },
    ];

    const roleLabel = role === 'admin' ? 'Administrador' : role === 'ventas' ? 'Comercial' : 'Operador';
    const items = navSections.map(group => {
        const visibles = group.items.filter(i => !i.roles || i.roles.includes(role));
        if (!visibles.length) return '';
        const links = visibles.map(n => `<a class="nav-item${n.page === activePage ? ' active' : ''}" href="${n.href}" data-page="${n.page}">
            <span class="nav-icon">${n.icon}</span>${n.label}
        </a>`).join('');
        return `<div class="nav-label">${group.section}</div>${links}`;
    }).join('');

    return `
    <aside class="sidebar" id="sidebar">
        <div class="sidebar-logo">
            <h1>⬡ GestiónPro</h1>
            <span>Sistema de gestión</span>
        </div>
        <nav class="sidebar-nav">${items}</nav>
        <div class="sidebar-user">
            <div class="avatar" id="user-avatar">—</div>
            <div style="flex:1;min-width:0">
                <div id="user-name" style="font-weight:600;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">Cargando…</div>
                <div style="font-size:11px;color:var(--muted)">${roleLabel}</div>
            </div>
            <button class="btn btn-ghost btn-sm" id="btn-logout" title="Cerrar sesión" style="padding:4px 8px">↩</button>
        </div>
    </aside>`;
}
