(function () {
    const STORAGE_KEYS = {
        USERS: "lbdc_users",
        PRODUCTS: "lbdc_products",
        ORDERS: "lbdc_orders",
    };

    let currentUser = null;

    let firebaseDb = null;

    function initFirebase() {
        if (typeof firebase === "undefined" || !firebase.firestore) {
            console.warn("Firebase SDK non disponibile; uso solo salvataggio locale.");
            return Promise.resolve();
        }

        const firebaseConfig = {
            apiKey: "AIzaSyCNKNkemUSUlz3Y9BgYprVw_mvSHTpaGNI",
            authDomain: "spesa-b3cfe.firebaseapp.com",
            projectId: "spesa-b3cfe",
            storageBucket: "spesa-b3cfe.firebasestorage.app",
            messagingSenderId: "511269465888",
            appId: "1:511269465888:web:40d8a4ab2c2dc3f3127145",
        };

        try {
            if (firebase.apps && firebase.apps.length) {
                firebase.app();
            } else if (firebase.initializeApp) {
                firebase.initializeApp(firebaseConfig);
            }
        } catch (err) {
            console.warn("Firebase già inizializzato o errore durante init:", err);
        }

        try {
            firebaseDb = firebase.firestore();
        } catch (err) {
            console.error("Impossibile inizializzare Firestore:", err);
            firebaseDb = null;
            return Promise.resolve();
        }

        const docRef = firebaseDb.collection("lbdc").doc("data");
        return docRef
            .get()
            .then((doc) => {
                if (!doc.exists) return;
                const data = doc.data() || {};
                if (Array.isArray(data.users)) {
                    saveToStorage(STORAGE_KEYS.USERS, data.users);
                }
                if (Array.isArray(data.products)) {
                    saveToStorage(STORAGE_KEYS.PRODUCTS, data.products);
                }
                if (Array.isArray(data.orders)) {
                    saveToStorage(STORAGE_KEYS.ORDERS, data.orders);
                }
            })
            .catch((err) => {
                console.error("Errore sincronizzazione iniziale da Firebase:", err);
            });
    }

    function syncToFirebase(partial) {
        if (!firebaseDb) return;
        const docRef = firebaseDb.collection("lbdc").doc("data");
        docRef.set(partial, { merge: true }).catch((err) => {
            console.error("Errore salvataggio su Firebase:", err);
        });
    }

    function clearFirebaseData() {
        if (!firebaseDb) return Promise.resolve();
        const docRef = firebaseDb.collection("lbdc").doc("data");
        return docRef
            .set({ users: [], products: [], orders: [] })
            .catch((err) => {
                console.error("Errore cancellazione dati su Firebase:", err);
            });
    }

    function loadFromStorage(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return fallback;
            return JSON.parse(raw);
        } catch (err) {
            console.error("Errore lettura storage", key, err);
            return fallback;
        }
    }

    function saveToStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            console.error("Errore salvataggio storage", key, err);
        }
    }

    function ensureSeedData() {
        let users = loadFromStorage(STORAGE_KEYS.USERS, null);
        if (!users || !Array.isArray(users) || users.length === 0) {
            users = [
                {
                    id: "u-admin",
                    name: "Admin",
                    username: "admin",
                    pin: "0000",
                    role: "admin",
                },
                {
                    id: "u-mario",
                    name: "Mario Rossi",
                    username: "mario",
                    pin: "1234",
                    role: "employee",
                },
                {
                    id: "u-anna",
                    name: "Anna Bianchi",
                    username: "anna",
                    pin: "5678",
                    role: "employee",
                },
            ];
            saveToStorage(STORAGE_KEYS.USERS, users);
        }

        let products = loadFromStorage(STORAGE_KEYS.PRODUCTS, null);
        if (!products || !Array.isArray(products) || products.length === 0) {
            products = [
                "Bicchieri caffè",
                "Bicchieri cappuccino",
                "Bustine zucchero",
                "Caffè in grani",
                "Cialde decaffeinato",
                "Cioccolata in polvere",
                "Latte fresco",
                "Panna spray",
                "Salviette umidificate",
                "Sciroppi aromatizzati",
                "Tovaglioli",
                "Zucchero di canna",
            ].map((name, index) => ({
                id: "p-" + (index + 1),
                name,
                category: "Generale",
            }));
saveToStorage(STORAGE_KEYS.PRODUCTS, products);
        }

        let orders = loadFromStorage(STORAGE_KEYS.ORDERS, null);
        if (!orders || !Array.isArray(orders)) {
            saveToStorage(STORAGE_KEYS.ORDERS, []);
        }
    }

    function loadUsers() {
        return loadFromStorage(STORAGE_KEYS.USERS, []);
    }

    function saveUsers(users) {
        saveToStorage(STORAGE_KEYS.USERS, users);
        syncToFirebase({ users });
    }

    function loadProducts() {
        return loadFromStorage(STORAGE_KEYS.PRODUCTS, []);
    }

    function saveProducts(products) {
        saveToStorage(STORAGE_KEYS.PRODUCTS, products);
        syncToFirebase({ products });
    }

    function loadOrders() {
        return loadFromStorage(STORAGE_KEYS.ORDERS, []);
    }

    function saveOrders(orders) {
        saveToStorage(STORAGE_KEYS.ORDERS, orders);
        syncToFirebase({ orders });
    }


    function formatDateTime(isoString) {
        const d = new Date(isoString);
        if (Number.isNaN(d.getTime())) return isoString;

        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, "0");
        const mins = String(d.getMinutes()).padStart(2, "0");
        return `${day}/${month}/${year} alle ${hours}:${mins}`;
    }

    function showToast(message, type = "success") {
        const toast = document.getElementById("toast");
        if (!toast) return;
        toast.textContent = message;
        toast.classList.remove("error", "show");
        if (type === "error") {
            toast.classList.add("error");
        }
        requestAnimationFrame(() => {
            toast.classList.add("show");
        });

        setTimeout(() => {
            toast.classList.remove("show");
        }, 2600);
    }

    function switchView(viewId) {
        document.querySelectorAll(".view").forEach((v) => {
            v.classList.toggle("active", v.id === viewId);
        });
    }

    function bindChecklistInteractions() {
        const container = document.getElementById("checklist-container");
        if (!container) return;

        container.addEventListener("change", (event) => {
            const checkbox = event.target.closest(".product-checkbox");
            if (!checkbox || !container.contains(checkbox)) return;

            const id = checkbox.dataset.id;
            const qtyInput = container.querySelector(
                '.quantity-input[data-id="' + id + '"]'
            );
            if (!qtyInput) return;

            const current = parseInt(qtyInput.value, 10);

            if (checkbox.checked) {
                if (Number.isNaN(current) || current < 1) {
                    qtyInput.value = "1";
                }
            } else {
                if (!Number.isNaN(current) && current <= 1) {
                    qtyInput.value = "";
                }
            }
        });
    }

    function bindClearDatabaseButton() {
        const btn = document.getElementById("clear-database");
        if (!btn) return;

        btn.addEventListener("click", () => {
            const confirmed = confirm(
                "Sei sicuro di voler cancellare tutti i dati (utenti, prodotti e liste) salvati in questo browser e su Firebase?"
            );
            if (!confirmed) return;

            const finishLocalClear = () => {
                Object.keys(STORAGE_KEYS).forEach((key) => {
                    localStorage.removeItem(STORAGE_KEYS[key]);
                });
                location.reload();
            };

            // Pulisce anche Firestore, se disponibile
            if (firebaseDb) {
                clearFirebaseData()
                    .then(() => {
                        finishLocalClear();
                    })
                    .catch((err) => {
                        console.error("Errore nella cancellazione dati Firebase:", err);
                        // Anche se Firebase fallisce, puliamo comunque il locale
                        finishLocalClear();
                    });
            } else {
                finishLocalClear();
            }
        });
    }
function bindAdminOrdersInteractions() {
        const list = document.getElementById("orders-list");
        if (!list) return;

        list.addEventListener("click", (event) => {
            const btn = event.target.closest(".admin-cart-toggle");
            if (!btn || !list.contains(btn)) return;
            const item = btn.closest(".order-item");
            if (!item) return;
            item.classList.toggle("purchased");
        });
    }

    function setTabsEvents() {
        const tabButtons = document.querySelectorAll(".tab-button");
        tabButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const tabId = btn.getAttribute("data-tab");
                tabButtons.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                document.querySelectorAll(".tab-panel").forEach((panel) => {
                    panel.classList.toggle("active", panel.id === tabId);
                });
            });
        });
    }

    function populateLoginSelect() {
        const select = document.getElementById("login-username");
        if (!select) return;
        const users = loadUsers();
        const sorted = [...users].sort((a, b) => {
            if (a.role === b.role) {
                return a.name.localeCompare(b.name, "it", { sensitivity: "base" });
            }
            return a.role === "admin" ? -1 : 1;
        });

        const prevValue = select.value;
        select.innerHTML = '<option value="">Seleziona...</option>';
        sorted.forEach((user) => {
            const opt = document.createElement("option");
            opt.value = user.username;
            opt.textContent =
                user.role === "admin" ? `${user.name} (Admin)` : user.name;
            select.appendChild(opt);
        });

        if (prevValue && sorted.some((u) => u.username === prevValue)) {
            select.value = prevValue;
        }
    }

    function handleLoginSubmit(event) {
        event.preventDefault();
        const username = document.getElementById("login-username").value.trim();
        const pin = document.getElementById("login-pin").value.trim();

        if (!username || !pin) {
            showToast("Inserisci utente e PIN.", "error");
            return;
        }

        const users = loadUsers();
        const found = users.find(
            (u) => u.username === username && u.pin === pin
        );

        if (!found) {
            showToast("Credenziali non valide.", "error");
            return;
        }

        currentUser = found;
        document.getElementById("login-pin").value = "";

        if (currentUser.role === "admin") {
            document.getElementById(
                "admin-greeting"
            ).textContent = `Accesso come ${currentUser.name}`;
            renderAdminViews();
            switchView("view-admin");
            showToast("Accesso admin effettuato.");
        } else {
            document.getElementById(
                "employee-greeting"
            ).textContent = `Ciao ${currentUser.name}, compila la tua lista.`;
            renderChecklist();
            switchView("view-employee");
            showToast("Accesso dipendente effettuato.");
        }
    }

    function handleLogout() {
        currentUser = null;
        populateLoginSelect();
        switchView("view-login");
    }

    function renderChecklist() {
        const container = document.getElementById("checklist-container");
        const status = document.getElementById("employee-status");
        if (!container || !status) return;
        container.innerHTML = "";
        status.textContent = "";

        const products = loadProducts();
        if (!products.length) {
            const empty = document.createElement("div");
            empty.className = "muted small";
            empty.style.padding = "10px 12px";
            empty.textContent =
                "Nessun prodotto configurato. Chiedi all'admin di aggiungerli dall'area di gestione.";
            container.appendChild(empty);
            return;
        }

        const sorted = [...products].sort((a, b) =>
            a.name.localeCompare(b.name, "it", { sensitivity: "base" })
        );

        sorted.forEach((product) => {
            const row = document.createElement("div");
            row.className = "checklist-row";
            row.dataset.id = product.id;

            const left = document.createElement("label");
            left.className = "checklist-left";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "product-checkbox";
            checkbox.dataset.id = product.id;

            const nameSpan = document.createElement("span");
            nameSpan.className = "product-name";
            nameSpan.textContent = product.name;

            const categorySpan = document.createElement("span");
            categorySpan.className = "item-category-tag";
            categorySpan.textContent = product.category ? `[${product.category}]` : "[Generale]";

            left.appendChild(checkbox);
            left.appendChild(nameSpan);
            left.appendChild(categorySpan);

            const qtyInput = document.createElement("input");
            qtyInput.type = "number";
            qtyInput.min = "1";
            qtyInput.step = "1";
            qtyInput.placeholder = "1";
            qtyInput.className = "quantity-input";
            qtyInput.dataset.id = product.id;
            qtyInput.inputMode = "numeric";
            qtyInput.pattern = "[0-9]*";

            row.appendChild(left);
            row.appendChild(qtyInput);
            container.appendChild(row);
        });
    }

    function handleSendChecklist() {
        if (!currentUser || currentUser.role !== "employee") return;

        const status = document.getElementById("employee-status");
        if (!status) return;

        const productsMap = new Map(
            loadProducts().map((p) => [p.id, p])
        );

        const checkboxes = Array.from(
            document.querySelectorAll(".product-checkbox")
        );
        const quantities = Array.from(
            document.querySelectorAll(".quantity-input")
        );

        const qtyById = new Map();
        quantities.forEach((input) => {
            const id = input.dataset.id;
            const qty = parseInt(input.value, 10);
            if (!Number.isNaN(qty) && qty > 0) {
                qtyById.set(id, qty);
            }
        });

        const items = [];
        checkboxes.forEach((cb) => {
            const id = cb.dataset.id;
            const selected = cb.checked;
            const qty = qtyById.get(id) || 0;

            if (!selected) {
                return;
            }

            const product = productsMap.get(id);
            if (product) {
                items.push({
                    productId: id,
                    productName: product.name,
                    category: product.category || "Generale",
                    quantity: qty > 0 ? qty : 1,
                });
            }
        });

        if (!items.length) {
            status.textContent =
                "Seleziona almeno un prodotto o indica una quantità.";
            status.classList.remove("success");
            status.classList.add("error");
            showToast("Nessun prodotto selezionato.", "error");
            return;
        }

        const orders = loadOrders();
        const now = new Date();
        orders.push({
            id: "o-" + now.getTime(),
            employeeName: currentUser.name,
            employeeUsername: currentUser.username,
            createdAt: now.toISOString(),
            items,
        });
        saveOrders(orders);

        document
            .querySelectorAll(".product-checkbox")
            .forEach((cb) => (cb.checked = false));
        document
            .querySelectorAll(".quantity-input")
            .forEach((input) => (input.value = ""));
        document
            .querySelectorAll(".checklist-row.purchased")
            .forEach((row) => row.classList.remove("purchased"));

        status.textContent = `Lista inviata alle ${formatDateTime(
            now.toISOString()
        )}.`;
        status.classList.remove("error");
        status.classList.add("success");
        showToast("Lista spesa inviata al responsabile.");
    }

    function renderAdminOrders() {
        const list = document.getElementById("orders-list");
        const empty = document.getElementById("orders-empty");
        if (!list || !empty) return;
        list.innerHTML = "";

        const orders = loadOrders().sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        if (!orders.length) {
            empty.style.display = "block";
            return;
        }
        empty.style.display = "none";

        orders.forEach((order) => {
            const card = document.createElement("article");
            card.className = "order-card";

            const header = document.createElement("div");
            header.className = "order-header";

            const main = document.createElement("div");
            const title = document.createElement("div");
            title.className = "order-employee";
            title.textContent = order.employeeName;

            const meta = document.createElement("div");
            meta.className = "order-meta";
            const dateText = formatDateTime(order.createdAt);
            const itemsCount = order.items.reduce(
                (acc, item) => acc + (item.quantity || 0),
                0
            );
            meta.textContent = `${dateText} • ${itemsCount} pezzi`;

            main.appendChild(title);
            main.appendChild(meta);

            const chip = document.createElement("div");
            chip.className = "chip";
            const dot = document.createElement("span");
            dot.className = "chip-dot";
            const label = document.createElement("span");
            label.textContent = "Lista ricevuta";
            chip.appendChild(dot);
            chip.appendChild(label);

            header.appendChild(main);
            header.appendChild(chip);

            const exportBtn = document.createElement("button");
            exportBtn.type = "button";
            exportBtn.className = "btn small ghost";
            exportBtn.textContent = "Esporta PDF";
            exportBtn.addEventListener("click", () => {
                exportOrderToPdf(order);
            });
            header.appendChild(exportBtn);

            const productsMap = new Map(
                loadProducts().map((p) => [p.id, p])
            );

            const itemsByCategory = {};

            order.items.forEach((item) => {
                let category = item.category;
                if (!category) {
                    const prod = productsMap.get(item.productId);
                    category = prod && prod.category ? prod.category : "Altro";
                }
                if (!itemsByCategory[category]) {
                    itemsByCategory[category] = [];
                }
                itemsByCategory[category].push(item);
            });

            const categories = Object.keys(itemsByCategory).sort((a, b) =>
                a.localeCompare(b, "it", { sensitivity: "base" })
            );

            const body = document.createElement("div");

            categories.forEach((category) => {
                const catTitle = document.createElement("h4");
                catTitle.className = "order-category-title";
                catTitle.textContent = category;
                body.appendChild(catTitle);

                const ul = document.createElement("ul");
                ul.className = "order-items";

                itemsByCategory[category].forEach((item) => {
                    const li = document.createElement("li");
                    li.className = "order-item";

                    const span = document.createElement("span");
                    span.textContent = `${item.productName}: ${item.quantity}`;

                    const cartBtn = document.createElement("button");
                    cartBtn.type = "button";
                    cartBtn.className = "btn small ghost admin-cart-toggle";
                    cartBtn.textContent = "In carrello";

                    li.appendChild(span);
                    li.appendChild(cartBtn);
                    ul.appendChild(li);
                });

                body.appendChild(ul);
            });

            card.appendChild(header);
            card.appendChild(body);
            list.appendChild(card);
        });

    function exportOrderToPdf(order) {
        const productsMap = new Map(
            loadProducts().map((p) => [p.id, p])
        );

        const itemsByCategory = {};

        order.items.forEach((item) => {
            let category = item.category;
            if (!category) {
                const prod = productsMap.get(item.productId);
                category = prod && prod.category ? prod.category : "Altro";
            }
            if (!itemsByCategory[category]) {
                itemsByCategory[category] = [];
            }
            itemsByCategory[category].push(item);
        });

        const categories = Object.keys(itemsByCategory).sort((a, b) =>
            a.localeCompare(b, "it", { sensitivity: "base" })
        );

        const win = window.open("", "_blank");
        if (!win) {
            alert("Impossibile aprire la finestra per l'esportazione PDF (popup bloccato?).");
            return;
        }

        const title = `Lista spesa - ${order.employeeName}`;
        const dateText = formatDateTime(order.createdAt);

        let html = `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8" />
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            padding: 24px;
            color: #333;
        }
        h1 {
            font-size: 1.4rem;
            margin-bottom: 4px;
        }
        .meta {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 16px;
        }
        .category {
            margin-top: 10px;
            margin-bottom: 4px;
            font-weight: 600;
        }
        ul {
            margin: 0 0 8px 18px;
            padding: 0;
        }
        li {
            margin-bottom: 2px;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <h1>${title}</h1>
    <div class="meta">${dateText}</div>
`;

        categories.forEach((category) => {
            html += `<div class="category">${category}</div><ul>`;
            itemsByCategory[category].forEach((item) => {
                html += `<li>${item.productName}: ${item.quantity}</li>`;
            });
            html += `</ul>`;
        });

        html += `
</body>
</html>`;

        win.document.open();
        win.document.write(html);
        win.document.close();
        win.focus();
        win.print();
    }

    }

    function renderAdminProducts() {
        const container = document.getElementById("products-list");
        if (!container) return;
        container.innerHTML = "";

        const products = loadProducts();
        if (!products.length) {
            const empty = document.createElement("div");
            empty.className = "muted small";
            empty.style.padding = "10px 12px";
            empty.textContent = "Nessun prodotto presente nella checklist.";
            container.appendChild(empty);
            return;
        }

        const sorted = [...products].sort((a, b) =>
            a.name.localeCompare(b.name, "it", { sensitivity: "base" })
        );

        const headerRow = document.createElement("div");
        headerRow.className = "list-row header";
        headerRow.innerHTML =
            '<div>Prodotto / Categoria</div><div style="text-align:right">Azioni</div>';
        container.appendChild(headerRow);

        sorted.forEach((product) => {
            const row = document.createElement("div");
            row.className = "list-row";
            row.dataset.id = product.id;

            const nameCell = document.createElement("div");
            const nameSpan = document.createElement("span");
            nameSpan.textContent = product.name;
            const catSpan = document.createElement("span");
            catSpan.className = "item-category-tag";
            catSpan.textContent = product.category ? `[${product.category}]` : "[Generale]";
            nameCell.appendChild(nameSpan);
            nameCell.appendChild(catSpan);

            const actionsCell = document.createElement("div");
            actionsCell.style.textAlign = "right";
            actionsCell.style.display = "flex";
            actionsCell.style.justifyContent = "flex-end";
            actionsCell.style.gap = "6px";

            const editBtn = document.createElement("button");
            editBtn.className = "btn small ghost";
            editBtn.textContent = "Modifica";
            editBtn.addEventListener("click", () => {
                const newName = prompt(
                    "Nuovo nome per il prodotto:",
                    product.name
                );
                if (!newName) return;
                const trimmedName = newName.trim();
                if (!trimmedName) return;

                const newCategory = prompt(
                    "Categoria per il prodotto:",
                    product.category || "Generale"
                );
                if (!newCategory) return;
                const trimmedCategory = newCategory.trim();
                if (!trimmedCategory) return;

                const all = loadProducts();
                const idx = all.findIndex((p) => p.id === product.id);
                if (idx >= 0) {
                    all[idx].name = trimmedName;
                    all[idx].category = trimmedCategory;
                    saveProducts(all);
                    renderAdminProducts();
                    if (currentUser && currentUser.role === "admin") {
                        showToast("Prodotto aggiornato.");
                    }
                }
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn small danger";
            deleteBtn.textContent = "Elimina";
            deleteBtn.addEventListener("click", () => {
                if (
                    !confirm(
                        `Confermi l'eliminazione di "${product.name}" dalla checklist?`
                    )
                ) {
                    return;
                }
                const all = loadProducts().filter((p) => p.id !== product.id);
                saveProducts(all);
                renderAdminProducts();
                if (currentUser && currentUser.role === "admin") {
                    showToast("Prodotto eliminato.");
                }
            });

            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);

            row.appendChild(nameCell);
            row.appendChild(actionsCell);
            container.appendChild(row);
        });
    }

    function renderAdminEmployees() {
        const container = document.getElementById("employees-list");
        if (!container) return;
        container.innerHTML = "";

        const users = loadUsers();
        const employees = users.filter((u) => u.role === "employee");
        if (!employees.length) {
            const empty = document.createElement("div");
            empty.className = "muted small";
            empty.style.padding = "10px 12px";
            empty.textContent =
                "Nessun dipendente configurato. Aggiungine uno con il modulo qui sopra.";
            container.appendChild(empty);
            return;
        }

        const headerRow = document.createElement("div");
        headerRow.className = "list-row header";
        headerRow.innerHTML =
            '<div>Dipendente</div><div style="text-align:right">Username / Azioni</div>';
        container.appendChild(headerRow);

        employees
            .sort((a, b) =>
                a.name.localeCompare(b.name, "it", { sensitivity: "base" })
            )
            .forEach((emp) => {
                const row = document.createElement("div");
                row.className = "list-row";
                row.dataset.id = emp.id;

                const nameCell = document.createElement("div");
                nameCell.textContent = emp.name;

                const actionsCell = document.createElement("div");
                actionsCell.style.textAlign = "right";
                actionsCell.style.display = "flex";
                actionsCell.style.justifyContent = "flex-end";
                actionsCell.style.gap = "6px";
                actionsCell.style.alignItems = "center";

                const userSpan = document.createElement("span");
                userSpan.textContent = emp.username;
                userSpan.style.fontSize = "0.82rem";
                userSpan.style.color = "#6a5a4a";

                const deleteBtn = document.createElement("button");
                deleteBtn.className = "btn small danger";
                deleteBtn.textContent = "Elimina";
                deleteBtn.addEventListener("click", () => {
                    if (
                        !confirm(
                            `Eliminare il dipendente "${emp.name}" (username: ${emp.username})?`
                        )
                    ) {
                        return;
                    }
                    const remaining = loadUsers().filter((u) => u.id !== emp.id);
                    saveUsers(remaining);
                    renderAdminEmployees();
                    populateLoginSelect();
                    showToast("Dipendente eliminato.");
                });

                actionsCell.appendChild(userSpan);
                actionsCell.appendChild(deleteBtn);

                row.appendChild(nameCell);
                row.appendChild(actionsCell);
                container.appendChild(row);
            });
    }

    function renderAdminViews() {
        renderAdminOrders();
        renderAdminProducts();
        renderAdminEmployees();
    }

    function handleAddProduct(event) {
        event.preventDefault();
        const nameInput = document.getElementById("new-product-name");
        const categoryInput = document.getElementById("new-product-category");
        if (!nameInput || !categoryInput) return;

        const name = nameInput.value.trim();
        const category = categoryInput.value.trim();

        if (!name || !category) {
            showToast("Inserisci sia nome che categoria del prodotto.", "error");
            return;
        }

        const products = loadProducts();
        if (
            products.some(
                (p) => p.name.toLowerCase() === name.toLowerCase()
            )
        ) {
            showToast("Prodotto già presente in elenco.", "error");
            return;
        }

        products.push({
            id: "p-" + Date.now(),
            name,
            category,
        });

        products.sort((a, b) =>
            a.name.localeCompare(b.name, "it", { sensitivity: "base" })
        );

        saveProducts(products);
        nameInput.value = "";
        categoryInput.value = "";
        renderAdminProducts();
        if (currentUser && currentUser.role === "admin") {
            showToast("Prodotto aggiunto alla checklist.");
        }
    }

    function handleAddEmployee(event) {
        event.preventDefault();
        const nameInput = document.getElementById("new-employee-name");
        const userInput = document.getElementById("new-employee-username");
        const pinInput = document.getElementById("new-employee-pin");
        if (!nameInput || !userInput || !pinInput) return;

        const name = nameInput.value.trim();
        const username = userInput.value.trim();
        const pin = pinInput.value.trim();

        if (!name || !username || !pin) {
            showToast(
                "Compila nome, username e PIN per il dipendente.",
                "error"
            );
            return;
        }

        const users = loadUsers();
        if (users.some((u) => u.username === username)) {
            showToast("Username già in uso. Scegline un altro.", "error");
            return;
        }

        users.push({
            id: "u-" + Date.now(),
            name,
            username,
            pin,
            role: "employee",
        });
        saveUsers(users);

        nameInput.value = "";
        userInput.value = "";
        pinInput.value = "";

        renderAdminEmployees();
        populateLoginSelect();
        showToast("Dipendente aggiunto.");
    }

    function bindEvents() {
        bindChecklistInteractions();
        bindClearDatabaseButton();
        bindAdminOrdersInteractions();
        const loginForm = document.getElementById("login-form");
        if (loginForm) {
            loginForm.addEventListener("submit", handleLoginSubmit);
        }

        const logoutEmployee = document.getElementById("logout-employee");
        if (logoutEmployee) {
            logoutEmployee.addEventListener("click", handleLogout);
        }

        const logoutAdmin = document.getElementById("logout-admin");
        if (logoutAdmin) {
            logoutAdmin.addEventListener("click", handleLogout);
        }

        const sendBtn = document.getElementById("send-checklist");
        if (sendBtn) {
            sendBtn.addEventListener("click", handleSendChecklist);
        }

        const addProductForm = document.getElementById("add-product-form");
        if (addProductForm) {
            addProductForm.addEventListener("submit", handleAddProduct);
        }

        const addEmployeeForm =
            document.getElementById("add-employee-form");
        if (addEmployeeForm) {
            addEmployeeForm.addEventListener("submit", handleAddEmployee);
        }

        setTabsEvents();
    }

    document.addEventListener("DOMContentLoaded", () => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("./sw.js")
                .catch((err) =>
                    console.error("Service worker registration failed:", err)
                );
        }

        initFirebase()
            .catch((err) => {
                console.error("Errore inizializzazione Firebase:", err);
            })
            .finally(() => {
                ensureSeedData();
                populateLoginSelect();
                bindEvents();
            });
    });
})();
