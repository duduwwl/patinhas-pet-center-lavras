import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const compile = (source) => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const moduleUrl = (source) => `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
const catalogUrl = moduleUrl(compile(await readFile(new URL("../lib/catalog.ts", import.meta.url), "utf8")));
const checkoutSource = compile(await readFile(new URL("../pages-src/checkout.ts", import.meta.url), "utf8")).replace('"../lib/catalog"', JSON.stringify(catalogUrl));
const { getCartEntries, subtotal, orderMessage } = await import(moduleUrl(checkoutSource));
const { products } = await import(catalogUrl);
const item = products.find((product) => product.price !== null);
const unpriced = products.find((product) => product.price === null);
const entries = getCartEntries({ [item.id]: 2, [unpriced.id]: 1, unknown: 3 });
assert.equal(entries.length, 1);
assert.equal(subtotal(entries), item.price * 2);
for (const invalid of [-1, 0, 1.5, 100, NaN, "2"]) assert.equal(getCartEntries({ [item.id]: invalid }).length, 0);

const data = new FormData();
Object.entries({ customerName: "Cliente Teste", phone: "35999990000", fulfillment: "pickup", payment: "pix", email: "teste@example.com", notes: "Separar para retirada" }).forEach(([key, value]) => data.set(key, value));
const pickup = orderMessage(entries, data);
assert.ok(pickup.includes("RETIRADA NA LOJA"));
assert.ok(pickup.includes("Pagamento escolhido: Pix"));
assert.ok(pickup.includes("E-mail: teste@example.com"));
assert.ok(pickup.includes("Observações: Separar para retirada"));
assert.ok(!pickup.includes("CEP:"));
data.set("fulfillment", "delivery");
Object.entries({ street: "Rua de Teste", number: "10", district: "Centro", city: "Lavras", state: "MG", postalCode: "37203-750" }).forEach(([key, value]) => data.set(key, value));
for (const [payment, expected] of [["debit", "Cartão de débito"], ["credit", "Cartão de crédito"]]) {
  data.set("payment", payment);
  const delivery = orderMessage(entries, data);
  assert.ok(delivery.includes("Rua de Teste, 10"));
  assert.ok(delivery.includes("Centro — Lavras/MG"));
  assert.ok(delivery.includes(`Pagamento escolhido: ${expected}`));
  assert.ok(delivery.includes("Frete e área de entrega: a confirmar"));
}
const html = await readFile(new URL("../docs/index.html", import.meta.url), "utf8");
assert.ok(!html.includes("<h3>Tosa</h3>"));
assert.ok(html.includes("<option>Tosa</option>"));
assert.ok(html.includes('id="checkout-dialog"'));
console.log("Checkout: totais, quantidades, retirada, entrega, pagamentos e saída compilada validados.");
