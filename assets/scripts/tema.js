// ==========================================================
// tema.js — BÔNUS: alternador de tema claro/escuro
// ==========================================================
// Responsabilidade ÚNICA: o BOTÃO de tema.
//   1. ligar o clique do botão;
//   2. alternar entre claro e escuro (ligando/desligando o
//      data-theme="escuro" no <html>);
//   3. PERSISTIR a escolha no localStorage;
//   4. manter o botão coerente (ícone, aria-pressed, aria-label).
//
// Quem aplica o tema logo na abertura (antes da 1ª pintura, sem "piscada")
// é o pequeno script inline no <head> do index.html. Este módulo cuida da
// interação DEPOIS que a página já carregou. Os dois combinam pela MESMA
// chave do localStorage abaixo.
// ==========================================================

// Mesma chave usada pelo script no-FOUC do <head>. O prefixo "skillradar:"
// evita colidir com outras chaves do mesmo domínio (ex.: skillradar:perfil).
const CHAVE_TEMA = "skillradar:tema";

// Lê no <html> se o tema escuro está ativo agora. O script do <head> pode
// já ter ligado o data-theme; aqui é a "fonte da verdade" do estado atual.
function estaEscuro() {
  return document.documentElement.dataset.theme === "escuro";
}

// Deixa o botão coerente com o tema atual: no escuro mostramos ☀️ ("clicar
// para clarear"); no claro, 🌙. aria-pressed=true quando o modo escuro está
// LIGADO, para a tecnologia assistiva anunciar o estado do botão de alternância.
function sincronizarBotao(botao, icone) {
  const escuro = estaEscuro();
  botao.setAttribute("aria-pressed", String(escuro));
  botao.setAttribute("aria-label", escuro ? "Ativar tema claro" : "Ativar tema escuro");
  icone.textContent = escuro ? "☀️" : "🌙";
}

export function initTema() {
  const botao = document.getElementById("btn-tema");
  if (!botao) return; // defensivo: se o HTML mudar, não quebra o app

  const icone = botao.querySelector(".cabecalho__tema-icone");

  // Ao carregar: o script do <head> já decidiu o tema; só alinhamos o botão.
  sincronizarBotao(botao, icone);

  botao.addEventListener("click", () => {
    const novo = estaEscuro() ? "claro" : "escuro";

    if (novo === "escuro") {
      document.documentElement.dataset.theme = "escuro";
    } else {
      // Remover o atributo faz o CSS voltar ao :root (tema claro "base").
      delete document.documentElement.dataset.theme;
    }

    // PERSISTE a escolha: na próxima visita o script do <head> lê isto.
    localStorage.setItem(CHAVE_TEMA, novo);

    sincronizarBotao(botao, icone);
  });
}
