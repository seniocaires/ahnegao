const axios = require('axios');
const cheerio = require('cheerio');

const buscarImagens = async (url) => {
  const html = await axios
    .get(url)
    .then((response) => response.data)
    .catch((erro) => {
      console.error(`Erro ao buscar as imagens. ${JSON.stringify(erro)}`);
      throw erro;
    });

  const $ = cheerio.load(html);
  const itens = $(`div[id='gallery-1'] img`);
  let dados = [];
  for (const item of itens) {
    dados.push({ url: item['attribs']['src'] });
  }
  return dados;
};

module.exports = { buscarImagens };
