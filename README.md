# Rei das Pizzas

Site estático em React, Vite, TypeScript e Tailwind CSS. Sem backend, banco de dados, cadastro ou pagamento integrado.

## Executar com Docker

Com o Docker Desktop funcionando com contêineres Linux:

```sh
docker compose up --build -d
```

Abra http://localhost:8080. O Compose publica somente em 127.0.0.1.
Para encerrar: `docker compose down`.

O Dockerfile compila o site com Node 22 e serve o resultado com Nginx. Não há servidor de aplicação ou API; o Nginx apenas entrega arquivos estáticos.

Se docker não estiver no PATH deste computador, no PowerShell:

```powershell
& "$env:LOCALAPPDATA\Programs\DockerDesktop\resources\bin\docker.exe" compose up --build -d
```

## Executar sem Docker para desenvolvimento

Requer Node.js 22.12+ ou Node 24 LTS.

```sh
npm ci
npm run dev
```

Abra a URL informada pelo Vite (normalmente http://localhost:5173).

## Build de produção

```sh
npm run build
npm run preview
```

Os arquivos de publicação ficam em `dist/`. Em hospedagem estática, configure o comando `npm run build` e a pasta de saída `dist`. O funcionamento básico não requer serviço pago.

## Testes

```sh
npm test
npx playwright install chromium
npm run test:e2e
```

Os testes verificam contagens e categorias, preços de todos os Xis, preços pendentes, limites de sabores, calzones, codificação da mensagem de WhatsApp, busca, carrinho e responsividade em 320, 375, 390, 414, 768, 1366 e 1920 px.

## Estrutura e manutenção

A organização de pastas e as responsabilidades estão descritas em [docs/architecture.md](docs/architecture.md).

- `src/App.tsx`: composição da página e abertura dos modais.
- `src/components/`: componentes separados por área — layout, home, menu, product, cart e ui.
- `src/hooks/`: estado do carrinho, montagem e avisos.
- `src/data/catalog/`: produtos, ingredientes, categorias e tamanhos.
- `src/data/confirmed-prices.ts`: preços de pizzas e bordas.
- `src/utils/`: cálculos, busca, formatação e integração com WhatsApp.
- `src/styles/`: estilos globais e da abertura.
- `tests/`: testes de dados e navegador.

Use `npm run format` para formatar, `npm run format:check` para verificar o padrão e `npm run typecheck` para validar os tipos.

## Funcionamento do pedido

1. O cliente escolhe o produto.
2. Define tamanho/versão, sabores permitidos e quantidade. Para pizzas pode escolher uma borda.
3. Pode incluir uma observação por item e adicionar ao pedido. O botão Editar reabre tamanho, sabores, borda, quantidade e observação; salvar substitui apenas aquele item. Bebidas são editadas separadamente.
4. Informa rua, número (ou S/N), bairro e cidade. Complemento, referência, nome e observação geral são opcionais. Escolhe pagamento e, em dinheiro, pode indicar o valor para troco, que deve ser igual ou maior que o total.
5. Revisa itens, endereço e pagamento. O botão Finalizar pelo WhatsApp abre uma nova aba para o destino configurado em `business.orderWhatsapp`, com a mensagem organizada e codificada.
6. O cliente envia a mensagem no WhatsApp e combina os detalhes com a pizzaria.

O site não envia mensagens automaticamente, não confirma pedidos e não processa pagamentos. Abrir o link mantém o carrinho. Carrinho e dados pessoais existem somente na memória da página; recarregar a página apaga esses dados.

A edição de um item preserva os dados já preenchidos no carrinho; cancelar descarta apenas as mudanças daquela edição. Fechar o carrinho reinicia os campos de atendimento ao reabri-lo. A taxa continua sendo R$ 10 por pedido; área atendida e prazo são confirmados pela pizzaria.

Preços confirmados: tradicionais e doces tradicionais 40/50/60/70; Premium e doces Premium 50/60/70/80, na ordem Broto/Média/Grande/Família. Sabores mistos cobram o maior valor escolhido para o tamanho, sem média nem soma de sabores. Todas as oito bordas recheadas custam 6/8/10/15, adicionadas uma única vez por pizza; sem borda não há adicional. Xis Salada Regular custa R$ 28,00 e Calota R$ 68,00. Calzones mantêm R$ 50,00 e R$ 60,00. Fonte central: src/data/confirmed-prices.ts.

Os 80 sabores de pizza estão disponíveis também para calzones. Limites: Broto 1, Média 2, Grande 3, Família 4; calzones até 2. Ao reduzir o tamanho, a interface informa que mantém os primeiros sabores selecionados.

## Análise dos materiais

A pasta estava vazia no início. Posteriormente ficaram disponíveis três JPEGs oficiais de 501 × 501 pixels: dourada em fundo preto, circular branca em fundo preto e circular preta em fundo branco. Foram inspecionados e copiados integralmente para public. As imagens repetidas na conversa correspondem a essas versões. Não contêm preços nem ingredientes e não apresentam conflito com o briefing.

Nenhuma foto de produto foi fornecida. Os cards não usam fotografias e a decoração da abertura é tipográfica, feita em CSS. Nenhuma imagem foi gerada por IA.

Conteúdo atualizado: 33 tradicionais, 28 Premium, 12 doces tradicionais, 7 doces Premium, 80 opções de calzone, 8 bordas, 16 Xis e 9 bebidas. Calabresa com Catupiry e Frango e cheddar foram acrescentados a partir da nova tabela. As descrições anteriores foram preservadas; erros de digitação do texto colado não substituíram ingredientes confirmados. O Xis Alcatra mantém exatamente os ingredientes fornecidos, sem inserir pão por suposição.

## Pendências para confirmação

2. Descrições de Carne acebolada, Carne com bacon, Carne com requeijão cremoso e Carne com cheddar.
3. Endereço.
4. Horários de funcionamento.
5. Demais regras de entrega (área atendida e detalhes): ainda não informadas. Taxa padrão confirmada: R$ 10 por pedido.
6. Confirmação operacional de pagamento: Pix, cartão e dinheiro já aparecem como preferências do cliente.
   Carne com requeijão cremoso já tem os preços Premium confirmados pela tabela por categoria e permanece separado de Carne e Catupiry.

As logos oficiais já foram recebidas e integradas; não há pendência impeditiva de marca. Um arquivo com maior resolução pode ser incorporado posteriormente, preservando a identidade.

## Publicação e SEO

Title, description, Open Graph, favicon com arquivo oficial, HTML semântico e idioma pt-BR configurados. Quando houver domínio público, substituir o caminho relativo de `og:image` por uma URL absoluta desse domínio e acrescentar `og:url` e canonical. Não foi inventado um domínio.

## Limitação do ambiente local

O Docker Desktop foi encontrado em instalação por usuário, fora do PATH. A primeira tentativa de acesso ao mecanismo retornou “Docker Desktop is unable to start”. O log indicou “Virtual Machine Platform not enabled”, e o WSL retornou `Wsl/CallMsi/Install/REGDB_E_CLASSNOTREG`. O pacote oficial do WSL foi instalado com sucesso (código 0) e a Plataforma de Máquina Virtual foi ativada com sucesso, pendente de reinicialização (código 3010). A tentativa de `docker compose up --build -d` antes de reiniciar ainda retornou “Docker Desktop is unable to start”. Salve seu trabalho, reinicie o Windows, abra o Docker Desktop e execute o Compose novamente. A imagem Docker ainda não pôde ser construída nem testada neste ambiente; somente a sintaxe do Compose foi validada. Não houve reinicialização automática.

Referências oficiais:

- https://docs.docker.com/desktop/setup/install/windows-install/
- https://learn.microsoft.com/windows/wsl/install
- https://learn.microsoft.com/windows/wsl/troubleshooting

## Resultado da validação

- Build de produção gerado com sucesso.
- 11 testes de dados/preços e 17 testes de navegador aprovados.
- Verificação de overflow horizontal e montagem em todas as sete larguras solicitadas.
- Hash SHA-256 das três logos copiadas idêntico ao dos arquivos originais.
- Prévia estática local iniciada em http://localhost:5173, com resposta HTTP 200; ela precisará ser iniciada novamente após reiniciar o computador.
- A mensagem e a URL do WhatsApp foram verificadas sem enviar pedidos reais.

As imagens recebidas foram organizadas em assets/originais; as cópias utilizadas pelo site ficam em public/brand. O favicon usa a logo circular oficial em fundo preto, sem redesenho.
Animações com Motion foram adicionadas aos cards, à abertura, aos tamanhos, ao contador e aos modais, respeitando a preferência de movimento reduzido. A marca recebeu moldura circular sem alteração do arquivo oficial. A revisão permite indicar Pix, cartão ou dinheiro como preferência a confirmar no atendimento; a escolha acompanha a mensagem. Bebidas e seis bordas foram confirmadas pelas capturas posteriores.
Atualização: confirmado o destino temporário de pedidos +55 55 93505-2865 em business.orderWhatsapp. Somente a finalização do carrinho usa esse destino; links de contato mantêm o WhatsApp oficial. O Anota AI indicado para consulta de preços bloqueou o navegador automatizado, por isso os preços foram transcritos das capturas e do texto posteriormente fornecidos pelo responsável.

## Preços confirmados nas capturas

Bebidas: Coca-Cola e Zero lata R$ 6 (volume da lata não informado); Coca-Cola e Zero 600 ml R$ 8; Coca-Cola, Zero, Fanta laranja e Sprite 2 L R$ 15; Charrua 2 L R$ 13. Nenhum sabor específico foi atribuído à Charrua.

Bordas (Broto / Média / Grande / Família): todos os oito sabores custam R$ 6 / R$ 8 / R$ 10 / R$ 15.

A montagem permite incluir bebidas como itens separados. Quantidades de bebidas são independentes da quantidade do produto principal. O preço da borda é somado por pizza, sem duplicação no total. Se um componente não tiver preço conhecido, o total permanece a confirmar.

Bordas são exibidas no cardápio com os preços por tamanho, mas só podem ser adicionadas durante a montagem de uma pizza. Para revisar e enviar o pedido, o cliente escolhe Pix, cartão ou dinheiro; não existe mais a opção “Combinar no WhatsApp”.

O aviso dinâmico “loja fechada, abre amanhã às 18h30” nas capturas não foi convertido em horário permanente do estabelecimento.

Carne e Catupiry permanece como sabor separado, com composição de carne e Catupiry e preços Premium 50/60/70/80. Exemplo: Família Calabresa + Americana = 80; com borda Chocolate preto = 95; com Charrua 2 L = 108, antes da entrega.

## Entrega fixa confirmada

Taxa de R$ 10 por pedido em business.deliveryFee. O carrinho, a barra mobile e o WhatsApp usam o mesmo total: subtotal dos produtos + uma única taxa. O modal mostra o valor dos itens sendo adicionados e informa que a entrega entra no carrinho. Preços pendentes continuam impedindo a exibição de um total falso. O carrinho vazio não cobra entrega.

Exemplo final: Família Calabresa + Americana 80 + borda Chocolate preto 15 + Charrua 2 L 13 + entrega 10 = R$ 118,00.

## Abertura interativa

A logo oficial é exibida sem redesenho em um quadro maior no cabeçalho. A abertura apresenta uma vitrine navegável com categorias e produtos existentes em src/data/menu.ts. As setas e abas permitem alternar entre Tradicionais, Premium, Doces e Xis; Montar pedido abre o seletor do produto e Ver categoria leva ao cardápio correspondente. Animações de brasas, brilho e transições são desativadas ou reduzidas conforme prefers-reduced-motion. Nenhuma fotografia de produto foi criada.
