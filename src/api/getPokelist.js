export async function pokemonList() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon");
  const listPokemons = await response.json();

  return listPokemons;
}

export async function pokemonInfos(pokemonUrl) {
  const response = await fetch(`${pokemonUrl}`);
  const informations = await response.json();

  return informations;
}
