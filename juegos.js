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

const juegoImagenes = {
    red: "img/rojo.jpg",
    blue: "img/azul.jpg",
    yellow: "img/amarillo.jpg",
    gold: "img/oro.jpg",
    silver: "img/plata.jpg",
    crystal: "img/cristal.jpg",
    ruby: "img/rubi.jpg",
    sapphire: "img/zafiro.jpg",
    emerald: "img/esmeralda.jpg",
    firered: "img/rojoFuego.jpg",
    leafgreen: "img/verdeHoja.jpg",
    diamond: "img/diamante.jpg",
    pearl: "img/perla.jpg",
    platinum: "img/platino.jpg",
    heartgold: "img/oroHeartGold.jpg",
    soulsilver: "img/plataSoulSilver.jpg",
    black: "img/negro.jpg",
    white: "img/blanco.jpg",
    colosseum: "img/colosseum.jpg",
    xd: "img/xd.jpg",
    "black-2": "img/negro2.jpg",
    "white-2": "img/blanco2.jpg",
    x: "img/x.jpg",
    y: "img/y.jpg",
    "omega-ruby": "img/rubiOmega.jpg",
    "alpha-sapphire": "img/zafiroAlfa.jpg",
    sun: "img/sol.jpg",
    moon: "img/luna.jpg",
    "ultra-sun": "img/ultraSol.jpg",
    "ultra-moon": "img/ultraLuna.jpg",
    "lets-go-pikachu": "img/letsGoPikachu.jpg",
    "lets-go-eevee": "img/letsGoEevee.jpg",
    sword: "img/espada.jpg",
    shield: "img/escudo.jpg",
    "the-isle-of-armor": "img/laIslaDeLaArmadura.jpg",
    "the-crown-tundra": "img/lasNievesDeLaCorona.jpg",
    "brilliant-diamond": "img/diamanteBrillante.jpg",
    "shining-pearl": "img/perlaReluciente.jpg",
    "legends-arceus": "img/arceus.jpg",
    scarlet: "img/escarlata.jpg",
    violet: "img/purpura.jpg",
};

// Constante que guarda la URL base de la PokeAPI
const url = 'https://pokeapi.co/api/v2/';

// Función que devuelve una promesa que se resuelve con todos los movimientos
async function obtenerJuegos() {
    mostrarCarga();
    // Hacemos una solicitud para obtener la cantidad total de movimientos
    const response = await fetch(`${url}version/?limit=41&offset=0`);
    const data = await response.json();

    // Hacemos una solicitud para cada página y combinamos los resultados
    const resultados = [];
    resultados.push(...data.results);

    // Hacemos una solicitud para cada movimiento para obtener su información completa
    const juego = await Promise.all(resultados.map(async (resultado) => {
        const response = await fetch(resultado.url);
        return response.json();
    }));

    return juego;
}
obtenerJuegos().then((juego) => {
    const resultados = document.querySelector("#resultados");
    resultados.innerHTML = '';

    // Creamos una tarjeta para cada Movimiento
    juego.map((item) => {
        const nombre = item.names.find(name => name.language.name === 'es')?.name || '';

        const cardItem = document.createElement('div');
        cardItem.classList.add('col-12', 'col-md-6', 'col-lg-4', 'cardAltura');
        cardItem.innerHTML = `
            <div class="cardMovimientos">
                <h1 class="nombrePokemon mb-4">Pokémon ${nombre}</h1>
                <hr>
                <div class="p-3 img-juego">
                    <img src="${juegoImagenes[item.name]}">
                </div>
            </div>`;
        resultados.appendChild(cardItem);
    });
    ocultarCarga();
    console.log(juego);
});