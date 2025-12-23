    (function () {
    const cpEmpty = document.getElementById("cpEmpty");
    const cpContent = document.getElementById("cpContent");
    const cpItems = document.getElementById("cpItems");
    const cpTotal = document.getElementById("cpTotal");

    const btnClear = document.getElementById("cpClear");
    const form = document.getElementById("cpForm");
    const msg = document.getElementById("cpMsg");
    const btnSend = document.getElementById("cpSend");

    const inNombre = document.getElementById("cpNombre"); 
    const inCorreo = document.getElementById("cpCorreo");
    const inTelefono = document.getElementById("cpTelefono");

    function dinero(v) {
    const n = Number(v);
        if (!Number.isFinite(n)) return "S/ 0.00";
        return "S/ " + n.toFixed(2);
    }

    const CART_KEY = "fitkids_cart_v1";

    function getCart() {
        try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
        catch { return []; }
    }

    function setCart(arr) {
        localStorage.setItem(CART_KEY, JSON.stringify(arr));
    }

    function getName(item) {
        return item.nombre || item.name || item.titulo || "Producto";
    }

    function getPrecio(item) {
        const p = item.precio ?? item.price ?? 0;
        const n = Number(p);
        return Number.isFinite(n) ? n : 0;
    }

    function getDetail(item) {
        return item.detalle || item.color || item.variant || "";
    }

    function getImg(item) {
        return item.img || item.imagen || item.image || "";
    }

    function render() {
        const cart = getCart();

        if (!cart.length) {
        cpContent.hidden = true;
        cpEmpty.hidden = false;
        return;
        }

        cpEmpty.hidden = true;
        cpContent.hidden = false;

        cpItems.innerHTML = "";
        let total = 0;

        cart.forEach((item) => {
        const nombre = getName(item);
        const detalle = getDetail(item);
        const precio = getPrecio(item);
        const img = getImg(item);

        total += precio;

        const row = document.createElement("div");
        row.className = "cp-item";

        const imgEl = document.createElement("img");
        imgEl.alt = nombre;
        imgEl.src = img ? img : "../img/placeholder.png";
        imgEl.onerror = () => (imgEl.src = "../img/placeholder.png");

        const mid = document.createElement("div");

        const title = document.createElement("p");
        title.className = "cp-item-title";
        title.textContent = nombre;

        const meta = document.createElement("p");
        meta.className = "cp-item-meta";
        meta.textContent = detalle ? detalle : "Sin detalle";

        mid.appendChild(title);
        mid.appendChild(meta);

        const price = document.createElement("div");
        price.className = "cp-item-price";
        price.textContent = dinero(precio);

        row.appendChild(imgEl);
        row.appendChild(mid);
        row.appendChild(price);

        cpItems.appendChild(row);
    });

    cpTotal.textContent = dinero(total);
    }

    function showMsg(text, type) {
        msg.textContent = text || "";
        msg.classList.remove("ok", "err");
        if (type) msg.classList.add(type);
    }

    btnClear.addEventListener("click", () => {
    setCart([]);
    showMsg("Carrito vaciado.", "ok");
    render();
    });

    form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showMsg("");

    const nombre = inNombre.value.trim();
    const correo = inCorreo.value.trim();
    const telefono = inTelefono.value.trim();
    const cart = getCart();

    if (!cart.length) {
        showMsg("Tu carrito está vacío.", "err");
        render();
        return;
    }

    if (!nombre) {
        showMsg("Escribe tu nombre.", "err");
        inNombre.focus();
        return;
    }

    if (!correo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        showMsg("Escribe un correo válido.", "err");
        inCorreo.focus();
        return;
    }

    const items = cart.map((it) => ({
        producto: getName(it),
        detalle: getDetail(it),
        precio: getPrecio(it),
        img: getImg(it)
    }));

    const total = items.reduce((acc, it) => acc + (Number(it.precio) || 0), 0);

    const payload = {
        nombre,
        correo,
        telefono,
        total: Number(total.toFixed(2)),
        items
    };

    btnSend.disabled = true;
    btnSend.textContent = "Enviando...";

    try {
    // Cambia esta URL a tu endpoint real en hosting:
    // Ej: https://tudominio.com/api/pedidos_create.php
    const API_URL = "../api/pedidos_create.php";

    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.ok) {
        const err = data.error || "No se pudo enviar el pedido.";
        showMsg(err, "err");
        return;
    }

    setCart([]);
    render();
    showMsg(`Pedido enviado correctamente. Código: ${data.pedido_id ?? "-"}`, "ok");

    } catch (err) {
        showMsg("Error de conexión. Intenta de nuevo.", "err");
    } finally {
        btnSend.disabled = false;
        btnSend.textContent = "Enviar pedido";
    }
    });

    render();
    })();