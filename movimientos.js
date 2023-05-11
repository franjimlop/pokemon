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

// Constante que guarda la URL base de la PokeAPI
const url = 'https://pokeapi.co/api/v2/';

// Función que devuelve una promesa que se resuelve con todos los movimientos
async function obtenerMovimientos() {
    mostrarCarga();
    // Hacemos una solicitud para obtener la cantidad total de movimientos
    const response = await fetch(`${url}move/?limit=920&offset=0`);
    const data = await response.json();

    // Hacemos una solicitud para cada página y combinamos los resultados
    const resultados = [];
    resultados.push(...data.results);

    // Hacemos una solicitud para cada movimiento para obtener su información completa
    const movimiento = await Promise.all(resultados.map(async (resultado) => {
        const response = await fetch(resultado.url);
        return response.json();
    }));

    return movimiento;
}

// Llamamos a la función y creamos nuestras tarjetas de Pokemon
obtenerMovimientos().then((movimiento) => {
    const resultados = document.querySelector("#resultados");
    resultados.innerHTML = '';

    // Creamos una tarjeta para cada Movimiento
    movimiento.map((item) => {
        const nombreEspanol = item.names.find(name => name.language.name === 'es')?.name || '';
        const nombre = nombreEspanol || item.names.find(name => name.language.name === 'en')?.name || '';   

        if (item.damage_class.name == "physical") {
            if (item.power == null) {
                if (item.accuracy == null) {
                    const cardItem = document.createElement('div');
                    cardItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'col-xl-3', 'cardAltura');
                    cardItem.innerHTML = `
                    <div class="cardMovimientos">
                    <h1 class="nombrePokemon mb-4">${nombre.charAt(0).toUpperCase() + nombre.slice(1)}</h1>
                    <p><img class="imgTipo" src="${tipoImagenes[item.type.name]}" alt="${item.type.name}"></p>
                    <p>Ataque físico</p>
                    <p>Precisión: Nunca falla</p>
                    <p>Potencia: Variable o daño fijo</p>
                    <p>PP: ${item.pp}</p>
                    </div>`;
                    resultados.appendChild(cardItem);
                } else {
                    const cardItem = document.createElement('div');
                    cardItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'col-xl-3', 'cardAltura');
                    cardItem.innerHTML = `
                    <div class="cardMovimientos">
                    <h1 class="nombrePokemon mb-4">${nombre.charAt(0).toUpperCase() + nombre.slice(1)}</h1>
                    <p><img class="imgTipo" src="${tipoImagenes[item.type.name]}" alt="${item.type.name}"></p>
                    <p>Ataque físico</p>
                    <p>Precisión: ${item.accuracy}</p>
                    <p>Potencia: Variable o daño fijo</p>
                    <p>PP: ${item.pp}</p>
                    </div>`;
                    resultados.appendChild(cardItem);
                }
            } else {
                const cardItem = document.createElement('div');
                cardItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'col-xl-3', 'cardAltura');
                cardItem.innerHTML = `
                <div class="cardMovimientos">
                <h1 class="nombrePokemon mb-4">${nombre.charAt(0).toUpperCase() + nombre.slice(1)}</h1>
                <p><img class="imgTipo" src="${tipoImagenes[item.type.name]}" alt="${item.type.name}"></p>
                <p>Ataque físico</p>
                <p>Precisión: ${item.accuracy}</p>
                <p>Potencia: ${item.power}</p>
                <p>PP: ${item.pp}</p>
                </div>`;
                resultados.appendChild(cardItem);
            }
        }
        if (item.damage_class.name == "special") {
            if (item.power == null) {
                if (item.accuracy == null) {
                    const cardItem = document.createElement('div');
                    cardItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'col-xl-3', 'cardAltura');
                    cardItem.innerHTML = `
                    <div class="cardMovimientos">
                    <h1 class="nombrePokemon mb-4">${nombre.charAt(0).toUpperCase() + nombre.slice(1)}</h1>
                    <p><img class="imgTipo" src="${tipoImagenes[item.type.name]}" alt="${item.type.name}"></p>
                    <p>Ataque especial</p>
                    <p>Precisión: Nunca falla</p>
                    <p>Potencia: Variable o daño fijo</p>
                    <p>PP: ${item.pp}</p>
                    </div>`;
                    resultados.appendChild(cardItem);
                } else {
                    const cardItem = document.createElement('div');
                    cardItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'col-xl-3', 'cardAltura');
                    cardItem.innerHTML = `
                    <div class="cardMovimientos">
                    <h1 class="nombrePokemon mb-4">${nombre.charAt(0).toUpperCase() + nombre.slice(1)}</h1>
                    <p><img class="imgTipo" src="${tipoImagenes[item.type.name]}" alt="${item.type.name}"></p>
                    <p>Ataque especial</p>
                    <p>Precisión: ${item.accuracy}</p>
                    <p>Potencia: Variable o daño fijo</p>
                    <p>PP: ${item.pp}</p>
                    </div>`;
                    resultados.appendChild(cardItem);
                }
            } else {
                const cardItem = document.createElement('div');
                cardItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'col-xl-3', 'cardAltura');
                cardItem.innerHTML = `
                <div class="cardMovimientos">
                <h1 class="nombrePokemon mb-4">${nombre.charAt(0).toUpperCase() + nombre.slice(1)}</h1>
                <p><img class="imgTipo" src="${tipoImagenes[item.type.name]}" alt="${item.type.name}"></p>
                <p>Ataque especial</p>
                <p>Precisión: ${item.accuracy}</p>
                <p>Potencia: ${item.power}</p>
                <p>PP: ${item.pp}</p>
                </div>`;
                resultados.appendChild(cardItem);
            }
        }
        if (item.damage_class.name == "status") {
            if (item.accuracy == null) {
                const cardItem = document.createElement('div');
                cardItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'col-xl-3', 'cardAltura');
                cardItem.innerHTML = `
                <div class="cardMovimientos">
                <h1 class="nombrePokemon mb-4">${nombre.charAt(0).toUpperCase() + nombre.slice(1)}</h1>
                <p><img class="imgTipo" src="${tipoImagenes[item.type.name]}" alt="${item.type.name}"></p>
                <p>Ataque de estado</p>
                <p>Precisión: Nunca falla</p>
                <p>PP: ${item.pp}</p>
                </div>`;
                resultados.appendChild(cardItem);
            } else {
                const cardItem = document.createElement('div');
                cardItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'col-xl-3', 'cardAltura');
                cardItem.innerHTML = `
                <div class="cardMovimientos">
                <h1 class="nombrePokemon m-4">${nombre.charAt(0).toUpperCase() + nombre.slice(1)}</h1>
                <p><img class="imgTipo" src="${tipoImagenes[item.type.name]}" alt="${item.type.name}"></p>
                <p>Ataque de estado</p>
                <p>Precisión: ${item.accuracy}</p>
                <p>PP: ${item.pp}</p>
                </div>`;
                resultados.appendChild(cardItem);
            }
        }
    });

    ocultarCarga();
    console.log(movimiento);
});