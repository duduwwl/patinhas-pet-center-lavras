# Patinhas Pet Center

Site da Patinhas Pet Center, em Lavras (MG), com catálogo para cães, gatos e outros pets, favoritos, sacola, pré-agendamento de banho e tosa e contato pelo WhatsApp.

## Duas edições no mesmo repositório

- **Aplicação completa:** `app/`, `components/`, `lib/`, `db/` e `public/`. Usa Vinext/Next, Cloudflare Worker, D1 e rotas de servidor para conta, sacola, pedidos, agendamentos e integração de pagamento. A configuração de hospedagem Sites está em `.openai/hosting.json`.
- **GitHub Pages:** `pages-src/` é a edição estática; `docs/` é o resultado pronto para publicação. Ela oferece catálogo com busca, filtros, favoritos e sacola locais, além de pedido e solicitação de banho e tosa enviados para confirmação pelo WhatsApp. Não há autenticação, reserva automática, estoque em tempo real ou pagamento online no Pages. Não use o Pages como substituto do backend da aplicação completa.

Os produtos e valores são demonstrativos e precisam de confirmação com a loja. As imagens do catálogo são ilustrativas. Nenhuma chave de pagamento é incluída neste repositório.

## Desenvolvimento

Requer Node.js 22.13 ou superior.

```sh
npm ci
npm run dev
```

Para compilar a aplicação completa:

```sh
npm run build
```

Para regenerar a edição do GitHub Pages após alterar o catálogo ou o visual:

```sh
npm run build:pages
```

O build estático copia as imagens públicas necessárias para `docs/images/` e gera `docs/index.html`. O GitHub Pages deve apontar para a branch `main`, pasta `/docs`.

## Configuração de produção

A aplicação completa precisa de um ambiente de servidor compatível com Cloudflare Workers e um banco D1 configurado. As credenciais de pagamento do Mercado Pago e o endereço do webhook devem ser configurados como segredos do ambiente, nunca em arquivos versionados. Antes de aceitar pedidos reais, valide pagamento, estoque, frete, política de privacidade e dados comerciais com a equipe da loja.

Contato público da loja: [Instagram](https://instagram.com/patinhas_petcenter) · [WhatsApp](https://wa.me/5535988427974).
