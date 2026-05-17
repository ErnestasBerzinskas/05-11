let allPokemon = [];

/* =========================
   EVOLUTION SYSTEM
========================= */
async function loadEvolution(data) {
  let species = await fetch(data.species.url);
  let speciesData = await species.json();

  let evo = await fetch(speciesData.evolution_chain.url);
  let evoData = await evo.json();

  let evoDiv = document.getElementById("evolution");
  evoDiv.innerHTML = "<h3>Evolution</h3>";

  function getEvolutions(chain) {
    let list = [];
    let current = chain;

    while (current) {
      list.push(current.species.name);

      current = current.evolves_to.length
        ? current.evolves_to[0]
        : null;
    }

    return list;
  }

  let evoList = getEvolutions(evoData.chain);

  for (let name of evoList) {
    let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    let pokeData = await res.json();

    let card = document.createElement("div");
    card.classList.add("card");

    card.style.display = "inline-block";
    card.style.margin = "10px";
    card.style.cursor = "pointer";
    card.style.width = "140px";

    card.innerHTML = `
      <img src="${pokeData.sprites.front_default}">
      <p>${name.toUpperCase()}</p>
    `;

    card.addEventListener("click", () => {
      getPokemonByData(pokeData);
      loadEvolution(pokeData);
    });

    evoDiv.appendChild(card);
  }
}

/* =========================
   MAIN SEARCH (NAME + ID)
========================= */
async function getPokemon() {
  let input = document
    .getElementById("pokemonName")
    .value
    .toLowerCase()
    .trim();

  if (!input) return;

  try {
    let response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${input}`
    );

    if (!response.ok) {
      alert("Pokémon not found!");
      return;
    }

    let data = await response.json();

    document.getElementById("info").classList.remove("hidden");
    document.getElementById("stats").classList.remove("hidden");
    document.getElementById("evolution").classList.remove("hidden");

    document.getElementById("name").innerText =
      data.name.toUpperCase();

    document.getElementById("image").src =
      data.sprites.front_default;

    document.getElementById("id").innerText =
      "ID: #" + data.id;

    document.getElementById("type").innerText =
      "Type: " + data.types.map(t => t.type.name).join(", ");

    document.getElementById("height").innerText =
      "Height: " + data.height;

    document.getElementById("weight").innerText =
      "Weight: " + data.weight;

    document.getElementById("ability").innerText =
      "Ability: " + data.abilities.map(a => a.ability.name).join(", ");

    document.getElementById("hp").innerText =
      "HP: " + data.stats[0].base_stat;

    document.getElementById("attack").innerText =
      "Attack: " + data.stats[1].base_stat;

    document.getElementById("defense").innerText =
      "Defense: " + data.stats[2].base_stat;

    document.getElementById("speed").innerText =
      "Speed: " + data.stats[5].base_stat;

    await loadEvolution(data);

  } catch (err) {
    alert("Error loading Pokémon");
  }
}

/* =========================
   LOAD POKEMON LIST (20 CARDS)
========================= */
async function loadPokemonList() {
  let response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=100000"
  );

  let data = await response.json();
  allPokemon = data.results;

  showPokemonCards(allPokemon.slice(0, 20));
}

/* =========================
   SHOW CARDS
========================= */
async function showPokemonCards(list) {
  const container = document.getElementById("pokemonContainer");

  container.innerHTML = "";

  for (let pokemon of list.slice(0, 20)) {
    let response = await fetch(pokemon.url);
    let data = await response.json();

    let card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${data.sprites.front_default}">
      <h2>${data.name.toUpperCase()}</h2>
      <p>ID: #${data.id}</p>
      <p>Type: ${data.types.map(t => t.type.name).join(", ")}</p>
    `;

    card.addEventListener("click", () => {
      getPokemonByData(data);
      loadEvolution(data);
    });

    container.appendChild(card);
  }
}

/* =========================
   POKEDEX VIEW
========================= */
function getPokemonByData(data) {
  document.getElementById("info").classList.remove("hidden");
  document.getElementById("stats").classList.remove("hidden");
  document.getElementById("evolution").classList.remove("hidden");

  document.getElementById("name").innerText =
    data.name.toUpperCase();

  document.getElementById("image").src =
    data.sprites.front_default;

  document.getElementById("id").innerText =
    "ID: #" + data.id;

  document.getElementById("type").innerText =
    "Type: " + data.types.map(t => t.type.name).join(", ");

  document.getElementById("height").innerText =
    "Height: " + data.height;

  document.getElementById("weight").innerText =
    "Weight: " + data.weight;

  document.getElementById("ability").innerText =
    "Ability: " + data.abilities.map(a => a.ability.name).join(", ");

  document.getElementById("hp").innerText =
    "HP: " + data.stats[0].base_stat;

  document.getElementById("attack").innerText =
    "Attack: " + data.stats[1].base_stat;

  document.getElementById("defense").innerText =
    "Defense: " + data.stats[2].base_stat;

  document.getElementById("speed").innerText =
    "Speed: " + data.stats[5].base_stat;
}

/* =========================
   LIVE SEARCH (NAME + ID FIXED)
========================= */
document.getElementById("pokemonName").addEventListener("input", function () {
  let value = this.value.toLowerCase().trim();

  if (!value) {
    showPokemonCards(allPokemon);
    return;
  }

  let filtered = allPokemon.filter(pokemon => {
    let nameMatch = pokemon.name.startsWith(value);

    let id = pokemon.url.split("/").filter(Boolean).pop();
    let idMatch = id === value;

    return nameMatch || idMatch;
  });

  showPokemonCards(filtered);
});

/* =========================
   START APP
========================= */
loadPokemonList();