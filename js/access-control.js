import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-lite.js";

const ROLE_CACHE_KEY = 'gp_user_role';
const EMPRESA_CACHE_KEY = 'gp_empresa_id';

function setSessionProfile(data = {}, fallbackUid = null) {
    const role = data.rol || 'admin';
    const empresaId = data.empresa_id || fallbackUid || null;
    sessionStorage.setItem(ROLE_CACHE_KEY, role);
    if (empresaId) sessionStorage.setItem(EMPRESA_CACHE_KEY, empresaId);
}

export async function ensureUserActive(auth, db, user) {
    if (!user) return false;

    try {
        const snap = await getDoc(doc(db, 'usuarios', user.uid));
        if (!snap.exists()) {
            setSessionProfile({ rol: 'admin', empresa_id: user.uid }, user.uid);
            return true;
        }
        const data = snap.data() || {};
        setSessionProfile(data, user.uid);
        if (data.activo !== false) return true;

        sessionStorage.removeItem(ROLE_CACHE_KEY);
        sessionStorage.removeItem(EMPRESA_CACHE_KEY);
        await auth.signOut();
        window.location.href = 'login.html?motivo=inactivo';
        return false;
    } catch {
        // Ante errores de red temporales no bloqueamos para evitar falsos negativos.
        return true;
    }
}

export async function getUserRole(db, user) {
    if (!user) return null;
    try {
        const snap = await getDoc(doc(db, 'usuarios', user.uid));
        if (!snap.exists()) {
            sessionStorage.setItem(ROLE_CACHE_KEY, 'admin');
            sessionStorage.setItem(EMPRESA_CACHE_KEY, user.uid);
            return 'admin';
        }
        const data = snap.data() || {};
        const role = data.rol || 'admin';
        setSessionProfile(data, user.uid);
        return role;
    } catch {
        // Si no podemos leer perfil por error temporal, evitamos bloquear por rol.
        const cached = sessionStorage.getItem(ROLE_CACHE_KEY);
        return cached || 'admin';
    }
}

export async function ensureRoleAllowed(db, user, allowedRoles = []) {
    if (!user) return false;
    if (!Array.isArray(allowedRoles) || !allowedRoles.length) return true;

    const role = await getUserRole(db, user);
    const granted = allowedRoles.includes(role);
    if (granted) return true;

    window.location.href = 'index.html?motivo=sin_permiso';
    return false;
}

export function getEmpresaId() {
    return sessionStorage.getItem(EMPRESA_CACHE_KEY) || null;
}
