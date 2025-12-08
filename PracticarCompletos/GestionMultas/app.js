// ==========================================
// 1. CLASE MODELO (DATOS)
// ==========================================
class Infraccion {
    constructor(idmulta, matricula, velocidad, limite) {
        this._idmulta = idmulta;
        this._matricula = matricula;
        this._velocidad = parseFloat(velocidad);
        this._limite = parseFloat(limite);
    }

    // Getters para encapsulación
    get idmulta() { return this._idmulta; }
    get matricula() { return this._matricula; }
    get velocidad() { return this._velocidad; }
    get limite() { return this._limite; }

    // Lógica de negocio 1: Exceso
    calcularExceso() {
        const exceso = this._velocidad - this._limite;
        // Solo multamos si hay exceso
        return exceso > 0 ? exceso : 0; 
    }

    // Lógica de negocio 2: Importe
    calcularImporte() {
        const exceso = this.calcularExceso();
        if (exceso >= 20) {
            return 300; // Multa grave
        } else if (exceso > 0) {
            return 100; // Multa leve
        }
        return 0; // Si no hay exceso, no hay multa
    }

    // Lógica de negocio 3: Condición visual (Grave)
    esGrave() {
        return this.calcularImporte() >= 300;
    }
}

// ==========================================
// 2. CLASE GESTORA (CONTROLADOR)
// ==========================================
class GestorMultas {
    constructor() {
        // Cargar y REINSTANCIAR: Convertir objetos planos en instancias de Infraccion
        const datosJSON = JSON.parse(localStorage.getItem("misInfracciones")) || [];
        this.coleccion = datosJSON.map(d => 
            new Infraccion(d._idmulta, d._matricula, d._velocidad, d._limite)
        );
    }

    agregarMulta(nuevaMulta) {
        this.coleccion.push(nuevaMulta);
        this.guardar();
    }

    eliminarMulta(indice) {
        this.coleccion.splice(indice, 1);
        this.guardar();
    }

    existeID(idBuscado) {
        return this.coleccion.some(m => m.idmulta === idBuscado);
    }

    calcularRecaudacion() {
        // Sumar todos los importes calculados por el método de la clase Infraccion
        return this.coleccion.reduce((total, multa) => total + multa.calcularImporte(), 0);
    }

    guardar() {
        localStorage.setItem("misInfracciones", JSON.stringify(this.coleccion));
    }
}

// ==========================================
// 3. INTERFAZ Y DOM
// ==========================================

const gestorMultas = new GestorMultas();

function actualizarVista() {
    const tbody = document.getElementById("cuerpoTabla"); 
    tbody.innerHTML = ""; // Limpiar

    gestorMultas.coleccion.forEach((item, index) => {
        const importe = item.calcularImporte();
        const exceso = item.calcularExceso();

        // Clase dinámica: llama al método de la clase
        const claseFila = item.esGrave() ? "grave" : "";

        // Generación de la fila
        const fila = `
            <tr class="${claseFila}">
                <td>${item.idmulta}</td>
                <td>${item.matricula}</td>
                <td>${item.velocidad}</td>
                <td>${item.limite}</td>
                <td>${exceso} km/h</td>
                <td>${importe.toFixed(2)} €</td>
                <td>
                    <button class="btn-borrar" data-index="${index}">Eliminar</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });

    // Actualizar estadística
    document.getElementById("totalRecaudacion").innerText = gestorMultas.calcularRecaudacion().toFixed(2);
}
// ==========================================
// 4. EVENTOS (ADDEVENTLISTENER)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inicialización
    actualizarVista();

    // 2. Evento Añadir (Submit del Formulario)
    document.getElementById('formAñadir').addEventListener('submit', (e) => {
        e.preventDefault();

        // Capturar y limpiar valores
        const id = document.getElementById("idmulta").value.trim().toUpperCase();
        const mat = document.getElementById("matricula").value.trim().toUpperCase();
        const vel = document.getElementById("velocidad").value;
        const lim = document.getElementById("limite").value;

        // Validaciones
        if (gestorMultas.existeID(id)) {
            alert("⚠️ Error: Ya existe una multa con ese ID.");
            return;
        }

        if (vel <= lim) {
            alert("✅ Información: La velocidad es menor o igual al límite. No se considera infracción, pero se registra.");
            // No hacemos return para permitir registrar sin multa
        }
        
        // Crear objeto y guardar
        const nuevaInfraccion = new Infraccion(id, mat, vel, lim);
        gestorMultas.agregarMulta(nuevaInfraccion);
        
        actualizarVista();
        e.target.reset();
    });

    // 3. Evento Delegado (Eliminar)
    // Escuchamos en el <tbody> para manejar los botones creados dinámicamente
    document.getElementById("cuerpoTabla").addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-borrar")) {
            const index = e.target.dataset.index;
            
            if(confirm("¿Estás seguro de eliminar esta multa?")) {
                gestorMultas.eliminarMulta(index);
                actualizarVista();
            }
        }
    });

});