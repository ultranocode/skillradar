# 📡 SkillRadar

> Informe suas habilidades e descubra o quanto você combina com cada vaga de front-end júnior.

**SkillRadar** é uma aplicação web (Single Page) em **HTML + CSS + JavaScript puro** — sem
frameworks. Ela evolui o motor de compatibilidade do mini-projeto **SkillMatch JS** (que rodava
no console) para um produto que qualquer pessoa abre no navegador: o usuário preenche o próprio
perfil e o app analisa **1 candidato × N vagas**, ranqueando da vaga mais compatível para a menos.

Projeto Avaliativo Final do **Módulo 01 — Front-End React (Turma T2)**.

## 🔗 Links

- **Repositório:** <https://github.com/ultranocode/skillradar>
- **Quadro Trello (público):** <https://trello.com/b/wWl8w5m1/skillradar-projeto-avaliativo-m1s13>
- 🎥 **Vídeo de apresentação (≤ 7 min):** _link em breve_

## ✨ O que o app faz

- Captura um **perfil** (nome, área, habilidades, meses de experiência) com **validação acessível**.
- **Persiste** o perfil no `localStorage` (ao recarregar, seus dados não se perdem).
- Busca um **catálogo de vagas** via `fetch` e trata os 3 estados: carregando, vazio e erro.
- Calcula a **compatibilidade** (% + habilidades que você tem × as que faltam) e **classifica**
  cada vaga em Alta / Média / Baixa.
- Destaca a **melhor combinação** e gera uma **recomendação de estudo** priorizada pelo que mais
  falta entre as vagas.
- Renderiza os resultados como **cards dinâmicos**, com layout **responsivo mobile-first**.

## 🚀 Como executar

Como o projeto usa **módulos ES** e **`fetch`**, ele **não** funciona abrindo o arquivo direto
(`file://`) — o navegador bloqueia por segurança (CORS). Rode com um servidor local:

1. Abra a pasta do projeto no **VS Code**.
2. Instale a extensão **Live Server** (se ainda não tiver).
3. Clique com o botão direito no `index.html` → **Open with Live Server**.
4. O app abre em `http://127.0.0.1:5500/index.html`.

> 💡 Preencha o formulário (nome, ao menos 1 habilidade, experiência ≥ 0) e clique em
> **"Analisar vagas"** para ver os cards.

## 🏗️ Arquitetura — dados × regras × tela

O código é dividido por **responsabilidade** (conceito da Semana 12), e o `main.js` é o **maestro**
que liga tudo. Cada módulo só sabe fazer a sua parte e não conhece os detalhes dos outros:

| Módulo | Papel | Não faz |
|---|---|---|
| `dados.js` | **DADOS** — `fetch` das vagas + `localStorage` do perfil | não conhece regras nem DOM |
| `motor.js` | **REGRAS** — classes, compatibilidade, classificação, recomendação | não toca no DOM nem no `fetch` |
| `ui.js` | **TELA** — desenha os 3 estados, o destaque e os cards | não calcula nem busca dados |
| `formulario.js` | **ENTRADA** — captura + valida o perfil e avisa o `main` | não calcula compatibilidade |
| `main.js` | **ORQUESTRADOR** — coordena o fluxo na ordem certa | não implementa a lógica de ninguém |

**Fluxo completo** (a cada perfil válido enviado):

```
formulário válido
   → mostra "carregando"
   → dados.js: fetch das vagas        (vazio? mostra "nenhuma vaga" | erro? mostra "erro")
   → motor.js: cria instâncias (POO) → analisa e ordena → gera recomendação
   → ui.js: desenha destaque + cards
```

Essa separação foi decisão de projeto: mantém cada arquivo pequeno, testável e fácil de trocar
(ex.: dá para mudar a fonte das vagas mexendo só no `dados.js`).

## 📋 Requisitos atendidos

| RF | Descrição | Onde |
|---|---|---|
| RF01 | Perfil como objeto (nome, área, habilidades[], experiência) | `formulario.js` |
| RF02 | Catálogo ≥ 4 vagas via `fetch` | `assets/dados/vagas.json` |
| RF03 | Cálculo de compatibilidade (% + encontradas × faltantes) | `motor.js` |
| RF04 | Classificação Alta / Média / Baixa | `motor.js` |
| RF05 | Melhor vaga + recomendação de estudo | `motor.js` |
| RF06 | ≥ 3 métodos de array (`map`, `filter`, `every`, `reduce`) | `motor.js` |
| RF07 | POO: classe `Vaga` + `VagaFrontEnd extends Vaga` | `motor.js` |
| RF08 | ≥ 1 callback + 1 closure (contador de análises) | `motor.js` / `main.js` |
| RF09 | HTML semântico + acessível + SEO | `index.html` |
| RF10 | Formulário com validação + eventos (erro acessível) | `formulario.js` |
| RF11 | Render dinâmico dos cards (`createElement`/`classList`) | `ui.js` |
| RF12 | Responsivo mobile-first (Flexbox, `@media`, unidades fluidas) | `index.style.css` |
| RF13 | `fetch` + `async/await` com 3 estados (`aria-live`) | `dados.js` / `ui.js` |
| RF14 | `localStorage` do perfil (JSON + tratamento de `null`) | `dados.js` |
| RF15 | Módulos ES (`import`/`export`, `type="module"`) | todos os `.js` |
| RF16 | Depuração com `debugger` (documentada) | ver abaixo |

## 🐛 Depuração com o debugger (RF16)

Durante a Etapa 8 cacei um bug **lógico e silencioso** — a tela mostrava uma lista de
habilidades, então "parecia" funcionar, mas o resultado estava errado.

**Sintoma:** a recomendação de estudo (`gerarRecomendacao`, em `motor.js`) promete
*"Priorize estudar: …"*, ou seja, as habilidades que faltam em **mais** vagas deveriam vir
primeiro. Não vinham: uma habilidade que faltava em 1 vaga aparecia na frente de outra que
faltava em 2.

**Como cacei (Chrome DevTools → aba *Sources*):**

1. Coloquei um **breakpoint** na linha do `return` de `gerarRecomendacao` (dá pra usar um
   `debugger;` no lugar) e reenviei o formulário — a execução **pausou** ali.
2. No painel **Scope/Watch**, inspecionei `todasFaltantes`: o array vinha **com duplicatas**
   (ex.: `"react"` repetido 3×). É aí que mora a *frequência*.
3. Inspecionei a variável seguinte (`[...new Set(todasFaltantes)]`): as duplicatas sumiam e a
   ordem **não** refletia a contagem. Eureka — o `Set` jogava a frequência fora.

**Causa:** `[...new Set(todasFaltantes)]` deduplica, mas descarta *quantas vezes* cada
habilidade aparecia — que era exatamente o critério de prioridade.

**Correção:** contar a frequência de cada habilidade (`reduce` → mapa `habilidade → nº`) e
**ordenar** da que mais falta para a que menos falta antes de montar a frase.

## 🔦 Auditoria Lighthouse

Auditoria no Chrome DevTools (aba *Lighthouse*, modo *Navigation*, device *Mobile*), com a tela
cheia (formulário enviado + cards renderizados):

| Performance | Accessibility | Best Practices | SEO |
|:---:|:---:|:---:|:---:|
| **99** | **100** | **100** | **100** |

## 🗂️ Estrutura

```
skillradar/
├── index.html               # estrutura semântica + acessível (RF09)
├── README.md
├── PLANEJAMENTO.md           # planejamento e mapa de requisitos
├── DIARIO-DE-BORDO.md        # registro didático de cada etapa
└── assets/
    ├── styles/index.style.css   # CSS mobile-first, Flexbox (RF12)
    ├── scripts/
    │   ├── main.js           # orquestra o fluxo
    │   ├── motor.js          # regras (compatibilidade, POO)
    │   ├── ui.js             # tela (DOM/eventos)
    │   ├── formulario.js     # captura + validação do perfil
    │   └── dados.js          # fetch + localStorage
    ├── dados/vagas.json      # catálogo de vagas
    └── img/logo.svg
```

## 🛠️ Tecnologias

HTML5 semântico · CSS3 (Flexbox, `clamp`, media queries, custom properties) · JavaScript ES6+
(módulos, classes, `async/await`, `fetch`, `localStorage`) — **sem frameworks nem bibliotecas**.

## 👨‍💻 Autor

**Diego da Costa** — Curso de Programação Front-End React, Turma T2.
