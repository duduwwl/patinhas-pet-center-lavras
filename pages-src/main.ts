import "./style.css";
import { products, formatPrice, store, type Product } from "../lib/catalog";

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
  $("#favorites-count").textContent = String(favorites.size);
  $("#cart-count").textContent = String(Object.values(cart).reduce((sum, quantity) => sum + quantity, 0));
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
  const entries = Object.entries(cart).map(([id, quantity]) => ({ product: products.find((candidate) => candidate.id === id), quantity })).filter((entry): entry is { product: Product; quantity: number } => !!entry.product && entry.product.price !== null && entry.quantity > 0);
  const total = entries.reduce((sum, { product, quantity }) => sum + (product.price ?? 0) * quantity, 0);
  $("#cart-items").innerHTML = entries.length ? entries.map(({ product, quantity }) => `<div class="cart-line"><div><strong>${escapeHtml(product.name)}</strong><small>${quantity} × ${formatPrice(product.price)}</small></div><button type="button" data-remove="${escapeHtml(product.id)}">Remover</button></div>`).join("") : "<p>Sua sacola está vazia. Explore os produtos da loja.</p>";
  $("#cart-footer").innerHTML = entries.length ? `<div class="cart-total"><span>Subtotal estimado</span><span>${formatPrice(total)}</span></div><p class="notice">Preço e disponibilidade dependem de confirmação da equipe. Não há pagamento online nesta versão.</p><a class="button button-burgundy" href="${wa(`Olá! Gostaria de consultar este pedido da loja Patinhas:\n${entries.map(({ product, quantity }) => `• ${quantity} × ${product.name}`).join("\n")}\nSubtotal estimado: ${formatPrice(total)}. Podem confirmar preços e disponibilidade?`)}" target="_blank" rel="noreferrer">Enviar pedido pelo WhatsApp</a>` : "";
}

function setupAnimation() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const frames = ["hero-patinhas-frame-turn.png", "hero-patinhas-frame-approach.png", "hero-patinhas-interaction.png", "hero-patinhas-frame-reaction.png", "hero-patinhas-frame-release.png"];
  Promise.all(frames.map((file) => new Promise<void>((resolve) => { const image = new Image(); image.onload = image.onerror = () => resolve(); image.src = `./images/${file}`; }))).then(() => {
    const timings = [350, 1400, 2450, 3650, 4750, 6200];
    timings.forEach((delay, index) => window.setTimeout(() => { $("#hero-image").style.backgroundImage = `url('./images/${frames[index] ?? "hero-patinhas.png"}')`; }, delay));
  });
}

function init() {
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
    const animalLink = target.closest<HTMLElement>("[data-animal-link], [data-animal-card]");
    const categoryLink = target.closest<HTMLElement>("[data-category-card]");
    if (favorite) { const id = favorite.dataset.favorite!; if (favorites.has(id)) favorites.delete(id); else favorites.add(id); storage.set(favoriteKey, [...favorites]); updateCounts(); renderProducts(); }
    if (productButton) { const product = products.find((item) => item.id === productButton.dataset.product); if (product) openProduct(product); }
    if (remove) { delete cart[remove.dataset.remove!]; storage.set(cartKey, cart); updateCounts(); renderCart(); }
    if (animalLink) { $<HTMLSelectElement>("#animal-filter").value = animalLink.dataset.animalLink ?? animalLink.dataset.animalCard ?? ""; $<HTMLSelectElement>("#category-filter").value = ""; favoritesOnly = false; renderProducts(); location.hash = "loja"; }
    if (categoryLink) { $<HTMLSelectElement>("#category-filter").value = categoryLink.dataset.categoryCard ?? ""; $<HTMLSelectElement>("#animal-filter").value = ""; favoritesOnly = false; renderProducts(); location.hash = "loja"; }
    if (target.closest(".dialog-close")) target.closest("dialog")?.close();
    if (target.closest("#add-detail")) { const id = target.closest<HTMLElement>("#add-detail")!.dataset.id!; cart[id] = (cart[id] ?? 0) + 1; storage.set(cartKey, cart); updateCounts(); $<HTMLDialogElement>("#product-dialog").close(); renderCart(); $<HTMLDialogElement>("#cart-dialog").showModal(); }
  });
  $("#favorites-toggle").addEventListener("click", () => { favoritesOnly = !favoritesOnly; renderProducts(); location.hash = "loja"; });
  $("#cart-toggle").addEventListener("click", () => { renderCart(); $<HTMLDialogElement>("#cart-dialog").showModal(); });
  $<HTMLFormElement>("#booking-form").addEventListener("submit", (event) => { event.preventDefault(); const form = new FormData(event.currentTarget as HTMLFormElement); const name = String(form.get("name") ?? "").trim(); const pet = String(form.get("pet") ?? "").trim(); const service = String(form.get("service") ?? "").trim(); const date = String(form.get("date") ?? "").trim(); if (!name || !pet || !service || !date) return; window.open(wa(`Olá! Sou ${name}. Gostaria de solicitar ${service} para ${pet} na data ${date}. Podem confirmar disponibilidade e valor?`), "_blank", "noopener,noreferrer"); });
  updateCounts(); renderProducts(); setupAnimation();
}

init();
