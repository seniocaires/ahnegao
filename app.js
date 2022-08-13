const express = require('express');
const app = express();
const port = 3000;
const imagemScrapper = require('./app/scrappers/imagemScrapper');
const imagemService = require('./app/service/imagemService');
const clearDownloadScheduler = require('./app/schedulers/clearDownloadScheduler');
const cors = require('cors');

app.use(cors());

app.get('/analise', async (req, res) => {
  try {
    const imagens = await imagemScrapper.buscarImagens(req.query.url);
    for (let imagem of imagens) {
      imagem.nomeArquivo = await imagemService.download(imagem.url);
      imagem.metadata = await imagemService.metadata(imagem.nomeArquivo);
    }
    res.send(imagens);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.use(express.static(__dirname + '/vue/dist'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/vue/dist/index.html');
});

app.listen(port, () => {
  clearDownloadScheduler();
  console.log(`Example app listening on port ${port}`);
});
