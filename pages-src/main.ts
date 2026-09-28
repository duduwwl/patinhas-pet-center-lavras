import "./style.css";
import "./checkout.css";
import { products, formatPrice, store, type Product } from "../lib/catalog";
import { getCartEntries, subtotal, setupCheckout } from "./checkout";

const $ = <T = HTMLElement>(selector: string) => document.querySelector(selector)! as unknown as T;
const storage = {
  get<T>(key: string, fallback: T): T {
    try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
  },
  set(key: string, value: unknown) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Armazenamento opcional. */ } },
};
const favoriteKey = "patinhas:pages:favorites";
const cartKey = "patinhas:pages:cart";
const favorites = new Set<string>(storage.get<string[]>(favoriteKey, []));
const cart: Record<string, number> = storage.get(cartKey, {});
let favoritesOnly = false;

const imagePath = (product: Product) => `./images/${(product.imageSheet ?? "/images/catalog-products-sprite-v2.png").split("/").pop()}`;
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
const wa = (message: string) => `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`;

function updateCounts() {
  $("#cart-count").textContent = String(getCartEntries(cart).reduce((sum, entry) => sum + entry.quantity, 0));
}

function renderProducts() {
  const query = ($<HTMLInputElement>("#search").value || "").trim().toLocaleLowerCase("pt-BR");
  const animal = $<HTMLSelectElement>("#animal-filter").value;
  const category = $<HTMLSelectElement>("#category-filter").value;
  const pricedOnly = $<HTMLInputElement>("#available-only").checked;
  const sort = $<HTMLSelectElement>("#sort-filter").value;
  let items = products.filter((product) => (!animal || product.animal === animal) && (!category || product.category === category) && (!pricedOnly || product.price !== null) && (!favoritesOnly || favorites.has(product.id)) && (!query || `${product.name} ${product.brand} ${product.category}`.toLocaleLowerCase("pt-BR").includes(query)));
  if (sort === "price-asc") items = [...items].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  if (sort === "price-desc") items = [...items].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
  if (sort === "name") items = [...items].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  $("#catalog-count").textContent = `${items.length} produto${items.length === 1 ? "" : "s"} encontrado${items.length === 1 ? "" : "s"}${favoritesOnly ? " nos favoritos" : ""}`;
  $("#catalog-empty").hidden = items.length > 0;
  $("#products").innerHTML = items.map((product) => `<article class="product-card"><div class="product-visual"><div class="product-photo" role="img" aria-label="${escapeHtml(product.imageAlt)}" style="background-image:url('${imagePath(product)}');--pos:${product.imagePosition}"></div>${product.badge ? `<span class="product-badge">${escapeHtml(product.badge)}</span>` : ""}<button type="button" class="favorite-button" data-favorite="${escapeHtml(product.id)}" aria-label="${favorites.has(product.id) ? "Remover dos" : "Adicionar aos"} favoritos: ${escapeHtml(product.name)}" aria-pressed="${favorites.has(product.id)}">${favorites.has(product.id) ? "♥" : "♡"}</button></div><div class="product-info"><small>${escapeHtml(product.brand)} · ${escapeHtml(product.category)}</small><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.size)}</p><div class="product-price"><div>${product.oldPrice ? `<span class="old">${formatPrice(product.oldPrice)}</span>` : ""}<strong>${formatPrice(product.price)}</strong></div><button type="button" class="round-button" data-product="${escapeHtml(product.id)}" aria-label="Ver ${escapeHtml(product.name)}">+</button></div></div></article>`).join("");
}

function openProduct(product: Product) {
  $("#product-detail").innerHTML = `<div class="detail-image" role="img" aria-label="${escapeHtml(product.imageAlt)}" style="background-image:url('${imagePath(product)}');--pos:${product.imagePosition}"></div><h2>${escapeHtml(product.name)}</h2><p><strong>${escapeHtml(product.brand)}</strong> · ${escapeHtml(product.category)} · ${escapeHtml(product.size)}</p><p>${escapeHtml(product.description)}</p><p><strong>${formatPrice(product.price)}</strong>${product.price === null ? " · preço sob consulta" : ""}</p>${product.price === null ? `<a class="button button-burgundy" target="_blank" rel="noreferrer" href="${wa(`Olá! Gostaria de consultar ${product.name}.`)}">Consultar pelo WhatsApp</a>` : `<button type="button" class="button button-gold" id="add-detail" data-id="${escapeHtml(product.id)}">Adicionar à sacola</button>`}`;
  $<HTMLDialogElement>("#product-dialog").showModal();
}

function renderCart() {
  const entries = getCartEntries(cart);
  $("#cart-items").innerHTML = entries.length ? entries.map(({ product, quantity }) => `<div class="cart-line"><div><strong>${escapeHtml(product.name)}</strong><small>${quantity} × ${formatPrice(product.price)}</small><div class="cart-quantity"><button type="button" data-quantity="${escapeHtml(product.id)}" data-delta="-1" aria-label="Diminuir quantidade de ${escapeHtml(product.name)}" ${quantity <= 1 ? "disabled" : ""}>−</button><span>${quantity}</span><button type="button" data-quantity="${escapeHtml(product.id)}" data-delta="1" aria-label="Aumentar quantidade de ${escapeHtml(product.name)}" ${quantity >= 99 ? "disabled" : ""}>+</button></div></div><button type="button" data-remove="${escapeHtml(product.id)}">Remover</button></div>`).join("") : "<p>Sua sacola está vazia. Explore os produtos da loja.</p>";
  $("#cart-footer").innerHTML = entries.length ? `<div class="cart-total"><span>Subtotal estimado</span><span>${formatPrice(subtotal(entries))}</span></div><p class="notice">Escolha retirada ou entrega e Pix, débito ou crédito. Valores e condições serão confirmados pela equipe.</p><button type="button" class="button button-burgundy" id="checkout-open">Continuar para o checkout →</button>` : "";
}

function setupAnimation() {
  const video = $<HTMLVideoElement>("#hero-video");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let visible = true;
  const sync = () => {
    if (motion.matches || document.hidden || !visible) {
      video.pause();
      if (motion.matches) video.classList.remove("is-playing");
      return;
    }
    if (!video.src) video.src = "./videos/hero-patinhas-ordered-v3.mp4";
    video.play().then(() => video.classList.add("is-playing")).catch(() => {
      // Autoplay can be disabled by a browser; keep the original photo visible.
      video.classList.remove("is-playing");
    });
  };
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .05 }).observe(video);
  motion.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  video.addEventListener("error", () => video.classList.remove("is-playing"));
  sync();
}

function init() {
  const openCheckout = setupCheckout(() => getCartEntries(cart));
  $("#catalog-total").textContent = `${products.length} produtos · ${new Set(products.map((product) => product.category)).size} categorias`;
  const categories = [...new Set(products.map((product) => product.category))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  $<HTMLSelectElement>("#category-filter").insertAdjacentHTML("beforeend", categories.map((name) => `<option>${escapeHtml(name)}</option>`).join(""));
  for (const id of ["search", "animal-filter", "category-filter", "sort-filter", "available-only"]) document.getElementById(id)?.addEventListener(id === "search" ? "input" : "change", renderProducts);
  $("#clear-filters").addEventListener("click", () => { $<HTMLInputElement>("#search").value = ""; $<HTMLSelectElement>("#animal-filter").value = ""; $<HTMLSelectElement>("#category-filter").value = ""; $<HTMLSelectElement>("#sort-filter").value = "featured"; $<HTMLInputElement>("#available-only").checked = false; favoritesOnly = false; renderProducts(); });
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const favorite = target.closest<HTMLElement>("[data-favorite]");
    const productButton = target.closest<HTMLElement>("[data-product]");
    const remove = target.closest<HTMLElement>("[data-remove]");
    const quantityButton = target.closest<HTMLButtonElement>("[data-quantity]");
    const animalLink = target.closest<HTMLElement>("[data-animal-link], [data-animal-card]");
    const categoryLink = target.closest<HTMLElement>("[data-category-card]");
    if (favorite) { const id = favorite.dataset.favorite!; if (favorites.has(id)) favorites.delete(id); else favorites.add(id); storage.set(favoriteKey, [...favorites]); updateCounts(); renderProducts(); }
    if (productButton) { const product = products.find((item) => item.id === productButton.dataset.product); if (product) openProduct(product); }
    if (remove) { delete cart[remove.dataset.remove!]; storage.set(cartKey, cart); updateCounts(); renderCart(); }
    if (quantityButton && !quantityButton.disabled) { const id = quantityButton.dataset.quantity!; cart[id] = Math.max(1, Math.min(99, (cart[id] ?? 1) + Number(quantityButton.dataset.delta))); storage.set(cartKey, cart); updateCounts(); renderCart(); }
    if (target.closest("#checkout-open")) openCheckout();
    if (animalLink) { $<HTMLSelectElement>("#animal-filter").value = animalLink.dataset.animalLink ?? animalLink.dataset.animalCard ?? ""; $<HTMLSelectElement>("#category-filter").value = ""; favoritesOnly = false; renderProducts(); location.hash = "loja"; }
    if (categoryLink) { $<HTMLSelectElement>("#category-filter").value = categoryLink.dataset.categoryCard ?? ""; $<HTMLSelectElement>("#animal-filter").value = ""; favoritesOnly = false; renderProducts(); location.hash = "loja"; }
    if (target.closest(".dialog-close")) target.closest("dialog")?.close();
    if (target.closest("#add-detail")) { const id = target.closest<HTMLElement>("#add-detail")!.dataset.id!; const current = getCartEntries(cart).find((entry) => entry.product.id === id)?.quantity ?? 0; cart[id] = Math.min(99, current + 1); storage.set(cartKey, cart); updateCounts(); $<HTMLDialogElement>("#product-dialog").close(); renderCart(); $<HTMLDialogElement>("#cart-dialog").showModal(); }
  });
  $("#cart-toggle").addEventListener("click", () => { renderCart(); $<HTMLDialogElement>("#cart-dialog").showModal(); });
  $<HTMLFormElement>("#booking-form").addEventListener("submit", (event) => { event.preventDefault(); const form = new FormData(event.currentTarget as HTMLFormElement); const name = String(form.get("name") ?? "").trim(); const pet = String(form.get("pet") ?? "").trim(); const service = String(form.get("service") ?? "").trim(); const date = String(form.get("date") ?? "").trim(); if (!name || !pet || !service || !date) return; window.open(wa(`Olá! Sou ${name}. Gostaria de solicitar ${service} para ${pet} na data ${date}. Podem confirmar disponibilidade e valor?`), "_blank", "noopener,noreferrer"); });
  updateCounts(); renderProducts(); setupAnimation();
}

init();
