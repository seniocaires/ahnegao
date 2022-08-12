function converterUrlImagemParaNomeArquivo(url) {
  return url.split(':').join('_').split('/').join('_');
}

module.exports = {
  converterUrlImagemParaNomeArquivo,
};
