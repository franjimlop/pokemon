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
        <h1 class="nombrePokemon">${item.name.charAt(0).toUpperCase() + item.name.slice(1)}</h1>
        <p class="numPokedex">${item.id}</p>
        <img src="${item.sprites.front_default || 'img/logo.png'}">
        <p>${item.types.map(type => `<img class="imgTipo" src="${tipoImagenes[type.type.name]}" alt="${type.type.name}">`).join(" ")}</p>
        <p>Altura: ${item.height / 10} m</p>
        <p>Peso: ${item.weight} kg</p>
        </div>`;
        //puedo añadir abilities y moves y poner todos los sprites
        resultados.appendChild(cardItem);
    });
    console.log(pokemon);
});

// Constante para buscar pokemon
const search = async () => {
    // Obtener el valor del input de búsqueda
    const searchValue = document.querySelector('#buscador').value;

    // Comprobar si se ha introducido algún valor
    if (searchValue) {
        // Variable que guarda la url de la pokeAPI para buscar pokemon
        const url = `https://pokeapi.co/api/v2/pokemon/?limit=1118&offset=0`;

        // Hacemos una solicitud para obtener la lista completa de pokemon
        const response = await fetch(url);
        const data = await response.json();

        // Filtramos la lista de pokemon para obtener solo aquellos cuyo nombre contiene la cadena de búsqueda
        const filteredPokemon = data.results.filter((pokemon) => pokemon.name.includes(searchValue.toLowerCase()));

        // Hacemos una solicitud para cada Pokemon para obtener su información completa
        const pokemon = await Promise.all(filteredPokemon.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            return response.json();
        }));

        const resultados = document.querySelector("#resultados");
        resultados.innerHTML = '';

        // Creamos una tarjeta para cada Pokemon
        pokemon.map((item) => {
            const cardItem = document.createElement('div');
            cardItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'col-xl-3');
            cardItem.innerHTML = `
            <div class="card">
            <h1 class="nombrePokemon">${item.name.charAt(0).toUpperCase() + item.name.slice(1)}</h1>
            <p class="numPokedex">${item.id}</p>
            <img src="${item.sprites.front_default || 'img/logo.png'}">
            <p>${item.types.map(type => `<img class="imgTipo" src="${tipoImagenes[type.type.name]}" alt="${type.type.name}">`).join(" ")}</p>
            <p>Altura: ${item.height / 10} m</p>
            <p>Peso: ${item.weight} kg</p>
            </div>`;
            resultados.appendChild(cardItem);
        });
    } else {
        // Si no se ha introducido ningún valor, mostrar todos los personajes de la página actual
        obtenerPokemon().then((pokemon) => {
            const resultados = document.querySelector("#resultados");
            resultados.innerHTML = '';
            pokemon.map((item) => {
                const cardItem = document.createElement('div');
                cardItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'col-xl-3');
                cardItem.innerHTML = `
                <div class="card">
                <h1 class="nombrePokemon">${item.name.charAt(0).toUpperCase() + item.name.slice(1)}</h1>
                <p class="numPokedex">${item.id}</p>
                <img src="${item.sprites.front_default || 'img/logo.png'}">
                <p>${item.types.map(type => `<img class="imgTipo" src="${tipoImagenes[type.type.name]}" alt="${type.type.name}">`).join(" ")}</p>
                <p>Altura: ${item.height / 10} m</p>
                <p>Peso: ${item.weight} kg</p>
                </div>`;
                resultados.appendChild(cardItem);
            });
        });
    }
};

async function obtenerPokemonPorTipo() {
    // Hacemos una solicitud para obtener la cantidad total de tipos de Pokemon
    const urlTipos = await fetch('https://pokeapi.co/api/v2/type/');
    const tipos = await urlTipos.json();

    return tipos;
}

obtenerPokemonPorTipo().then((tipos) => {
    const resultados = document.querySelector("#filtroTipo");
    resultados.innerHTML = '';

    // Creamos un botón para cada tipo de Pokemon
    tipos.results.map((boton) => {
        if (boton.name !== "unknown" && boton.name !== "shadow") {
            const botonItem = document.createElement('div');
            botonItem.classList.add('col-2', 'd-inline-block', 'my-2');
            botonItem.innerHTML = `
            <button id="btn-${boton.name}" class="bg-${boton.name}">${boton.name.charAt(0).toUpperCase() + boton.name.slice(1)}</button>`;
            resultados.appendChild(botonItem);
        }
    });

    console.log(tipos);

    const btnTipoNormal = document.querySelector("#btn-normal");
    btnTipoNormal.addEventListener("click", () => {
        filtrarPorTipo("normal");
    });
    const btnTipoFuego = document.querySelector("#btn-fire");
    btnTipoNormal.addEventListener("click", () => {
        filtrarPorTipo("fire");
    });
    const btnTipoAgua = document.querySelector("#btn-water");
    btnTipoNormal.addEventListener("click", () => {
        filtrarPorTipo("water");
    });
    const btnTipoElectrico = document.querySelector("#btn-electric");
    btnTipoNormal.addEventListener("click", () => {
        filtrarPorTipo("electrico");
    });
    const btnTipoPlanta = document.querySelector("#btn-grass");
    btnTipoNormal.addEventListener("click", () => {
        filtrarPorTipo("grass");
    });
    const btnTipoHielo = document.querySelector("#btn-ice");
    btnTipoNormal.addEventListener("click", () => {
        filtrarPorTipo("ice");
    });
    const btnTipoLucha = document.querySelector("#btn-fighting");
    btnTipoNormal.addEventListener("click", () => {
        filtrarPorTipo("fighting");
    });
    const btnTipoVeneno = document.querySelector("#btn-poison");
    btnTipoNormal.addEventListener("click", () => {
        filtrarPorTipo("poison");
    });
    const btnTipoTierra = document.querySelector("#btn-ground");
    btnTipoNormal.addEventListener("click", () => {
        filtrarPorTipo("ground");
    });
    const btnTipoVolador = document.querySelector("#btn-flying");
    btnTipoNormal.addEventListener("click", () => {
        filtrarPorTipo("flying");
    });
    const btnTipoPsiquico = document.querySelector("#btn-psychic");
    btnTipoNormal.addEventListener("click", () => {
        filtrarPorTipo("psychic");
    });
    const btnTipoBicho = document.querySelector("#btn-bug");
    btnTipoNormal.addEventListener("click", () => {
        filtrarPorTipo("bug");
    });
    const btnTipoRoca = document.querySelector("#btn-rock");
    btnTipoNormal.addEventListener("click", () => {
        filtrarPorTipo("rock");
    });
    const btnTipoFantasma = document.querySelector("#btn-ghost");
    btnTipoNormal.addEventListener("click", () => {
        filtrarPorTipo("ghost");
    });
    const btnTipoDragon = document.querySelector("#btn-dragon");
    btnTipoNormal.addEventListener("click", () => {
        filtrarPorTipo("dragon");
    });
    const btnTipoSiniestro = document.querySelector("#btn-dark");
    btnTipoNormal.addEventListener("click", () => {
        filtrarPorTipo("dark");
    });
    const btnTipoAcero = document.querySelector("#btn-steel");
    btnTipoNormal.addEventListener("click", () => {
        filtrarPorTipo("steel");
    });
    const btnTipoHada = document.querySelector("#btn-fairy");
    btnTipoNormal.addEventListener("click", () => {
        filtrarPorTipo("fairy");
    });

    function filtrarPorTipo(tipo) {
        obtenerPokemon().then((pokemon) => {
            const resultados = document.querySelector("#resultados");
            resultados.innerHTML = "";

            // Filtrar los Pokémon por tipo
            const pokemonFiltrado = pokemon.filter((item) =>
                item.types.some((type) => type.type.name === tipo)
            );

            // Mostrar los Pokémon filtrados en la pantalla
            pokemonFiltrado.map((item) => {
                const cardItem = document.createElement("div");
                cardItem.classList.add(
                    "col-12",
                    "col-md-6",
                    "col-lg-4",
                    "col-xl-3"
                );
                cardItem.innerHTML = `
                <div class="card">
                <h1 class="nombrePokemon">${item.name.charAt(0).toUpperCase() + item.name.slice(1)
                    }</h1>
                <p class="numPokedex">${item.id}</p>
                <img src="${item.sprites.front_default || "img/logo.png"
                    }">
                <p>${item.types
                        .map(
                            (type) =>
                                `<img class="imgTipo" src="${tipoImagenes[type.type.name]}" alt="${type.type.name}">`
                        )
                        .join(" ")}</p>
                <p>Altura: ${item.height / 10} m</p>
                <p>Peso: ${item.weight} kg</p>
                </div>`;
                resultados.appendChild(cardItem);
            });
        });
    }
});