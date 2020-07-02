const { firefox } = require("playwright");
let state = require("./state");
require("dotenv").config();

const fileName = "./temp/demandas_oasis.json";
const urlSistema = process.env.OASIS_URL;
const sistemas = ["SITAF-LANC", "SITAF-PARC", "SITAF-CERT"];

const start = async () => {
  const browser = await firefox.launch({ headless: true });
  const page = await browser.newPage();
  try {
    console.log("> [Crawler] - Inicializando...");
    // Fazendo login
    await page.goto(urlSistema);
    await page.fill("#usuario", process.env.OASIS_USER);
    await page.fill("#senha", process.env.OASIS_PASS);
    await page.click("button#btLogin");
    const url = page.url().toString();
    if (url.includes("error")) throw "Usuário ou senha inválido";
    await page.waitForSelector("#nomeUsuario");
    console.log("> [Crawler] - Login efetuado com sucesso");

    const content = [];
    // Buscar as demandas
    for (let i = 0; i < sistemas.length; i++) {
      let data = await buscarDemandasPorSistema(page, sistemas[i]);
      content.push(data);
    }
    state.save(
      fileName,
      content.flatMap((x) => x)
    );
    await browser.close();

    console.log("> [Crawler] - Demandas carregadas no arquivo " + fileName);
  } catch (e) {
    await browser.close();
    console.log("> [Crawler] - Erro no processamento:", e);
  }
};

async function buscarDemandasPorSistema(page, nomeSistema) {
  console.log("> [Crawler] - Buscando demandas do sistema", nomeSistema);
  // Vai para a tela de consulta
  await page.goto(`${urlSistema}/consultar`);
  await page.waitForSelector("#propostas_parcelas");
  await page.click("#propostas_parcelas");
  await page.selectOption("select#cd_sistema", { label: nomeSistema });
  await page.click("button#bt_consultar");
  await page.waitForSelector("table#tableSolicitacaoServicoConsulta");

  const data = await page.evaluate(() => {
    let table = document.querySelector("#tableSolicitacaoServicoConsulta");
    let table_rows = [...table.rows];
    let rows_content = table_rows.map((row) => row.cells);

    let row_content_text = rows_content.map((content) => {
      const [
        oasis,
        sustentacao,
        tipoDemanda,
        unidade,
        sistema,
        assunto,
        status,
      ] = content;
      return {
        oasis: oasis.innerText,
        sustentacao: sustentacao.innerText,
        tipoDemanda: tipoDemanda.innerText,
        unidade: unidade.innerText,
        sistema: sistema.innerText,
        assunto: assunto.innerText,
        status: status.innerText,
      };
    });
    row_content_text.shift();
    return row_content_text;
  });
  return data;
}

module.exports = {
  start,
};
