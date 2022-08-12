const express = require('express');
const app = express();
const port = 3000;

const imagemScrapper = require('./app/scrappers/imagemScrapper');
const imagemService = require('./app/service/imagemService');

const clearDownloadScheduler = require('./app/schedulers/clearDownloadScheduler');

app.get('/analise', async (req, res) => {
  try {
    const imagens = await imagemScrapper.buscarImagens('https://www.ahnegao.com.br/2022/08/coletanea-de-memes-aleatorios-de-quinta-feira-111.html');
    for (let imagem of imagens) {
      imagem.nomeArquivo = await imagemService.download(imagem.url);
      imagem.metadata = await imagemService.metadata(imagem.nomeArquivo);
    }
    res.send(imagens);
  } catch (error) {
    next(error);
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  clearDownloadScheduler();
  console.log(`Example app listening on port ${port}`);
});
