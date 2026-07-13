// ==========================================================
// motor.js — AS REGRAS do SkillRadar (o "cérebro")
// ==========================================================
// Aqui ficam as CLASSES (Vaga, VagaFrontEnd) e as FUNÇÕES de
// compatibilidade, classificação, melhor vaga e recomendação.
// É o motor reaproveitado do mini-projeto SkillMatch JS, agora
// invertido: 1 candidato (o usuário) × N vagas.
//
// Este módulo é PURO: não conhece a tela (DOM) nem o fetch.
// Só recebe dados, aplica regras e devolve resultados.
// Tudo que o resto do app precisa é exportado (export).
// ==========================================================


// ==========================================================
// RF07 — POO: CLASSE VAGA (usa "this" para os próprios dados)
// ==========================================================
export class Vaga {
  constructor(id, empresa, cargo, requisitos, salario, modalidade) {
    this.id = id;
    this.empresa = empresa;
    this.cargo = cargo;
    this.requisitos = requisitos;   // array de habilidades exigidas
    this.salario = salario;
    this.modalidade = modalidade;   // Remoto / Híbrido / Presencial
  }

  // Método que usa "this" para montar um resumo legível da vaga.
  exibirResumo() {
    return `${this.cargo} na ${this.empresa} | R$ ${this.salario} | ${this.modalidade}`;
  }
}


// ==========================================================
// RF07 — HERANÇA: VagaFrontEnd herda tudo de Vaga e adiciona "nivel"
// ==========================================================
// Herança "com propósito": além dos dados da vaga, guarda o nível
// (Estágio/Júnior/...) e sabe se exibir. É a classe que realmente
// instanciamos no app.
export class VagaFrontEnd extends Vaga {
  constructor(id, empresa, cargo, requisitos, salario, modalidade, nivel) {
    super(id, empresa, cargo, requisitos, salario, modalidade); // reaproveita o construtor pai
    this.nivel = nivel;
  }

  exibirNivel() {
    return `Nível: ${this.nivel}`;
  }
}


// ==========================================================
// FÁBRICA: transforma dados "crus" (JSON) em instâncias de VagaFrontEnd
// ==========================================================
// A Etapa 3 vai buscar as vagas via fetch como objetos simples (JSON).
// JSON não carrega classes, então aqui damos "vida" a cada objeto:
// convertemos cada registro numa instância que TEM os métodos (POO).
// RF06 — método de array: map.
export function criarVagas(listaCrua) {
  return listaCrua.map(v =>
    new VagaFrontEnd(v.id, v.empresa, v.cargo, v.requisitos, v.salario, v.modalidade, v.nivel)
  );
}


// ==========================================================
// AUXILIARES
// ==========================================================

// Normaliza texto para comparar sem erro por maiúscula/espaço.
function normalizarTexto(texto) {
  return texto.toLowerCase().trim();
}

// RF04 — classifica o percentual em Alta / Média / Baixa.
export function classificarPercentual(percentual) {
  if (percentual >= 80) {
    return "Alta";
  } else if (percentual >= 50) {
    return "Média";
  } else {
    return "Baixa";
  }
}


// ==========================================================
// RF03 — CÁLCULO DE COMPATIBILIDADE (candidato × 1 vaga)
// ==========================================================
// É o coração reaproveitado do mini-projeto, sem alteração de lógica.
// Compara UM perfil com UMA vaga e devolve o %, o que ele já tem
// e o que falta. Quem varia (candidato ou vaga) é problema de quem chama.
export function calcularCompatibilidade(candidato, vaga) {
  // RF06 — map: normaliza as habilidades do candidato.
  const habilidadesNorm = candidato.habilidades.map(normalizarTexto);

  // RF06 — map: normaliza os requisitos da vaga.
  const requisitosNorm = vaga.requisitos.map(normalizarTexto);

  // RF06 — filter: requisitos que o candidato JÁ possui.
  const habilidadesEncontradas = requisitosNorm.filter(req =>
    habilidadesNorm.includes(req)
  );

  // filter: requisitos que ainda FALTAM.
  const habilidadesFaltantes = requisitosNorm.filter(req =>
    !habilidadesNorm.includes(req)
  );

  // % = quantos requisitos ele cobre / total de requisitos.
  // Protege contra divisão por zero (vaga sem requisitos).
  const percentual = requisitosNorm.length > 0
    ? (habilidadesEncontradas.length / requisitosNorm.length) * 100
    : 0;

  return { percentual, habilidadesEncontradas, habilidadesFaltantes };
}


// ==========================================================
// RF03 + RF04 — ANALISAR TODAS AS VAGAS PARA UM CANDIDATO
// ==========================================================
// A INVERSÃO do projeto: no mini rankeávamos candidatos p/ 1 vaga;
// aqui percorremos as VAGAS para 1 candidato e ordenamos por %.
export function analisarVagas(candidato, vagas) {
  // RF06 — map: gera um resultado por vaga com todos os dados prontos p/ tela.
  const resultado = vagas.map(vaga => {
    const comp = calcularCompatibilidade(candidato, vaga);

    // RF06 — every: true só se TODOS os requisitos foram atendidos.
    const atendeTudo = vaga.requisitos.every(req =>
      candidato.habilidades.map(normalizarTexto).includes(normalizarTexto(req))
    );

    return {
      vaga,                                            // a instância (tem exibirResumo/exibirNivel)
      percentual: comp.percentual,
      percentualFormatado: `${comp.percentual.toFixed(0)}%`,
      classificacao: classificarPercentual(comp.percentual),
      habilidadesEncontradas: comp.habilidadesEncontradas,
      habilidadesFaltantes: comp.habilidadesFaltantes,
      atendeTudo
    };
  });

  // Ordena da vaga mais compatível para a menos; desempate pelo maior salário.
  resultado.sort((a, b) => {
    if (b.percentual !== a.percentual) return b.percentual - a.percentual;
    return b.vaga.salario - a.vaga.salario;
  });

  return resultado;
}


// ==========================================================
// RF05 — MELHOR VAGA (a de maior compatibilidade)
// ==========================================================
// RF06 — reduce: percorre as vagas guardando sempre a de maior %.
export function encontrarMelhorVaga(candidato, vagas) {
  return vagas.reduce((melhor, vagaAtual) => {
    const compAtual = calcularCompatibilidade(candidato, vagaAtual);
    const compMelhor = calcularCompatibilidade(candidato, melhor);
    return compAtual.percentual > compMelhor.percentual ? vagaAtual : melhor;
  });
}


// ==========================================================
// RF05 — RECOMENDAÇÃO DE ESTUDO (o que mais falta entre as vagas)
// ==========================================================
export function gerarRecomendacao(candidato, vagas) {
  // Junta as habilidades faltantes de TODAS as vagas num só array.
  // RF06 — reduce: acumula as faltantes de cada vaga.
  const todasFaltantes = vagas.reduce((acc, vaga) => {
    const comp = calcularCompatibilidade(candidato, vaga);
    return acc.concat(comp.habilidadesFaltantes);
  }, []);

  if (todasFaltantes.length === 0) {
    return "Parabéns! Você atende todos os requisitos das vagas analisadas.";
  }

  // Remove repetidas com Set e devolve a frase de recomendação.
  const semDuplicatas = [...new Set(todasFaltantes)];
  return `Priorize estudar: ${semDuplicatas.join(", ")}.`;
}


// ==========================================================
// RF08 — CALLBACK: recebe uma função e a executa ao final da análise
// ==========================================================
export function finalizarAnalise(dados, callback) {
  // ...aqui poderia haver mais lógica de encerramento...
  callback(dados); // chama a função que foi passada de fora
}


// ==========================================================
// RF08 — CLOSURE: contador que "lembra" o total entre chamadas
// ==========================================================
// A função interna continua enxergando a variável "total" mesmo depois
// que criarContadorDeAnalises() já terminou — isso é uma closure.
export function criarContadorDeAnalises() {
  let total = 0;
  return function () {
    total++;
    return total;
  };
}
