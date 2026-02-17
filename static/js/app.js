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
            const response = await fetch("http://localhost:8000/api/dashboard-data");
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
                log("Starting Client-Side Batch Processing (Clean Center Crop)...");

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
            // --- STRICT PROPORTIONAL SCALE + CENTER CROP (Source-Based) ---
            async function processImageVariant(bitmap, targetW, targetH) {
                const canvas = document.createElement('canvas');
                canvas.width = targetW;
                canvas.height = targetH;
                const ctx = canvas.getContext('2d');

                const srcW = bitmap.width;
                const srcH = bitmap.height;

                // 1. Force Scale by TARGET WIDTH (User Request: No generic cover)
                const scale = targetW / srcW;

                // 2. Calculate source area to match target ratio (Un-scaled dimensions)
                const srcCropW = targetW / scale;
                const srcCropH = targetH / scale;

                // 3. Center the crop on the source image (Horizontal)
                const srcX = (srcW - srcCropW) / 2;

                // Vertical Bias (0.42 instead of 0.5 to favor top-center/faces)
                const verticalBias = 0.42;
                const srcY = (srcH - srcCropH) * verticalBias;

                // 4. Draw (Source Crop -> Target Canvas)
                // Clear canvas first (white base)
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, targetW, targetH);

                // High quality scaling
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
                ctx.drawImage(bitmap, srcX, srcY, srcCropW, srcCropH, 0, 0, targetW, targetH);

                // 5. Adaptive Compression (< 200KB)
                let quality = 0.95;
                let blob = await canvasToBlob(canvas, 'image/jpeg', quality);

                // If > 200KB, reduce quality iteratively
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
