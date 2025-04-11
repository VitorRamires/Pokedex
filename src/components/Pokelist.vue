<script setup>
import { ref, onMounted, watch } from "vue";
import { getAllTypes, pokemonList } from "../api/getPokelist.js";
import Pokeinfo from "./Pokeinfo.vue";

const pokeList = ref([]);
const scrollPokemons = ref([]);
const allTypes = ref([]);

const filterName = ref("");
const filterID = ref("");
const filterType = ref("");

const limit = ref(20);
const fetching = ref(false);
let offset = ref(0);
let filteredPokemons = ref([]);

watch(filterName, (newValue) => {
  if (newValue === "") {
    filteredPokemons.value = scrollPokemons.value;
  } else {
    filteredPokemons.value = pokeList.value.filter((pokemon) => {
      return pokemon.name.toLowerCase().includes(newValue.toLowerCase());
    });
  }
});

watch(filterID, (newValue) => {
  if (newValue === "") {
    filteredPokemons.value = scrollPokemons.value;
  } else {
    filteredPokemons.value = pokeList.value.filter((pokemon) => {
      return pokemon.id == newValue;
    });
  }
});

watch(filterType, async (newValue) => {
  if (newValue === "") {
    filteredPokemons.value = scrollPokemons.value;
  } else {
    const typePokemons = await getPokemonByTypes(newValue);
    filteredPokemons.value = typePokemons;
  }
});

async function getPokemonByTypes(type) {
  const response = await fetch(`https://pokeapi.co/api/v2/type/${type}/`);
  const typeInfo = await response.json();

  const allPokemons = typeInfo.pokemon
  const finalPokemonList = allPokemons.map(pokemonInfo => {
    return pokemonInfo.pokemon
  })

  return finalPokemonList;
}

onMounted(async () => {
  await getAllPokemons();
  addPokemons();
  const reponseTypes = await getAllTypes();
  allTypes.value.push(...reponseTypes.results);
  window.addEventListener("scroll", endScreen);
});

async function getAllPokemons() {
  if (fetching.value) {
    return;
  }

  fetching.value = true;
  const response = await pokemonList();
  try {
    pokeList.value.push(...response.results);
  } catch {
    alert("Erro ao carregar mais pokemons!");
  } finally {
    fetching.value = false;
  }
}

async function addPokemons() {
  scrollPokemons.value.push(
    ...pokeList.value.slice(offset.value, offset.value + limit.value)
  );
  offset.value += limit.value;

  filteredPokemons.value = scrollPokemons.value;
}

function endScreen() {
  let scrollTop = document.documentElement.scrollTop;
  let heightWindow = document.documentElement.offsetHeight;
  let clientHeight = document.documentElement.clientHeight;

  if (scrollTop + clientHeight >= heightWindow - 350) {
    addPokemons();
  }
}
</script>

<template>
  <div class="content">
    <div class="filters">
      <h2>Filtros de pokemons</h2>
      <div class="filter">
        <p>Nome do pokemon</p>
        <input type="text" v-model="filterName" />
      </div>

      <div class="filter">
        <p>ID do pokemon</p>
        <input type="text" v-model="filterID" />
      </div>

      <div class="filter">
        <p>Tipos</p>
        <div class="types">
          <select name="" id="" v-model="filterType">
            <option :value="type.id" v-for="type in allTypes">
              {{ type.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="pokemon-list" v-if="filteredPokemons.length !== 0">
      <div
        v-for="pokemon in filteredPokemons"
        :key="pokemon.name"
        class="pokemon"
      >
        <h2>
          {{ pokemon.name }}
        </h2>
        <Pokeinfo :pokemonUrl="pokemon.url" />
      </div>
    </div>

    <div class="teste" v-else>NENHUM POKEMON ENCONTRADO!</div>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  align-items: start;
  justify-content: space-between;
}

.filters {
  position: sticky;
  width: 400px;
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
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 45px;
  padding: 40px;
}

.pokemon {
  position: relative;
  background-color: #2e2e2e52;
  color: #ffffff;
  width: 420px;
  max-width: 100%;
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
    padding: 40px 15px;
  }

  .pokemon {
    margin-top: 15px;
  }
}
</style>
