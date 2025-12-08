// --- 1. Definición de Clases (Tipos de datos - 10%) ---

class Vuelo {
    constructor(codigo, plazas, importe) {
        this._codigo = codigo;
        this._plazas = parseInt(plazas);
        // Usamos parseFloat ya que el importe puede admitir decimales [cite: 14]
        this._importe = parseFloat(importe.replace(',', '.')); 
    }

    // Getters y Setters (Recomendación para obtener el 10 en "Tipos de datos" [cite: 62])
    get codigo() { return this._codigo; }
    
    get plazas() { return this._plazas; }
    set plazas(valor) { this._plazas = parseInt(valor); }
    
    get importe() { return this._importe; }
    set importe(valor) { this._importe = parseFloat(valor.replace(',', '.')); }

    calcularIngresoEstimado() {
        return this._plazas * this._importe; // [cite: 38]
    }
}

// Clase VueloMuyRentable (Solo almacena código e ingreso estimado) [cite: 16, 17]
// Nota: Para este ejercicio, solo necesitamos el código del vuelo. El ingreso lo calculamos del Vuelo original.
// Si se pidiera más información, se podría extender Vuelo. Para simplicidad, se usa un objeto plano o esta clase simple.
class VueloMuyRentable {
    constructor(codigo, ingreso) {
        this.codigo = codigo;
        this.ingreso = ingreso;
    }
}


// --- 2. Colecciones en Memoria [cite: 26] ---

const listaVuelos = [];
const listaMuyRentables = [];

// --- 3. Funciones de Ayuda (Validaciones - 15%) ---

function obtenerInputs() {
    const codigo = document.getElementById('codigo').value.trim();
    const plazas = document.getElementById('plazas').value;
    const importe = document.getElementById('importe').value;
    return { codigo, plazas, importe };
}

function validarInputs(codigo, plazas, importe, isModifying = false) {
    if (!codigo || !plazas || !importe) {
        alert("Error: Debe introducir todos los datos."); // [cite: 48]
        return false;
    }
    
    const numPlazas = parseInt(plazas);
    // Reemplazamos coma por punto para asegurar la conversión a float
    const numImporte = parseFloat(importe.replace(',', '.')); 

    if (numPlazas < 1 || numImporte < 1) {
        alert("Error: El número de plazas y el importe deben ser mayores o iguales a 1."); // [cite: 51, 52]
        return false;
    }
    
    // Si no estamos modificando, verificamos si el código ya existe.
    if (!isModifying && existeVuelo(codigo)) {
        alert(`Error: El vuelo con código ${codigo} ya existe.`); // [cite: 48, 49]
        return false;
    }
    
    return true;
}

function existeVuelo(codigo) {
    return listaVuelos.some(v => v.codigo === codigo);
}


// --- 4. Funcionalidad Principal ---

/**
 * Función principal que maneja las operaciones de los botones
 */
function gestionarVuelo(operacion) {
    const { codigo, plazas, importe } = obtenerInputs();
    const resultadoCalculoDiv = document.getElementById('resultado-calculo');
    resultadoCalculoDiv.innerHTML = ''; // Limpiar mensajes anteriores

    // 1. Validar los datos comunes
    if (!validarInputs(codigo, plazas, importe, operacion === 'modificar')) return;

    // Ejecutar la operación solicitada
    switch (operacion) {
        case 'añadir':
            return añadirVuelo(codigo, plazas, importe);
        case 'modificar':
            return modificarVuelo(codigo, plazas, importe);
        case 'calcular':
            // "Calcular" no añade ni modifica [cite: 39]
            const ingreso = new Vuelo(codigo, plazas, importe).calcularIngresoEstimado();
            return mostrarCalculo(ingreso);
        default:
            console.error("Operación no reconocida.");
    }
}

// --- A. Añadir Vuelo (15% + 10%) ---

function añadirVuelo(codigo, plazas, importe) {
    // La validación de duplicados ya se hizo en validarInputs
    const nuevoVuelo = new Vuelo(codigo, plazas, importe);
    listaVuelos.push(nuevoVuelo);
    
    const ingreso = nuevoVuelo.calcularIngresoEstimado();
    
    // Si es muy rentable, se añade a la segunda colección [cite: 29]
    if (ingreso > 20000) {
        listaMuyRentables.push(new VueloMuyRentable(codigo, ingreso.toFixed(2)));
    }

    alert(`Vuelo ${codigo} añadido correctamente. Ingreso estimado: ${ingreso.toFixed(2)}€`);
    limpiarCampos();
}

// --- B. Modificar Vuelo (15%) ---

function modificarVuelo(codigo, plazas, importe) {
    const index = listaVuelos.findIndex(v => v.codigo === codigo);

    if (index === -1) {
        alert(`Error: El código ${codigo} no existe en memoria.`); // [cite: 30, 50]
        return;
    }

    const vueloAModificar = listaVuelos[index];
    const ingresoAnterior = vueloAModificar.calcularIngresoEstimado();
    const eraMuyRentableAntes = ingresoAnterior > 20000;
    
    // 1. Modificar el vuelo
    vueloAModificar.plazas = plazas;
    vueloAModificar.importe = importe;

    // 2. Recalcular y gestionar la colección de rentables (Requisito del examen [cite: 63])
    const nuevoIngreso = vueloAModificar.calcularIngresoEstimado();
    const esMuyRentableAhora = nuevoIngreso > 20000;

    const indiceRentable = listaMuyRentables.findIndex(v => v.codigo === codigo);

    if (esMuyRentableAhora) {
        if (!eraMuyRentableAntes) {
            // Se vuelve muy rentable: añadir a la colección
            listaMuyRentables.push(new VueloMuyRentable(codigo, nuevoIngreso.toFixed(2)));
            alert(`Vuelo ${codigo} modificado. ¡Ahora es MUY RENTABLE!`);
        } else {
            // Ya era muy rentable: solo actualizar el ingreso en la colección
            listaMuyRentables[indiceRentable].ingreso = nuevoIngreso.toFixed(2);
            alert(`Vuelo ${codigo} modificado correctamente.`);
        }
    } else if (eraMuyRentableAntes) {
        // Deja de ser muy rentable: eliminar de la colección
        listaMuyRentables.splice(indiceRentable, 1);
        alert(`Vuelo ${codigo} modificado. Ya no es Muy Rentable. Ingreso: ${nuevoIngreso.toFixed(2)}€`);
    } else {
        alert(`Vuelo ${codigo} modificado correctamente.`);
    }

    limpiarCampos();
}

// --- C. Calcular Ingreso (10%) ---

function obtenerCategoria(ingreso) {
    if (ingreso < 10000) {
        return "Poco rentable"; // [cite: 44]
    } else if (ingreso >= 10000 && ingreso <= 20000) {
        return "Rentable"; // [cite: 44]
    } else { // ingreso > 20000
        return "Muy rentable"; // [cite: 45]
    }
}

function mostrarCalculo(ingreso) {
    const categoria = obtenerCategoria(ingreso);
    const resultadoDiv = document.getElementById('resultado-calculo');
    
    resultadoDiv.innerHTML = `
        <p><strong>Ingreso Estimado:</strong> ${ingreso.toFixed(2)} €</p>
        <p><strong>Categoría de vuelo:</strong> ${categoria}</p>
    `;
}

// --- D. Mostrar Vuelos Muy Rentables (15%) ---

function mostrarVuelosMuyRentables() {
    const contenedor = document.getElementById('tabla-rentables');
    
    if (listaMuyRentables.length === 0) {
        contenedor.innerHTML = '<p>No hay vuelos clasificados como Muy Rentables actualmente.</p>';
        return;
    }
    
    // Usar tabla para obtener la máxima nota [cite: 64]
    let html = '<h2>Lista de Vuelos Muy Rentables</h2>';
    html += '<table>';
    html += '<thead><tr><th>Código de Vuelo</th><th>Ingreso Estimado (€)</th></tr></thead>';
    html += '<tbody>';

    listaMuyRentables.forEach(v => {
        html += `<tr><td>${v.codigo}</td><td>${v.ingreso}</td></tr>`;
    });

    html += '</tbody></table>';
    contenedor.innerHTML = html;
}

// --- E. Utilidades ---

function limpiarCampos() {
    document.getElementById('codigo').value = '';
    document.getElementById('plazas').value = '';
    document.getElementById('importe').value = '';
    document.getElementById('codigo').focus();
}