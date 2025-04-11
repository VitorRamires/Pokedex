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
        <p>Nome / espécie do pokemon</p>
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

    <div class="not-found" v-else>
      <img src="/src/assets/not-found.svg" alt="" />
      <p>Ops... Nenhum Pokemon foi encontrado</p>
    </div>
  </div>
</template>

<style scoped></style>
