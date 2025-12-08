// Importamos las clases (Unidad 3.3.7)
import { Vuelo, VueloMuyRentable } from './clases.js';

// --- COLECCIONES EN MEMORIA (Arrays - Unidad 3.2) ---
let listaVuelos = [];
let listaMuyRentables = [];

// --- REFERENCIAS AL DOM (Unidad 4.2.2) ---
const inpCodigo = document.getElementById("txtCodigo");
const inpPlazas = document.getElementById("txtPlazas");
const inpImporte = document.getElementById("txtImporte");
const divMensaje = document.getElementById("mensaje");
const divTabla = document.getElementById("zonaTabla");

// --- FUNCIONES AUXILIARES ---

// Función para mostrar mensajes en el DOM
const mostrarMensaje = (texto, esError = false) => {
    divMensaje.textContent = texto; // Unidad 4.2.4.3
    divMensaje.className = esError ? "error" : ""; // Unidad 4.2.4.2
};

// Validación de datos (Unidad 2.7)
const validarDatos = () => {
    const cod = inpCodigo.value.trim();
    const plazas = parseInt(inpPlazas.value);
    const importe = parseFloat(inpImporte.value);

    // Validación 1: Campos vacíos o NaN (Unidad 2.4)
    if (!cod || isNaN(plazas) || isNaN(importe)) {
        mostrarMensaje("Error: Todos los campos son obligatorios.", true);
        return null;
    }

    // Validación 4 del examen: Valores menores que 1
    if (plazas < 1 || importe < 1) {
        mostrarMensaje("Error: Plazas e importe deben ser mayores o iguales a 1.", true);
        return null;
    }

    return { cod, plazas, importe };
};

// Función CRÍTICA para el 10: Gestionar la lista de rentables al añadir o modificar
const actualizarListaRentables = (vueloObj) => {
    const ingreso = vueloObj.calcularIngreso();
    
    // Buscamos si ya existe en la lista de rentables (Unidad 3.2.7 - findIndex)
    const index = listaMuyRentables.findIndex(v => v.codigo === vueloObj.codigo);

    if (ingreso > 20000) {
        // Es muy rentable
        const nuevoVR = new VueloMuyRentable(vueloObj.codigo, ingreso);
        if (index >= 0) {
            // Si ya existía, lo actualizamos (Asignación directa en Array)
            listaMuyRentables[index] = nuevoVR;
        } else {
            // Si no existía, lo añadimos (push - Unidad 3.2.6)
            listaMuyRentables.push(nuevoVR);
        }
    } else {
        // No es muy rentable. Si existía en la lista, lo borramos.
        if (index >= 0) {
            // splice para borrar elementos (Unidad 3.2.3)
            listaMuyRentables.splice(index, 1);
        }
    }
};

// --- EVENTOS (Unidad 4.3.1 addEventListener) ---

// 1. BOTÓN AÑADIR
document.getElementById("btnAnadir").addEventListener("click", () => {
    const datos = validarDatos();
    if (!datos) return;

    // Validación 2: Código único (usamos .some o .find de Unidad 3.2.7)
    const existe = listaVuelos.find(v => v.codigo === datos.cod);
    if (existe) {
        mostrarMensaje("Error: Ya existe un vuelo con ese código.", true);
        return;
    }

    // Creación del objeto
    const nuevoVuelo = new Vuelo(datos.cod, datos.plazas, datos.importe);
    listaVuelos.push(nuevoVuelo); // Añadir al array

    // Lógica de rentables
    actualizarListaRentables(nuevoVuelo);

    mostrarMensaje(`Vuelo ${datos.cod} añadido correctamente.`);
    limpiarFormulario();
});

// 2. BOTÓN MODIFICAR
document.getElementById("btnModificar").addEventListener("click", () => {
    const datos = validarDatos();
    if (!datos) return;

    // Validación 3: El código debe existir para modificar
    const vueloEncontrado = listaVuelos.find(v => v.codigo === datos.cod);

    if (!vueloEncontrado) {
        mostrarMensaje("Error: No existe vuelo con ese código para modificar.", true);
        return;
    }

    // Usamos los SETTERS de la clase (Unidad 3.3.3.3)
    vueloEncontrado.plazas = datos.plazas;
    vueloEncontrado.importe = datos.importe;

    // Actualizamos lista de rentables (puede haber dejado de serlo o empezar a serlo)
    actualizarListaRentables(vueloEncontrado);

    mostrarMensaje(`Vuelo ${datos.cod} modificado con éxito.`);
    limpiarFormulario();
});

// 3. BOTÓN CALCULAR
document.getElementById("btnCalcular").addEventListener("click", () => {
    // Este botón NO modifica arrays, solo calcula con los inputs
    const datos = validarDatos();
    if (!datos) return;

    const ingreso = datos.plazas * datos.importe;
    let categoria = "";

    // Estructura condicional (Unidad 2.7)
    if (ingreso < 10000) {
        categoria = "Poco rentable";
    } else if (ingreso >= 10000 && ingreso <= 20000) {
        categoria = "Rentable";
    } else {
        categoria = "Muy rentable";
    }

    mostrarMensaje(`Ingreso: ${ingreso.toFixed(2)}€ - Categoría: ${categoria}`);
});

// 4. MOSTRAR TABLA (DOM - Unidad 4)
document.getElementById("btnVerRentables").addEventListener("click", () => {
    if (listaMuyRentables.length === 0) {
        divTabla.innerHTML = "<p>No hay vuelos muy rentables.</p>";
        return;
    }

    // Generamos tabla HTML dinámicamente usando String Literals (Unidad 2.5)
    let html = `
        <table>
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Ingreso Estimado</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Recorremos con for...of (Unidad 2.8.5)
    for (const vr of listaMuyRentables) {
        html += `
            <tr>
                <td>${vr.codigo}</td>
                <td>${vr.ingresoEstimado.toFixed(2)} €</td>
            </tr>
        `;
    }

    html += `</tbody></table>`;
    
    // Inserción en el DOM (Unidad 4.2.4)
    divTabla.innerHTML = html;
});

function limpiarFormulario() {
    inpCodigo.value = "";
    inpPlazas.value = "";
    inpImporte.value = "";
}

