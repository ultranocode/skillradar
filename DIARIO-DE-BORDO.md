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
