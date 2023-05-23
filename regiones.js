// Selecciona el div con id pantallaCarga
const pantallaCarga = document.getElementById('pantallaCarga');

// Función para mostrar la pantalla de carga
function mostrarCarga() {
    pantallaCarga.classList.remove('ocultar');
    pantallaCarga.classList.add('mostrar');
}

// Función para ocultar la pantalla de carga
function ocultarCarga() {
    pantallaCarga.classList.remove('mostrar');
    pantallaCarga.classList.add('ocultar');
}

const fotoRegion = {
    kanto: "img/kanto.png",
    johto: "img/johto.png",
    hoenn: "img/hoenn.png",
    sinnoh: "img/sinnoh.png",
    unova: "img/unova.png",
    kalos: "img/kalos.png",
    alola: "img/alola.png",
    galar: "img/galar.jpg",
    hisui: "img/hisui.jpeg",
    paldea: "img/paldea.jpg",
};

// Constante que guarda la URL base de la PokeAPI
const url = 'https://pokeapi.co/api/v2/';

// Función que devuelve una promesa que se resuelve con todos los movimientos
async function obtenerRegiones() {
    mostrarCarga();
    // Hacemos una solicitud para obtener la cantidad total de movimientos
    const response = await fetch(`${url}region/?limit=10&offset=0`);
    const data = await response.json();

    // Hacemos una solicitud para cada página y combinamos los resultados
    const resultados = [];
    resultados.push(...data.results);

    // Hacemos una solicitud para cada movimiento para obtener su información completa
    const region = await Promise.all(resultados.map(async (resultado) => {
        const response = await fetch(resultado.url);
        return response.json();
    }));

    return region;
}
obtenerRegiones().then((region) => {
    const resultados = document.querySelector("#resultados");
    resultados.innerHTML = '';

    // Creamos una tarjeta para cada Movimiento
    region.map((item) => {
        const cardItem = document.createElement('div');
        cardItem.classList.add('col-12', 'col-lg-6', 'cardAltura');
        if (item.main_generation) {
            cardItem.innerHTML = `
                <div class="cardRegiones">
                    <h1 class="nombrePokemon mb-3">${item.name.charAt(0).toUpperCase() + item.name.slice(1)}</h1>
                    <h5>Generación: ${item.main_generation.name.slice(11).toUpperCase()}</h5>
                    <div class="text-center p-3">
                        <img class="img-region" src="${fotoRegion[item.name]}" alt="${item.name}">
                    </div>
                    <div class="p-3">
                        <p>Juegos:</p>
                        <ul class="lista-juegos">
                            ${item.version_groups.map((version) => `<li>${capitalizeWords(version.name.replace(/-/g, ' '))}</li>`).join('')}
                        </ul>
                    </div>
                </div>`;
            resultados.appendChild(cardItem);
        } else {
            cardItem.innerHTML = `
            <div class="cardRegiones">
                <h1 class="nombrePokemon mb-3">${item.name.charAt(0).toUpperCase() + item.name.slice(1)}</h1>
                <div class="text-center p-3">
                    <img class="img-region" src="${fotoRegion[item.name]}" alt="${item.name}">
                </div>
                <div class="p-3">
                    <p>Juegos:</p>
                    <ul class="lista-juegos">
                        ${item.version_groups.map((version) => `<li>${capitalizeWords(version.name.replace(/-/g, ' '))}</li>`).join('')}
                    </ul>
                </div>
            </div>`;
            resultados.appendChild(cardItem);
        }
    });
    ocultarCarga();
    console.log(region);
});

function capitalizeWords(str) {
    return str.replace(/\b\w/g, (match) => match.toUpperCase());
}