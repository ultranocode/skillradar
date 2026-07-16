// ==========================================================
// main.js — O ORQUESTRADOR do SkillRadar (ponto de entrada)
// ==========================================================
// É o único script carregado pelo index.html (type="module").
// A partir daqui importamos os outros módulos e COORDENAMOS o fluxo.
// O main.js é o "maestro": ele não sabe validar formulário, nem calcular
// compatibilidade, nem desenhar card — ele CHAMA quem sabe, na ordem certa:
//
//   formulario.js  → captura e valida o perfil
//   dados.js       → busca as vagas (fetch) e guarda o perfil
//   motor.js       → transforma dados crus em vagas e calcula tudo
//   ui.js          → desenha os 3 estados, o destaque e os cards
//
// Fluxo completo (RF15 — módulos ES ligando tudo):
//   perfil válido → carregando → fetch vagas → cria instâncias →
//   analisa/ordena → renderiza destaque + cards.  (vazio/erro tratados)
// ==========================================================

import { initFormulario } from "./formulario.js";
import { initTema } from "./tema.js";
import { carregarVagas } from "./dados.js";
import {
  criarVagas,
  analisarVagas,
  gerarRecomendacao,
  finalizarAnalise,
  criarContadorDeAnalises,
} from "./motor.js";
import { mostrarCarregando, mostrarVazio, mostrarErro, renderizarAnalise } from "./ui.js";

console.log("SkillRadar: setup inicial carregado com sucesso ✅");


// ==========================================================
// RF08 — CLOSURE: um contador que "lembra" quantas análises rolaram
// ==========================================================
// criarContadorDeAnalises() devolve uma FUNÇÃO que carrega, na memória,
// a variável "total" lá de dentro do motor. Cada vez que o usuário
// reenvia o formulário e chamamos contarAnalise(), o número sobe — mesmo
// a função "de fábrica" já tendo terminado. Isso é uma closure viva.
const contarAnalise = criarContadorDeAnalises();


// ==========================================================
// O FLUXO PRINCIPAL — roda a cada perfil válido enviado
// ==========================================================
// async porque lá dentro usamos await para esperar o fetch das vagas.
// Recebe o "perfil" já validado e salvo pelo formulario.js (RF10/RF14).
async function analisarEExibir(perfil) {
  // 1) Estado CARREGANDO (RF13): mostra ANTES de começar o fetch, para o
  //    usuário (e o leitor de tela) saberem que algo está acontecendo.
  mostrarCarregando();

  try {
    // 2) Busca as vagas cruas (JSON) via dados.js. await pausa aqui sem
    //    travar a página; se der erro HTTP/rede, dados.js dá throw e caímos
    //    direto no catch lá embaixo (estado de erro).
    const vagasCruas = await carregarVagas();

    // 3) Estado VAZIO (RF13): o fetch funcionou mas não veio nenhuma vaga.
    //    Nada a analisar — avisa e encerra aqui.
    if (vagasCruas.length === 0) {
      mostrarVazio();
      return;
    }

    // 4) FÁBRICA (POO): JSON não carrega classes, então transformamos cada
    //    objeto cru numa instância de VagaFrontEnd — que TEM os métodos
    //    exibirResumo()/exibirNivel() que o ui.js usa nos cards.
    const vagas = criarVagas(vagasCruas);

    // 5) ANÁLISE: o motor compara o perfil com cada vaga, classifica e
    //    ORDENA da mais compatível para a menos (a "inversão" do projeto).
    const resultados = analisarVagas(perfil, vagas);

    // 6) RECOMENDAÇÃO: o que mais falta estudar somando todas as vagas.
    const recomendacao = gerarRecomendacao(perfil, vagas);

    // 7) DESENHA TUDO: status de sucesso + destaque + cards (RF11/RF05).
    renderizarAnalise(resultados, recomendacao);

    // 8) RF08 — CLOSURE em ação: conta esta análise e loga o total acumulado.
    const numeroDaAnalise = contarAnalise();

    // 9) RF08 — CALLBACK em ação: finalizarAnalise recebe uma função e a
    //    executa ao fim. Aqui usamos para registrar no console (poderia ser
    //    enviar métrica, tocar um som, etc. — quem chama decide o "o quê").
    finalizarAnalise(resultados, (dados) => {
      console.log(
        `Análise nº ${numeroDaAnalise} concluída para ${perfil.nome}: ` +
        `${dados.length} vaga(s). Melhor: ${dados[0].vaga.cargo} (${dados[0].percentualFormatado}).`
      );
    });
  } catch (erro) {
    // 10) Estado ERRO (RF13): qualquer falha no caminho acima cai aqui.
    //     O dados.js já logou o detalhe técnico; para o usuário mostramos
    //     uma mensagem amigável na região com aria-live.
    console.error("[main] Falha no fluxo de análise:", erro);
    mostrarErro("Não foi possível carregar as vagas. Verifique sua conexão e tente novamente.");
  }
}


// ==========================================================
// LIGAÇÃO FINAL: o formulário dispara o fluxo
// ==========================================================
// initFormulario liga o submit, valida (RF10) e, só quando o perfil é
// válido, chama de volta o callback que passamos — que agora é o fluxo
// REAL. Assim o formulario.js não precisa saber nada de fetch/render:
// ele só entrega um perfil pronto e o main decide o que fazer com ele.
initFormulario(analisarEExibir);

// BÔNUS: liga o alternador de tema claro/escuro (independente do fluxo de análise).
initTema();
