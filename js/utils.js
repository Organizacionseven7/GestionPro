// ── TOAST ────────────────────────────────────────
export function toast(msg, type = 'ok', ms = 3200) {
    const icons = { ok:'✓', err:'✕', wrn:'⚠' };
    let c = document.getElementById('toasts');
    if (!c) { c = document.createElement('div'); c.id = 'toasts'; document.body.appendChild(c); }
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<span>${icons[type]||'·'}</span><span>${msg}</span>`;
    c.appendChild(el);
    setTimeout(() => el.remove(), ms);
}

// ── MODAL ─────────────────────────────────────────
export function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
export function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

// Support inline onclick handlers used across HTML pages loaded as ES modules.
if (typeof window !== 'undefined') {
    window.openModal = openModal;
    window.closeModal = closeModal;
}

document.addEventListener('click', e => {
    if (e.target.classList.contains('overlay')) e.target.classList.remove('open');
});

// ── FORMAT ───────────────────────────────────────
export function money(n) {
    return '$' + parseFloat(n||0).toLocaleString('es-AR', { minimumFractionDigits:2, maximumFractionDigits:2 });
}
export function num(n) { return parseInt(n||0).toLocaleString('es-AR'); }
export function dateStr(ts) {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('es-AR');
}
export function nowDate() {
    return new Date().toLocaleDateString('es-AR', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
}

// ── CONFIRM ──────────────────────────────────────
export function ask(msg) { return confirm(msg); }

// ── GENERATE ID ──────────────────────────────────
export function genId(prefix = 'ID') {
    return prefix + '-' + Date.now().toString(36).toUpperCase();
}

// ── SIDEBAR TOGGLE ───────────────────────────────
export function initSidebar() {
    document.querySelector('.btn-menu')?.addEventListener('click', () => {
        document.querySelector('.sidebar')?.classList.toggle('open');
    });
}

// ── SIDEBAR ACTIVE LINK ──────────────────────────
export function setActiveNav(page) {
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.page === page);
    });
}

// ── SPINNER ──────────────────────────────────────
export function loading(tbody, cols = 6) {
    if (tbody) tbody.innerHTML = `<tr><td colspan="${cols}"><div class="empty"><div class="eicon">⋯</div><p>Cargando…</p></div></td></tr>`;
}
