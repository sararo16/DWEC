// ==========================================
// 1. CLASE VUELO
// ==========================================
class Vuelo {
    constructor(codigo, plazas, importe) {
        this._codigo = codigo;
        this._plazas = parseInt(plazas);
        this._importe = parseFloat(importe);
    }

    // Getters y Setters
    get codigo() { return this._codigo; }
    get plazas() { return this._plazas; }
    get importe() { return this._importe; }

    set plazas(p) { this._plazas = parseInt(p); }
    set importe(i) { this._importe = parseFloat(i); }

    // Calcular Ingreso Estimado
    calcularIngreso() {
        return this._plazas * this._importe;
    }

    // Clasificación según PDF
    obtenerCategoria() {
        const ingreso = this.calcularIngreso();
        if (ingreso < 10000) return "Poco rentable";
        if (ingreso <= 20000) return "Rentable";
        return "Muy rentable";
    }
}

// ==========================================
// 2. GESTOR (CONTROLADOR)
// ==========================================
class GestorVuelos {
    constructor() {
        // Dos colecciones en memoria como pide el examen 
        this.vuelos = []; 
        this.muyRentables = []; 
    }

    // --- AÑADIR ---
    agregarVuelo(nuevoVuelo) {
        this.vuelos.push(nuevoVuelo);
        
        // Si es muy rentable, también a la otra lista [cite: 29]
        if (nuevoVuelo.calcularIngreso() > 20000) {
            this.muyRentables.push(nuevoVuelo);
        }
    }

    // --- MODIFICAR (La parte más difícil del examen) ---
    modificarVuelo(codigo, nuevasPlazas, nuevoImporte) {
        const vuelo = this.vuelos.find(v => v.codigo === codigo);

        if (vuelo) {
            // 1. Modificamos datos usando setters
            vuelo.plazas = nuevasPlazas;
            vuelo.importe = nuevoImporte;

            // 2. Gestionar la lista de Rentables (Entra o sale)
            const esRentable = vuelo.calcularIngreso() > 20000;
            const indexEnRentables = this.muyRentables.findIndex(v => v.codigo === codigo);

            if (esRentable && indexEnRentables === -1) {
                // Se ha vuelto rico -> Añadir
                this.muyRentables.push(vuelo);
            } else if (!esRentable && indexEnRentables !== -1) {
                // Ha dejado de ser rico -> Borrar
                this.muyRentables.splice(indexEnRentables, 1);
            }
            return true;
        }
        return false;
    }

    existeCodigo(codigo) {
        return this.vuelos.some(v => v.codigo === codigo);
    }
}

// ==========================================
// 3. INTERFAZ
// ==========================================
const gestor = new GestorVuelos();

// Función auxiliar para leer inputs
function getInputs() {
    return {
        cod: document.getElementById("codigo").value.trim(),
        plaz: document.getElementById("plazas").value,
        imp: document.getElementById("importe").value
    };
}

function limpiar() {
    document.getElementById("formVuelo").reset();
}

function pintarTablas() {
    // 1. Tabla General
    const tbody = document.getElementById("cuerpoVuelos");
    tbody.innerHTML = "";
    gestor.vuelos.forEach(v => {
        tbody.innerHTML += `<tr><td>${v.codigo}</td><td>${v.plazas}</td><td>${v.importe}</td></tr>`;
    });

    // 2. Tabla Rentables (Se repinta al pulsar el botón mostrar, pero actualizamos lógica interna)
    const tbodyRent = document.getElementById("cuerpoRentables");
    tbodyRent.innerHTML = "";
    gestor.muyRentables.forEach(v => {
        tbodyRent.innerHTML += `<tr><td>${v.codigo}</td><td>${v.calcularIngreso()} €</td></tr>`;
    });
}

// ==========================================
// 4. EVENTOS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {

    // A) BOTÓN AÑADIR
    document.getElementById("btnAnadir").addEventListener("click", () => {
        const { cod, plaz, imp } = getInputs();

        // Validaciones [cite: 48, 51]
        if (!cod || !plaz || !imp) { alert("Faltan datos"); return; }
        if (plaz < 1 || imp < 1) { alert("Valores deben ser >= 1"); return; }
        if (gestor.existeCodigo(cod)) { alert("¡Código Duplicado!"); return; }

        const nuevo = new Vuelo(cod, plaz, imp);
        gestor.agregarVuelo(nuevo);
        
        pintarTablas();
        limpiar();
    });

    // B) BOTÓN MODIFICAR
    document.getElementById("btnModificar").addEventListener("click", () => {
        const { cod, plaz, imp } = getInputs();

        if (!cod) { alert("Indica el código a modificar"); return; }
        
        // El examen pide comprobar si existe ANTES de modificar [cite: 30, 50]
        if (!gestor.existeCodigo(cod)) {
            alert("El vuelo no existe, no se puede modificar.");
            return;
        }

        gestor.modificarVuelo(cod, plaz, imp);
        pintarTablas();
        alert("Vuelo modificado correctamente");
        limpiar();
    });

    // C) BOTÓN CALCULAR (Solo muestra info) [cite: 38]
    document.getElementById("btnCalcular").addEventListener("click", () => {
        const { cod, plaz, imp } = getInputs();
        
        if (!plaz || !imp) { alert("Introduce plazas e importe para calcular"); return; }

        // Creamos un objeto temporal solo para calcular (sin guardar)
        const tempVuelo = new Vuelo(cod || "TEMP", plaz, imp);
        const ingreso = tempVuelo.calcularIngreso();
        const cat = tempVuelo.obtenerCategoria();

        const div = document.getElementById("resultadoCalculo");
        div.style.display = "block";
        document.getElementById("textoCalculo").innerHTML = 
            `Ingreso Estimado: <b>${ingreso} €</b> <br> Categoría: <b>${cat}</b>`;
    });

    // D) MOSTRAR MUY RENTABLES [cite: 53]
    document.getElementById("btnMostrarRentables").addEventListener("click", () => {
        document.getElementById("divRentables").style.display = "block";
        pintarTablas(); // Asegura que esté actualizada
    });
});