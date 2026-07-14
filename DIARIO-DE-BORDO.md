# 📔 Diário de Bordo — SkillRadar

Guia didático, passo a passo, de como o projeto foi construído.
Serve para **revisão** e para **aprender**: cada etapa traz o *objetivo*, *o que foi feito*,
os *comandos* usados (com explicação), os *conceitos* envolvidos e *dicas*.

> Leia de cima para baixo. Cada "Etapa" corresponde a um cartão do Trello / uma branch.

---

## Etapa 0 — Planejamento

**Objetivo:** entender o desafio antes de escrever código.

**O que foi feito:**
- Li o PDF do projeto avaliativo e o mini-projeto SkillMatch JS (o motor de console).
- Identifiquei a **inversão de lógica**: no mini eu escolhia 1 vaga e via vários candidatos;
  no projeto novo, eu (usuário) preencho 1 perfil e vejo várias vagas com meu %.
- Criei o `PLANEJAMENTO.md` (arquitetura, branches, mapa de requisitos, ordem de execução).
- Montei o quadro no Trello (4 listas + cartões, um por feature).

**Conceito-chave:** separar **dados × regras × tela** (ideia da Semana 12). No código isso vira
três módulos: `dados.js`, `motor.js`, `ui.js`, coordenados pelo `main.js`.

**Dica para o vídeo:** a pergunta "como você organizou as tarefas?" se responde mostrando o Trello.

---

## Etapa 1 — Setup (estrutura + Git)

**Objetivo:** preparar o terreno — pastas certas e o fluxo de versionamento.

### O que foi feito

1. Criei a estrutura de pastas exatamente como o PDF pede:
   ```
   index.html
   assets/styles/index.style.css
   assets/scripts/{main,motor,ui,dados}.js
   assets/dados/        (vagas.json vem na Etapa 3)
   assets/img/logo.svg
   ```
2. Cada `.js` começou com um comentário explicando seu papel (deixa o projeto legível).
3. Configurei o Git com o fluxo `main → develop → feature/*`.

### Comandos usados (e o que cada um faz)

```bash
# Inicia um repositório Git já com a branch principal chamada "main"
git init -b main

# Prepara (adiciona à "área de stage") os arquivos que vão no próximo commit
git add README.md .gitignore PLANEJAMENTO.md

# Grava o commit com uma mensagem no imperativo ("adiciona ..." e não "adicionado ...")
git commit -m "adiciona documentacao inicial e gitignore"

# Cria a branch develop (a partir de onde estamos, a main)
git branch develop

# Troca para a develop
git checkout develop

# Cria a feature branch E já troca para ela (-b = "branch nova")
git checkout -b feature/estrutura-inicial

# Adiciona a estrutura e faz o commit dela nessa feature
git add index.html assets/
git commit -m "cria estrutura de pastas e arquivos base do projeto"

# Volta para develop e traz o trabalho da feature para dentro dela.
# --no-ff força um "commit de merge", preservando o galho no histórico.
git checkout develop
git merge --no-ff feature/estrutura-inicial -m "merge feature/estrutura-inicial em develop"

# Visualiza o histórico em forma de árvore, com todas as branches
git log --oneline --graph --all
```

### Conceitos envolvidos

- **`.gitignore`**: lista do que o Git deve *ignorar* (ex.: `node_modules/`, arquivos do SO).
- **Branch**: uma "linha do tempo" paralela do código. `main` = oficial, `develop` = integração,
  `feature/*` = uma tarefa isolada.
- **`--no-ff` (no fast-forward)**: sem ele, o Git às vezes "junta" a feature sem deixar marca.
  Com ele, fica registrado que existiu uma branch — ótimo para contar a história no vídeo.
- **Commit no imperativo**: "implementa X", "corrige Y" (padrão pedido no PDF).

### Como testar

Abrir o `index.html` no **Live Server** e conferir no console do navegador (F12) a mensagem
`SkillRadar: setup inicial carregado com sucesso ✅` — prova que o módulo ES está carregando.

### Dica

Os avisos `LF will be replaced by CRLF` são normais no Windows (só a forma de quebrar linha).
Não são erros.

---

## Etapa 2 — Motor de compatibilidade (`motor.js`)

**Objetivo:** trazer o "cérebro" do mini-projeto (que rodava no console) para o app,
**invertendo a lógica**: no mini eu escolhia 1 vaga e via N candidatos; aqui eu (1 candidato)
preencho meu perfil e vejo N vagas, cada uma com meu % de compatibilidade.

### O que foi feito

1. Criei a branch `feature/motor` a partir de `develop` e movi o cartão 2 no Trello para
   **🔨 Em Andamento**.
2. Preenchi o `assets/scripts/motor.js` (módulo ES, tudo com `export`, sem tocar em DOM/fetch).
3. Testei o módulo no Node antes de seguir e conferi a saída (ranking, melhor vaga, recomendação,
   closure e callback funcionando).

### A ideia central (o que responder no vídeo)

- **A função que compara não mudou.** `calcularCompatibilidade(candidato, vaga)` compara UM perfil
  com UMA vaga e devolve `{ percentual, habilidadesEncontradas, habilidadesFaltantes }`. Ela é a
  mesma do mini — reaproveitamento puro.
- **A inversão foi trocar sobre o que eu itero.** Onde o mini fazia `candidatos.map(...)` para uma
  vaga fixa, o `analisarVagas(candidato, vagas)` faz `vagas.map(...)` para um perfil fixo. Só isso.

### O que cada parte faz (e qual RF cumpre)

| Trecho | Papel | RF |
|---|---|---|
| `class Vaga` (com `this` e `exibirResumo()`) | dados + comportamento da vaga | RF07 |
| `class VagaFrontEnd extends Vaga` (+ `nivel`, `exibirNivel()`) | herança com propósito | RF07 |
| `criarVagas(listaCrua)` | fábrica: JSON "cru" → instâncias de classe (`map`) | RF06/07 |
| `calcularCompatibilidade` | % + encontradas × faltantes (`map`, `filter`) | RF03/06 |
| `classificarPercentual` | Alta (≥80) / Média (≥50) / Baixa | RF04 |
| `analisarVagas` | 1 candidato × N vagas, ordenado (`map`, `every`, `sort`) | RF03/04/06 |
| `encontrarMelhorVaga` | a de maior % (`reduce`) | RF05/06 |
| `gerarRecomendacao` | junta as faltantes de todas as vagas, sem repetir (`reduce` + `Set`) | RF05 |
| `finalizarAnalise(dados, callback)` | recebe e executa uma função | RF08 (callback) |
| `criarContadorDeAnalises()` | contador que "lembra" o total entre chamadas | RF08 (closure) |

### Conceitos envolvidos

- **Módulo ES puro**: `motor.js` só exporta lógica. Não sabe o que é botão, `<div>` ou `fetch`.
  Isso é a separação **dados × regras × tela** (Semana 12) — facilita testar e explicar.
- **`map` × `filter` × `every` × `reduce`**: `map` transforma cada item; `filter` seleciona alguns;
  `every` responde um sim/não sobre TODOS; `reduce` "espreme" a lista num único resultado
  (a melhor vaga, ou o array de todas as faltantes).
- **Fábrica de objetos**: JSON não guarda classes; `criarVagas` converte cada registro em
  `new VagaFrontEnd(...)`, por isso a POO tem uso real (os cards chamam `exibirResumo()`).
- **Closure**: a função devolvida por `criarContadorDeAnalises` continua enxergando a variável
  `total` mesmo depois da função-mãe terminar — por isso o número cresce em vez de resetar.
- **Callback**: `finalizarAnalise` não decide o que mostrar; ela recebe *de fora* a função a chamar.

### Como testar

Como `motor.js` é um módulo (`export`), testei fora da tela rodando um script no **Node**:
carreguei o módulo com `import`, passei um perfil de exemplo e um array de vagas "cruas"
(como virão do JSON), e imprimi o ranking. Saída confirmada:

```
100% [Alta] Front-End Júnior na PixelTech ...   (atendeTudo: true)
 75% [Média] Estágio Front-End na CodeFactory ...(falta: kanban)
 ...
⭐ Melhor vaga: PixelTech    📚 Priorize estudar: react, responsividade, ...
Análise nº 1 | nº 2 | nº 3   ✅ Callback: sua melhor chance é PixelTech (100%).
```

> Quando a tela existir (Etapa 6), esse mesmo motor será chamado pelo `main.js` — sem mudar
> nenhuma linha daqui. É o sinal de que a separação de responsabilidades ficou correta.

### Dica

As habilidades aparecem em minúsculas (`html`, `git`) porque são **normalizadas** para a
comparação não falhar por causa de maiúscula/espaço. Mostrar bonito (com a grafia original)
é decisão de *apresentação* — fica para a Etapa 6, não é problema do motor.

### Passo a passo: como rodar o teste do motor (com Node)

O `motor.js` é um **módulo ES** (usa `export`), então não dá pra abrir sozinho no navegador —
ele precisa ser importado por alguém. Para testar só a lógica, sem depender da tela, criei um
script em `testes/teste-motor.mjs` que **importa** o motor, passa um perfil e um array de vagas
de exemplo, e imprime o resultado no terminal.

> A pasta `testes/` está no `.gitignore` **de propósito**: é bancada de estudo, não faz parte
> da entrega (não vai para o repositório).

**Como executar:**

1. No VS Code, abrir o terminal: menu **Terminal → New Terminal** (ou `Ctrl + '`). Ele já abre
   dentro da pasta do projeto.
2. Digitar o comando e apertar Enter:
   ```powershell
   node testes/teste-motor.mjs
   ```

**O que cada parte do comando significa:**

- **`node`** — programa que executa JavaScript **fora do navegador**, direto no PC. Roda JS como
  o navegador roda, mas sem tela — ideal para testar só a *lógica* (o motor).
- **`testes/teste-motor.mjs`** — o caminho do arquivo, a partir de onde o terminal está (a raiz
  do projeto). Por isso o caminho curto basta.
- **`.mjs`** — extensão que avisa o Node "isto é um **módulo ES**", ou seja, que pode usar
  `import`/`export`. (Um `.js` comum, no Node, por padrão não entende `import`.)

**Como saber se "passou":** não é um teste automático com ✅/❌ — é um teste **visual**. Lê-se a
saída e confere-se se ela bate com a lógica esperada:

- PixelTech dá **100%** porque o perfil tem exatamente os 4 requisitos dela → `atendeTudo: true`.
- NovaWeb dá **25%** porque das 4 exigências o perfil só cobre "JavaScript".
- O contador imprime **1 → 2 → 3** (a *closure* "lembrou" o total entre as chamadas).

**Dica para aprender de verdade:** abrir `testes/teste-motor.mjs`, mudar as `habilidades` do
`meuPerfil` (ex.: acrescentar `"React"`), salvar e rodar de novo. Os percentuais mudam na hora —
é a melhor forma de sentir o motor reagindo aos dados de entrada.

---

## Etapa 3 — Dados e persistência (`vagas.json` + `dados.js`)

**Objetivo:** dar ao app uma **fonte de vagas** (buscada de fora, como num sistema real) e uma
**memória do perfil** (que sobrevive ao recarregar a página). É a camada que *entrega* e *guarda*
dados — sem conhecer as regras nem a tela.

### O que foi feito

1. Criei a branch `feature/dados` a partir de `develop` e movi o cartão 3 no Trello para
   **🔨 Em Andamento**.
2. Criei `assets/dados/vagas.json` com **6 vagas** (o mínimo é 4) de front-end, com requisitos
   variados de propósito (de 3 a 8 exigências) para gerar percentuais diferentes.
3. Preenchi `assets/scripts/dados.js` com duas responsabilidades: `carregarVagas()` (fetch) e as
   funções de perfil no `localStorage`.
4. Testei a lógica no Node antes de seguir (simulando `fetch` e `localStorage`), cobrindo os 3
   cenários do fetch e o ciclo salvar/ler/limpar do perfil.

### A ideia central (o que responder no vídeo)

- **`vagas.json` é só dado, sem lógica.** Ele existe fora do código para simular uma API: amanhã as
  vagas poderiam vir de um servidor e nada no resto do app mudaria. Os campos batem exatamente com a
  fábrica `criarVagas` do motor (`id, empresa, cargo, requisitos, salario, modalidade, nivel`).
- **`salario` é número, não texto** (`4200`, não `"R$ 4.200"`), porque o motor **ordena** as vagas
  por salário no desempate (`b.vaga.salario - a.vaga.salario`) — e não se subtrai texto.
- **`dados.js` não desenha nada.** Ele só *sinaliza* o que aconteceu; quem mostra "carregando/
  vazio/erro" na tela é o `main.js` (Etapa 6). Essa é a separação **dados × regras × tela**.

### Os 3 estados do fetch — de onde cada um nasce (RF13)

| Estado | Quem dispara | Como |
|---|---|---|
| ⏳ Carregando | `main.js` (antes de chamar) | mostra a mensagem *antes* do `await` |
| 📭 Vazio | `dados.js` devolve `[]` | o `main` vê `vagas.length === 0` |
| ❌ Erro | `dados.js` faz `throw` | cai no `catch` do `main`, que mostra o erro (com `aria-live`) |

### O que cada parte faz (e qual RF cumpre)

| Trecho | Papel | RF |
|---|---|---|
| `vagas.json` (6 vagas) | catálogo consumido via `fetch` | RF02 |
| `carregarVagas()` | `fetch` + `async/await` + `try/catch` + `response.ok` | RF13 |
| `salvarPerfil(perfil)` | objeto → texto (`JSON.stringify`) → `setItem` | RF14 |
| `carregarPerfil()` | `getItem` → trata `null` → `JSON.parse` | RF14 |
| `limparPerfil()` | `removeItem` (para um botão "recomeçar") | RF14 |

### Conceitos envolvidos

- **`async`/`await`**: `async` faz a função devolver uma *Promise*; `await` **pausa** naquela linha
  até a resposta chegar, **sem congelar** a página. É o jeito moderno (e legível) de esperar.
- **`response.ok` + `throw`**: um `fetch` com erro **HTTP** (404, 500) **não** cai sozinho no
  `catch` — a Promise "deu certo", só trouxe um status ruim. Por isso checamos `response.ok` na mão
  e lançamos o erro nós mesmos.
- **`try/catch`**: envolve o que pode falhar (rede caiu, JSON quebrado). O `catch` centraliza o
  tratamento; aqui ele loga e **re-lança** para o `main` decidir o que a pessoa vê.
- **`localStorage` só guarda texto**: por isso o par `JSON.stringify` (ao salvar) e `JSON.parse`
  (ao ler). Sem isso, um objeto viraria a string inútil `"[object Object]"`.
- **Tratar `null`**: `getItem` devolve `null` quando a chave nunca existiu (primeira visita).
  Checar isso explicitamente evita bugs silenciosos mais tarde.

### Como testar

**Rápido, no Node (só a lógica):** simulei `fetch` e `localStorage` num script de bancada e conferi
a saída — os 6 valores esperados bateram:

```
=== RF13: carregarVagas ===
  sucesso → 6 vagas (esperado 6)
  vazio   → 0 vagas (esperado 0)
  erro    → throw capturado OK: Falha ao carregar vagas (HTTP 404).
=== RF14: localStorage do perfil ===
  1a leitura (nada salvo) → null (esperado null)
  apos salvar             → {"nome":"Diego","habilidades":["HTML","CSS","JavaScript"]}
  apos limpar             → null (esperado null)
```

**De verdade, no navegador (dá para testar já):** como a tela ainda não existe (Etapa 6), o teste
é pelo **Console** do navegador (F12), importando o módulo na mão.

1. Abrir o `index.html` pelo **Live Server** (botão direito no arquivo → *Open with Live Server*).
   ⚠️ Não abrir por duplo-clique (`file://`) — o `fetch` é bloqueado por segurança do navegador.
2. Abrir o Console (F12 → aba *Console*) e colar, um bloco por vez:

**Buscar as vagas (RF13):**
```js
const dados = await import('./assets/scripts/dados.js');
const vagas = await dados.carregarVagas();
console.table(vagas);   // deve mostrar as 6 vagas numa tabela
```

**Perfil no localStorage (RF14):**
```js
dados.carregarPerfil();                     // null (nada salvo ainda)
dados.salvarPerfil({ nome: 'Diego', habilidades: ['HTML','CSS','JavaScript'] });
dados.carregarPerfil();                     // volta o objeto salvo
localStorage.getItem('skillradar:perfil');  // o texto cru guardado
dados.limparPerfil();
dados.carregarPerfil();                     // null de novo
```

**Ver o estado de erro (o `throw`):** trocar o `CAMINHO_VAGAS` no topo do `dados.js` por um arquivo
que não existe, salvar e rodar `carregarVagas()` de novo → cai no `catch` e lança o erro.
Lembrar de **desfazer** depois.

> Detalhe: `console.table(vagas)` mostra os objetos **crus** (sem os métodos `exibirResumo`/
> `exibirNivel`). É esperado — quem transforma cada registro em instância de classe é o `criarVagas`
> do motor, ligado na Etapa 6.

### Dica

Se abrir a página por duplo-clique (`file://`) o `fetch` falha com erro de CORS — **não é bug do
código**, é segurança do navegador. Sempre usar **Live Server** (ou outro servidor local). Esse é,
inclusive, um ótimo candidato a "bug caçado com `debugger`" do RF16 (Etapa 8).

---

## Etapa 4 — HTML semântico + SEO + acessibilidade (`index.html`)

**Branch:** `feature/html-semantico` · **Cartão 4** · **RF09 + SEO + RF15**

Montei o **esqueleto semântico** da página: os *landmarks*, o formulário de perfil completo e os
"buracos" vazios onde o JavaScript vai injetar as vagas nas próximas etapas. **Nenhuma lógica ainda**
— validação do form é a Etapa 5, e o render dos cards é a Etapa 6. Aqui é só a estrutura acessível.

### O que cada parte faz (e qual RF cumpre)

| Trecho | Papel | RF |
|---|---|---|
| `lang="pt-BR"` | idioma da página (voz do leitor de tela + SEO) | RF09 |
| `<title>` + `<meta name="description">` | SEO on-page (aba + resultado do Google) | RF09/SEO |
| `.skip-link` | pular o cabeçalho e ir ao conteúdo pelo teclado | RF09 |
| `<header>` / `<main>` / `<footer>` | *landmarks* (regiões de navegação) | RF09 |
| **um único** `<h1>` | topo da hierarquia de títulos | RF09 |
| `<img … alt="SkillRadar">` | texto alternativo da logo | RF09 |
| `<label for>` + `id` em cada campo | rótulo acessível ligado ao input | RF09 |
| `<fieldset>` + `<legend>` | agrupa os checkboxes de habilidades | RF09 |
| `aria-labelledby` nas `<section>` | nomeia cada região pelo `<h2>` | RF09 |
| `#status` com `role="status"` + `aria-live="polite"` | anúncio dos 3 estados (carregando/vazio/erro) | RF13 |
| `<ul id="lista-vagas">` (vazio) | destino do render dinâmico dos cards | RF11 (Etapa 6) |
| `<script type="module">` | ponto de entrada dos módulos ES | RF15 |

### Conceitos envolvidos

- **HTML semântico**: usar a tag que *significa* a coisa (`header`, `main`, `footer`, `section`,
  `ul`, `fieldset`) em vez de `div` para tudo. O navegador e as tecnologias assistivas entendem a
  estrutura de graça.
- **Landmarks**: `header`/`main`/`footer` viram "regiões de referência" que um leitor de tela lista
  para o usuário saltar entre elas — como um índice invisível.
- **`label`/`for` ↔ `id`**: o par mais importante de um formulário acessível. Clicar no rótulo foca o
  campo, e o leitor de tela lê o rótulo junto do input.
- **`fieldset` + `legend`**: o jeito semântico de agrupar campos relacionados (os checkboxes de
  habilidades). A legenda é anunciada antes de cada opção.
- **`aria-live="polite"`**: faz o leitor de tela **anunciar** mudanças de texto naquela região sem o
  usuário procurar. É o que torna os 3 estados do `fetch` (Etapa 3) realmente acessíveis.
- **Foco visível**: mantivemos o `outline` padrão (não removemos!) e reforçamos com `:focus-visible`
  no CSS — aparece só na navegação por teclado.
- **`<script type="module">`**: além de habilitar `import`/`export`, já roda em *strict mode* e é
  adiado (`defer`) por padrão — executa depois do HTML carregar.

> **Decisão:** os checkboxes de habilidades trazem a união das skills que aparecem no `vagas.json`
> (HTML, CSS, JavaScript, Git, React, TypeScript, Node, Testes, Figma, Acessibilidade). Assim os
> `value` batem com o que o `motor.js` compara, sem depender de digitação.

### Como testar (no navegador — copiar e colar)

Como ainda **não há CSS visual** (Etapa 7) nem JS de tela (Etapas 5–6), o teste aqui é de
**estrutura e acessibilidade**. Dá para fazer tudo agora.

**1. Abrir com Live Server** (botão direito no `index.html` → *Open with Live Server*).
Deve aparecer: a logo, o título **SkillRadar**, o formulário (Nome, Área, as 10 habilidades, Meses,
botão **Analisar vagas**) e o rodapé. A área "Vagas para você" fica vazia — é o esperado.

**2. Teste de teclado (acessibilidade real):**
- Clique na barra de endereço e aperte **Tab** uma vez: deve surgir o link **"Pular para o
  conteúdo"** no canto (o *skip link*). Aperte **Enter** → o foco pula para a seção de conteúdo.
- Continue apertando **Tab**: cada campo deve receber uma **borda azul de foco** visível, na ordem
  natural (Nome → Área → checkboxes → Meses → botão).

**3. Checagem automática — cole no Console (F12 → Console), um bloco por vez.**
Cada bloco **se autoverifica** e imprime ✅ ou ❌:

**Um único `<h1>` e landmarks presentes (RF09):**
```js
const h1 = document.querySelectorAll('h1').length;
console.log(h1 === 1 ? '✅ exatamente 1 <h1>' : `❌ tem ${h1} <h1> (esperado 1)`);
['header','main','footer'].forEach(tag =>
  console.log(document.querySelector(tag) ? `✅ <${tag}> presente` : `❌ falta <${tag}>`)
);
```

**Todo input/select tem rótulo associado (RF09):**
```js
const semRotulo = [...document.querySelectorAll('input, select')].filter(campo => {
  const temLabel = campo.id && document.querySelector(`label[for="${campo.id}"]`);
  return !temLabel;
});
console.log(semRotulo.length === 0
  ? '✅ todos os campos têm <label for>'
  : '❌ sem rótulo:', semRotulo);
```

**Imagem com `alt`, idioma e região de status (RF09/RF13):**
```js
const img = document.querySelector('img');
console.log(img && img.alt ? `✅ <img> com alt="${img.alt}"` : '❌ <img> sem alt');
console.log(document.documentElement.lang === 'pt-BR' ? '✅ lang="pt-BR"' : '❌ lang errado');
const status = document.querySelector('#status[aria-live]');
console.log(status ? '✅ região aria-live pronta p/ os 3 estados' : '❌ falta #status aria-live');
```

**Módulo ES carregou (RF15):** no Console deve aparecer, sozinho ao abrir a página:
```
SkillRadar: setup inicial carregado com sucesso ✅
```
(é o `console.log` do `main.js`, provando que o `<script type="module">` executou).

**4. Acessibilidade rápida (opcional, prévia da Etapa 8):** F12 → aba **Lighthouse** → marcar só
**Accessibility** e **SEO** → *Analyze*. A estrutura já deve pontuar alto; a auditoria completa
(com o app pronto) fica para o cartão 8.

### Pendências assumidas

- **Visual/layout** (cores, espaçamento, cards bonitos): Etapa 7 (CSS mobile-first). Por ora a página
  fica "crua" de propósito.
- O `#status`, o `#destaque` e o `#lista-vagas` começam **vazios**: quem os preenche é o JS das
  Etapas 5–6.

---

## Apêndice — Configuração do MCP do Trello (ferramenta de apoio)

> Isto NÃO faz parte do código do SkillRadar — é só a integração que permite montar o
> quadro do Trello automaticamente pelo Claude Code. Fica registrado porque deu trabalho no Windows.

**Servidor usado:** `@delorenj/mcp-server-trello` (npm).

**Credenciais (da sua conta Trello):**
- `TRELLO_API_KEY` — gerada em https://trello.com/power-ups/admin (criar um Power-Up).
- `TRELLO_TOKEN` — gerado autorizando o Power-Up (link "Token" / URL de authorize com `scope=read,write`).

**Armadilha do Windows:** rodar via `npx` fez o Claude Code dar `✘ Failed to connect`
(o `npx` é lento pra resolver o pacote no Windows e o health check estoura o tempo).

**Solução que funcionou:** instalar o pacote globalmente e apontar o MCP direto pro `node` + arquivo:

```powershell
# 1) instala globalmente
npm install -g "@delorenj/mcp-server-trello"

# 2) registra o MCP apontando direto pro build/index.js (rápido e estável)
claude mcp add trello --scope user `
  --env TRELLO_API_KEY=SUA_KEY `
  --env TRELLO_TOKEN=SEU_TOKEN `
  -- node "C:\Users\<usuario>\AppData\Roaming\npm\node_modules\@delorenj\mcp-server-trello\build\index.js"

# 3) confere a conexão
claude mcp list
```

**Detalhe:** depois de adicionar um MCP novo, é preciso **reiniciar o Claude Code** para que as
ferramentas dele fiquem disponíveis na sessão.

---

<!-- As próximas etapas serão adicionadas aqui conforme avançamos. -->
