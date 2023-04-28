// Constante que guarda la URL base de la PokeAPI
const url = 'https://pokeapi.co/api/v2/';

// Función que devuelve una promesa que se resuelve con todos los Pokemon
async function obtenerPokemon() {
    // Hacemos una solicitud para obtener la cantidad total de Pokemon
    const response = await fetch(`${url}pokemon/`);
    const data = await response.json();
    const totalPokemon = data.count;

    // Calculamos la cantidad de páginas necesarias para obtener todos los Pokemon
    const paginas = Math.ceil(totalPokemon / 20);

    // Hacemos una solicitud para cada página y combinamos los resultados
    const resultados = [];
    for (let i = 1; i <= paginas; i++) {
        const response = await fetch(`${url}pokemon/?limit=20&offset=${(i - 1) * 20}`);
        const data = await response.json();
        resultados.push(...data.results);
    }

    // Hacemos una solicitud para cada Pokemon para obtener su información completa
    const pokemon = await Promise.all(resultados.map(async (resultado) => {
        const response = await fetch(resultado.url);
        return response.json();
    }));

    return pokemon;
}

// Objeto que uso en obtenerPokemon() para enlazar los nombres de los tipos a las rutas de sus imágenes
const tipoImagenes = {
    normal: "img/normal.png",
    fire: "img/fuego.png",
    water: "img/agua.png",
    electric: "img/electrico.png",
    grass: "img/planta.png",
    ice: "img/hielo.png",
    fighting: "img/lucha.png",
    poison: "img/veneno.png",
    ground: "img/tierra.png",
    flying: "img/volador.png",
    psychic: "img/psiquico.png",
    bug: "img/bicho.png",
    rock: "img/roca.png",
    ghost: "img/fantasma.png",
    dragon: "img/dragon.png",
    dark: "img/siniestro.png",
    steel: "img/acero.png",
    fairy: "img/hada.png",
  };

// Llamamos a la función y creamos nuestras tarjetas de Pokemon
obtenerPokemon().then((pokemon) => {
    const resultados = document.querySelector("#resultados");
    resultados.innerHTML = '';

    // Creamos una tarjeta para cada Pokemon
    pokemon.map((item) => {
        const cardItem = document.createElement('div');
        cardItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'col-xl-3');
        cardItem.innerHTML = `
        <div class="card">
        <p class="numPokedex">${item.id}</p>
        <h1 class="nombrePokemon">${item.name.charAt(0).toUpperCase() + item.name.slice(1)}</h1>
        <img src="${item.sprites.front_default}">
        <p>${item.types.map(type => `<img src="${tipoImagenes[type.type.name]}" alt="${type.type.name}">`).join(" ")}</p>
        <p>Altura: ${item.height / 10} m</p>
        <p>Peso: ${item.weight} kg</p>
        </div>`;
        //puedo añadir abilities y moves y poner todos los sprites
        resultados.appendChild(cardItem);
    });
    console.log(pokemon);
});