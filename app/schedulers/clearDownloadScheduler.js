const schedule = require('node-schedule');
const pastaDownload = './tmp/downloads';
const path = require('path');
const fs = require('fs');

/**
 * Schedule para limpar downloads antigos.
 * O schedule irá apagar arquivos da pasta
 * downloads que foram criados à mais de 30 minutos
 */
module.exports = () => {
  schedule.scheduleJob('10 * * * *', async function () {
    // Roda a cada hora no minuto 10

    console.info('Rodando schedule: Limpar downloads.');

    if (fs.existsSync(pastaDownload)) {
      fs.readdirSync(pastaDownload).forEach((arquivo) => {
        fs.stat(path.join(pastaDownload, arquivo), function (erroStat, stat) {
          let dataLimite, dataAtual;
          if (erroStat) {
            console.error(erroStat);
          }

          dataAtual = new Date().getTime();
          dataLimite = new Date(stat.ctime).getTime() + 1800000;

          if (dataAtual > dataLimite) {
            fs.unlink(path.join(pastaDownload, arquivo), function (erroApagarArquivo) {
              if (erroApagarArquivo) {
                console.error(erroApagarArquivo);
              }
            });
          }
        });
      });
    }
  });
};
