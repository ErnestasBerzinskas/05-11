async function getPokemon() {
  let pokemon = document
    .getElementById("pokemonName")
    .value
    .toLowerCase();

  let response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemon}`
  );

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

  let species = await fetch(data.species.url);
  let speciesData = await species.json();

  let evo = await fetch(speciesData.evolution_chain.url);
  let evoData = await evo.json();

  let evoDiv = document.getElementById("evolution");
  evoDiv.innerHTML = "<h3>Evolution</h3>";

  let currentStep = evoData.chain;

  while (currentStep) {
    let evoName = currentStep.species.name;
    let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${evoName}`);
    let pokeData = await res.json();

    evoDiv.innerHTML += `
      <div style="display:inline-block; text-align:center; margin: 10px;">
        <img src="${pokeData.sprites.front_default}" alt="${evoName}">
        <p>${evoName.toUpperCase()}</p>
      </div>
    `;

    if (currentStep.evolves_to.length > 0) {
      currentStep = currentStep.evolves_to[0];
    } else {
      currentStep = null;
    }
  }
}
