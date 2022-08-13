# AhNegão

https://www.ahnegao.com.br/

Software acessa a coletânea de memes e retorna as imagens de acordo com o filtro selecionado.

Quando o usuário informa a url e seleciona um tipo de filtro, os parâmetros de pesquisa são enviados para o backend.

No backend é utilizado um Web Scrapper para baixar as imagens, em seguida são extraídos os metadados dos arquivos e os dados são devolvidos para o frontend.

### Stack

- NodeJS
- VueJS

### Subindo a aplicação

Construa a imagem com Docker
```
docker build -t ahnegao .
```

Inicie o container
```
docker run -it --rm -p 3000:3000 ahnegao
```

Acesse http://localhost:3000

### Telas do sistema

![](https://github.com/seniocaires/ahnegao/blob/main/docs/video.gif)
