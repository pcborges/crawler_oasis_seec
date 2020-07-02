const { GoogleSpreadsheet } = require("google-spreadsheet");
require("dotenv").config();

var state = require("./state");
const fileName = "./temp/demandas_sheets.json";

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
const credentials = {
  client_email: process.env.GOOGLE_API_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_API_PRIVATE_KEY,
};

let header = [
  "oasis",
  "sustentacao",
  "tipoDemanda",
  "unidade",
  "sistema",
  "assunto",
  "status",
  "limiteProposta",
  "limiteEntrega",
  "responsavel",
  "observacao",
  "complexidade",
  "prioridade",
];
async function get() {
  try {
    console.log("> [Sheets] - Inicializando recuperação de dados da planilha");
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[1];
    console.log("> [Sheets] - Recuperando demandas da planilha");
    const rows = await sheet.getRows();
    const formattedRows = rows.map((row) => rowToObject(row._rawData));
    formattedRows.pop();
    state.save(fileName, formattedRows);
    console.log("> [Sheets] - Demandas carregadas no arquivo " + fileName);
  } catch (err) {
    console.error(err);
  }
}

function rowToObject(array) {
  return {
    oasis: array[0],
    sustentacao: array[1],
    tipoDemanda: array[2],
    unidade: array[3],
    sistema: array[4],
    assunto: array[5],
    status: array[6],
    limiteProposta: array[7],
    limiteEntrega: array[8],
    responsavel: array[9],
    observacao: array[10],
    complexidade: array[11],
    prioridade: array[12],
  };
}

async function update(data) {
  try {
    console.log("> [Sheets] - Inicializando Atualização da planilha...");
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[1];
    console.log("> [Sheets] - Limpando planilha");
    await sheet.clear();
    console.log("> [Sheets] - Recriando Cabeçalho");
    await sheet.setHeaderRow(header);
    console.log("> [Sheets] - Inserindo demandas");
    // console.log(state.load("./temp/demandas_sheets.json"));
    await sheet.addRows(data);
    const date = new Date();
    let formattedDate = date.toLocaleDateString();
    let formattedTime = date.toLocaleTimeString();
    let rowContent = `Atualizado em: ${formattedDate} às ${formattedTime}`;
    await sheet.addRow([rowContent]);
    console.log("> [Sheets] - Demandas atualizadas na planilha");
  } catch (err) {
    console.error("UPDATE -> ", err);
  }
}

module.exports = {
  get,
  update,
};
