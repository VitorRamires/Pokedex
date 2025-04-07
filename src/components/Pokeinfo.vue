<script setup>
import { ref, onMounted } from "vue";
import { pokemonInfos } from "../api/getPokelist.js";
import Evolutions from "../components/Evolutions.vue";

const props = defineProps({
  pokemonUrl: String,
});
const pokeInfo = ref(null);
const speciesUrl = ref(null);

onMounted(async () => {
  try {
    pokeInfo.value = await pokemonInfos(props.pokemonUrl);
    speciesUrl.value = pokeInfo.value.species.url;

    console.log(pokeInfo.id);
  } catch (error) {
    console.error("Erro ao buscar informações do Pokémon:", error);
  }
});
</script>

<template>
  <div class="sprites" v-if="pokeInfo && pokeInfo.sprites">
    <h3>Sprites</h3>
    <img :src="pokeInfo.sprites.front_default" alt="Sprite frontal" />
    <img :src="pokeInfo.sprites.back_default" alt="Sprite traseira" />
    <img :src="pokeInfo.sprites.front_shiny" alt="Sprite frontal shiny" />
    <img :src="pokeInfo.sprites.back_shiny" alt="Sprite traseira shiny" />
  </div>

  <div class="abilities">
    <h3>Habilidades</h3>
    <ul v-if="pokeInfo && pokeInfo.moves">
      <li v-for="move in pokeInfo.moves" :key="move.move.name">
        <p>{{ move.move.name }}</p>
      </li>
    </ul>
    <p v-else>Carregando as habilidades do pokemon...</p>
  </div>

  <div class="evolutions" v-if="speciesUrl">
    <Evolutions :speciesUrl="speciesUrl" />
  </div>

  <div class="game-indices">
    <h3>Incluídos nos games:</h3>
    <ul v-if="pokeInfo && pokeInfo.game_indices">
      <li v-for="indice in pokeInfo.game_indices" :key="indice.version.name">
        <p>Pokemon{{ indice.version.name }}</p>
      </li>
    </ul>
    <p v-else>Carregando as habilidades do pokemon...</p>
  </div>
</template>

<style scoped></style>
