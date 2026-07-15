// ==========================================================
// ui.js — A TELA do SkillRadar (DOM e eventos)
// ==========================================================
// Responsável por desenhar as coisas na página com JavaScript:
//  - os 3 estados da região de status: carregando / vazio / erro (RF13);
//  - o destaque da melhor vaga + a recomendação de estudo (RF05);
//  - os cards de vaga, criados na mão com createElement (RF11).
//
// Este módulo cuida SÓ da apresentação: recebe dados prontos e os
// transforma em elementos na tela. Ele NÃO calcula compatibilidade
// (isso é do motor.js) nem busca dados (isso é do dados.js). Quem
// decide QUAL estado mostrar é o main.js — aqui a gente só sabe DESENHAR.
// ==========================================================


// ==========================================================
// REFERÊNCIAS DO DOM (pegas uma única vez)
// ==========================================================
// Como o <script type="module"> é "adiado" (defer) por natureza, ele só
// roda depois que o HTML terminou de carregar. Então podemos capturar os
// elementos aqui no topo com segurança — eles já existem. Guardar as
// referências uma vez evita ficar chamando getElementById a cada render.
const elStatus = document.getElementById("status");       // <p role="status" aria-live>
const elDestaque = document.getElementById("destaque");   // <div hidden>
const elLista = document.getElementById("lista-vagas");   // <ul>


// ==========================================================
// RF13 — OS 3 ESTADOS (escritos na região com aria-live)
// ==========================================================
// O #status tem role="status" + aria-live="polite": qualquer texto que
// a gente escrever ali é ANUNCIADO pelo leitor de tela, sem o usuário
// precisar procurar. Por isso os 3 estados passam TODOS por aqui.

// Estado "carregando": some com resultados antigos e avisa que está buscando.
export function mostrarCarregando() {
  elStatus.textContent = "Carregando vagas…";
  elDestaque.hidden = true;    // esconde destaque anterior
  elDestaque.textContent = ""; // e limpa o conteúdo antigo
  elLista.replaceChildren();   // esvazia a lista (jeito moderno de remover todos os filhos)
}

// Estado "vazio": o fetch funcionou, mas veio uma lista sem vagas.
export function mostrarVazio() {
  elStatus.textContent = "Nenhuma vaga encontrada no momento.";
  elDestaque.hidden = true;
  elDestaque.textContent = "";
  elLista.replaceChildren();
}

// Estado "erro": algo falhou (rede caiu, JSON quebrado, 404…).
// A mensagem vem de fora para o main decidir o texto exato.
export function mostrarErro(mensagem) {
  elStatus.textContent = mensagem || "Não foi possível carregar as vagas. Tente novamente.";
  elDestaque.hidden = true;
  elDestaque.textContent = "";
  elLista.replaceChildren();
}


// ==========================================================
// RF11 — CRIA UM CARD DE VAGA (createElement + classList)
// ==========================================================
// Recebe UM item já analisado pelo motor.js (com percentual, classificação
// e habilidades faltantes) e devolve um <li> pronto para entrar na lista.
// Função "privada" do módulo (não exportada): só o renderizarVagas usa.
function criarCardVaga(resultado) {
  // Desestruturação: puxa só os campos que este card precisa.
  const { vaga, percentualFormatado, classificacao, habilidadesFaltantes } = resultado;

  // <li> raiz do card. classList.add permite empilhar classes; a segunda
  // classe (--alta/--media/--baixa) é o "gancho" para o CSS da Etapa 7
  // pintar a borda conforme a compatibilidade. toLowerCase p/ virar slug.
  const li = document.createElement("li");
  li.classList.add("vaga-card", `vaga-card--${classificacao.toLowerCase()}`);

  // ----- Topo: cargo (h3) + nível -----
  // <h3> mantém a hierarquia: h1 (SkillRadar) › h2 (Vagas para você) › h3 (cargo).
  const titulo = document.createElement("h3");
  titulo.className = "vaga-card__cargo";
  titulo.textContent = vaga.cargo;

  const nivel = document.createElement("span");
  nivel.className = "vaga-card__nivel";
  nivel.textContent = vaga.exibirNivel(); // método da CLASSE (POO) → "Nível: Júnior"

  // ----- Linha da empresa (reaproveita o método exibirResumo da classe) -----
  const empresa = document.createElement("p");
  empresa.className = "vaga-card__empresa";
  empresa.textContent = vaga.exibirResumo(); // "Cargo na Empresa | R$ x | Modalidade"

  // ----- Percentual + classificação -----
  const compat = document.createElement("p");
  compat.className = "vaga-card__compat";
  // <strong> destaca o número; o resto é texto normal. innerHTML aqui é
  // seguro porque só interpolamos valores que NÓS geramos (não input do usuário).
  compat.innerHTML =
    `<strong class="vaga-card__percentual">${percentualFormatado}</strong> ` +
    `de compatibilidade — <span class="vaga-card__classificacao">${classificacao}</span>`;

  // ----- Habilidades que faltam -----
  const faltantes = document.createElement("div");
  faltantes.className = "vaga-card__faltantes";
  if (habilidadesFaltantes.length === 0) {
    // Cobre 100% dos requisitos: elogia em vez de listar vazio.
    faltantes.textContent = "✅ Você cobre todos os requisitos desta vaga!";
  } else {
    // Rótulo + <ul> com um <li> por habilidade faltante.
    const rotulo = document.createElement("p");
    rotulo.textContent = "Falta estudar:";
    const ul = document.createElement("ul");
    ul.className = "vaga-card__faltantes-lista";
    // forEach: para cada habilidade que falta, cria um <li>.
    habilidadesFaltantes.forEach((hab) => {
      const item = document.createElement("li");
      item.textContent = hab;
      ul.appendChild(item);
    });
    faltantes.append(rotulo, ul); // append aceita vários filhos de uma vez
  }

  // Monta o card na ordem visual e devolve pronto.
  li.append(titulo, nivel, empresa, compat, faltantes);
  return li;
}


// ==========================================================
// RF05 — DESTAQUE: melhor vaga + recomendação de estudo
// ==========================================================
// O bloco #destaque começa "hidden" no HTML para não anunciar vazio.
// Aqui preenchemos e revelamos. Recebe a melhor vaga (o 1º da lista já
// ordenada pelo motor) e a frase de recomendação (gerada pelo motor).
function renderizarDestaque(melhor, recomendacao) {
  elDestaque.replaceChildren(); // limpa render anterior

  const titulo = document.createElement("h3");
  titulo.textContent = "⭐ Sua melhor combinação";

  const nomeVaga = document.createElement("p");
  nomeVaga.className = "destaque__vaga";
  // melhor.vaga é a instância; melhor.percentualFormatado veio do motor.
  nomeVaga.textContent =
    `${melhor.vaga.cargo} na ${melhor.vaga.empresa} — ${melhor.percentualFormatado} de compatibilidade`;

  const rec = document.createElement("p");
  rec.className = "destaque__recomendacao";
  rec.textContent = recomendacao;

  elDestaque.append(titulo, nomeVaga, rec);
  elDestaque.hidden = false; // agora que tem conteúdo, mostra
}


// ==========================================================
// RENDER PRINCIPAL — o main.js chama esta no caminho feliz
// ==========================================================
// Recebe o resultado da análise (já ordenado) + a recomendação, e desenha
// tudo: status de sucesso, destaque e a lista de cards. Um único ponto de
// entrada mantém o main.js limpo (ele só orquestra, não mexe no DOM item a item).
export function renderizarAnalise(resultados, recomendacao) {
  // Mensagem de sucesso na região de status (anunciada pelo aria-live).
  elStatus.textContent = `${resultados.length} vaga(s) analisada(s), da mais compatível para a menos.`;

  // Destaque usa o 1º item (a lista já vem ordenada por compatibilidade).
  renderizarDestaque(resultados[0], recomendacao);

  // Lista de cards. Montamos tudo num DocumentFragment e inserimos de uma
  // vez só: assim o navegador "repinta" a tela uma vez, não a cada card.
  const fragmento = document.createDocumentFragment();
  resultados.forEach((resultado) => {
    fragmento.appendChild(criarCardVaga(resultado));
  });

  // replaceChildren troca todo o conteúdo antigo pela nova leva de uma vez.
  elLista.replaceChildren(fragmento);
}
