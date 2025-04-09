<script setup>
import { ref, onMounted } from "vue";
import { pokemonList } from "../api/getPokelist.js";
import Pokeinfo from "./Pokeinfo.vue";

const pokeList = ref([]);
const filterPokemon = "";

onMounted(async () => {
  pokeList.value = await pokemonList(filterPokemon.value);
});
</script>

<template>
  <div class="content">
    <div class="filters">
      <h2>Filtros de pokemons</h2>
      <div class="filter">
        <p>Nome do pokemon</p>
        <input type="text" v-model="filterPokemon" />
      </div>

      <div class="filter">
        <p>ID do pokemon</p>
        <input type="text" v-model="filterPokemon" />
      </div>

      <div class="filter">
        <p>Espécie do pokemon</p>
        <input type="text" v-model="filterPokemon" />
      </div>
    </div>

    <div class="pokemon-list">
      <div v-for="pokemon in pokeList.results" class="pokemon">
        <h2>
          {{ pokemon.name }}
        </h2>

        <Pokeinfo :pokemonUrl="pokemon.url" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  align-items: start;
  justify-content: center;
}

.filters {
  position: sticky;
  width: 600px;
  max-width: 100%;
  left: 0;
  top: 0;
  height: 100vh;
  padding: 35px;
  font-family: "Nunito";
  background: #2e2e2ec9;
  color: #ececec;
  z-index: 55;
}

.filters h2 {
  margin-bottom: 55px;
}

.filter {
  width: 100%;
  margin: 25px 0;
}

.filter p {
  margin-bottom: 10px;
  font-weight: 600;
}

.filter input {
  width: 100%;
  padding: 8px 10px;
  border-radius: 5px;
  border: none;
  background-color: #f1f1f1;
  outline: none;
}

.pokemon-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 45px;
  padding: 40px;
}

.pokemon {
  position: relative;
  background-color: #2e2e2e52;
  color: #ffffff;
  height: 520px;
  overflow: auto;
  text-align: center;
  font-family: "Nunito";
  border-radius: 5px;
}

.pokemon::-webkit-scrollbar {
  width: 6px;
  background: #00f7ff1c;
}

.pokemon::-webkit-scrollbar-track {
  background: #00f7ff1c;
}

.pokemon::-webkit-scrollbar-thumb {
  background: #00f7ff;
  border-radius: 5px;
}

.pokemon h2 {
  position: sticky;
  top: 0;
  font-size: 2rem;
  margin-bottom: 30px;
  background: linear-gradient(90deg, #222222, #292929);
  z-index: 15;
  padding: 20px 0;
}

.modal {
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: red;
  overflow: auto;
}

.filter {
  position: relative;
}

@media screen and (max-width: 790px) {
  .content {
    width: 100%;
    flex-direction: column;
    align-items: unset;
  }

  .filters {
    height: 100px;
    width: 100%;
    backdrop-filter: blur(30px);
    overflow: hidden;
  }

  .pokemon-list {
    display: block;
    padding:40px 15px;
  }

  .pokemon{
    margin-top:15px;
  }
}
</style>
