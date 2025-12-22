const CART_KEY = "fitkids_cart_v1";

function loadCart(){
  try { return JSON.parse(localStorage.getItem(CART_KEY)) ?? []; }
  catch { return []; }
}

function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function parsePrecio(text){
  const m = (text || "").replace(",", ".").match(/(\d+(\.\d+)?)/);
  return m ? Number(m[1]) : 0;
}

function renderCart(){
  const cart = loadCart();
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.getElementById("cartCount");

  if(!cartItems || !cartTotal || !cartCount) return;

  cartCount.textContent = String(cart.length);

  if(cart.length === 0){
    cartItems.innerHTML = `<div class="cart-empty">Tu carrito está vacío.</div>`;
    cartTotal.textContent = "S/ 0";
    return;
  }

  let total = 0;
  cartItems.innerHTML = cart.map((it, idx) => {
    total += it.precio;
    return `
      <div class="cart-item">
        <img src="${it.img}" alt="${it.nombre}">
        <div>
          <h4>${it.nombre}</h4>
          <div class="mini">${it.detalle ?? ""}</div>
          <div class="mini"><strong>S/ ${it.precio}</strong></div>
        </div>
        <button class="remove" type="button" data-remove="${idx}">Quitar</button>
      </div>
    `;
  }).join("");

  cartTotal.textContent = `S/ ${total}`;

  cartItems.querySelectorAll("[data-remove]").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = Number(btn.getAttribute("data-remove"));
      const cart2 = loadCart();
      cart2.splice(i, 1);
      saveCart(cart2);
      renderCart();
    });
  });
}

function openCart(){
  const panel = document.getElementById("cartPanel");
  const overlay = document.getElementById("cartOverlay");
  const openBtn = document.getElementById("cartOpen");
  if(!panel || !overlay || !openBtn) return;

  panel.classList.add("open");
  overlay.hidden = false;
  panel.setAttribute("aria-hidden", "false");
  openBtn.setAttribute("aria-expanded", "true");
}

function closeCart(){
  const panel = document.getElementById("cartPanel");
  const overlay = document.getElementById("cartOverlay");
  const openBtn = document.getElementById("cartOpen");
  if(!panel || !overlay || !openBtn) return;

  panel.classList.remove("open");
  overlay.hidden = true;
  panel.setAttribute("aria-hidden", "true");
  openBtn.setAttribute("aria-expanded", "false");
}

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("cartOpen");
  const closeBtn = document.getElementById("cartClose");
  const overlay = document.getElementById("cartOverlay");
  const clearBtn = document.getElementById("cartClear");

  openBtn?.addEventListener("click", openCart);
  closeBtn?.addEventListener("click", closeCart);
  overlay?.addEventListener("click", closeCart);
  clearBtn?.addEventListener("click", () => {
    saveCart([]);
    renderCart();
  });

  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape") closeCart();
  });

  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const nombre = btn.getAttribute("data-nombre") || "Producto";
      const precio = Number(btn.getAttribute("data-precio") || 0);
      const img = btn.getAttribute("data-img") || "";
      const detalle = btn.getAttribute("data-detalle") || "";

      const cart = loadCart();
      cart.push({ nombre, precio, img, detalle });
      saveCart(cart);

      renderCart();
      openCart();
    });
  });

  renderCart();
});