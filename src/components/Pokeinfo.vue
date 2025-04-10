<script setup>
import { ref, onMounted } from "vue";
import { pokemonInfos } from "../api/getPokelist.js";
import Evolutions from "../components/Evolutions.vue";
import Sprites from "./sprites.vue";

const props = defineProps({
  pokemonUrl: String,
});
const pokeInfo = ref(null);
const speciesUrl = ref(null);

onMounted(async () => {
  try {
    pokeInfo.value = await pokemonInfos(props.pokemonUrl);
    speciesUrl.value = pokeInfo.value.species.url;
  } catch (error) {
    alert("algo deu errado!");
  }
});
</script>

<template>
  <div class="sprites" v-if="pokeInfo && pokeInfo.sprites">
    <Sprites
      :frontDefault="pokeInfo.sprites.front_default"
      :backDefault="pokeInfo.sprites.back_default"
      :frontShiny="pokeInfo.sprites.front_shiny"
      :backShiny="pokeInfo.sprites.back_shiny"
    />
  </div>

  <div class="pokemom-infos">
    <div class="moves" v-if="pokeInfo && pokeInfo.moves">
      <h3>Movimentos</h3>

      <ul>
        <li v-for="move in pokeInfo.moves" :key="move.move.name">
          <p>{{ move.move.name }}</p>
        </li>
      </ul>
    </div>

    <div class="evolutions" v-if="speciesUrl">
      <Evolutions :speciesUrl="speciesUrl" />
    </div>

    <div class="game-indices" v-if="pokeInfo && pokeInfo.game_indices">
      <h3>Incluídos nos games:</h3>
      <ul>
        <li v-for="indice in pokeInfo.game_indices" :key="indice.version.name">
          <p>Pokemon: {{ indice.version.name }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.moves h3 {
  margin-bottom: 25px;
  font-size: 1.5rem;
}

.moves ul {
  list-style-type: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.moves li {
  background-color: #fcf7d5;
  padding: 8px 5px;
  text-align: center;
  border-radius: 4px;
}

.moves li p {
  font-size: 1.1rem;
  color: #000000;
}

.pokemom-infos {
  text-align: start;
  padding: 15px;
  width: 100%;
  border-radius: 15px;
  margin-top: 40px;
}

.game-indices h3 {
  margin-bottom: 25px;
}

.game-indices ul {
  display: flex;
  flex-wrap: wrap;
  list-style-type: none;
  gap: 15px;
}

.game-indices li {
  background-color: #3b4cca;
  padding: 8px 5px;
  text-align: center;
  border-radius: 4px;
}
</style>
