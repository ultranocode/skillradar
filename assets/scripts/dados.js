// ==========================================================
// dados.js — DADOS e PERSISTÊNCIA do SkillRadar
// ==========================================================
// Esta é a CAMADA DE DADOS. Ela faz só duas coisas:
//   1. buscar as vagas via fetch (async/await) do vagas.json  → RF13
//   2. salvar e ler o perfil do usuário no localStorage        → RF14
//
// De propósito, este módulo NÃO conhece as regras (motor.js)
// nem desenha a tela (ui.js). Ele só entrega/guarda dados.
// Quem mostra "carregando/vazio/erro" na tela é o main.js —
// aqui a gente apenas SINALIZA o que aconteceu:
//   • sucesso  → devolve o array de vagas
//   • vazio    → devolve []  (o main vê length === 0)
//   • falha    → lança erro (throw) → cai no catch do main
// ==========================================================


// Caminho do arquivo de vagas, relativo ao index.html (raiz do site).
// Como o fetch resolve a partir da PÁGINA (não deste .js), o caminho
// começa em ./assets, e não em ../dados.
const CAMINHO_VAGAS = "./assets/dados/vagas.json";

// Chave única do localStorage. Usar um "prefixo:nome" evita colidir
// com outras chaves que existam no mesmo domínio (ex.: Live Server).
const CHAVE_PERFIL = "skillradar:perfil";


// ==========================================================
// RF13 — BUSCAR VAGAS (fetch + async/await + try/catch)
// ==========================================================
// async: marca a função como assíncrona → ela sempre devolve uma Promise
//        e nos deixa usar "await" para esperar sem travar a página.
export async function carregarVagas() {
  try {
    // await: pausa AQUI até a resposta chegar, sem congelar a tela.
    const resposta = await fetch(CAMINHO_VAGAS);

    // response.ok é true para status 200–299. Se o arquivo não existe
    // (404) ou o servidor deu erro (500), ok é false — e um fetch com
    // erro HTTP NÃO cai sozinho no catch, então checamos na mão.
    if (!resposta.ok) {
      throw new Error(`Falha ao carregar vagas (HTTP ${resposta.status}).`);
    }

    // Converte o corpo da resposta (texto JSON) em array de objetos JS.
    // await de novo porque .json() também é assíncrono.
    const vagas = await resposta.json();

    // Cinto de segurança: se o JSON não for uma lista, tratamos como vazio.
    if (!Array.isArray(vagas)) {
      return [];
    }

    return vagas; // caminho feliz: devolve as vagas cruas p/ o main.
  } catch (erro) {
    // Qualquer problema (rede caiu, JSON quebrado, throw acima) chega aqui.
    // Logamos para o desenvolvedor e RE-LANÇAMOS para o main decidir o
    // que mostrar na tela (estado de erro com aria-live).
    console.error("[dados] Erro ao carregar vagas:", erro);
    throw erro;
  }
}


// ==========================================================
// RF14 — SALVAR O PERFIL NO localStorage
// ==========================================================
// localStorage só guarda TEXTO. Um perfil é um objeto, então
// convertemos para string com JSON.stringify antes de gravar.
export function salvarPerfil(perfil) {
  try {
    const texto = JSON.stringify(perfil);
    localStorage.setItem(CHAVE_PERFIL, texto);
    return true;
  } catch (erro) {
    // Pode falhar em modo anônimo ou com storage cheio — não derruba o app.
    console.error("[dados] Não foi possível salvar o perfil:", erro);
    return false;
  }
}


// ==========================================================
// RF14 — LER O PERFIL do localStorage
// ==========================================================
// getItem devolve a string salva OU null se a chave nunca existiu.
// TRATAR O null é essencial: JSON.parse(null) não quebra, mas cair
// nesse caminho sem querer causaria bugs. Aqui é explícito.
export function carregarPerfil() {
  const texto = localStorage.getItem(CHAVE_PERFIL);

  // Primeira visita (ou perfil apagado): não há nada guardado.
  if (texto === null) {
    return null;
  }

  try {
    // Desfaz o stringify: volta de texto para objeto.
    return JSON.parse(texto);
  } catch (erro) {
    // Se o valor guardado estiver corrompido, não quebramos o app:
    // avisamos e tratamos como "sem perfil".
    console.error("[dados] Perfil salvo está corrompido, ignorando:", erro);
    return null;
  }
}


// ==========================================================
// RF14 — APAGAR o perfil (útil para um botão "recomeçar")
// ==========================================================
export function limparPerfil() {
  localStorage.removeItem(CHAVE_PERFIL);
}
