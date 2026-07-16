# 📡 SkillRadar

> Informe suas habilidades e descubra o quanto você combina com cada vaga de front-end júnior.

Aplicação web (Single Page) em **HTML + CSS + JavaScript puro** que evolui o motor de
compatibilidade do mini-projeto **SkillMatch JS** (que rodava no console) para um produto
que qualquer pessoa abre no navegador.

> ⏳ Projeto em desenvolvimento — Projeto Avaliativo Final do Módulo 01 (Front-End React T2).
> Este README será completado ao longo das etapas.

## 🚀 Como executar

Como o projeto usa **módulos ES** e **fetch**, ele não funciona abrindo o arquivo direto
(`file://`). Rode com um servidor local:

1. Abra a pasta do projeto no VS Code.
2. Clique com o botão direito no `index.html` → **Open with Live Server**.

## 🗂️ Estrutura

```
skillradar/
├── index.html
├── README.md
├── PLANEJAMENTO.md
└── assets/
    ├── styles/index.style.css
    ├── scripts/
    │   ├── main.js      # orquestra o fluxo
    │   ├── motor.js     # regras (compatibilidade)
    │   ├── ui.js        # tela (DOM/eventos)
    │   └── dados.js     # fetch + localStorage
    ├── dados/vagas.json # catálogo de vagas
    └── img/logo.svg
```

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

Auditoria feita no Chrome DevTools (aba *Lighthouse*, modo *Navigation*, categorias
Performance / Accessibility / Best Practices / SEO). Resultados e ajustes registrados no
`DIARIO-DE-BORDO.md` (Etapa 8).

## 👨‍💻 Autor

**Diego da Costa** — Curso de Programação Front-End React, Turma T2.
