// ==========================================================
// formulario.js — CAPTURA DO PERFIL do SkillRadar
// ==========================================================
// Responsabilidade ÚNICA deste módulo (RF10 + RF01 + RF14):
//   1. ouvir o "enviar" do formulário e impedir o reload da página;
//   2. VALIDAR cada campo com mensagens de erro ACESSÍVEIS;
//   3. focar o PRIMEIRO campo inválido (o usuário vai direto ao problema);
//   4. montar o objeto `perfil` (RF01) e SALVAR no localStorage (RF14);
//   5. avisar quem chamou (o main.js) que existe um perfil válido e salvo.
//
// De propósito, ele NÃO conhece as regras de compatibilidade
// (isso é do motor.js) nem desenha os resultados (isso é do ui.js).
// Ele só entrega um perfil pronto — separação de responsabilidades.
// ==========================================================

// Importamos só o que precisamos do dados.js: a função que grava
// o perfil no localStorage. O dados.js já cuida do JSON.stringify.
import { salvarPerfil } from "./dados.js";


// ==========================================================
// HELPERS DE ERRO ACESSÍVEL
// ==========================================================
// Cada campo tem, no HTML, um <span id="erro-XXX" role="alert">.
// role="alert" faz o leitor de tela ANUNCIAR o texto assim que ele
// aparece — sem o usuário precisar navegar até lá.
//
// Além do texto, marcamos o campo com aria-invalid="true": é assim
// que a tecnologia assistiva sabe que AQUELE campo está com problema.

function mostrarErro(campo, idErro, mensagem) {
  document.getElementById(idErro).textContent = mensagem;
  campo.setAttribute("aria-invalid", "true");
}

function limparErro(campo, idErro) {
  document.getElementById(idErro).textContent = "";
  campo.setAttribute("aria-invalid", "false");
}


// ==========================================================
// VALIDAÇÃO — regra por regra
// ==========================================================
// Devolve um ARRAY com os elementos que devem receber FOCO quando
// há erro. Se o array voltar vazio, está tudo válido.
//
// Por que devolver os elementos de foco? Porque o foco precisa ir
// para o PRIMEIRO campo inválido — e para o grupo de habilidades o
// "campo focável" é o primeiro checkbox, não o <fieldset> (fieldset
// não recebe foco de teclado). Por isso separamos: a MARCA de erro
// vai no fieldset (via aria), mas o FOCO vai no checkbox.

function validar(form) {
  const alvosDeFoco = [];

  const nome = form.nome;                 // acha o input por name="nome"
  const experiencia = form.experiencia;   // input por name="experiencia"
  const grupoHabilidades = document.getElementById("grupo-habilidades"); // o <fieldset>
  const primeiraHabilidade = form.querySelector('input[name="habilidades"]');
  const qtdMarcadas = form.querySelectorAll('input[name="habilidades"]:checked').length;

  // --- Regra 1: nome não pode ser vazio (trim tira espaços "invisíveis") ---
  if (nome.value.trim() === "") {
    mostrarErro(nome, "erro-nome", "Informe seu nome.");
    alvosDeFoco.push(nome);
  } else {
    limparErro(nome, "erro-nome");
  }

  // --- Regra 2: pelo menos UMA habilidade marcada ---
  if (qtdMarcadas === 0) {
    mostrarErro(grupoHabilidades, "erro-habilidades", "Selecione ao menos uma habilidade.");
    alvosDeFoco.push(primeiraHabilidade); // foca no 1º checkbox do grupo
  } else {
    limparErro(grupoHabilidades, "erro-habilidades");
  }

  // --- Regra 3: experiência precisa ser número >= 0 ---
  // Number("") vira 0, então checamos o vazio ANTES; Number("abc") vira NaN.
  const exp = Number(experiencia.value);
  if (experiencia.value.trim() === "" || Number.isNaN(exp) || exp < 0) {
    mostrarErro(experiencia, "erro-experiencia", "Informe a experiência em meses (0 ou mais).");
    alvosDeFoco.push(experiencia);
  } else {
    limparErro(experiencia, "erro-experiencia");
  }

  return alvosDeFoco;
}


// ==========================================================
// MONTAR O OBJETO PERFIL (RF01)
// ==========================================================
// Só é chamada quando a validação passou, então aqui os dados já
// estão confiáveis. O formato bate com o que o motor.js espera:
// ele lê `candidato.habilidades` (um array de strings).

function montarPerfil(form) {
  // Pega os checkboxes marcados e transforma na lista dos seus values.
  // querySelectorAll devolve uma NodeList; Array.from permite usar .map.
  const habilidades = Array.from(
    form.querySelectorAll('input[name="habilidades"]:checked')
  ).map((checkbox) => checkbox.value);

  return {
    nome: form.nome.value.trim(),
    area: form.area.value,
    habilidades,                             // ex.: ["HTML", "CSS", "JavaScript"]
    experiencia: Number(form.experiencia.value),
  };
}


// ==========================================================
// LIGAÇÃO DO FORMULÁRIO (o que o main.js chama)
// ==========================================================
// Recebe um callback `aoEnviarPerfil`: é assim que este módulo
// "avisa" o orquestrador que há um perfil válido e salvo, sem
// precisar conhecer o que o main.js vai fazer com ele (na Etapa 6:
// carregar vagas -> analisar -> renderizar).

export function initFormulario(aoEnviarPerfil) {
  const form = document.getElementById("form-perfil");
  if (!form) return; // defensivo: se o HTML mudar, não quebra o app

  // RF10 — o evento central: o envio do formulário.
  form.addEventListener("submit", (evento) => {
    // preventDefault impede o comportamento padrão do form (recarregar
    // a página / navegar). Sem isso, todo o nosso JS seria perdido.
    evento.preventDefault();

    const camposInvalidos = validar(form);

    // Se há erros, foca o PRIMEIRO campo inválido e para por aqui.
    if (camposInvalidos.length > 0) {
      camposInvalidos[0].focus();
      return;
    }

    // Tudo válido: monta o perfil e persiste (RF14).
    const perfil = montarPerfil(form);
    salvarPerfil(perfil);

    // Entrega o perfil pronto para quem ligou o formulário.
    if (typeof aoEnviarPerfil === "function") {
      aoEnviarPerfil(perfil);
    }
  });
}
