// ==========================================
// 1. CLASE MODELO (DATOS)
// ==========================================
class Inmueble {
    constructor(referencia, zona, metros, precioMetro) {
        this._referencia = referencia;
        this._zona = zona;
        this._metros = parseFloat(metros);
        this._precioMetro = parseFloat(precioMetro);
    }

    // Getters (Para el 10 en "Tipos de Datos")
    get referencia() { return this._referencia; }
    get zona() { return this._zona; }
    get metros() { return this._metros; }
    get precioMetro() { return this._precioMetro; }

    // Método de cálculo (Lógica de negocio)
    // Precio Base + 3% de comisión
    getPrecioVenta() {
        const precioBase = this._metros * this._precioMetro;
        return precioBase * 1.03; 
    }

    // Método para determinar la categoría
    obtenerCategoria() {
        const precioFinal = this.getPrecioVenta();
        if (precioFinal <= 100000) return "Oportunidad";
        if (precioFinal >= 500000) return "Premium";
        return "Estándar";
    }
}

// ==========================================
// 2. CLASE GESTORA (CONTROLADOR)
// ==========================================
class GestorInmobiliario {
    constructor() {
        // 1. Recuperar JSON crudo del LocalStorage
        const datosJSON = JSON.parse(localStorage.getItem("datosInmoFast")) || [];
        
        // 2. RECONSTRUIR OBJETOS (CRÍTICO)
        // Convertimos los datos planos de vuelta a "new Inmueble" para que funcionen los métodos
        this.cartera = datosJSON.map(item => 
            new Inmueble(item._referencia, item._zona, item._metros, item._precioMetro)
        );
    }

    agregarInmueble(nuevoInmueble) {
        this.cartera.push(nuevoInmueble);
        this.guardar();
    }

    eliminarInmueble(indice) {
        this.cartera.splice(indice, 1);
        this.guardar();
    }

    existeReferencia(ref) {
        return this.cartera.some(i => i.referencia === ref);
    }

    calcularTotalCartera() {
        return this.cartera.reduce((total, i) => total + i.getPrecioVenta(), 0);
    }

    guardar() {
        localStorage.setItem("datosInmoFast", JSON.stringify(this.cartera));
    }
}

// ==========================================
// 3. INTERFAZ Y DOM
// ==========================================

const gestor = new GestorInmobiliario();

// Función de renderizado
function pintarTabla() {
    const tbody = document.getElementById("cuerpoTabla");
    tbody.innerHTML = ""; // Limpiar tabla

    gestor.cartera.forEach((inmueble, index) => {
        const precioVenta = inmueble.getPrecioVenta();
        const categoria = inmueble.obtenerCategoria();
        
        // Asignar clase CSS según categoría
        let claseCSS = "";
        if (categoria === "Oportunidad") claseCSS = "oferta";
        if (categoria === "Premium") claseCSS = "lujo";

        // Crear fila
        const fila = `
            <tr class="${claseCSS}">
                <td>${inmueble.referencia}</td>
                <td>${inmueble.zona}</td>
                <td>${inmueble.metros} m²</td>
                <td>${precioVenta.toFixed(2)} €</td>
                <td>${categoria}</td>
                <td>
                    <button class="btn-borrar" data-index="${index}">Eliminar</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });

    // Actualizar el total general abajo
    document.getElementById("totalCartera").innerText = gestor.calcularTotalCartera().toFixed(2);
}

// ==========================================
// 4. EVENTOS (ADDEVENTLISTENER)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    
    // A) Carga inicial
    pintarTabla();

    // B) Botón Calcular (Aunque pintamos al añadir, mantenemos este botón si lo pide el examen)
    document.getElementById("btnCalcular").addEventListener("click", pintarTabla);

    // C) Formulario Añadir
    document.getElementById("formInmuebles").addEventListener("submit", (e) => {
        e.preventDefault();

        const ref = document.getElementById("referencia").value.trim();
        const zona = document.getElementById("zona").value;
        const metros = document.getElementById("metros").value;
        const precioM = document.getElementById("precioMetro").value;

        // Validaciones
        if (gestor.existeReferencia(ref)) {
            alert("⚠️ Error: La referencia ya existe.");
            return;
        }

        const nuevo = new Inmueble(ref, zona, metros, precioM);
        gestor.agregarInmueble(nuevo);
        
        alert("Inmueble registrado correctamente.");
        pintarTabla();
        e.target.reset(); // Limpiar inputs
    });

    // D) Evento Delegado: Borrar
    document.getElementById("cuerpoTabla").addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-borrar")) {
            const index = e.target.dataset.index;
            
            if (confirm("¿Eliminar este inmueble de la cartera?")) {
                gestor.eliminarInmueble(index);
                pintarTabla();
            }
        }
    });

});