import { products, formatPrice, store, type Product } from "../lib/catalog";

export type CartEntry = { product: Product; quantity: number };
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

export function getCartEntries(cart: Record<string, number>): CartEntry[] {
  return Object.entries(cart).flatMap(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return product && product.price !== null && Number.isInteger(quantity) && quantity > 0 && quantity <= 99 ? [{ product, quantity }] : [];
  });
}

export const subtotal = (entries: CartEntry[]) => entries.reduce((sum, { product, quantity }) => sum + (product.price ?? 0) * quantity, 0);

const paymentLabels: Record<string, string> = { pix: "Pix", debit: "Cartão de débito", credit: "Cartão de crédito" };
const field = (data: FormData, name: string) => String(data.get(name) ?? "").trim();

export function orderMessage(entries: CartEntry[], data: FormData): string {
  const delivery = field(data, "fulfillment") === "delivery";
  return [
    "Olá! Quero solicitar este pedido pelo site da Patinhas:",
    "", "PRODUTOS",
    ...entries.map(({ product, quantity }) => `• ${quantity} × ${product.name} (${product.size}) — ${formatPrice((product.price ?? 0) * quantity)}`),
    `Subtotal estimado: ${formatPrice(subtotal(entries))}`,
    "", "DADOS DO CLIENTE",
    `Nome: ${field(data, "customerName")}`,
    `WhatsApp: ${field(data, "phone")}`,
    ...(field(data, "email") ? [`E-mail: ${field(data, "email")}`] : []),
    "", delivery ? "ENTREGA" : "RETIRADA NA LOJA",
    ...(delivery ? [
      `${field(data, "street")}, ${field(data, "number")}${field(data, "complement") ? ` — ${field(data, "complement")}` : ""}`,
      `${field(data, "district")} — ${field(data, "city")}/${field(data, "state")}`,
      `CEP: ${field(data, "postalCode")}`,
      "Frete e área de entrega: a confirmar pela equipe.",
    ] : [store.address, "Horário para retirada: a combinar com a equipe."]),
    "", `Pagamento escolhido: ${paymentLabels[field(data, "payment")] ?? "A combinar"}`,
    "Pagamento a combinar após confirmação da loja; nenhum valor foi cobrado pelo site.",
    ...(field(data, "notes") ? ["", `Observações: ${field(data, "notes")}`] : []),
    "", "Podem confirmar estoque, preços, prazo e valor final antes do pagamento?",
  ].join("\n");
}

export function setupCheckout(getEntries: () => CartEntry[]) {
  const dialog = document.querySelector<HTMLDialogElement>("#checkout-dialog")!;
  const form = document.querySelector<HTMLFormElement>("#checkout-form")!;
  const address = document.querySelector<HTMLFieldSetElement>("#delivery-address")!;
  const ready = document.querySelector<HTMLElement>("#checkout-ready")!;
  const pickup = document.querySelector<HTMLElement>("#pickup-details")!;
  const summary = document.querySelector<HTMLElement>("#checkout-summary")!;
  const error = document.querySelector<HTMLElement>("#checkout-error")!;

  const syncFulfillment = () => {
    const delivery = new FormData(form).get("fulfillment") === "delivery";
    address.hidden = !delivery;
    address.disabled = !delivery;
    pickup.hidden = delivery;
    document.querySelector("#checkout-shipping")!.textContent = delivery ? "A confirmar com a loja" : "Retirada na loja (sem frete)";
    document.querySelector("#checkout-total-note")!.textContent = delivery ? "Frete não incluído. O total final será confirmado pela equipe." : "Preços e disponibilidade serão confirmados pela equipe.";
  };

  const syncPayment = () => {
    const payment = new FormData(form).get("payment");
    document.querySelector("#payment-help")!.textContent = payment === "pix"
      ? "Após confirmar seu pedido, a equipe enviará a chave ou o QR Code Pix pelo WhatsApp. Não faça pagamentos antes da confirmação."
      : "O pagamento com cartão e suas condições serão combinados com a equipe, na retirada ou entrega. Não informe número de cartão ou CVV aqui.";
  };

  const showForm = () => {
    ready.hidden = true;
    form.hidden = false;
    error.hidden = true;
    document.querySelector("#checkout-step")!.textContent = "1. Dados do pedido";
  };

  form.addEventListener("change", () => { syncFulfillment(); syncPayment(); });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const entries = getEntries();
    if (!entries.length) { error.textContent = "Sua sacola está vazia. Adicione um produto para continuar."; error.hidden = false; return; }
    for (const input of form.querySelectorAll<HTMLInputElement>("input[type=text], input[type=tel], input[type=email]")) input.value = input.value.trim();
    const phone = form.elements.namedItem("phone") as HTMLInputElement;
    const digits = phone.value.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
    phone.setCustomValidity(/^\d{10,11}$/.test(digits) ? "" : "Informe um telefone válido com DDD.");
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (!paymentLabels[field(data, "payment")]) return;
    document.querySelector("#checkout-review")!.textContent = orderMessage(entries, data);
    document.querySelector<HTMLAnchorElement>("#send-checkout")!.href = `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(orderMessage(entries, data))}`;
    form.hidden = true;
    ready.hidden = false;
    document.querySelector("#checkout-step")!.textContent = "2. Revise e envie";
    dialog.scrollTop = 0;
    document.querySelector<HTMLHeadingElement>("#review-title")!.focus();
  });
  (form.elements.namedItem("phone") as HTMLInputElement).addEventListener("input", (event) => (event.target as HTMLInputElement).setCustomValidity(""));
  document.querySelector("#edit-checkout")!.addEventListener("click", () => { showForm(); dialog.scrollTop = 0; document.querySelector<HTMLInputElement>("#customer-name")!.focus(); });
  document.querySelector("#checkout-back")!.addEventListener("click", () => { dialog.close(); document.querySelector<HTMLButtonElement>("#cart-toggle")!.click(); });
  dialog.addEventListener("close", () => {
    // Personal data stays only in this open form, never in localStorage.
    form.reset();
    (form.elements.namedItem("phone") as HTMLInputElement).setCustomValidity("");
    document.querySelector("#checkout-review")!.textContent = "";
    document.querySelector<HTMLAnchorElement>("#send-checkout")!.removeAttribute("href");
  });

  return () => {
    const entries = getEntries();
    if (!entries.length) return;
    document.querySelector<HTMLDialogElement>("#cart-dialog")!.close();
    showForm();
    summary.innerHTML = entries.map(({ product, quantity }) => `<div class="checkout-item"><div><strong>${escapeHtml(product.name)}</strong><small>${quantity} × ${formatPrice(product.price)} · ${escapeHtml(product.size)}</small></div><span>${formatPrice((product.price ?? 0) * quantity)}</span></div>`).join("");
    document.querySelector("#checkout-subtotal")!.textContent = formatPrice(subtotal(entries));
    syncFulfillment(); syncPayment();
    dialog.showModal();
  };
}
