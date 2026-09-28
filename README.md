# Patinhas Pet Center

Site da Patinhas Pet Center, em Lavras (MG), com catálogo para cães, gatos e outros pets, favoritos, sacola, pré-agendamento de banho e tosa e contato pelo WhatsApp.

## Duas edições no mesmo repositório

- **Aplicação completa:** `app/`, `components/`, `lib/`, `db/` e `public/`. Usa Vinext/Next, Cloudflare Worker, D1 e rotas de servidor para conta, sacola, pedidos, agendamentos e integração de pagamento. A configuração de hospedagem Sites está em `.openai/hosting.json`.
- **Demonstração estática:** `pages-src/` é uma edição de referência; `docs/` é seu resultado compilado. Ela oferece catálogo com busca, filtros, favoritos e sacola locais, além de checkout assistido e solicitação de banho e tosa enviados para confirmação pelo WhatsApp. No checkout, o cliente informa seus dados, escolhe retirada ou entrega e Pix, débito ou crédito, revisa o pedido e abre a mensagem para a loja. Não há autenticação, reserva automática, estoque em tempo real ou pagamento online nessa edição. Não a use como substituto do backend da aplicação completa.

Os produtos e valores são demonstrativos e precisam de confirmação com a loja. As imagens do catálogo são ilustrativas. Nenhuma chave de pagamento é incluída neste repositório.

O checkout estático não solicita dados de cartão, não gera Pix e não cobra valores. Frete, prazo e pagamento dependem de confirmação da equipe. Dados do cliente ficam apenas no formulário aberto e são limpos ao fechá-lo; somente a sacola e os favoritos usam armazenamento local. O botão final abre o WhatsApp com a mensagem preenchida, mas o cliente ainda precisa enviá-la. Nenhum pedido é registrado automaticamente no servidor.

### Sequência visual do cachorro e do gato

O hero usa `public/videos/hero-patinhas-ordered-v3.mp4`: 12 segundos, 30 fps e 360 frames em ordem. A origem são seis fotografias de poses, não um clipe contínuo. As etapas são repouso, virada, aproximação, lambida, reação, afastamento e retorno. Transições curtas com suavização substituem o optical flow que deformava os rostos. Cenário, piso, corpos e patas permanecem na fotografia de referência; somente a região das cabeças recebe as transições. Início e fim usam a mesma pose para a emenda do loop.

Para reconstruir: `node scripts/build-hero-video.mjs <caminho-do-ffmpeg>`. O script registra a fase e o tempo de cada frame em `.sites-runtime/hero-ordered-*/frame-order.json`. Verifique todos os frames decodificados com `node scripts/check-hero-video.mjs <ffmpeg> public/videos/hero-patinhas-ordered-v3.mp4 <frame-order.json>`. Movimento anatômico verdadeiramente contínuo exige substituir as fotografias por um vídeo original; mais frames codificados não inventam esses movimentos.

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

Para regenerar a edição estática após alterar o catálogo ou o visual:

```sh
npm run build:pages
```

O build estático copia as imagens públicas necessárias para `docs/images/` e gera `docs/index.html`. O GitHub Pages não deve ser ativado para esta loja: [as regras do serviço não permitem hospedá-lo como site de e-commerce ou negócio online](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits). Para colocar a loja no ar, use uma hospedagem comercial compatível com a aplicação e seu backend.

## Configuração de produção

A aplicação completa precisa de um ambiente de servidor compatível com Cloudflare Workers e um banco D1 configurado. As credenciais de pagamento do Mercado Pago e o endereço do webhook devem ser configurados como segredos do ambiente, nunca em arquivos versionados. Antes de aceitar pedidos reais, valide pagamento, estoque, frete, política de privacidade e dados comerciais com a equipe da loja.

Contato público da loja: [Instagram](https://instagram.com/patinhas_petcenter) · [WhatsApp](https://wa.me/5535988427974).
