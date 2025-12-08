// ==========================================
// 1. CLASE MODELO (DATOS)
// ==========================================
class Reparacion {
    constructor(matricula, averia, precioBase) {
        this._matricula = matricula;
        this._averia = averia;
        this._precioBase = parseFloat(precioBase);
    }

    // Getters
    get matricula() { return this._matricula; }
    get averia() { return this._averia; }
    get precioBase() { return this._precioBase; }

    // Setters (Necesarios para la modificación)
    set averia(nuevaAveria) { this._averia = nuevaAveria; }
    set precioBase(nuevoPrecio) { this._precioBase = parseFloat(nuevoPrecio); }

    // --- Lógica de Negocio ---
    
    // Calcular precio con IVA (21%)
    calcularPrecioFinal() {
        return this._precioBase * 1.21;
    }

    // Determinar categoría
    obtenerCategoria() {
        if (this.calcularPrecioFinal() < 500) {
            return "Estándar";
        } else {
            return "Reparación Cara";
        }
    }
}

// ==========================================
// 2. CLASE GESTORA (CONTROLADOR)
// ==========================================
class GestorTaller {
    constructor() {
        // 1. Cargar JSON crudo
        const datosJSON = JSON.parse(localStorage.getItem("datosTaller")) || [];
        
        // 2. RECONSTRUIR OBJETOS (CRÍTICO)
        // Convertimos los objetos planos en instancias reales de 'Reparacion'
        this.reparaciones = datosJSON.map(d => 
            new Reparacion(d._matricula, d._averia, d._precioBase)
        );
    }

    agregarReparacion(nuevaReparacion) {
        this.reparaciones.push(nuevaReparacion);
        this.guardar();
    }

    eliminarReparacion(indice) {
        this.reparaciones.splice(indice, 1);
        this.guardar();
    }

    // Buscar y modificar
    modificarReparacion(matricula, nuevaAveria, nuevoPrecio) {
        // Buscamos el objeto real dentro del array
        const reparacion = this.reparaciones.find(r => r.matricula === matricula);

        if (reparacion) {
            // Usamos los setters si hay nuevos valores
            if (nuevaAveria) reparacion.averia = nuevaAveria;
            if (nuevoPrecio) reparacion.precioBase = nuevoPrecio;
            
            this.guardar();
            return true; // Éxito
        }
        return false; // No encontrado
    }

    existeMatricula(matricula) {
        return this.reparaciones.some(r => r.matricula === matricula);
    }

    calcularFacturacionTotal() {
        return this.reparaciones.reduce((total, r) => total + r.calcularPrecioFinal(), 0);
    }

    guardar() {
        localStorage.setItem("datosTaller", JSON.stringify(this.reparaciones));
    }
}

// ==========================================
// 3. INTERFAZ Y DOM
// ==========================================

const gestor = new GestorTaller();

function pintarTabla() {
    const tbody = document.getElementById("cuerpoTabla");
    tbody.innerHTML = ""; // Limpiar

    gestor.reparaciones.forEach((rep, index) => {
        const precioFinal = rep.calcularPrecioFinal();
        const categoria = rep.obtenerCategoria();

        // Estilos dinámicos
        let claseCSS = (categoria === "Estándar") ? "economico" : "costoso";

        const fila = `
            <tr class="${claseCSS}">
                <td>${rep.matricula}</td>
                <td>${rep.averia}</td>
                <td>${precioFinal.toFixed(2)} €</td>
                <td>${categoria}</td>
                <td>
                    <button class="btn-borrar" data-index="${index}">Eliminar</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });

    // Actualizar total
    document.getElementById("totalFacturacion").innerText = gestor.calcularFacturacionTotal().toFixed(2);
}

// ==========================================
// 4. LISTENERS (EVENTOS)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    
    // Carga inicial
    pintarTabla();

    // A) Botón Calcular (Refrescar)
    document.getElementById("btnCalcular").addEventListener("click", pintarTabla);

    // B) Formulario Alta
    document.getElementById("formAlta").addEventListener("submit", (e) => {
        e.preventDefault();

        const mat = document.getElementById("matricula").value.trim().toUpperCase();
        const ave = document.getElementById("averia").value;
        const pre = document.getElementById("precioBase").value;

        if (gestor.existeMatricula(mat)) {
            alert("⚠️ Error: Esa matrícula ya está registrada.");
            return;
        }

        const nueva = new Reparacion(mat, ave, pre);
        gestor.agregarReparacion(nueva);
        
        alert("Vehículo registrado correctamente.");
        pintarTabla();
        e.target.reset();
    });

    // C) Formulario Modificar
    document.getElementById("formModificar").addEventListener("submit", (e) => {
        e.preventDefault();

        const mat = document.getElementById("modMatricula").value.trim().toUpperCase();
        const ave = document.getElementById("modAveria").value;
        const pre = document.getElementById("modPrecioBase").value;

        // Llamamos al método del gestor
        const exito = gestor.modificarReparacion(mat, ave, pre);

        if (exito) {
            alert("✅ Datos modificados correctamente.");
            pintarTabla();
            e.target.reset();
        } else {
            alert("❌ Error: No se encontró ningún vehículo con esa matrícula.");
        }
    });

    // D) Borrar (Delegación de eventos)
    document.getElementById("cuerpoTabla").addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-borrar")) {
            const index = e.target.dataset.index;
            
            if (confirm("¿Eliminar este registro del taller?")) {
                gestor.eliminarReparacion(index);
                pintarTabla();
            }
        }
    });

});