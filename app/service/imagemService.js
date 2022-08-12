const pastaDownload = './tmp/downloads';
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const { converterUrlImagemParaNomeArquivo } = require('../util/url');
const { spawn } = require('child_process');

const download = async (url) => {
  let requestConfig = {
    responseType: 'stream',
  };

  if (!fs.existsSync(pastaDownload)) {
    fs.mkdirSync(pastaDownload, { recursive: true });
  }

  const nomeArquivo = converterUrlImagemParaNomeArquivo(url);
  const writer = fs.createWriteStream(path.join(pastaDownload, nomeArquivo));

  const response = await axios.get(url, requestConfig);
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    response.data.on('end', () => {
      resolve(nomeArquivo);
    });

    response.data.on('error', () => {
      reject(false);
    });
  });
};

const metadata = async (nomeArquivo) => {
  const child = spawn('file', [`${pastaDownload}/${nomeArquivo}`]);

  let data = '';
  for await (const chunk of child.stdout) {
    data += chunk;
  }

  let error = '';
  for await (const chunk of child.stderr) {
    console.error('stderr chunk: ' + chunk);
    error += chunk;
  }

  if (error) {
    throw new Error(`Ocorreu um erro ao ler os metadados do arquivo. (${nomeArquivo}), ${error}`);
  }
  const exitCode = await new Promise((resolve, reject) => {
    child.on('close', resolve);
  });

  if (exitCode) {
    throw new Error(`Ocorreu um erro ao ler os metadados do arquivo. ${exitCode}. (${nomeArquivo}), ${error}`);
  }

  return {
    completo: data,
    software: obterPropriedade(data, 'software'),
    description: obterPropriedade(data, 'description'),
  };
};

const obterPropriedade = (metadata, propriedade) => {
  if (!metadata) {
    return '';
  }
  let arrayMetadata = metadata.split(`${propriedade}=`);

  if (arrayMetadata.length <= 1) {
    return '';
  }

  arrayMetadata = arrayMetadata[1].split(',');
  if (arrayMetadata.length <= 1) {
    return '';
  } else {
    return arrayMetadata[0];
  }
};

module.exports = {
  download,
  metadata,
};
