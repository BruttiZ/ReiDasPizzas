# Organização do código

O site é uma aplicação React estática. O Nginx entrega o build; não há API nem banco de dados.

## Estrutura

```text
src/
  App.tsx                 Composição da página e abertura dos modais
  components/
    layout/               Cabeçalho, rodapé, contato e etapas do pedido
    home/                 Abertura e vitrine interativa
    menu/                 Cardápio, cards, preços e guia de tamanhos
    product/              Montagem: tamanho, sabores, borda e bebidas
    cart/                 Carrinho, itens, revisão e atalhos do pedido
    ui/                   Dialog, Quantity, Brand, ícones e avisos
  hooks/                  Estado do carrinho, montagem e avisos temporários
  data/
    catalog/              Produtos, categorias e tamanhos por arquivo
    menu.ts               Agregação e exportação do catálogo
    confirmed-prices.ts   Tabelas de pizzas e bordas
    config.ts             Marca, contatos e entrega
  types/                  Contratos de produto, tamanho e pedido
  utils/                  Funções de preço, totais, busca, formato e WhatsApp
  styles/                 Entrada dos estilos, base global e abertura
tests/
  menu.test.ts            Catálogo, preços, totais e mensagens
  e2e/site.spec.ts        Fluxo de pedido e layout no navegador
```

## Responsabilidades

`App.tsx` conecta as seções e controla qual modal está aberto. A categoria e a busca ficam nele porque a vitrine também pode navegar para o cardápio.

`useCart` mantém os itens e deriva quantidade e total. `useProductSelection` mantém a montagem, aplica o limite de sabores e cria os itens do pedido. A busca local de sabores pertence ao `FlavorSelector`. `useAnnouncement` controla a duração dos avisos.

Os seletores recebem valores e callbacks. Eles não calculam o total do pedido. `utils/pricing.ts` calcula a pizza e a borda; `utils/order.ts` calcula subtotal e entrega; `utils/format.ts` formata reais. `utils/whatsapp.ts` apenas monta mensagens e URLs usando essas funções.

`Cart` mantém o formulário de atendimento e o item em edição. Durante a edição, ele apresenta `ProductModal` com `initialItem`, preservando o formulário na memória. O hook de montagem restaura IDs de sabores, tamanho, borda, quantidade e observação. Salvar mantém o ID do item e o substitui; cancelar não altera o carrinho. Bebidas são itens independentes e não são adicionadas novamente na edição.

`DeliveryFields` apresenta o endereço. `utils/checkout.ts` verifica os campos essenciais e interpreta o valor para troco. A revisão exige rua, número, bairro, cidade e pagamento; dinheiro com troco exige um valor válido, igual ou maior que o total. A mensagem usa `CheckoutDetails` para endereço e troco, além das observações individuais dos itens. Não há confirmação automática do pedido ou cálculo de área atendida.

Os arquivos de dados não dependem de React nem de componentes. `data/menu.ts` é a entrada pública do catálogo; os arquivos em `data/catalog/` importam suas dependências diretamente, evitando ciclos com essa entrada.

O carrinho continua em memória. Fechar e reabrir o carrinho reinicia os campos de atendimento, como antes; recarregar a página limpa o pedido. Nenhuma persistência ou integração nova foi adicionada.

## Onde alterar

| Alteração                           | Arquivo ou pasta                        |
| ----------------------------------- | --------------------------------------- |
| Valores de pizza e borda            | `src/data/confirmed-prices.ts`          |
| Sabores e ingredientes              | `src/data/catalog/pizzas.ts`            |
| Xis e bebidas                       | `src/data/catalog/xis.ts` e `drinks.ts` |
| Tamanhos e limite de sabores        | `src/data/catalog/sizes.ts`             |
| Regra de cobrança de sabores mistos | `src/utils/pricing.ts`                  |
| Entrega e contatos                  | `src/data/config.ts`                    |
| Texto enviado ao WhatsApp           | `src/utils/whatsapp.ts`                 |
| Apresentação e interação            | Componente da respectiva área           |

## Formatação e validação

Prettier define aspas simples, indentação de dois espaços, ponto e vírgula e finais de linha LF. `.editorconfig` aplica as convenções nos editores compatíveis.

```sh
npm run format
npm run format:check
npm run typecheck
npm test
npm run build
npm run test:e2e
```

No PowerShell com execução de scripts desabilitada, use `npm.cmd` no lugar de `npm`.

Mantenha regras comerciais nas funções de cálculo e no catálogo. Componentes de interface devem consumir essas regras, sem duplicar preços. Ao extrair componentes, preserve os nomes acessíveis usados pelos clientes e pelos testes de navegador.
