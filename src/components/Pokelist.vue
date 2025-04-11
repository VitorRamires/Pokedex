<script setup>
import { ref, onMounted, watch } from "vue";
import {
  getAllTypes,
  pokemonList,
  getPokemonByTypes,
} from "../api/getPokelist.js";
import Pokeinfo from "./Pokeinfo.vue";

const pokeList = ref([]);
const scrollPokemons = ref([]);
const allTypes = ref([]);

//Filtros
let filteredPokemons = ref([]);
const filterName = ref("");
const filterID = ref("");
const filterType = ref("");

//scroll
const limit = ref(20);
let offset = ref(0);
const fetching = ref(false);

// Estado para controlar a expansão dos filtros
const isExpanded = ref(false);

// Filtrando pelo nome ao mudar o valor do input
watch(filterName, (newValue) => {
  if (newValue === "") {
    filteredPokemons.value = scrollPokemons.value;
  } else {
    filteredPokemons.value = pokeList.value.filter((pokemon) => {
      return pokemon.name.toLowerCase().includes(newValue.toLowerCase());
    });
  }
});

// Filtrando pelo ID ao mudar o valor do input
watch(filterID, (newValue) => {
  if (newValue === "") {
    filteredPokemons.value = scrollPokemons.value;
  } else {
    filteredPokemons.value = pokeList.value.filter((pokemon) => {
      return pokemon.id == newValue;
    });
  }
});

// Filtrando pelo Tipo ao mudar o valor do select
watch(filterType, async (newValue) => {
  if (newValue === "") {
    filteredPokemons.value = scrollPokemons.value;
  } else {
    const typePokemons = await getPokemonByTypes(newValue);
    filteredPokemons.value = typePokemons;
  }
});

onMounted(async () => {
  await getAllPokemons();
  addPokemons();
  const reponseTypes = await getAllTypes();
  allTypes.value.push(...reponseTypes.results);
  window.addEventListener("scroll", endScreen);
});

// Pega a lista de todos os pokemons existentes
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

// Salva de 20 em 20 pokenons numa nova array
async function addPokemons() {
  scrollPokemons.value.push(
    ...pokeList.value.slice(offset.value, offset.value + limit.value)
  );
  offset.value += limit.value;
  filteredPokemons.value = scrollPokemons.value;
}

// Calcula o final da tela para aplicar a iteração do scroll
function endScreen() {
  let scrollTop = document.documentElement.scrollTop;
  let heightWindow = document.documentElement.offsetHeight;
  let clientHeight = document.documentElement.clientHeight;

  if (filterName.value || filterID.value || filterType.value) {
    return;
  }

  if (scrollTop + clientHeight >= heightWindow - 350) {
    addPokemons();
  }
}

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}
</script>

<template>
  <div class="content">
    <div class="filters" :class="{ expanded: isExpanded }">
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
            <option value="">Todos</option>
            <option :value="type.id" v-for="type in allTypes">
              {{ type.name }}
            </option>
          </select>
        </div>
      </div>
      <h2 class="arrow" @click="toggleExpand">
        <img src="../assets/arrow.svg" alt="" />
      </h2>
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
.arrow {
  display: none;
  margin-top: 30px;
}

.arrow img {
  width: 30px;
  height: auto;
}

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
  padding: 25px 35px 35px 35px;
  font-family: "Nunito";
  background: #2e2e2ec9;
  color: #ececec;
  z-index: 55;
  text-align: center;
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

.filter input,
.filter select {
  width: 100%;
  padding: 8px 10px;
  border-radius: 5px;
  border: none;
  background-color: #f1f1f1;
  outline: none;
  border: 2px solid transparent;
}

.filter input:focus,
.filter select:focus {
  border: 2px solid #00f7ff;
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

@media screen and (max-width: 790px) {
  .content {
    width: 100%;
    flex-direction: column;
    align-items: unset;
  }

  .arrow {
    display: block;
    position: fixed;
    top: 50px;
    left: 50%;
    transform: translateX(-50%) rotate(180deg);
    cursor: pointer;
    z-index: 66;
    transition: 0.4s;
  }

  .expanded .arrow {
    transform: translateX(-50%) rotate(0deg);
  }

  .filters {
    position: fixed;
    top: 0;
    left: 0;
    height: 150px;
    width: 100%;
    backdrop-filter: blur(30px);
    overflow: hidden;
    transition: 0.4s;
  }

  .filters h2 {
    margin-bottom: 100px;
  }

  .filter {
    text-align: start;
  }

  .pokemon-list {
    margin-top: 140px;
    padding: 40px 15px;
  }

  .pokemon {
    margin-top: 15px;
  }

  .filters.expanded {
    height: 470px;
    max-height: 100%;
  }
}

@media screen and (max-width: 330px) {
  .filters h2 {
    font-size: 1.2rem;
    text-align: center;
  }
}

@media screen and (max-height: 425px) {
  .filters {
    overflow: auto;
  }
}
</style>
