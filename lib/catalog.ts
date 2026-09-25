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
  imagePosition: string;
  imageAlt: string;
};

export const products: Product[] = [
  { id: "mordedor-corda", slug: "mordedor-de-corda", name: "Mordedor de corda", brand: "Patinhas Play", category: "Brinquedos", animal: "Cachorros", price: 18.9, oldPrice: 24.9, size: "Médio", stock: 12, badge: "OFERTA", description: "Mordedor trançado para brincadeiras supervisionadas, com fibras resistentes e pegada confortável.", confirmed: true, color: "#f0b323", imagePosition: "66.667% 0%", imageAlt: "Mordedor de corda colorido" },
  { id: "pelucia-pet", slug: "pelucia-para-pets", name: "Pelúcia Raposinha", brand: "Patinhas Play", category: "Brinquedos", animal: "Cachorros", price: 26, size: "Único", stock: 8, badge: "NOVO", description: "Pelúcia macia em formato de raposa para companhia e brincadeiras leves.", confirmed: true, color: "#b61f3c", imagePosition: "100% 0%", imageAlt: "Pelúcia de raposa para pets" },
  { id: "cama-nuvem", slug: "cama-nuvem", name: "Cama Nuvem", brand: "Patinhas Casa", category: "Camas", animal: "Cachorros", price: 89.9, size: "P, M e G", stock: 6, badge: "MAIS VENDIDO", description: "Cama redonda e macia, com laterais aconchegantes para uma rotina de descanso confortável.", confirmed: true, color: "#d29a23", imagePosition: "0% 33.333%", imageAlt: "Cama redonda e macia para pets" },
  { id: "special-dog-ultralife", slug: "special-dog-ultralife-frango", name: "Special Dog Ultralife Frango", brand: "Special Dog", category: "Rações", animal: "Cachorros", price: 149.9, oldPrice: 169.9, size: "10,1 kg", stock: 10, badge: "OFERTA", description: "Alimento seco para cães adultos. Imagem ilustrativa; confirme a apresentação disponível.", confirmed: true, color: "#173b6c", imagePosition: "0% 0%", imageAlt: "Saco de ração premium para cães" },
  { id: "bionatural", slug: "bionatural-caes-adultos", name: "Bionatural Cães Adultos", brand: "Bionatural", category: "Rações", animal: "Cachorros", price: 164.9, size: "10,1 kg", stock: 7, description: "Ração para cães adultos com formulação equilibrada. Consulte indicação e disponibilidade.", confirmed: true, color: "#214b3c", imagePosition: "0% 0%", imageAlt: "Embalagem ilustrativa de ração para cães" },
  { id: "formula-natural", slug: "formula-natural", name: "Fórmula Natural", brand: "Fórmula Natural", category: "Rações", animal: "Cachorros", price: 189.9, size: "10 kg", stock: 5, description: "Linha de alimentação para cães. Escolha a variação adequada com orientação da equipe.", confirmed: true, color: "#22577a", imagePosition: "0% 0%", imageAlt: "Embalagem ilustrativa de alimento para cães" },
  { id: "granplus", slug: "granplus", name: "GranPlus Gatos", brand: "GranPlus", category: "Rações", animal: "Gatos", price: 79.9, size: "3 kg", stock: 11, description: "Alimento seco para gatos adultos em apresentação demonstrativa.", confirmed: true, color: "#8a2141", imagePosition: "33.333% 0%", imageAlt: "Saco de ração premium para gatos" },
  { id: "frontline", slug: "frontline-antipulgas", name: "Frontline Antipulgas", brand: "Frontline", category: "Farmácia pet", animal: "Cachorros", price: 69.9, size: "Apresentação sob consulta", stock: 9, description: "Produto antipulgas. A escolha da apresentação deve seguir orientação profissional.", confirmed: true, color: "#91c53b", imagePosition: "33.333% 66.667%", imageAlt: "Frasco conta-gotas e caixa ilustrativa" },
  { id: "racao-filhotes", slug: "racao-premium-filhotes", name: "Ração Premium Filhotes", brand: "Patinhas Selection", category: "Rações", animal: "Cachorros", price: 119.9, size: "8 kg", stock: 13, badge: "NOVO", description: "Alimento completo demonstrativo para cães filhotes de portes variados.", confirmed: false, color: "#c89211", imagePosition: "0% 0%", imageAlt: "Saco ilustrativo de ração para filhotes" },
  { id: "sache-gatos", slug: "sache-gourmet-gatos", name: "Sachê Gourmet para Gatos", brand: "Miau & Cia", category: "Rações", animal: "Gatos", price: 4.99, size: "85 g", stock: 42, badge: "MAIS VENDIDO", description: "Alimento úmido demonstrativo para gatos adultos, em sabores variados.", confirmed: false, color: "#8b1937", imagePosition: "33.333% 0%", imageAlt: "Embalagem ilustrativa de alimento para gatos" },
  { id: "areia-premium", slug: "areia-premium-gatos", name: "Areia Higiênica Premium", brand: "Miau & Cia", category: "Areia e higiene", animal: "Gatos", price: 39.9, size: "4 kg", stock: 18, description: "Areia aglomerante de alta absorção para a rotina da caixa sanitária.", confirmed: false, color: "#77706c", imagePosition: "66.667% 33.333%", imageAlt: "Embalagem ilustrativa de areia para gatos" },
  { id: "arranhador-compacto", slug: "arranhador-compacto", name: "Arranhador Compacto", brand: "Patinhas Casa", category: "Arranhadores", animal: "Gatos", price: 119.9, size: "60 cm", stock: 4, badge: "NOVO", description: "Arranhador compacto com base macia e brinquedo suspenso.", confirmed: false, color: "#706966", imagePosition: "100% 33.333%", imageAlt: "Arranhador compacto para gatos" },
  { id: "shampoo-pet", slug: "shampoo-pelagem-macia", name: "Shampoo Pelagem Macia", brand: "Patinhas Care", category: "Higiene", animal: "Cachorros", price: 32.9, size: "500 ml", stock: 16, description: "Shampoo demonstrativo para limpeza suave e fragrância confortável.", confirmed: false, color: "#8b1937", imagePosition: "0% 66.667%", imageAlt: "Frasco ilustrativo de shampoo pet" },
  { id: "condicionador-pet", slug: "condicionador-desembaracante", name: "Condicionador Desembaraçante", brand: "Patinhas Care", category: "Higiene", animal: "Cachorros", price: 34.9, size: "500 ml", stock: 10, description: "Condicionador demonstrativo para facilitar o cuidado de pelagens longas.", confirmed: false, color: "#d49c18", imagePosition: "0% 66.667%", imageAlt: "Frasco ilustrativo de cuidado para pelagem" },
  { id: "peitoral-conforto", slug: "peitoral-conforto", name: "Peitoral Conforto", brand: "Patinhas Walk", category: "Passeio", animal: "Cachorros", price: 74.9, size: "P, M e G", stock: 9, badge: "MAIS VENDIDO", description: "Peitoral acolchoado demonstrativo com ajuste de tórax e pontos reforçados.", confirmed: false, color: "#8b1937", imagePosition: "33.333% 33.333%", imageAlt: "Peitoral bordô com guia" },
  { id: "guia-refletiva", slug: "guia-refletiva", name: "Guia Refletiva", brand: "Patinhas Walk", category: "Passeio", animal: "Cachorros", price: 39.9, size: "1,5 m", stock: 14, description: "Guia demonstrativa com faixa refletiva para passeios diurnos ou noturnos.", confirmed: false, color: "#4a4240", imagePosition: "33.333% 33.333%", imageAlt: "Guia bordô para passeio" },
  { id: "comedouro-ceramica", slug: "comedouro-ceramica", name: "Comedouro de Cerâmica", brand: "Patinhas Casa", category: "Comedouros", animal: "Cachorros", price: 44.9, size: "700 ml", stock: 12, description: "Comedouro pesado e estável, com acabamento ilustrativo de patinhas.", confirmed: false, color: "#f0b323", imagePosition: "66.667% 66.667%", imageAlt: "Comedouro de cerâmica com estampa de patas" },
  { id: "caixa-transporte", slug: "caixa-de-transporte", name: "Caixa de Transporte", brand: "Patinhas Travel", category: "Transporte", animal: "Gatos", price: 139.9, size: "Nº 2", stock: 5, description: "Caixa rígida demonstrativa com ventilação lateral e porta metálica.", confirmed: false, color: "#3d3b3f", imagePosition: "100% 66.667%", imageAlt: "Caixa rígida para transporte de pets" },
  { id: "kit-dental", slug: "kit-higiene-dental", name: "Kit Higiene Dental", brand: "Patinhas Care", category: "Saúde bucal", animal: "Cachorros", price: 49.9, size: "Escova + creme", stock: 15, description: "Kit demonstrativo para introduzir uma rotina de cuidado bucal supervisionada.", confirmed: false, color: "#a72d4c", imagePosition: "100% 100%", imageAlt: "Escova e creme dental ilustrativos para pets" },
  { id: "escova-removedora", slug: "escova-removedora-de-pelos", name: "Escova Removedora de Pelos", brand: "Patinhas Care", category: "Higiene", animal: "Gatos", price: 36.9, size: "Médio", stock: 17, description: "Escova demonstrativa para manutenção periódica da pelagem.", confirmed: false, color: "#8b1937", imagePosition: "100% 100%", imageAlt: "Escova bordô para pelagem de pets" },
  { id: "sementes-aves", slug: "mix-de-sementes-aves", name: "Mix de Sementes para Aves", brand: "Cantinho das Aves", category: "Aves", animal: "Outros pets", price: 24.9, size: "500 g", stock: 20, description: "Mistura demonstrativa de sementes para aves ornamentais.", confirmed: false, color: "#d79b0a", imagePosition: "0% 100%", imageAlt: "Pacote ilustrativo de sementes para aves" },
  { id: "kit-roedores", slug: "kit-diversao-roedores", name: "Kit Diversão para Roedores", brand: "Pequenos Amigos", category: "Roedores", animal: "Outros pets", price: 129.9, size: "Roda + toca", stock: 3, badge: "NOVO", description: "Conjunto demonstrativo com roda de exercício e toca de madeira.", confirmed: false, color: "#a06d35", imagePosition: "33.333% 100%", imageAlt: "Roda e toca de madeira para pequenos roedores" },
  { id: "alimento-peixes", slug: "alimento-peixes-tropicais", name: "Alimento para Peixes Tropicais", brand: "Aqua Vida", category: "Aquarismo", animal: "Outros pets", price: 22.9, size: "100 g", stock: 15, description: "Alimento demonstrativo em flocos para peixes ornamentais.", confirmed: false, color: "#e7a512", imagePosition: "66.667% 100%", imageAlt: "Pote ilustrativo de alimento para peixes" },
  { id: "filtro-aquario", slug: "filtro-compacto-aquario", name: "Filtro Compacto para Aquário", brand: "Aqua Vida", category: "Aquarismo", animal: "Outros pets", price: 98.9, size: "Até 60 L", stock: 6, description: "Filtro demonstrativo para circulação e manutenção da água do aquário.", confirmed: false, color: "#24272a", imagePosition: "66.667% 100%", imageAlt: "Filtro compacto ilustrativo para aquário" },
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
