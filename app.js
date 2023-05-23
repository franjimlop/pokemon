// Selecciona el div con id pantallaCarga
const pantallaCarga = document.getElementById('pantallaCarga');

// Función para mostrar la pantalla de carga
function mostrarCarga() {
    pantallaCarga.classList.remove('ocultar');
    pantallaCarga.classList.add('mostrar');
};

// Función para ocultar la pantalla de carga
function ocultarCarga() {
    pantallaCarga.classList.remove('mostrar');
    pantallaCarga.classList.add('ocultar');
};

const botonCargarMas = document.getElementById('botonCargarMas');
botonCargarMas.addEventListener('click', cargarMasElementos);

// Función para ocultar el botón "Cargar más"
function ocultarBotonCargarMas() {
    botonCargarMas.style.display = 'none';
}

// Función para mostrar el botón "Cargar más"
function mostrarBotonCargarMas() {
    botonCargarMas.style.display = 'block';
}

//pokemon que quiero cargar desde el principio
var pokemonCargados = 40;

// Constante que guarda la URL base de la PokeAPI
const url = 'https://pokeapi.co/api/v2/';

// Función que devuelve una promesa que se resuelve con todos los Pokemon
async function obtenerPokemon() {
    mostrarCarga();
    // Hacemos una solicitud para obtener la cantidad total de Pokemon
    const response = await fetch(`${url}pokemon/?limit=1281&offset=0`);
    const data = await response.json();

    // Hacemos una solicitud para cada página y combinamos los resultados
    const resultados = [];
    resultados.push(...data.results);

    // Hacemos una solicitud para cada Pokemon para obtener su información completa
    const pokemon = await Promise.all(resultados.map(async (resultado) => {
        const response = await fetch(resultado.url);
        return response.json();
    }));

    return pokemon;
};

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
    for (let i = 0; i < pokemonCargados; i++) {
        const item = pokemon[i];
        const cardItem = document.createElement('div');
        cardItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'col-xl-3', 'cardAltura');
        cardItem.innerHTML = `
            <div class="card">
                <h1 class="nombrePokemon">${item.name.charAt(0).toUpperCase() + item.name.slice(1)}</h1>
                <p class="numPokedex">${item.id}</p>
                <img src="${item.sprites.front_default || 'img/logo.png'}">
                <p>${item.types.map(type => `<img class="imgTipo" src="${tipoImagenes[type.type.name]}">`).join(" ")}</p>
                <p>Altura: ${item.height / 10} m</p>
                <p>Peso: ${item.weight} kg</p>
            </div>`;
        resultados.appendChild(cardItem);
    }
    if (pokemonCargados >= pokemon.length) {
        ocultarBotonCargarMas();
    }
    ocultarCarga();
    console.log(pokemon);
});

// Constante para buscar pokemon
const search = async () => {
    // Obtener el valor del input de búsqueda
    const searchValue = document.querySelector('#buscador').value;
    mostrarCarga();

    // Variable que guarda la url de la pokeAPI para buscar pokemon
    const url = `https://pokeapi.co/api/v2/pokemon/?limit=1281&offset=0`;

    // Hacemos una solicitud para obtener la lista completa de pokemon
    const response = await fetch(url);
    const data = await response.json();

    // Filtramos la lista de pokemon para obtener solo aquellos cuyo nombre contiene la cadena de búsqueda
    const filteredPokemon = data.results.filter((pokemon) => pokemon.name.includes(searchValue.toLowerCase()));

    // Obtener el tipo seleccionado
    const tipoSeleccionado = obtenerTipoSeleccionado();

    const resultados = document.querySelector("#resultados");
    resultados.innerHTML = '';

    Promise.all(filteredPokemon.map(async (pokemon) => {
        const response = await fetch(pokemon.url);
        return response.json();
    })).then((pokemon) => {
        // Filtrar por tipo si hay un tipo seleccionado
        if (tipoSeleccionado) {
            pokemon = pokemon.filter((item) =>
                item.types.some((type) => type.type.name === tipoSeleccionado)
            );
        }
        if (searchValue == "") {
            obtenerPokemon;
        } else {
            // Creamos una tarjeta para cada Pokemon
            pokemon.map((item) => {
                const cardItem = document.createElement('div');
                cardItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'col-xl-3', 'cardAltura');
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
        }
    })
    ocultarBotonCargarMas();
    ocultarCarga();
};

function obtenerTipoSeleccionado() {
    const botonActivo = document.querySelector("#filtroTipo button.active");
    if (botonActivo) {
        const tipo = botonActivo.id.replace("btn-", "");
        return tipo;
    }
    return null;
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

    let botonActivo = null;

    // Creamos un botón para cada tipo de Pokemon
    tipos.results.map((boton) => {
        if (boton.name !== "unknown" && boton.name !== "shadow") {
            const botonItem = document.createElement('div');
            botonItem.classList.add('col-4', 'col-xl-2', 'd-inline-block', 'my-2');
            botonItem.innerHTML = `
            <button id="btn-${boton.name}" class="bg-${boton.name} cursor-personalizado boton-tipo">${boton.name.charAt(0).toUpperCase() + boton.name.slice(1)}</button>`;
            resultados.appendChild(botonItem);

            const btnTipo = document.querySelector(`#btn-${boton.name}`);
            btnTipo.addEventListener("click", () => {
                if (botonActivo) {
                    botonActivo.classList.remove("active");
                }
                btnTipo.classList.add("active");
                botonActivo = btnTipo;
                filtrarPorTipo(boton.name);
            });
        }
    });
    console.log(tipos);
});

function filtrarPorTipo(tipo) {
    mostrarCarga();

    if (document.querySelector('#buscador').value) {
        search();
    } else {
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
                cardItem.classList.add("col-12", "col-md-6", "col-lg-4", 'col-xl-3', 'cardAltura');
                cardItem.innerHTML = `
                <div class="card">
                <h1 class="nombrePokemon">${item.name.charAt(0).toUpperCase() + item.name.slice(1)}</h1>
                <p class="numPokedex">${item.id}</p>
                <img src="${item.sprites.front_default || "img/logo.png"}">
                <p>${item.types.map((type) => `<img class="imgTipo" src="${tipoImagenes[type.type.name]}" alt="${type.type.name}">`).join(" ")}</p>
                <p>Altura: ${item.height / 10} m</p>
                <p>Peso: ${item.weight} kg</p>
                </div>`;
                resultados.appendChild(cardItem);
            });
            ocultarBotonCargarMas();
            ocultarCarga();
        });
    }
};

function cargarMasElementos() {
    // Incrementa el número de elementos cargados
    pokemonCargados += 40;

    // Vuelve a llamar a la función obtenerPokemon() para obtener los nuevos elementos
    obtenerPokemon().then((pokemon) => {
        const resultados = document.querySelector("#resultados");
        resultados.innerHTML = '';
    
        // Creamos una tarjeta para cada Pokemon
        for (let i = 0; i < pokemonCargados; i++) {
            const item = pokemon[i];
            const cardItem = document.createElement('div');
            cardItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'col-xl-3', 'cardAltura');
            cardItem.innerHTML = `
                <div class="card">
                    <h1 class="nombrePokemon">${item.name.charAt(0).toUpperCase() + item.name.slice(1)}</h1>
                    <p class="numPokedex">${item.id}</p>
                    <img src="${item.sprites.front_default || 'img/logo.png'}">
                    <p>${item.types.map(type => `<img class="imgTipo" src="${tipoImagenes[type.type.name]}">`).join(" ")}</p>
                    <p>Altura: ${item.height / 10} m</p>
                    <p>Peso: ${item.weight} kg</p>
                </div>`;
            resultados.appendChild(cardItem);
        }
        if (pokemonCargados >= pokemon.length) {
            ocultarBotonCargarMas();
        }
        ocultarCarga();
        console.log(pokemon);
    });
};