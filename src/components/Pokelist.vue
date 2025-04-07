<script setup>
import { ref, onMounted } from "vue";
import { pokemonList } from "../api/getPokelist.js";
import Pokeinfo from "./Pokeinfo.vue";

const pokeList = ref([]);

onMounted(async () => {
  pokeList.value = await pokemonList();
});
</script>

<template>
  <div class="pokemon-list">
    <div v-for="pokemon in pokeList.results" class="pokemon">
      <h2>
        Nome: <span>{{ pokemon.name }}</span>
      </h2>
      <Pokeinfo :pokemonUrl="pokemon.url" />
    </div>
  </div>
</template>

<style scoped></style>
