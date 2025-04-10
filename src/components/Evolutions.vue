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
  } catch (error) {
    alert("algo deu errado!");
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
  </div>
</template>

<style scoped>
.evolutions {
  margin: 65px 0;
}

.evolutions ul {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: start;
  list-style-type: none;
  gap: 20px;
  margin-top: 20px;
}

.evolutions li {
  background-color: #f15151;
  color: #ffffff;
  width: max-content;
  max-width: 100%;
  padding: 5px 15px;
  border-radius: 7px;
}
</style>
