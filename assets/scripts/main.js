// ==========================================================
// main.js — O ORQUESTRADOR do SkillRadar (ponto de entrada)
// ==========================================================
// É o único script carregado pelo index.html (type="module").
// A partir daqui, importamos motor.js, dados.js e ui.js e
// coordenamos o fluxo: perfil -> fetch das vagas -> análise -> tela.
//
// ➡️ O fluxo completo (fetch -> análise -> render) entra na Etapa 6.
//    Por ora, a Etapa 5 já liga o formulário de perfil.

import { initFormulario } from "./formulario.js";

console.log("SkillRadar: setup inicial carregado com sucesso ✅");

// Etapa 5 — liga a captura do perfil. O callback abaixo é TEMPORÁRIO:
// na Etapa 6 ele será trocado pelo fluxo real (carregar vagas ->
// analisar -> renderizar os cards). Agora só confirmamos, na tela e
// no console, que o perfil válido chegou e foi salvo no localStorage.
initFormulario((perfil) => {
  console.log("Perfil válido e salvo:", perfil);

  // Escreve na região de status (role="status" + aria-live): o leitor
  // de tela anuncia a confirmação sem o usuário sair do lugar.
  const status = document.getElementById("status");
  if (status) {
    status.textContent =
      `Perfil de ${perfil.nome} salvo! ` +
      `${perfil.habilidades.length} habilidade(s) selecionada(s). ` +
      `A análise das vagas entra na Etapa 6.`;
  }
});
