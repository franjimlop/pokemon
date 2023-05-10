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

        const cardItem = document.createElement('div');
        cardItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'col-xl-3');
        cardItem.innerHTML = `
        <div class="card">
        <h1 class="nombrePokemon">${nombre.charAt(0).toUpperCase() + nombre.slice(1)}</h1>
        <p>Tipo de daño: ${item.damage_class.name}</p>
        <p>Precisión: ${item.accuracy}</p>
        <p>Potencia: ${item.power}</p>
        <p>PP: ${item.pp}</p>
        </div>`;
        // puedes añadir habilidades y movimientos y poner todos los sprites
        resultados.appendChild(cardItem);
    });

    ocultarCarga();
    console.log(movimiento);
});