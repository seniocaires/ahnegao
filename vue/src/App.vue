<template>
  <form @submit.prevent="buscar()">
    Informe o link da coletânea de <strong>memes</strong> aleatórios
    <div id="barraPesquisa">
      <input type="text" id="pesquisa" v-model="url" name="pesquisa" placeholder="Cole o link aqui ..." />
      <select v-model="filtro">
        <option value="moldiv">Processed with MOLDIV</option>
        <option value="photoshop">Photoshop</option>
        <option value="todas">Todas</option>
      </select>
      <button type="submit"><i class="fa fa-search"></i></button>
    </div>
    <section class="imagens">
      <div v-if="pesquisou && imagens.length == 0">Nenhuma imagem encontrada</div>
      <div v-for="item in imagens" :key="item.url">
        <img :src="item.url" alt="imagem" />
      </div>
    </section>
    <div id="cover-spin" v-if="pesquisando"></div>
  </form>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  components: {},
  data() {
    return {
      url: '',
      imagens: [],
      filtro: 'moldiv',
      pesquisou: false,
      pesquisando: false,
    };
  },
  methods: {
    buscar() {
      if (!this.url || !this.url.startsWith('https://www.ahnegao.com.br')) {
        alert('Informe o link corretamente');
      } else {
        this.imagens = [];
        this.pesquisando = true;
        axios
          .get(`http://localhost:3000/analise?url=${this.url}`)
          .then((responseImagens) => {
            this.pesquisando = false;
            this.pesquisou = true;
            for (const imagem of responseImagens.data) {
              if (
                (this.filtro == 'moldiv' && imagem.metadata && imagem.metadata.description.toLowerCase().includes('processed with moldiv')) || //
                (this.filtro == 'photoshop' && imagem.metadata && imagem.metadata.software.toLowerCase().includes('photoshop')) || //
                (this.filtro == 'todas')
              ) {
                this.imagens.push(imagem);
              }
            }
          })
          .catch((error) => {
            this.pesquisando = false;
            console.dir(error);
            if (error.code == 'ERR_NETWORK') {
              alert('Serviço indisponível no momento. Tente novamente mais tarde.');
            } else {
              alert(`Ocorreu um erro. ${error && error.response && error.response.data ? JSON.stringify(error.response.data) : ''}`);
            }
          });
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
* {
  box-sizing: border-box;
}
input[type='text'] {
  padding: 10px;
  font-size: 17px;
  border: 1px solid grey;
  float: left;
  width: 65%;
  background: #f1f1f1;
}
select {
  padding: 10px;
  font-size: 17px;
  border: 1px solid grey;
  float: left;
  width: 30%;
  background: #f1f1f1;
}
#barraPesquisa {
  max-width: 900px;
  margin: auto;
}
#barraPesquisa::after {
  content: '';
  clear: both;
  display: table;
}
button {
  float: left;
  width: 5%;
  padding: 10px;
  background: gray;
  color: white;
  font-size: 17px;
  border: 1px solid grey;
  border-left: none; /* Prevent double borders */
  cursor: pointer;
}
button:hover {
  background: #979797;
}
.imagens div {
  padding: 10px;
  width: 100%;
  float: left;
}
#cover-spin {
  position: fixed;
  width: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 9999;
  display: block;
}

@-webkit-keyframes spin {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

#cover-spin::after {
  content: '';
  display: block;
  position: absolute;
  left: 48%;
  top: 40%;
  width: 40px;
  height: 40px;
  border-style: solid;
  border-color: black;
  border-top-color: transparent;
  border-width: 4px;
  border-radius: 50%;
  -webkit-animation: spin 0.8s linear infinite;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
