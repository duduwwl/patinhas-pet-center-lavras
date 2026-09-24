export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  animal: "Cachorros" | "Gatos" | "Outros pets";
  price: number | null;
  oldPrice?: number;
  size: string;
  stock: number | null;
  badge?: "OFERTA" | "NOVO" | "MAIS VENDIDO";
  description: string;
  confirmed: boolean;
  color: string;
};

export const products: Product[] = [
  { id: "mordedor-corda", slug: "mordedor-de-corda", name: "Mordedor de corda", brand: "Marca a confirmar", category: "Brinquedos", animal: "Cachorros", price: 18.9, size: "Tamanho a confirmar", stock: null, badge: "OFERTA", description: "Brinquedo de corda visto nas publicações da loja. Cor, tamanho e estoque devem ser confirmados antes da compra.", confirmed: true, color: "#f0b323" },
  { id: "pelucia-pet", slug: "pelucia-para-pets", name: "Pelúcia para pets", brand: "Marca a confirmar", category: "Brinquedos", animal: "Cachorros", price: 26, size: "Modelo a confirmar", stock: null, badge: "NOVO", description: "Pelúcia apresentada no catálogo social da Patinhas. Modelo, medidas e disponibilidade sujeitos à confirmação.", confirmed: true, color: "#b61f3c" },
  { id: "cama-nuvem", slug: "cama-nuvem", name: "Cama Nuvem", brand: "Marca a confirmar", category: "Camas", animal: "Cachorros", price: 89.9, size: "Tamanho a confirmar", stock: null, badge: "MAIS VENDIDO", description: "Cama macia em formato redondo exibida nas publicações da loja. Consulte cores, medidas e estoque no WhatsApp.", confirmed: true, color: "#d29a23" },
  { id: "special-dog-ultralife", slug: "special-dog-ultralife-frango", name: "Special Dog Ultralife Frango", brand: "Special Dog", category: "Rações", animal: "Cachorros", price: null, size: "Peso a confirmar", stock: null, badge: "OFERTA", description: "Linha identificada em promoção publicada pela Patinhas. Preço, peso e disponibilidade devem ser confirmados.", confirmed: true, color: "#173b6c" },
  { id: "bionatural", slug: "bionatural-caes-adultos", name: "Bionatural Cães Adultos", brand: "Bionatural", category: "Rações", animal: "Cachorros", price: null, size: "Peso a confirmar", stock: null, description: "Linha Bionatural reconhecida nas imagens enviadas. Consulte indicação, peso e preço com a equipe.", confirmed: true, color: "#214b3c" },
  { id: "formula-natural", slug: "formula-natural", name: "Fórmula Natural", brand: "Fórmula Natural", category: "Rações", animal: "Cachorros", price: null, size: "Variações disponíveis na loja", stock: null, description: "Marca identificada na fachada e nas prateleiras da Patinhas Pet Center. Linha exata sob consulta.", confirmed: true, color: "#22577a" },
  { id: "granplus", slug: "granplus", name: "GranPlus", brand: "GranPlus", category: "Rações", animal: "Gatos", price: null, size: "Variações disponíveis na loja", stock: null, description: "Marca confirmada pela comunicação visual da loja. Consulte a linha adequada ao seu gato.", confirmed: true, color: "#8a2141" },
  { id: "frontline", slug: "frontline-antipulgas", name: "Frontline Antipulgas", brand: "Frontline", category: "Farmácia pet", animal: "Cachorros", price: null, size: "Apresentação a confirmar", stock: null, description: "Produto identificado na farmácia pet da loja. A escolha da apresentação deve seguir orientação profissional.", confirmed: true, color: "#91c53b" },
];

export const categories = [
  { name: "Cachorros", icon: "dog", description: "Rações, brinquedos, higiene e passeio" },
  { name: "Gatos", icon: "cat", description: "Alimentação, areia, camas e acessórios" },
  { name: "Aves", icon: "bird", description: "Itens sob consulta na loja" },
  { name: "Roedores", icon: "rabbit", description: "Cuidados para pequenos pets" },
  { name: "Peixes", icon: "fish", description: "Linha disponível sob consulta" },
  { name: "Farmácia pet", icon: "heart", description: "Saúde, higiene e prevenção" },
];

export const services = [
  { id: "banho", name: "Banho", description: "Higiene e cuidado com produtos adequados ao perfil do pet.", duration: 60, price: null, confirmed: true },
  { id: "tosa", name: "Tosa", description: "Serviço de tosa com avaliação prévia da pelagem e do porte.", duration: 75, price: null, confirmed: true },
  { id: "banho-tosa", name: "Banho + Tosa", description: "Cuidado completo em uma única visita. Valor conforme porte e pelagem.", duration: 120, price: null, confirmed: true },
] as const;

export const store = { name: "Patinhas Pet Center", since: 2015, address: "Rua Francisco Antônio dos Santos, 388 — Lavras, MG — 37203-750", whatsapp: "5535988427974", instagram: "patinhas_petcenter", email: "patinhas.ps@gmail.com" };
export function formatPrice(value: number | null) { if (value === null) return "Consulte"; return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value); }
export function getProduct(slug: string) { return products.find((product) => product.slug === slug); }
