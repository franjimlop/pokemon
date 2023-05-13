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
async function obtenerObjetos() {
    mostrarCarga();
    // Hacemos una solicitud para obtener la cantidad total de movimientos
    const response = await fetch(`${url}item/?limit=954&offset=0`);
    const data = await response.json();

    // Hacemos una solicitud para cada página y combinamos los resultados
    const resultados = [];
    resultados.push(...data.results);

    // Hacemos una solicitud para cada movimiento para obtener su información completa
    const objeto = await Promise.all(resultados.map(async (resultado) => {
        const response = await fetch(resultado.url);
        return response.json();
    }));

    return objeto;
}
obtenerObjetos().then((objeto) => {
    const resultados = document.querySelector("#resultados");
    resultados.innerHTML = '';

    // Creamos una tarjeta para cada Movimiento
    objeto.map((item) => {
        const nombreEspanol = item.names.find(name => name.language.name === 'es')?.name || '';
        const nombre = nombreEspanol || item.names.find(name => name.language.name === 'en')?.name || '';
        let descripcion = "";
        for (let i = 0; i < item.flavor_text_entries.length; i++) {
            if (item.flavor_text_entries[i].language.name === "es") {
                descripcion = item.flavor_text_entries[i].text;
                break;
            }
        }

        const cardItem = document.createElement('div');
        cardItem.classList.add('col-12', 'col-md-6', 'cardAltura');
        cardItem.innerHTML = `
            <div class="cardMovimientos">
            <div class="row">
                <div class="col-9 p-3">
                    <h1 class="nombrePokemon mb-4">${nombre.charAt(0).toUpperCase() + nombre.slice(1)}</h1>
                </div>
                <div class="col-3 p-3 img-container">
                    <img src="${item.sprites.default}">
                </div>
            </div>
            <hr>
            <div class="p-4 text-center">
                <p>${descripcion}</p>
            </div>
            </div>`;
        resultados.appendChild(cardItem);
    });
    ocultarCarga();
    console.log(objeto);
});