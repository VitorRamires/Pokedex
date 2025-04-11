<script setup>
// import function to register Swiper custom elements
import { register } from "swiper/element/bundle";
// register Swiper custom elements
register();

const props = defineProps({
  frontDefault: String,
  backDefault: String,
  frontShiny: String,
  backShiny: String,
});
</script>

<template>
  <div class="sprites">
    <div
      class="swiper-content"
      v-if="props.frontDefault && props.backDefault && props.frontShiny && props.backShiny"
    >
      <swiper-container
        slides-per-view="1"
        space-between="5"
        :pagination="{
          hideOnClick: true,
        }"
      >
        <swiper-slide><img :src="props.frontDefault" alt="" /></swiper-slide>
        <swiper-slide><img :src="props.backDefault" alt="" /></swiper-slide>
        <swiper-slide><img :src="props.frontShiny" alt="" /></swiper-slide>
        <swiper-slide><img :src="props.backShiny" alt="" /></swiper-slide>
      </swiper-container>
    </div>
    <div class="not-images" v-else>
      <h3>O pokemom não possuí sprites disponíveis</h3>
    </div>
  </div>
</template>

<style scoped>
.sprites {
  cursor: grab;
}

.sprites img {
  width: 250px;
}

.sprites {
  margin: 100px 0;
}
</style>
