// Firebase Configuration
// TODO: Replace with your project's config object from Firebase Console
// Go to Project Settings > General > Your Apps > SDK Setup and Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBSnSstmZmui0X3zxyQKATlUMSpaq0b-VI",
    authDomain: "casino-system-5947f.firebaseapp.com",
    projectId: "casino-system-5947f",
    storageBucket: "casino-system-5947f.firebasestorage.app",
    messagingSenderId: "166527970847",
    appId: "1:166527970847:web:1ed9f03fefcb44aa0f6f2a"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized");
} catch (e) {
    console.error("Firebase init error (Did you update the config?):", e);
}

const translations = {
    es: {
        brand_title: "INTELIGENCIA",
        nav_dashboard: "Panel Principal",
        nav_vision: "IA VisionProcessor",
        nav_admin: "Panel Admin",
        nav_reports: "Reportes",
        nav_config: "Configuración",
        logout: "Cerrar Sesión",
        role_superuser: "Super Usuario",
        header_title: "Centro de Inteligencia de Proveedores",
        system_status: "Sistema En Línea",
        search_placeholder: "Buscar proveedor, operación...",
        kpi_ops: "Total Operaciones",
        kpi_providers: "Total Proveedores",
        kpi_active: "Activos Globales",
        kpi_compliance: "Tasa Cumplimiento",
        matrix_title: "Matriz de Proveedores",
        filter_all: "Todas las Operaciones",
        col_provider: "Proveedor",
        col_subprovider: "Sub-Proveedor",
        col_vertical: "Vertical",
        col_status: "Estado",
        col_global_status: "Estado Global",
        compliance_title: "Cumplimiento Crítico",
        system_healthy: "Sistema Saludable",
        activity_title: "Actividad en Vivo",
        vision_desc: "Motor automatizado de optimización de imágenes. Sube activos para procesar al instante.",
        drag_drop: "Arrastra y suelta imágenes aquí",
        supported_files: "Soportado: JPG, PNG, WEBP (Max 10MB)",
        browse_files: "Explorar Archivos",
        files_selected: "Archivos Seleccionados:",
        target_size: "Tamaño Objetivo:",
        start_processing: "Iniciar Procesamiento por Lotes",
        admin_user_mgmt: "Gestión de Usuarios",
        add_user: "Agregar Usuario",
        col_user: "Usuario",
        col_role: "Rol",
        col_access: "Nivel de Acceso",
        col_actions: "Acciones",
        admin_system_ops: "Operaciones del Sistema",
        forcesync: "Forzar Sincronización de Datos",
        btn_sync: "Sincronizar Ahora",
        restart_services: "Reiniciar Servicios IA",
        btn_restart: "Reiniciar",
        audit_log: "Descargar Logs de Auditoría",
        btn_download: "Descargar (CSV)",
        reports_compliance: "Reporte Detallado de Cumplimiento",
        export_pdf: "Exportar PDF",
        date_range: "Rango de Fechas",
        region: "Región",
        gen_report: "Generar Reporte",
        chart_placeholder: "[Gráfico de Tendencia de Cumplimiento Mensual]",
        system_pref: "Preferencias del Sistema",
        cfg_darkmode: "Modo Oscuro Forzado",
        cfg_darkmode_desc: "Mantener la interfaz en modo alto contraste.",
        cfg_notifications: "Notifiche de Escritorio",
        cfg_notifications_desc: "Recibir alertas de nuevos proveedores.",
        cfg_autorefresh: "Auto-Refresco de Datos",
        cfg_autorefresh_desc: "Intervalo de sincronización de la matriz.",
        cfg_api_endpoint: "Endpoint de API Principal",
        save_changes: "Guardar Cambios",
        status_active: "Activo",
        status_inactive: "Inactivo",
        login_subtitle: "Sistema Seguro de Inteligencia de Proveedores",
        remember_me: "Recuérdame",
        forgot_pass: "¿Olvidaste tu contraseña?",
        login_action: "AUTENTICAR"
    },
    en: {
        brand_title: "INTELLIGENCE",
        nav_dashboard: "Dashboard",
        nav_vision: "VisionProcessor AI",
        nav_admin: "Admin Panel",
        nav_reports: "Reports",
        nav_config: "Settings",
        logout: "Logout",
        role_superuser: "Super User",
        header_title: "Provider Intelligence Center",
        system_status: "System Online",
        search_placeholder: "Search provider, operation...",
        kpi_ops: "Total Operations",
        kpi_providers: "Total Providers",
        kpi_active: "Global Active",
        kpi_compliance: "Compliance Rate",
        matrix_title: "Provider Matrix",
        filter_all: "All Operations",
        col_provider: "Provider",
        col_subprovider: "Sub-Provider",
        col_vertical: "Vertical",
        col_status: "Status",
        col_global_status: "Global Status",
        compliance_title: "Critical Compliance",
        system_healthy: "System Healthy",
        activity_title: "Live Activity",
        vision_desc: "Automated image optimization engine. Upload assets to process instantly.",
        drag_drop: "Drag & Drop Images Here",
        supported_files: "Supported: JPG, PNG, WEBP (Max 10MB)",
        browse_files: "Browse Files",
        files_selected: "Files Selected:",
        target_size: "Target Size:",
        start_processing: "Start Batch Processing",
        admin_user_mgmt: "User Management",
        add_user: "Add User",
        col_user: "User",
        col_role: "Role",
        col_access: "Access Level",
        col_actions: "Actions",
        admin_system_ops: "System Operations",
        forcesync: "Force Data Sync",
        btn_sync: "Sync Now",
        restart_services: "Restart AI Services",
        btn_restart: "Restart",
        audit_log: "Download Audit Logs",
        btn_download: "Download (CSV)",
        reports_compliance: "Detailed Compliance Report",
        export_pdf: "Export PDF",
        date_range: "Date Range",
        region: "Region",
        gen_report: "Generate Report",
        chart_placeholder: "[Monthly Compliance Trend Chart]",
        system_pref: "System Preferences",
        cfg_darkmode: "Forced Dark Mode",
        cfg_darkmode_desc: "Keep interface in high contrast mode.",
        cfg_notifications: "Desktop Notifications",
        cfg_notifications_desc: "Receive alerts for new providers.",
        cfg_autorefresh: "Data Auto-Refresh",
        cfg_autorefresh_desc: "Matrix synchronization interval.",
        cfg_api_endpoint: "Main API Endpoint",
        save_changes: "Save Changes",
        status_active: "Active",
        status_inactive: "Inactive",
        login_subtitle: "Secure Provider Intelligence System",
        remember_me: "Remember Me",
        forgot_pass: "Forgot Password?",
        login_action: "AUTHENTICATE"
    },
    // ... (Other languages can be added/maintained here, omitted for brevity but logic applies same)
};

let currentLang = 'es';

document.addEventListener('DOMContentLoaded', () => {

    // === Firebase Auth Logic ===
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.getElementById('app-container');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');
    const userNameDisplay = document.getElementById('user-name');

    // Force persistence to NONE to require login on every refresh
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE).then(() => {
        // Auth State Listener
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in
                console.log("User logged in:", user.email);
                loginScreen.style.display = 'none';
                appContainer.style.display = 'flex'; // Restore inline-flex or flex
                appContainer.classList.add('fade-in'); // Optional animation class

                // HIDE INTRO SCREEN IF LOGGED IN
                if (window.hideIntroScreen) window.hideIntroScreen();
                const intro = document.getElementById('intro-screen');
                if (intro) intro.classList.add('hidden'); // Fallback direct access

                if (user.email) userNameDisplay.textContent = user.email.split('@')[0];

                // Load data only when logged in
                loadDashboardData();
            } else {
                // User is signed out
                console.log("User logged out");
                loginScreen.style.display = 'flex';
                appContainer.style.display = 'none';
            }
        });
    });

    // Login Handler — with rate-limit protection & friendly error messages
    let loginAttempts = [];
    let rateLimitCooldown = false;
    let cooldownTimerId = null;

    function getFirebaseErrorMessage(errorCode) {
        const messages = {
            'auth/too-many-requests': '⚠️ Demasiados intentos fallidos. Tu dispositivo ha sido bloqueado temporalmente por seguridad.',
            'auth/wrong-password': 'Contraseña incorrecta. Verifica e intenta de nuevo.',
            'auth/user-not-found': 'No se encontró una cuenta con ese correo electrónico.',
            'auth/invalid-email': 'El correo electrónico no es válido.',
            'auth/user-disabled': 'Esta cuenta ha sido deshabilitada. Contacta al administrador.',
            'auth/invalid-credential': 'Credenciales inválidas. Verifica tu correo y contraseña.',
            'auth/network-request-failed': 'Error de conexión. Verifica tu conexión a internet.',
        };
        return messages[errorCode] || 'Error de autenticación. Intenta de nuevo.';
    }

    function startCooldownTimer(seconds) {
        rateLimitCooldown = true;
        const btn = document.getElementById('login-btn');
        let remaining = seconds;

        btn.disabled = true;

        if (cooldownTimerId) clearInterval(cooldownTimerId);

        cooldownTimerId = setInterval(() => {
            remaining--;
            if (remaining <= 0) {
                clearInterval(cooldownTimerId);
                cooldownTimerId = null;
                rateLimitCooldown = false;
                loginAttempts = [];
                btn.disabled = false;
                btn.innerHTML = `<span>AUTENTICAR</span><span class="material-icons-round">arrow_forward</span>`;
                loginError.textContent = '';
            } else {
                btn.innerHTML = `<span class="material-icons-round">hourglass_top</span> Espera ${remaining}s`;
                loginError.textContent = `⏳ Debes esperar ${remaining} segundos antes de intentar de nuevo.`;
            }
        }, 1000);

        btn.innerHTML = `<span class="material-icons-round">hourglass_top</span> Espera ${remaining}s`;
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (rateLimitCooldown) return;

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = document.getElementById('login-btn');

        // Client-side rate limiting: max 5 attempts in 2 minutes
        const now = Date.now();
        loginAttempts = loginAttempts.filter(t => now - t < 120000);
        if (loginAttempts.length >= 5) {
            loginError.textContent = '⚠️ Demasiados intentos. Espera un momento antes de intentar de nuevo.';
            startCooldownTimer(60);
            return;
        }
        loginAttempts.push(now);

        btn.disabled = true;
        btn.innerHTML = '<span class="material-icons-round spinning">refresh</span> Procesando...';
        loginError.textContent = '';

        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
            .then(() => {
                return firebase.auth().signInWithEmailAndPassword(email, password);
            })
            .then((userCredential) => {
                // Signed in — UI update happens in onAuthStateChanged
                loginAttempts = []; // Reset on success
            })
            .catch((error) => {
                const errorCode = error.code;
                console.error("Login Error:", errorCode, error.message);

                const friendlyMsg = getFirebaseErrorMessage(errorCode);
                loginError.textContent = friendlyMsg;

                if (errorCode === 'auth/too-many-requests') {
                    // Firebase has rate-limited us — start a 60s cooldown
                    startCooldownTimer(60);
                } else {
                    btn.disabled = false;
                    btn.innerHTML = `<span>AUTENTICAR</span><span class="material-icons-round">arrow_forward</span>`;
                }
            });
    });

    // Logout Handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            firebase.auth().signOut().then(() => {
                // Sign-out successful.
            }).catch((error) => {
                console.error("Logout Error:", error);
            });
        });
    }


    // === Language Switcher ===
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            changeLanguage(e.target.value);
        });
    }

    function changeLanguage(lang) {
        currentLang = lang;
        const t = translations[lang] || translations['en']; // Fallback

        // Update elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) el.textContent = t[key];
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (t[key]) el.placeholder = t[key];
        });
    }

    // === Navigation Logic ===
    const navItems = document.querySelectorAll('.nav-item:not(#logout-btn)'); // Exclude logout
    const views = document.querySelectorAll('.content-view');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.dataset.target;
            if (!target) return;

            // Update Nav State
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            // Update View State
            views.forEach(v => v.classList.remove('active'));
            const targetView = document.querySelector(`#view-${target}`);
            if (targetView) targetView.classList.add('active');

            // Trigger specific load if needed
            if (target === 'dashboard') loadDashboardData();
            if (target === 'analytics') loadAnalyticsData();
        });
    });

    // === Dashboard Logic ===
    async function loadDashboardData() {
        try {
            const response = await fetch("https://provider-system.onrender.com/api/dashboard-data");
            const data = await response.json();

            if (data.error) {
                console.error("Dashboard Error / Not Logged In?", data.error);
                return;
            }

            const isMstr = data.source === 'microstrategy';

            // Update KPI Cards
            const safeSetText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
            safeSetText('kpi-ops', data.metrics.total_operations);
            safeSetText('kpi-providers', data.metrics.total_providers);
            safeSetText('kpi-active', data.metrics.active_providers_global);
            safeSetText('kpi-compliance', data.metrics.compliance_rate + '%');

            // --- MATRIX & FILTER LOGIC ---
            const filterSelect = document.getElementById('operation-filter');
            if (!filterSelect) return;

            // Populate Filter options only if empty
            if (filterSelect.options.length <= 1 && data.stats_per_operation) {
                // Clear existing options except the first "all"
                while (filterSelect.options.length > 1) filterSelect.remove(1);

                // Add status filters for MSTR data
                if (isMstr) {
                    const optActive = document.createElement('option');
                    optActive.value = '_active';
                    optActive.textContent = `Proveedores Activos (${data.metrics.active_providers_global})`;
                    filterSelect.appendChild(optActive);

                    const optInactive = document.createElement('option');
                    optInactive.value = '_inactive';
                    optInactive.textContent = `Proveedores Inactivos (${data.metrics.total_providers - data.metrics.active_providers_global})`;
                    filterSelect.appendChild(optInactive);
                }

                Object.keys(data.stats_per_operation).forEach(op => {
                    const opt = document.createElement('option');
                    opt.value = op;
                    opt.textContent = `${op} (${data.stats_per_operation[op]})`;
                    filterSelect.appendChild(opt);
                });
            }

            // Render Table Function
            const renderTable = (filterOp) => {
                const tbody = document.getElementById('matrix-body');
                if (!tbody) return;
                tbody.innerHTML = '';
                const t = translations[currentLang] || translations['es'];

                // Update table header for MSTR data
                const thead = tbody.closest('table')?.querySelector('thead');
                if (thead && isMstr) {
                    thead.innerHTML = `<tr>
                        <th>${t.col_provider || 'Proveedor'}</th>
                        <th>${t.col_subprovider || 'Sub-Proveedor'}</th>
                        <th>${t.col_vertical || 'Vertical'}</th>
                        <th>Juegos</th>
                        <th>GGR</th>
                        <th>Spins</th>
                        <th>${t.col_status || 'Estado'}</th>
                    </tr>`;
                }

                let filteredProviders = data.providers_matrix;

                // Apply filter
                if (isMstr) {
                    if (filterOp === '_active') {
                        filteredProviders = data.providers_matrix.filter(p => p.is_active);
                    } else if (filterOp === '_inactive') {
                        filteredProviders = data.providers_matrix.filter(p => !p.is_active);
                    } else if (filterOp !== 'all') {
                        // Filter by category
                        filteredProviders = data.providers_matrix.filter(p =>
                            (p.Categorias || '').includes(filterOp)
                        );
                    }
                }

                filteredProviders.forEach(p => {
                    let isActive = false;
                    let displayStatus = t.status_inactive || 'Inactivo';
                    let statusClass = 'status-inactive';
                    let statusIcon = 'cancel';

                    if (isMstr) {
                        // MSTR source: use is_active
                        isActive = p.is_active;
                    } else {
                        // data.txt source: use SI/NO
                        if (filterOp === 'all') {
                            const opKeys = Object.keys(data.stats_per_operation);
                            isActive = opKeys.some(key => {
                                const val = (p[key] || '').toLowerCase();
                                return val === 'si' || val === 'active' || val === 'yes';
                            });
                        } else {
                            const val = (p[filterOp] || '').toLowerCase();
                            isActive = (val === 'si' || val === 'active' || val === 'yes');
                        }
                    }

                    if (isActive) {
                        displayStatus = t.status_active || 'Activo';
                        statusClass = 'status-active';
                        statusIcon = 'check_circle';
                    }

                    const tr = document.createElement('tr');

                    if (isMstr) {
                        // Enhanced MSTR table with metrics
                        const fmtNum = n => n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n.toString();
                        const fmtMoney = n => n >= 1000000 ? '$' + (n / 1000000).toFixed(2) + 'M' : n >= 1000 ? '$' + (n / 1000).toFixed(1) + 'K' : '$' + n.toFixed(0);

                        tr.innerHTML = `
                            <td style="font-weight: 600; color: #fff;">${p['Proveedor']}</td>
                            <td>${p['Sub-proveedor'] || '-'}</td>
                            <td><span style="font-size:11px; padding:2px 8px; border-radius:3px; background:rgba(255,255,255,0.06);">${p['Vertical'] || '-'}</span></td>
                            <td><span style="color:${p['Juegos Activos'] > 0 ? '#00ff88' : '#ff3b3b'}">${p['Juegos Activos']}A</span> / <span style="color:#ff3b3b">${p['Juegos Inactivos']}I</span></td>
                            <td style="color:${p['GGR'] >= 0 ? '#00ff88' : '#ff3b3b'}; font-weight:600;">${fmtMoney(p['GGR'])}</td>
                            <td style="color:#888;">${fmtNum(p['Spins'])}</td>
                            <td><span class="status-indicator ${statusClass}">
                                <span class="material-icons-round" style="font-size:14px; margin-right:4px;">${statusIcon}</span>
                                ${displayStatus}
                            </span></td>
                        `;
                    } else {
                        // Original data.txt table
                        tr.innerHTML = `
                            <td style="font-weight: 600; color: #fff;">${p['Proveedor']}</td>
                            <td>${p['Sub-proveedor'] || '-'}</td>
                            <td>${p['Vertical'] || '-'}</td>
                            <td><span class="status-indicator ${statusClass}">
                                <span class="material-icons-round" style="font-size:14px; margin-right:4px;">${statusIcon}</span>
                                ${displayStatus}
                            </span></td>
                        `;
                    }
                    tbody.appendChild(tr);
                });
            };

            // Initial Render
            if (data.stats_per_operation) renderTable(filterSelect.value);

            filterSelect.onchange = (e) => renderTable(e.target.value);


            // --- ALERTS LOGIC ---
            const alertsList = document.getElementById('compliance-list');
            if (alertsList) {
                alertsList.innerHTML = '';
                const t = translations[currentLang] || translations['es'];

                if (data.alerts && data.alerts.length > 0) {
                    data.alerts.forEach(alert => {
                        const div = document.createElement('div');
                        div.className = 'alert-card';
                        div.style.cssText = `
                        background: rgba(255, 59, 59, 0.1); 
                        border-left: 3px solid #ff3b3b;
                        padding: 12px;
                        margin-bottom: 8px;
                        border-radius: 4px;
                        font-size: 13px;
                    `;
                        div.innerHTML = `
                        <strong style="color:#ff3b3b; display:block; margin-bottom:4px;">${alert.type}</strong>
                        <span style="color:#ccc;">${alert.provider} (${alert.sub_provider}): ${alert.message}</span>
                    `;
                        alertsList.appendChild(div);
                    });
                } else {
                    const syncInfo = isMstr && data.last_sync ? `<br><small style="color:#888;">Última sync: ${data.last_sync}</small>` : '';
                    alertsList.innerHTML = `<div class="empty-state" style="color:#4caf50; padding:12px;">${t.system_healthy}${syncInfo}</div>`;
                }
            }

            // --- ACTIVITY LOG LOGIC ---
            const feed = document.getElementById('activity-feed');
            if (feed) {
                feed.innerHTML = '';
                if (data.activity_log) {
                    data.activity_log.forEach(log => {
                        const item = document.createElement('div');
                        item.style.cssText = `
                            display: flex; 
                            justify-content: space-between; 
                            padding: 8px 0; 
                            border-bottom: 1px solid rgba(255,255,255,0.05);
                            font-family: monospace;
                            font-size: 12px;
                        `;

                        let changeColor = '#a0a0a0';
                        if (log.type === 'inactive' || log.change === 'Inactive') {
                            changeColor = '#ff3b3b';
                        } else if (log.type === 'mixed') {
                            changeColor = '#ffa500';
                        } else if (log.change.includes('Active') && !log.change.includes('Inactive -> Active')) {
                            changeColor = '#ff3b3b';
                        } else if (log.change.includes('Inactive -> Active')) {
                            changeColor = '#00ff88';
                        }

                        const providerLabel = log.sub_provider ? `${log.provider} / ${log.sub_provider}` : log.provider;

                        item.innerHTML = `
                            <span style="color: #666;">${log.time}</span>
                            <span style="color: #fff; font-weight:600; flex:1; margin: 0 8px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${providerLabel}</span>
                            <span style="color: ${changeColor};">${log.change}</span>
                        `;
                        feed.appendChild(item);
                    });
                }
            }

        } catch (e) {
            console.error("Fetch Error:", e);
        }
    }

    // === Analytics Casino Logic ===
    const API_BASE = "https://provider-system.onrender.com";
    let analyticsCharts = {};
    let analyticsData = null;

    // Chart.js global defaults for dark theme
    if (typeof Chart !== 'undefined') {
        Chart.defaults.color = '#aaa';
        Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
        Chart.defaults.font.family = "'Inter', 'Segoe UI', sans-serif";
    }

    function formatNumber(n) {
        if (n === null || n === undefined || isNaN(n)) return '--';
        if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
        if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + 'K';
        return n.toLocaleString('es-CO', { maximumFractionDigits: 2 });
    }

    function formatCurrency(n) {
        if (n === null || n === undefined || isNaN(n)) return '--';
        return '$' + formatNumber(n);
    }

    function findColumn(columns, keywords) {
        // Fuzzy find a column by keywords
        const lower = columns.map(c => c.toLowerCase());
        for (const kw of keywords) {
            const kwLower = kw.toLowerCase();
            const idx = lower.findIndex(c => c.includes(kwLower));
            if (idx !== -1) return columns[idx];
        }
        return null;
    }

    async function loadAnalyticsData() {
        const syncStatus = document.getElementById('analytics-sync-status');
        if (syncStatus) syncStatus.textContent = 'Cargando datos...';

        try {
            const response = await fetch(`${API_BASE}/api/analytics-data`);
            const data = await response.json();

            if (!data.success || !data.records || data.records.length === 0) {
                if (syncStatus) syncStatus.textContent = data.error || 'Sin datos disponibles';
                return;
            }

            analyticsData = data;
            const records = data.records;
            const columns = data.columns;

            // Detect column names dynamically
            const colSpins = findColumn(columns, ['spin', 'spins', 'cantidad de jugadas', 'jugadas']);
            const colBets = findColumn(columns, ['apuesta', 'bet', 'valor apostado', 'stake', 'apuestas']);
            const colPrizes = findColumn(columns, ['premio', 'prize', 'ganancia', 'payout', 'premios']);
            const colGGR = findColumn(columns, ['ggr', 'gross gaming', 'ingreso bruto']);
            const colRTP = findColumn(columns, ['rtp', 'retorno', 'return to player']);
            const colName = findColumn(columns, ['nombre', 'name', 'producto', 'product', 'juego', 'game']);
            const colProvider = findColumn(columns, ['proveedor', 'provider', 'sub-proveedor']);

            // Compute KPIs
            let totalSpins = 0, totalBets = 0, totalPrizes = 0, totalGGR = 0;
            let rtpValues = [];

            records.forEach(r => {
                if (colSpins && typeof r[colSpins] === 'number') totalSpins += r[colSpins];
                if (colBets && typeof r[colBets] === 'number') totalBets += r[colBets];
                if (colPrizes && typeof r[colPrizes] === 'number') totalPrizes += r[colPrizes];
                if (colGGR && typeof r[colGGR] === 'number') totalGGR += r[colGGR];
                if (colRTP && typeof r[colRTP] === 'number' && r[colRTP] > 0) rtpValues.push(r[colRTP]);
            });

            // If no GGR column, compute from bets - prizes
            if (!colGGR && colBets && colPrizes) totalGGR = totalBets - totalPrizes;

            const avgRTP = rtpValues.length > 0
                ? rtpValues.reduce((a, b) => a + b, 0) / rtpValues.length
                : (totalBets > 0 ? (totalPrizes / totalBets) * 100 : 0);

            // Update KPI cards
            const s = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
            s('kpi-spins', formatNumber(totalSpins));
            s('kpi-bets', formatCurrency(totalBets));
            s('kpi-ggr', formatCurrency(totalGGR));
            s('kpi-rtp', avgRTP.toFixed(1) + '%');

            // ---- CHART 1: Bets vs Prizes (Top 15) ----
            const labelCol = colName || colProvider || columns[0];
            const sortedByBets = [...records]
                .filter(r => colBets && typeof r[colBets] === 'number' && r[colBets] > 0)
                .sort((a, b) => (b[colBets] || 0) - (a[colBets] || 0))
                .slice(0, 15);

            const labels1 = sortedByBets.map(r => {
                const name = String(r[labelCol] || '');
                return name.length > 20 ? name.substring(0, 18) + '..' : name;
            });
            const dataBets1 = sortedByBets.map(r => r[colBets] || 0);
            const dataPrizes1 = sortedByBets.map(r => (colPrizes ? r[colPrizes] : 0) || 0);

            renderChart('chart-bets-vs-prizes', 'bar', {
                labels: labels1,
                datasets: [
                    {
                        label: 'Apuestas',
                        data: dataBets1,
                        backgroundColor: 'rgba(0, 184, 148, 0.7)',
                        borderColor: '#00b894',
                        borderWidth: 1,
                        borderRadius: 4,
                    },
                    {
                        label: 'Premios',
                        data: dataPrizes1,
                        backgroundColor: 'rgba(108, 92, 231, 0.7)',
                        borderColor: '#6c5ce7',
                        borderWidth: 1,
                        borderRadius: 4,
                    }
                ]
            }, {
                indexAxis: 'x',
                plugins: { legend: { position: 'top' } },
                scales: {
                    y: {
                        ticks: { callback: v => formatCurrency(v) },
                        grid: { color: 'rgba(255,255,255,0.04)' }
                    },
                    x: { grid: { display: false } }
                }
            });

            // ---- CHART 2: GGR by Provider (horizontal bar) ----
            const ggrByProvider = {};
            records.forEach(r => {
                const prov = r[colProvider || labelCol] || 'Sin nombre';
                const ggr = colGGR ? (r[colGGR] || 0) : ((r[colBets] || 0) - (r[colPrizes] || 0));
                ggrByProvider[prov] = (ggrByProvider[prov] || 0) + ggr;
            });
            const sortedGGR = Object.entries(ggrByProvider)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10);

            const labelsGGR = sortedGGR.map(e => {
                const name = e[0];
                return name.length > 25 ? name.substring(0, 22) + '..' : name;
            });
            const dataGGR = sortedGGR.map(e => e[1]);
            const ggrColors = dataGGR.map(v => v >= 0 ? 'rgba(255, 107, 53, 0.75)' : 'rgba(255, 59, 59, 0.75)');

            renderChart('chart-ggr-provider', 'bar', {
                labels: labelsGGR,
                datasets: [{
                    label: 'GGR',
                    data: dataGGR,
                    backgroundColor: ggrColors,
                    borderRadius: 4,
                    borderSkipped: false,
                }]
            }, {
                indexAxis: 'y',
                plugins: { legend: { display: false } },
                scales: {
                    x: {
                        ticks: { callback: v => formatCurrency(v) },
                        grid: { color: 'rgba(255,255,255,0.04)' }
                    },
                    y: { grid: { display: false } }
                }
            });

            // ---- CHART 3: RTP Distribution (doughnut) ----
            const rtpBuckets = { 'RTP < 90%': 0, '90-95%': 0, '95-97%': 0, '97-100%': 0, 'RTP > 100%': 0 };
            records.forEach(r => {
                let rtp;
                if (colRTP && typeof r[colRTP] === 'number' && r[colRTP] > 0) {
                    rtp = r[colRTP];
                } else if (colBets && colPrizes && r[colBets] > 0) {
                    rtp = (r[colPrizes] / r[colBets]) * 100;
                } else {
                    return;
                }
                if (rtp < 90) rtpBuckets['RTP < 90%']++;
                else if (rtp < 95) rtpBuckets['90-95%']++;
                else if (rtp < 97) rtpBuckets['95-97%']++;
                else if (rtp <= 100) rtpBuckets['97-100%']++;
                else rtpBuckets['RTP > 100%']++;
            });

            renderChart('chart-rtp-dist', 'doughnut', {
                labels: Object.keys(rtpBuckets),
                datasets: [{
                    data: Object.values(rtpBuckets),
                    backgroundColor: [
                        '#ff3b3b', '#ff6b35', '#f7c948', '#00b894', '#6c5ce7',
                    ],
                    borderWidth: 0,
                    hoverOffset: 8,
                }]
            }, {
                plugins: {
                    legend: { position: 'bottom', labels: { padding: 12, usePointStyle: true } }
                },
                cutout: '60%',
            });

            // ---- DATA TABLE ----
            renderAnalyticsTable(records, columns);

            // ---- SYNC STATUS ----
            if (syncStatus) {
                const ts = data.timestamp ? new Date(data.timestamp).toLocaleString('es-CO') : 'N/A';
                syncStatus.innerHTML = `<span class="material-icons-round" style="font-size:14px; color:#00b894; vertical-align:middle;">check_circle</span> ${data.row_count} registros | Ultima sync: ${ts}`;
            }

        } catch (e) {
            console.error("Analytics fetch error:", e);
            if (syncStatus) syncStatus.textContent = 'Error al cargar datos';
        }
    }

    function renderChart(canvasId, type, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || typeof Chart === 'undefined') return;

        // Destroy existing chart if present
        if (analyticsCharts[canvasId]) {
            analyticsCharts[canvasId].destroy();
        }

        analyticsCharts[canvasId] = new Chart(canvas, {
            type,
            data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 800 },
                ...options,
            }
        });
    }

    function renderAnalyticsTable(records, columns) {
        const thead = document.getElementById('analytics-thead');
        const tbody = document.getElementById('analytics-tbody');
        if (!thead || !tbody) return;

        // Show max 8 columns
        const visibleCols = columns.slice(0, 8);

        thead.innerHTML = '<tr>' + visibleCols.map(c =>
            `<th style="font-size:12px; white-space:nowrap;">${c}</th>`
        ).join('') + '</tr>';

        const renderRows = (filter = '') => {
            tbody.innerHTML = '';
            const filtered = filter
                ? records.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(filter.toLowerCase())))
                : records;

            filtered.slice(0, 100).forEach(r => {
                const tr = document.createElement('tr');
                tr.innerHTML = visibleCols.map((col, i) => {
                    let val = r[col];
                    if (typeof val === 'number') {
                        val = val.toLocaleString('es-CO', { maximumFractionDigits: 2 });
                    }
                    const style = i === 0 ? 'font-weight:600; color:#fff;' : '';
                    return `<td style="${style} font-size:12px; white-space:nowrap;">${val ?? '-'}</td>`;
                }).join('');
                tbody.appendChild(tr);
            });

            if (filtered.length === 0) {
                tbody.innerHTML = '<tr><td colspan="' + visibleCols.length + '" style="text-align:center; color:#666; padding:20px;">Sin resultados</td></tr>';
            }
        };

        renderRows();

        // Search filter
        const searchInput = document.getElementById('analytics-search');
        if (searchInput) {
            searchInput.oninput = (e) => renderRows(e.target.value);
        }
    }

    // Sync Button Handler
    const syncBtn = document.getElementById('btn-analytics-sync');
    if (syncBtn) {
        syncBtn.addEventListener('click', async () => {
            syncBtn.disabled = true;
            syncBtn.innerHTML = '<span class="material-icons-round spinning">sync</span> Sincronizando...';
            const syncStatus = document.getElementById('analytics-sync-status');
            if (syncStatus) syncStatus.textContent = 'Extrayendo datos de MicroStrategy...';

            try {
                await fetch(`${API_BASE}/api/analytics-sync`, { method: 'POST' });
                // Wait a bit for extraction to start, then poll
                setTimeout(async () => {
                    await loadAnalyticsData();
                    syncBtn.disabled = false;
                    syncBtn.innerHTML = '<span class="material-icons-round">sync</span> Sincronizar';
                    if (typeof showNotification === 'function') {
                        showNotification('Datos actualizados correctamente', 'success');
                    }
                }, 15000);
            } catch (e) {
                syncBtn.disabled = false;
                syncBtn.innerHTML = '<span class="material-icons-round">sync</span> Sincronizar';
                if (typeof showNotification === 'function') {
                    showNotification('Error al sincronizar: ' + e.message, 'error');
                }
            }
        });
    }

    // Auto-refresh analytics every 60 minutes
    setInterval(() => {
        const analyticsView = document.getElementById('view-analytics');
        if (analyticsView && analyticsView.classList.contains('active')) {
            loadAnalyticsData();
        }
    }, 60 * 60 * 1000);


    // === VisionProcessor Logic (Client-Side Optimized) ===
    // === VisionProcessor Logic (Client-Side Optimized) ===
    (function () {
        try {
            // Check required elements first - if missing, exit early
            const dropZone = document.getElementById('drop-zone');
            const fileInput = document.getElementById('file-input');
            const processBtn = document.getElementById('process-btn');
            const logDiv = document.getElementById('processing-log');

            if (!dropZone || !fileInput || !processBtn) {
                console.warn("VisionProcessor: Required DOM elements missing. Module skipped.");
                return;
            }

            let selectedFiles = [];

            // Drag & Drop Handlers
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('dragover');
            });
            dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('dragover');
                handleFiles(e.dataTransfer.files);
            });
            fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

            function handleFiles(files) {
                selectedFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
                const countDisplay = document.getElementById('file-count');
                if (countDisplay) countDisplay.textContent = selectedFiles.length;

                if (selectedFiles.length > 0) {
                    processBtn.disabled = false;
                    processBtn.style.opacity = '1';
                    log(`Loaded ${selectedFiles.length} images. Ready to optimize.`);
                }
            }

            function log(msg) {
                if (!logDiv) return;
                const p = document.createElement('p');
                p.textContent = `> ${msg}`;
                p.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
                p.style.padding = '4px 0';
                logDiv.appendChild(p);
                logDiv.scrollTop = logDiv.scrollHeight;
            }

            // --- CORE PROCESSING LOGIC ---
            processBtn.addEventListener('click', async () => {
                if (selectedFiles.length === 0) return;

                // UI State: Processing
                processBtn.disabled = true;
                processBtn.innerHTML = '<span class="material-icons-round spinning">refresh</span> Processing...';
                logDiv.innerHTML = ''; // Clear previous logs
                log("Starting Client-Side Batch Processing (Content-Aware Smart Crop)...");

                try {
                    // Initialize JSZip
                    if (typeof JSZip === 'undefined') throw new Error("JSZip library not loaded. Check connection.");
                    const zip = new JSZip();
                    const folderSquare = zip.folder("CUADRADAS");
                    const folderRect = zip.folder("RECTANGULARES");

                    let processedCount = 0;
                    const total = selectedFiles.length;
                    const startTime = Date.now();

                    // Process each file
                    for (const file of selectedFiles) {
                        log(`Processing: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);

                        // Create Bitmap (Efficient decoding)
                        const bitmap = await createImageBitmap(file);

                        // Standardize output name to .jpg
                        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                        const fileNameOut = `${baseName}.jpg`;

                        // 1. Generate SQUARE (460x460) - Aspect Fill Center
                        const blobSquare = await processImageVariant(bitmap, 460, 460);
                        folderSquare.file(fileNameOut, blobSquare);

                        // 2. Generate RECTANGULAR (725x460) - Aspect Fill Center
                        const blobRect = await processImageVariant(bitmap, 725, 460);
                        folderRect.file(fileNameOut, blobRect);

                        processedCount++;
                        log(`  Processed OK: [${processedCount}/${total}]`);

                        // Allow UI updates
                        await new Promise(r => setTimeout(r, 0));
                    }

                    log("Generating ZIP archive...");

                    // Explicit MIME type helps browser security heuristics
                    const zipContent = await zip.generateAsync({
                        type: "blob",
                        compression: "DEFLATE",
                        mimeType: "application/zip"
                    });

                    const fileName = `virtualsoft_batch_${Date.now()}.zip`;
                    let saved = false;

                    // STRATEGY A: File System Access API (Modern Browsers)
                    if ('showSaveFilePicker' in window) {
                        try {
                            const handle = await window.showSaveFilePicker({
                                suggestedName: fileName,
                                types: [{
                                    description: 'ZIP Archive',
                                    accept: { 'application/zip': ['.zip'] },
                                }],
                            });
                            const writable = await handle.createWritable();
                            await writable.write(zipContent);
                            await writable.close();
                            log("SUCCESS: File saved securely via FileSystem API.");
                            saved = true;
                        } catch (err) {
                            if (err.name !== 'AbortError') {
                                console.warn("Native save skipped, using fallback...", err);
                            } else {
                                log("User cancelled save operation.");
                                processBtn.disabled = false;
                                const t = (window.translations && window.currentLang) ?
                                    (window.translations[window.currentLang] || window.translations['es']) : {};
                                processBtn.innerHTML = `<span class="material-icons-round">auto_fix_high</span> ${t.start_processing || 'Start Batch Processing'}`;
                                return; // Stop flow
                            }
                        }
                    }

                    // STRATEGY B: Traditional Download Fallback
                    if (!saved) {
                        const url = window.URL.createObjectURL(zipContent);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        window.URL.revokeObjectURL(url);
                        log("SUCCESS: File downloaded via browser manager.");
                    }

                    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
                    log(`BATCH COMPLETE: Processed ${total} images in ${duration}s.`);

                    processBtn.innerHTML = '<span class="material-icons-round">check</span> Completed';
                    if (typeof showNotification === 'function') {
                        showNotification(`Batch complete!`, 'success');
                    }

                    // Reset after delay
                    setTimeout(() => {
                        const t = (window.translations && window.currentLang) ?
                            (window.translations[window.currentLang] || window.translations['es']) : {};
                        processBtn.innerHTML = `<span class="material-icons-round">auto_fix_high</span> ${t.start_processing || 'Start Batch Processing'}`;
                        processBtn.disabled = false;
                        selectedFiles = [];
                        const count = document.getElementById('file-count');
                        if (count) count.textContent = '0';
                        logDiv.innerHTML = '';
                    }, 4000);

                } catch (error) {
                    console.error("Processing Logic Error:", error);
                    log(`CRITICAL ERROR: ${error.message}`);
                    processBtn.innerHTML = '<span class="material-icons-round">error</span> Failed';
                    processBtn.disabled = false;
                }
            });

            // --- IMAGE MANIPULATION HELPER ---
            // --- CONTENT-AWARE SMART CROP (iLoveIMG Style) ---
            const RATIO_TOLERANCE = 0.02; // ±2%

            /**
             * Detect center of visual interest using:
             * 1. Skin-tone detection (face proxy)
             * 2. Sobel edge density (content saliency)
             * 3. Weighted centroid on 5x5 grid
             * Returns { cx, cy } as normalized 0.0–1.0 coordinates.
             */
            function findInterestCenter(bitmap) {
                // Work on a small thumbnail for performance (max 200px)
                const maxDim = Math.max(bitmap.width, bitmap.height);
                const thumbScale = Math.min(1.0, 200 / maxDim);
                const tw = Math.max(1, Math.round(bitmap.width * thumbScale));
                const th = Math.max(1, Math.round(bitmap.height * thumbScale));

                const offCanvas = document.createElement('canvas');
                offCanvas.width = tw;
                offCanvas.height = th;
                const offCtx = offCanvas.getContext('2d');
                offCtx.drawImage(bitmap, 0, 0, tw, th);
                const imageData = offCtx.getImageData(0, 0, tw, th);
                const data = imageData.data;

                // --- Layer 1: Skin-tone detection (face proxy) ---
                let skinSumX = 0, skinSumY = 0, skinTotal = 0;

                for (let y = 0; y < th; y++) {
                    for (let x = 0; x < tw; x++) {
                        const i = (y * tw + x) * 4;
                        const r = data[i], g = data[i + 1], b = data[i + 2];

                        // RGB skin-tone heuristic
                        if (r > 95 && g > 40 && b > 20 &&
                            r > g && r > b &&
                            Math.abs(r - g) > 15 &&
                            r - Math.min(g, b) > 15) {
                            // Upper-third bias for faces
                            const verticalBoost = 1.0 + Math.max(0, (0.4 - y / th)) * 2.0;
                            skinSumX += x * verticalBoost;
                            skinSumY += y * verticalBoost;
                            skinTotal += verticalBoost;
                        }
                    }
                }

                // --- Layer 2: Sobel edge detection ---
                // Convert to grayscale array
                const gray = new Float32Array(tw * th);
                for (let i = 0; i < tw * th; i++) {
                    const idx = i * 4;
                    gray[i] = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
                }

                // Sobel magnitude on 5x5 grid
                const gridCols = 5, gridRows = 5;
                const cellW = Math.max(1, Math.floor(tw / gridCols));
                const cellH = Math.max(1, Math.floor(th / gridRows));
                const gridScores = [];

                for (let gy = 0; gy < gridRows; gy++) {
                    const row = [];
                    for (let gx = 0; gx < gridCols; gx++) {
                        let score = 0, pixelCount = 0;
                        const xStart = gx * cellW;
                        const yStart = gy * cellH;
                        const xEnd = Math.min(xStart + cellW, tw - 1);
                        const yEnd = Math.min(yStart + cellH, th - 1);

                        for (let py = yStart + 1; py < yEnd; py++) {
                            for (let px = xStart + 1; px < xEnd; px++) {
                                // Sobel 3x3 kernel
                                const tl = gray[(py - 1) * tw + (px - 1)];
                                const tc = gray[(py - 1) * tw + px];
                                const tr = gray[(py - 1) * tw + (px + 1)];
                                const ml = gray[py * tw + (px - 1)];
                                const mr = gray[py * tw + (px + 1)];
                                const bl = gray[(py + 1) * tw + (px - 1)];
                                const bc = gray[(py + 1) * tw + px];
                                const br = gray[(py + 1) * tw + (px + 1)];

                                const gx_val = -tl + tr - 2 * ml + 2 * mr - bl + br;
                                const gy_val = -tl - 2 * tc - tr + bl + 2 * bc + br;
                                score += Math.sqrt(gx_val * gx_val + gy_val * gy_val);
                                pixelCount++;
                            }
                        }
                        row.push(score / Math.max(1, pixelCount));
                    }
                    gridScores.push(row);
                }

                // --- Layer 3: Weighted centroid ---
                let edgeSumX = 0, edgeSumY = 0, edgeTotal = 0;
                for (let gy = 0; gy < gridRows; gy++) {
                    for (let gx = 0; gx < gridCols; gx++) {
                        const s = gridScores[gy][gx];
                        const cx = (gx + 0.5) / gridCols;
                        const cy = (gy + 0.5) / gridRows;
                        edgeSumX += cx * s;
                        edgeSumY += cy * s;
                        edgeTotal += s;
                    }
                }

                // --- Combine: skin (70%) + edge (30%) if skin detected ---
                const skinRatio = skinTotal / Math.max(1, tw * th);
                let skinCx, skinCy, skinW;

                if (skinTotal > 0 && skinRatio > 0.03) {
                    skinCx = skinSumX / skinTotal / tw;
                    skinCy = skinSumY / skinTotal / th;
                    skinW = 0.70;
                } else {
                    skinCx = 0.5; skinCy = 0.5;
                    skinW = 0.0;
                }

                let edgeCx, edgeCy;
                const edgeW = 1.0 - skinW;

                if (edgeTotal > 0) {
                    edgeCx = edgeSumX / edgeTotal;
                    edgeCy = edgeSumY / edgeTotal;
                } else {
                    edgeCx = 0.5; edgeCy = 0.5;
                }

                const totalW = skinW + edgeW;
                let finalCx = (skinCx * skinW + edgeCx * edgeW) / totalW;
                let finalCy = (skinCy * skinW + edgeCy * edgeW) / totalW;

                // Anti-overcrop smoothing: pull toward center
                const smoothing = 0.3;
                finalCx = finalCx * (1 - smoothing) + 0.5 * smoothing;
                finalCy = finalCy * (1 - smoothing) + 0.5 * smoothing;

                // Clamp
                finalCx = Math.max(0, Math.min(1, finalCx));
                finalCy = Math.max(0, Math.min(1, finalCy));

                return { cx: finalCx, cy: finalCy };
            }

            async function processImageVariant(bitmap, targetW, targetH) {
                const canvas = document.createElement('canvas');
                canvas.width = targetW;
                canvas.height = targetH;
                const ctx = canvas.getContext('2d');

                const srcW = bitmap.width;
                const srcH = bitmap.height;
                const srcRatio = srcW / srcH;
                const tgtRatio = targetW / targetH;

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                if (Math.abs(srcRatio - tgtRatio) / tgtRatio <= RATIO_TOLERANCE) {
                    // Branch 1: Ratio matches → direct resize, no crop
                    ctx.drawImage(bitmap, 0, 0, srcW, srcH, 0, 0, targetW, targetH);
                } else {
                    // Branch 2: Ratio mismatch → content-aware smart crop
                    // Step 1: Scale to COVER
                    const scale = Math.max(targetW / srcW, targetH / srcH);
                    const scaledW = Math.round(srcW * scale);
                    const scaledH = Math.round(srcH * scale);

                    // Step 2: Find interest center
                    const interest = findInterestCenter(bitmap);

                    // Step 3: Calculate crop window in scaled coordinates
                    let cropX = Math.round(interest.cx * scaledW - targetW / 2);
                    let cropY = Math.round(interest.cy * scaledH - targetH / 2);

                    // Step 4: Clamp to bounds
                    cropX = Math.max(0, Math.min(cropX, scaledW - targetW));
                    cropY = Math.max(0, Math.min(cropY, scaledH - targetH));

                    // Step 5: Map back to source coordinates for drawImage
                    const sx = cropX / scale;
                    const sy = cropY / scale;
                    const sw = targetW / scale;
                    const sh = targetH / scale;

                    ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, targetW, targetH);
                }

                // Adaptive Compression (< 200KB)
                let quality = 0.95;
                let blob = await canvasToBlob(canvas, 'image/jpeg', quality);

                let attempts = 0;
                while (blob.size > 200 * 1024 && quality > 0.5 && attempts < 10) {
                    quality -= 0.1;
                    blob = await canvasToBlob(canvas, 'image/jpeg', quality);
                    attempts++;
                }

                return blob;
            }

            // Promisify canvas.toBlob
            function canvasToBlob(canvas, type, quality) {
                return new Promise(resolve => {
                    canvas.toBlob(blob => resolve(blob), type, quality);
                });
            }

        } catch (e) {
            console.error("VisionProcessor Module Error:", e);
        }
    })();

    // === FUNCTIONAL IMPLEMENTATION ===

    // -- Helper: Toast Notification --
    function showNotification(message, type = 'info') {
        const notif = document.createElement('div');
        notif.className = `notification-toast ${type}`;
        notif.textContent = message;
        notif.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1e1e24;
            color: #fff;
            padding: 12px 24px;
            border-radius: 8px;
            border-left: 4px solid ${type === 'success' ? '#00ff88' : '#3b82f6'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            z-index: 10000;
            transition: opacity 0.3s ease;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
        `;
        document.body.appendChild(notif);
        setTimeout(() => {
            notif.style.opacity = '0';
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }

    // -- Header Dropdowns (Notifications & Help) --
    const notifBtn = document.getElementById('btn-notifications');
    const helpBtn = document.getElementById('btn-help');
    const notifDropdown = document.getElementById('notifications-dropdown');
    const helpDropdown = document.getElementById('help-dropdown');

    function toggleDropdown(btn, dropdown) {
        if (!btn || !dropdown) return;
        dropdown.classList.toggle('active');
    }

    if (notifBtn) notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown(notifBtn, notifDropdown);
        if (helpDropdown) helpDropdown.classList.remove('active');
    });

    if (helpBtn) helpBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown(helpBtn, helpDropdown);
        if (notifDropdown) notifDropdown.classList.remove('active');
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (notifDropdown && notifDropdown.classList.contains('active') && !notifDropdown.contains(e.target)) {
            notifDropdown.classList.remove('active');
        }
        if (helpDropdown && helpDropdown.classList.contains('active') && !helpDropdown.contains(e.target)) {
            helpDropdown.classList.remove('active');
        }
    });


    // -- 1. ADMIN PANEL: SYSTEM OPERATIONS --
    const adminActions = {
        'btn_sync': async (btn) => {
            const originalText = btn.textContent;
            btn.disabled = true;
            btn.innerHTML = '<span class="material-icons-round spinning">sync</span> Syncing...';

            try {
                await loadDashboardData();
                showNotification('Global Data synchronized successfully', 'success');
            } catch (e) {
                showNotification('Sync failed: ' + e.message, 'error');
            } finally {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        },
        'btn_restart': async (btn) => {
            btn.disabled = true;
            btn.textContent = 'Restarting...';
            // Mock restart
            setTimeout(() => {
                showNotification('AI Services Restarted Successfully', 'success');
                window.location.reload();
            }, 1500);
        },
        'btn_download': () => {
            const rows = [['Time', 'Provider', 'Change']];
            document.querySelectorAll('#activity-feed div').forEach(row => {
                const spans = row.querySelectorAll('span');
                if (spans.length >= 3) {
                    rows.push([spans[0].innerText, spans[1].innerText, spans[2].innerText]);
                }
            });
            const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "audit.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
            showNotification('Log downloaded', 'success');
        },
        'add_user': () => openUserModal() // Function ref below
    };

    // Attach Admin Actions
    const attachAdminListeners = () => {
        document.querySelectorAll('#view-admin button').forEach(btn => {
            const i18nKey = btn.getAttribute('data-i18n');
            const newBtn = btn.cloneNode(true); // Remove old listeners
            btn.parentNode.replaceChild(newBtn, btn);

            if (i18nKey && adminActions[i18nKey]) {
                newBtn.addEventListener('click', () => adminActions[i18nKey](newBtn));
            } else if (newBtn.querySelector('.material-icons-round') && newBtn.querySelector('.material-icons-round').textContent === 'edit') {
                // Edit Action - Unlock for Super Admin
                newBtn.addEventListener('click', () => {
                    const row = newBtn.closest('tr');
                    const email = row.cells[0].textContent;
                    const role = row.cells[1].textContent;
                    openUserModal(email, role);
                });
            }
        });
    };
    // Initial attach
    attachAdminListeners();


    // -- 2. USER MANAGEMENT (MODAL) --
    const userModal = document.getElementById('user-modal');
    const saveUserBtn = document.getElementById('save-user-btn');
    const modalTitle = document.getElementById('modal-title');
    const emailInput = document.getElementById('user-email');
    const roleInput = document.getElementById('user-role');
    let isEditing = false;
    let editingRow = null;

    function openUserModal(email = '', role = 'Viewer') {
        if (!userModal) return;

        if (email) {
            isEditing = true;
            modalTitle.textContent = 'Editar Usuario';
            emailInput.value = email;
            roleInput.value = role;
            emailInput.disabled = true; // Cannot change email in edit mode (mock)
        } else {
            isEditing = false;
            modalTitle.textContent = 'Agregar Usuario';
            emailInput.value = '';
            roleInput.value = 'Viewer';
            emailInput.disabled = false;
        }

        userModal.classList.add('active');
    }

    if (saveUserBtn) {
        saveUserBtn.addEventListener('click', () => {
            const email = emailInput.value;
            const role = roleInput.value;
            const status = document.getElementById('user-status').value;

            if (!email || !email.includes('@')) {
                showNotification('Email inválido', 'error');
                return;
            }

            const tbody = document.querySelector('#view-admin table tbody');

            if (isEditing) {
                // Find the row (simplistic approach: scan by email)
                Array.from(tbody.rows).forEach(row => {
                    if (row.cells[0].textContent === email) {
                        row.cells[1].textContent = role;
                        const statusSpan = row.cells[3].querySelector('span');
                        statusSpan.textContent = status;
                        statusSpan.className = `status-indicator status-${status.toLowerCase()}`;
                    }
                });
                showNotification(`Usuario ${email} actualizado`, 'success');
            } else {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${email}</td>
                    <td>${role}</td>
                    <td>Custom Access</td>
                    <td><span class="status-indicator status-${status.toLowerCase()}">${status}</span></td>
                    <td><button class="icon-btn"><span class="material-icons-round">edit</span></button></td>
                 `;
                tbody.appendChild(tr);
                showNotification(`Usuario ${email} creado`, 'success');

                // Re-attach listeners to new buttons
                attachAdminListeners();
            }

            userModal.classList.remove('active');
        });
    }


    // -- 3. CONFIG & DARK MODE --
    // Apply Settings Function
    function applySettings(config) {
        // Dark/Light Mode
        if (config.darkMode) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
        }

        // Update Toggle UI
        const dmToggle = document.querySelector('[data-i18n="cfg_darkmode"]')?.closest('.config-item')?.querySelector('.toggle-switch');
        if (dmToggle) {
            config.darkMode ? dmToggle.classList.add('active') : dmToggle.classList.remove('active');
        }

        const notifToggle = document.querySelector('[data-i18n="cfg_notifications"]')?.closest('.config-item')?.querySelector('.toggle-switch');
        if (notifToggle) {
            config.notifications ? notifToggle.classList.add('active') : notifToggle.classList.remove('active');
        }
    }

    // Load on start
    try {
        const saved = JSON.parse(localStorage.getItem('appConfig'));
        if (saved) applySettings(saved);
        else document.body.classList.add('dark-mode'); // Default
    } catch (e) { }

    // Toggle Listeners
    document.querySelectorAll('.toggle-switch').forEach(toggle => {
        // Remove old listeners
        const newToggle = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(newToggle, toggle);

        newToggle.addEventListener('click', () => {
            newToggle.classList.toggle('active');

            // Check if it's Notification Toggle
            const container = newToggle.closest('.config-item');
            if (container && container.querySelector('[data-i18n="cfg_notifications"]')) {
                if (newToggle.classList.contains('active')) {
                    // Request Permission
                    if ("Notification" in window) {
                        Notification.requestPermission().then(permission => {
                            if (permission === "granted") {
                                new Notification("Notificaciones Activadas", { body: "Ahora recibirás alertas del sistema." });
                            } else {
                                showNotification('Permiso denegado por el navegador', 'error');
                                newToggle.classList.remove('active');
                            }
                        });
                    }
                }
            }
        });
    });

    // Save Button
    const saveCfgBtn = document.querySelector('[data-i18n="save_changes"]');
    if (saveCfgBtn) {
        const newBtn = saveCfgBtn.cloneNode(true);
        saveCfgBtn.parentNode.replaceChild(newBtn, saveCfgBtn);

        newBtn.addEventListener('click', () => {
            const dmToggle = document.querySelector('[data-i18n="cfg_darkmode"]')?.closest('.config-item')?.querySelector('.toggle-switch');
            const notifToggle = document.querySelector('[data-i18n="cfg_notifications"]')?.closest('.config-item')?.querySelector('.toggle-switch');

            const config = {
                darkMode: dmToggle ? dmToggle.classList.contains('active') : true,
                notifications: notifToggle ? notifToggle.classList.contains('active') : false,
                timestamp: Date.now()
            };

            localStorage.setItem('appConfig', JSON.stringify(config));
            applySettings(config);
            showNotification('Preferencias guardadas correctamente', 'success');
        });
    }

    // -- 4. REPORTS --
    const exportBtn = document.querySelector('[data-i18n="export_pdf"]');
    if (exportBtn) {
        const n = exportBtn.cloneNode(true);
        exportBtn.parentNode.replaceChild(n, exportBtn);
        n.addEventListener('click', () => window.print());
    }

    // Simple report gen mock
    const reportBtn = document.querySelector('[data-i18n="gen_report"]');
    if (reportBtn) {
        const n = reportBtn.cloneNode(true);
        reportBtn.parentNode.replaceChild(n, reportBtn);
        n.addEventListener('click', () => {
            showNotification('Generando gráfico...', 'info');
            const container = document.querySelector('.chart-container-large');
            container.innerHTML = '<h3 style="color:#4caf50;">Reporte Generado: ' + new Date().toLocaleDateString() + '</h3>';
        });
    }
});
