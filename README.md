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

## 👨‍💻 Autor

**Diego da Costa** — Curso de Programação Front-End React, Turma T2.
