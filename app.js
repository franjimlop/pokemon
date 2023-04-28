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
        <h1>${item.name.charAt(0).toUpperCase() + item.name.slice(1)}</h1>
        <img class="my-3" src="${item.sprites.front_default}">
        <p>Tipo: ${item.types.map(type => type.type.name).join(", ")}</p>
        <p>Altura: ${item.height / 10} m</p>
        <p>Peso: ${item.weight} kg</p>
        </div>`;
        //puedo añadir abilities y moves y poner todos los sprites
        resultados.appendChild(cardItem);
    });
    console.log(pokemon);
});