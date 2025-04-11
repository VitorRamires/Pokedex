export async function pokemonList() {
  const limit = 1400;

  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/?limit=${limit}`
  );
  const listPokemons = await response.json();

  const newPokemons = listPokemons.results.map((pokemon) => {
    const urlPokemon = pokemon.url.split("/");
    const pokemonID = urlPokemon[urlPokemon.length - 2];
    pokemon = { ...pokemon, id: pokemonID };
    return pokemon;
  });

  return { ...listPokemons, results: newPokemons };
}

export async function pokemonInfos(pokemonUrl) {
  const response = await fetch(`${pokemonUrl}`);
  const informations = await response.json();

  return informations;
}

export async function getAllTypes() {
  const response = await fetch("https://pokeapi.co/api/v2/type?&limit=21");
  const types = await response.json();

  const newTypes = types.results.map((type) => {
    const urlTypes = type.url.split("/");
    const typeId = urlTypes[urlTypes.length - 2];
    type = { ...type, id: typeId };
    return type;
  });

  return { ...types, results: newTypes };
}

export async function getPokemonByTypes(type) {
  const response = await fetch(`https://pokeapi.co/api/v2/type/${type}/`);
  const typeInfo = await response.json();

  const allPokemons = typeInfo.pokemon
  const finalPokemonList = allPokemons.map(pokemonInfo => {
    return pokemonInfo.pokemon
  })

  return finalPokemonList;
}
