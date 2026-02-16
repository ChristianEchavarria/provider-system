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

    // Auth State Listener
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            console.log("User logged in:", user.email);
            loginScreen.style.display = 'none';
            appContainer.style.display = 'flex'; // Restore inline-flex or flex
            appContainer.classList.add('fade-in'); // Optional animation class

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

    // Login Handler
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = document.getElementById('login-btn');

        btn.disabled = true;
        btn.innerHTML = '<span class="material-icons-round spinning">refresh</span> Processing...';
        loginError.textContent = '';

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Signed in
                // UI update happens in onAuthStateChanged
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Login Error:", error);
                loginError.textContent = "Error: " + errorMessage;
                btn.disabled = false;
                btn.innerHTML = `<span>AUTHENTICATE</span><span class="material-icons-round">arrow_forward</span>`;
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

                data.providers_matrix.forEach(p => {
                    let isActive = false;
                    let displayStatus = t.status_inactive;
                    let statusClass = 'status-inactive';
                    let statusIcon = 'cancel';

                    if (filterOp === 'all') {
                        const opKeys = Object.keys(data.stats_per_operation);
                        isActive = opKeys.some(key => {
                            const val = (p[key] || '').toLowerCase();
                            return val === 'si' || val === 'active' || val === 'yes';
                        });

                        if (isActive) {
                            displayStatus = t.status_active;
                            statusClass = 'status-active';
                            statusIcon = 'check_circle';
                        }
                    } else {
                        const val = (p[filterOp] || '').toLowerCase();
                        isActive = (val === 'si' || val === 'active' || val === 'yes');

                        if (isActive) {
                            displayStatus = t.status_active;
                            statusClass = 'status-active';
                            statusIcon = 'check_circle';
                        }
                    }

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td style="font-weight: 600; color: #fff;">${p['Proveedor']}</td>
                        <td>${p['Sub-proveedor'] || '-'}</td>
                        <td>${p['Vertical'] || '-'}</td>
                        <td><span class="status-indicator ${statusClass}">
                            <span class="material-icons-round" style="font-size:14px; margin-right:4px;">${statusIcon}</span>
                            ${displayStatus}
                        </span></td>
                    `;
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
                    alertsList.innerHTML = `<div class="empty-state" style="color:#4caf50; padding:12px;">${t.system_healthy}</div>`;
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
                        if (log.change.includes('Active') && !log.change.includes('Inactive -> Active')) changeColor = '#ff3b3b';
                        if (log.change.includes('Inactive -> Active')) changeColor = '#00ff88';

                        item.innerHTML = `
                            <span style="color: #666;">${log.time}</span>
                            <span style="color: #fff; font-weight:600;">${log.provider}</span>
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

    // === VisionProcessor Logic ===
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const processBtn = document.getElementById('process-btn');
    const logDiv = document.getElementById('processing-log');
    let selectedFiles = [];

    if (dropZone && fileInput && processBtn) {
        // Drag & Drop
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
            document.getElementById('file-count').textContent = selectedFiles.length;

            if (selectedFiles.length > 0) {
                processBtn.disabled = false;
                processBtn.style.opacity = '1';
                log(`Loaded ${selectedFiles.length} images. Ready to process.`);
            }
        }

        function log(msg) {
            if (!logDiv) return;
            const p = document.createElement('p');
            p.textContent = `> ${msg}`;
            logDiv.appendChild(p);
            logDiv.scrollTop = logDiv.scrollHeight;
        }

        processBtn.addEventListener('click', async () => {
            if (selectedFiles.length === 0) return;

            processBtn.disabled = true;
            processBtn.innerHTML = '<span class="material-icons-round spinning">refresh</span> Processing...';
            log("Starting batch processing...");

            const formData = new FormData();
            selectedFiles.forEach(file => {
                formData.append("files", file);
            });

            console.log("Sending files:", selectedFiles);
            console.log("Request URL:", "https://provider-system.onrender.com/api/process-images");

            try {
                const start = Date.now();

                const response = await fetch(
                    "https://provider-system.onrender.com/api/process-images",
                    {
                        method: "POST",
                        body: formData
                    }
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }

                const contentType = response.headers.get("content-type");
                if (contentType && !contentType.includes("zip") && !contentType.includes("octet-stream")) {
                    throw new Error("El servidor no devolvió un archivo ZIP válido. Tipo de contenido recibido: " + contentType);
                }

                // 🔥 LEER COMO BLOB (ZIP)
                const blob = await response.blob();

                const timeTaken = ((Date.now() - start) / 1000).toFixed(2);

                // 🔥 DESCARGA AUTOMÁTICA
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = "virtualsoft_processed.zip";
                document.body.appendChild(a);
                a.click();
                a.remove();

                window.URL.revokeObjectURL(url);

                log(`SUCCESS: Images processed and ZIP downloaded in ${timeTaken}s.`);
                log(`Output: CUADRADAS (460x460) and RECTANGULARES (725x460)`);

                processBtn.innerHTML = '<span class="material-icons-round">check</span> Completed';

                setTimeout(() => {
                    const t = translations[currentLang] || translations['es'];
                    processBtn.innerHTML = `<span class="material-icons-round">auto_fix_high</span> ${t.start_processing}`;
                    processBtn.disabled = false;
                    selectedFiles = [];
                    document.getElementById('file-count').textContent = '0';
                }, 3000);

            } catch (error) {

                console.error("Processing error:", error);

                log(`ERROR: ${error.message}`);

                processBtn.innerHTML = '<span class="material-icons-round">error</span> Failed';

                processBtn.disabled = false;
            }

        });
    }
});
