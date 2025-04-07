<script setup>
import { ref, onMounted } from "vue";


const props = defineProps({
  speciesUrl: String,
});
const evolutions = ref(null);

onMounted(async () => {
  try {
    const speciesResponse = await fetch(props.speciesUrl);
    const speciesData = await speciesResponse.json();

    const evolutionResponse = await fetch(speciesData.evolution_chain.url);
    evolutions.value = await evolutionResponse.json();

    console.log(evolutions)
  } catch (error) {
    console.error("Erro ao buscar informações da evolução do Pokémon:", error);
  }
});

function evolutionChain(chain) {
  const evolutionNames = [];
  let current = chain;

  while (current) {
    evolutionNames.push(current.species.name);
    current = current.evolves_to[0];
  }

  return evolutionNames;
}
</script>

<template>
  <div class="evolutions">
    <h3>Cadeia de evoluções</h3>
    <ul v-if="evolutions && evolutions.chain">
      <li v-for="evo in evolutionChain(evolutions.chain)" :key="evo">
        {{ evo }}
      </li>
    </ul>
    <p v-else>Carregando evoluções...</p>
  </div>
</template>

<styled scoped>

</styled>
