//Creo una clase opción para tratar cada ítem como un objeto con un elo inicial de 1000
function Opcion(valor, elo = 1000) {
    this.valor = valor;
    this.elo = elo;
}

function agregarItem(form) {
    var form_insert = document.getElementById(form);

    // Guarda los valores actuales de los inputs
    const inputs = form_insert.getElementsByClassName('choice');
    const valoresActuales = [];
    for (let input of inputs) {
        valoresActuales.push(input.value);
    }

    // Agrega un nuevo input
    var item = `
      <div class="row">
        <label>Ingresa una opcion:</label>
        <input type="text" class="choice">
      </div>`;
    form_insert.innerHTML += item;

    // Restaura los valores actuales en los inputs
    const nuevosInputs = form_insert.getElementsByClassName('choice');
    for (let i = 0; i < valoresActuales.length; i++) {
        nuevosInputs[i].value = valoresActuales[i];
    }
}

function ocultar(div) {
    document.getElementById(div).style.display = 'none';
}

function mostrar(div) {
    document.getElementById(div).style.display = 'block';
}

let baseActual = 0;
let baseComparador = 1;
let opcionesObj = [];

function actualizarElo(opcionElegida, opcionNoElegida) {
    const elo_a = opcionElegida.elo;
    const elo_b = opcionNoElegida.elo;
    const ea = 1 / (1 + 10 ** ((elo_b - elo_a) / 400));

    // Actualiza el ELO sumando un factor de ajuste (K-factor, aquí usamos 32 como estándar)
    const K = 32;
    opcionElegida.elo += K * (1 - ea);
    opcionNoElegida.elo += K * (0 - (1 - ea));
}

function validar(){
    let inputs = document.getElementsByClassName("choice");
    var valores = [];
    for (let index = 0; index < inputs.length; index++) {
        valores.push(inputs[index].value);
    }
    if(valores.includes("")){
        alert("Se debe rellenar todos los campos para poder comparar.");
        return false;
    }else{
        comparar();
    }
}
function comparar() {
    ocultar('lista');
    mostrar('comparaciones');

    const opciones = document.getElementsByClassName("choice");
    const eleccion1 = document.getElementById("eleccion1");
    const eleccion2 = document.getElementById("eleccion2");

    // Solo inicializa opcionesObj si está vacío
    if (opcionesObj.length === 0) {
        for (let i = 0; i < opciones.length; i++) {
            opcionesObj.push(new Opcion(opciones[i].value));
        }
    }

    // Finaliza si todas las combinaciones han sido comparadas
    if (baseActual >= opcionesObj.length - 1) {
        alert("Todas las comparaciones se han realizado.");
        return;
    }

    // Muestra las opciones actuales
    eleccion1.innerHTML = opcionesObj[baseActual].valor;
    eleccion2.innerHTML = opcionesObj[baseComparador].valor;
    
    //calcular los resultados
    function calcularResultado() {
        ocultar('comparaciones');
        mostrar('resultados');
        opcionesObj.sort((a, b) => b.elo - a.elo);
        for (const opcion of opcionesObj) {
            document.getElementById("resultados").innerHTML += `
                <div class="eleccion btn">${opcion.valor}</div>
            `;
        }
    }
    function elegir(opcion) {
        const opcionElegida = opcion === 1 ? opcionesObj[baseActual] : opcionesObj[baseComparador];
        const opcionNoElegida = opcion === 1 ? opcionesObj[baseComparador] : opcionesObj[baseActual];

        // Actualiza los ELOs
        actualizarElo(opcionElegida, opcionNoElegida);

        baseComparador++;

        if (baseComparador >= opcionesObj.length) {
            baseActual++;
            baseComparador = baseActual + 1;
        }

        if (baseActual < opcionesObj.length - 1) {
            comparar();
        } else {
            calcularResultado();
        }
    }

    eleccion1.onclick = () => elegir(1);
    eleccion2.onclick = () => elegir(2);
}
