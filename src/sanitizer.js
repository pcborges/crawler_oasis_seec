const state = require("./state");
const util = require("./util");

async function start() {
  const demandasOasis = state.load("./temp/demandas_oasis.json");
  const demandasSheets = state.load("./temp/demandas_sheets.json");
  console.log("> [Sanitizer] - Iniciando processamento dos arquivos...");
  const demandasSanitizadas = demandasOasis.map((demandaOasis) => {
    let demandaEncontrada = demandasSheets.find(
      (demandaSheets) => demandaSheets.oasis === demandaOasis.oasis
    );
    if (!demandaEncontrada) return demandaOasis;

    demandaEncontrada.status = demandaOasis.status;
    demandaEncontrada.tipoDemanda = demandaOasis.tipoDemanda;
    return demandaEncontrada;
  });
  demandasSheets.forEach((demanda) => {
    let demandaEncontrada = demandasSanitizadas.find(
      (demandaSanitizada) => demandaSanitizada.oasis === demanda.oasis
    );
    if (demandaEncontrada) return;
    demandasSanitizadas.push(demanda);
  });
  console.log("> [Sanitizer] - Demandas atualizadas com sucesso");
  return demandasSanitizadas
    .filter(removeDemandasFaturadas)
    .filter(removeDemandasCanceladas)
    .sort(util.sortByOasis);
}

function removeDemandasFaturadas(demanda) {
  if (demanda.status.toLowerCase().includes("fatura")) return false;
  return true;
}

function removeDemandasCanceladas(demanda) {
  if (demanda.status.toLowerCase().includes("cancelada")) return false;
  return true;
}

module.exports = {
  start,
};
