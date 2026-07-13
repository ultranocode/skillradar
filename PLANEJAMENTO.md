# Planejamento — SkillRadar (Projeto Avaliativo M1S13)

**Autor:** Diego da Costa · **Turma:** Front-End React T2
**Prazo de entrega:** 20/07/2026 (segunda), até 22h
**App:** SkillRadar — evolução do SkillMatch JS (console) para aplicação web.

---

## 1. Objetivo

Transformar o motor de compatibilidade do mini-projeto (console) em uma **Single Page Application**
em HTML + CSS + JavaScript puro, onde o usuário preenche o próprio perfil e vê todas as vagas
com o percentual de compatibilidade, classificação, habilidades faltantes e recomendação de estudo.

**Regra de ouro:** nada de React/Vue/Angular, TypeScript, bundlers (Vite/Webpack), CSS Grid como
layout (usar Flexbox), jQuery/axios ou back-end. Só o que foi visto no Módulo 01.

---

## 2. Arquitetura (módulos ES)

```
skillmatch-web/                (raiz do repositório)
├── index.html                 # página (HTML semântico) — script type="module"
├── README.md
├── PLANEJAMENTO.md
└── assets/
    ├── styles/
    │   └── index.style.css     # estilos + responsividade mobile-first
    ├── scripts/
    │   ├── main.js             # ponto de entrada — orquestra o fluxo
    │   ├── motor.js            # REGRAS: classes Vaga/VagaFrontEnd + compatibilidade (export)
    │   ├── ui.js               # TELA: render dos cards, formulário, DOM/eventos (export)
    │   └── dados.js            # DADOS: fetch das vagas + localStorage (export)
    ├── dados/
    │   └── vagas.json          # catálogo de vagas (carregado via fetch)
    └── img/
        └── logo.svg
```

Divisão em 3 responsabilidades (S12): **dados × regras × tela**, orquestradas pelo `main.js`.

---

## 3. Estratégia de Git (branches)

- `main` — código final, só recebe merges prontos.
- `develop` — concentra os merges durante o desenvolvimento.
- `feature/*` — uma branch por tarefa, criada a partir de `develop`.
- Commits no imperativo: "implementa X", "corrige Y".
- Meta: **≥ 8 commits descritivos** e **não excluir** feature branches após o merge.

| Branch | Entrega |
|---|---|
| `feature/estrutura-inicial` | pastas, index.html base, .gitignore, README inicial |
| `feature/motor` | motor.js (classes, compatibilidade, classificação, melhor vaga, recomendação, callback, closure) |
| `feature/dados` | vagas.json + dados.js (fetch 3 estados + localStorage) |
| `feature/html-semantico` | index.html semântico + SEO + acessibilidade |
| `feature/formulario` | formulário de perfil + validação + eventos |
| `feature/render-cards` | ui.js render dinâmico dos cards + main.js orquestração |
| `feature/estilos-responsivo` | CSS mobile-first, flexbox, media queries |
| `feature/debug-lighthouse` | caça a um bug com debugger + Lighthouse |
| `docs/readme` | README completo |
| `feature/bonus-*` (opcional) | tema escuro, filtros, deploy, geolocation |

---

## 4. Mapa de Requisitos Funcionais (RF)

### Grupo A — Motor (motor.js)
- **RF01** Perfil do candidato como objeto (nome, area, habilidades[], experienciaMeses) — vem do form + persistido.
- **RF02** Catálogo ≥ 4 vagas (id, empresa, cargo, requisitos, salario, modalidade) — via fetch.
- **RF03** Cálculo de compatibilidade (% + encontradas × faltantes).
- **RF04** Classificação Alta (80–100) / Média (50–79) / Baixa (0–49).
- **RF05** Melhor vaga + recomendação de estudo (habilidades que mais faltam).
- **RF06** ≥ 3 métodos de array (map, filter, find, every, reduce).
- **RF07** POO: classe Vaga (this) + VagaFrontEnd extends Vaga (herança com propósito).
- **RF08** ≥ 1 callback + 1 closure (ex.: contador de análises da sessão).

### Grupo B — Interface (index.html + ui.js + css)
- **RF09** HTML semântico (landmarks, 1 h1, label/for, alt, aria, foco, lang) + SEO (title, meta description).
- **RF10** Formulário com validação + eventos (addEventListener, preventDefault, erro acessível).
- **RF11** Render dinâmico dos cards (createElement/classList).
- **RF12** Responsivo mobile-first (meta viewport, unidades fluidas, media queries, flexbox).

### Grupo C — Dados (dados.js + vagas.json)
- **RF13** fetch + async/await com 3 estados (carregando/vazio/erro), try/catch, response.ok, aria-live.
- **RF14** localStorage do perfil (setItem/getItem, JSON.stringify/parse, tratar null).

### Grupo D — Organização (S12)
- **RF15** Módulos ES (import/export, script type="module").
- **RF16** Depuração com debugger (documentar o bug caçado no README/vídeo).

### ⭐ Bônus (opcionais)
- Tema claro/escuro persistido · Filtro/ordenação de vagas · Deploy GitHub Pages · Geolocation · package.json com script de dev.

---

## 5. Ordem de execução (passo a passo)

1. **Setup** — estrutura de pastas, git (main + develop), .gitignore.
2. **Motor** — motor.js (adaptar 1 candidato × N vagas) + testes no console.
3. **Dados** — vagas.json + dados.js (fetch 3 estados + localStorage).
4. **HTML semântico** — index.html com landmarks, SEO, acessibilidade.
5. **Formulário** — captura + validação + eventos.
6. **Render + orquestração** — ui.js (cards) + main.js (fluxo completo).
7. **Estilos** — CSS mobile-first + responsividade.
8. **Debug + Lighthouse** — caçar 1 bug, rodar auditoria.
9. **README** — documentação completa.
10. **Bônus** (se sobrar tempo).
11. **Entrega** — vídeo ≤ 7 min, merge na main, links no AVA.

---

## 6. Checklist final de entrega

- [ ] Repositório GitHub público com a app rodando (Live Server)
- [ ] Motor reaproveitado (compatibilidade, faltantes, classificação, melhor vaga, recomendação)
- [ ] ≥ 3 métodos de array; POO com classe + herança + this; callback + closure
- [ ] HTML semântico + acessível + SEO
- [ ] Formulário com validação e eventos; cards gerados por JS
- [ ] Responsivo mobile-first
- [ ] fetch com 3 estados; localStorage com JSON + null tratado
- [ ] Módulos ES (motor/ui/dados)
- [ ] Branches + commits descritivos (≥ 8) mergeados na main
- [ ] Trello público + link no README
- [ ] README completo
- [ ] Vídeo (≤ 7 min) no Google Drive por link
- [ ] Links enviados no AVA antes do prazo
