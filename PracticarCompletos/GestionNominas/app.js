// ==========================================
// 1. CLASE EMPLEADO (MODELO)
// ==========================================
class Empleado {
    constructor(dni, nombre, base, antiguedad) {
        this._dni = dni;
        this._nombre = nombre;
        this._base = parseFloat(base);
        this._antiguedad = parseInt(antiguedad);
    }

    // Getters
    get dni() { return this._dni; }
    get nombre() { return this._nombre; }
    get base() { return this._base; }
    get antiguedad() { return this._antiguedad; }

    // --- LÓGICA DE NEGOCIO ---
    
    // Calcular sueldo final: Base + (Años * 50)
    calcularSueldoFinal() {
        return this._base + (this._antiguedad * 50);
    }

    // Calcular si es Senior (> 2000)
    esSenior() {
        return this.calcularSueldoFinal() > 2000;
    }

    // Calcular IRPF (15%)
    calcularIRPF() {
        return this.calcularSueldoFinal() * 0.15;
    }
}

// ==========================================
// 2. CLASE GESTOR (CONTROLADOR)
// ==========================================
class GestorTech {
    constructor() {
        // Cargar desde LocalStorage o array vacío
        const datos = JSON.parse(localStorage.getItem("techSolutionsDB")) || [];
        
        // RECONSTRUCCIÓN: Convertir JSON a objetos "Empleado" con métodos
        this.plantilla = datos.map(d => new Empleado(d._dni, d._nombre, d._base, d._antiguedad));
    }

    contratar(nuevoEmpleado) {
        this.plantilla.push(nuevoEmpleado);
        this.guardar();
    }

    despedir(indice) {
        this.plantilla.splice(indice, 1);
        this.guardar();
    }

    existeDNI(dni) {
        return this.plantilla.some(e => e.dni === dni);
    }

    // Devuelve un array nuevo solo con los Seniors
    filtrarSeniors() {
        return this.plantilla.filter(e => e.esSenior());
    }

    guardar() {
        localStorage.setItem("techSolutionsDB", JSON.stringify(this.plantilla));
    }
}

// ==========================================
// 3. INTERFAZ Y EVENTOS
// ==========================================

const gestor = new GestorTech();

// Función para pintar la tabla principal
function renderPrincipal() {
    const tbody = document.getElementById("cuerpoTabla");
    tbody.innerHTML = ""; // Limpiar

    gestor.plantilla.forEach((emp, index) => {
        const sueldo = emp.calcularSueldoFinal();
        const cat = emp.esSenior() ? "Senior" : "Junior";
        
        // Creamos la fila
        const fila = `
            <tr>
                <td>${emp.dni}</td>
                <td>${emp.nombre}</td>
                <td>${emp.base} €</td>
                <td>${emp.antiguedad} años</td>
                <td>${sueldo} €</td>
                <td>${cat}</td>
                <td>
                    <button class="btn-delete" data-index="${index}">X</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}

// Función para pintar la tabla secundaria (Seniors)
function renderSeniors() {
    const tbody = document.getElementById("cuerpoSeniors");
    tbody.innerHTML = ""; // Limpiar
    
    // Usamos el método de filtrado de la clase Gestor
    const listaSeniors = gestor.filtrarSeniors();

    if (listaSeniors.length === 0) {
        tbody.innerHTML = "<tr><td colspan='3'>No hay empleados con categoría Senior actualmente.</td></tr>";
        return;
    }

    listaSeniors.forEach(emp => {
        const sueldo = emp.calcularSueldoFinal();
        const irpf = emp.calcularIRPF();

        const fila = `
            <tr>
                <td>${emp.nombre}</td>
                <td class="high-salary">${sueldo} €</td>
                <td>${irpf.toFixed(2)} €</td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}

// ==========================================
// 4. LISTENERS (MANEJO DE EVENTOS)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    
    // Carga inicial
    renderPrincipal();

    // A) Contratar (Formulario)
    document.getElementById("formAlta").addEventListener("submit", (e) => {
        e.preventDefault();

        const dni = document.getElementById("dni").value.trim().toUpperCase();
        const nombre = document.getElementById("nombre").value;
        const base = document.getElementById("base").value;
        const antiguedad = document.getElementById("antiguedad").value;

        // Validaciones
        if (gestor.existeDNI(dni)) {
            alert("⚠️ Error: DNI duplicado.");
            return;
        }
        if (base < 0 || antiguedad < 0) {
            alert("⚠️ Error: No se admiten valores negativos.");
            return;
        }

        const nuevo = new Empleado(dni, nombre, base, antiguedad);
        gestor.contratar(nuevo);
        
        renderPrincipal();
        // Limpiamos la tabla de seniors porque los datos han cambiado y requiere recalcular
        document.getElementById("cuerpoSeniors").innerHTML = ""; 
        e.target.reset();
    });

    // B) Calcular Nóminas (Botón Verde)
    document.getElementById("btnCalcular").addEventListener("click", () => {
        renderSeniors();
        alert("Cálculos de IRPF y filtrado Senior realizados.");
    });

    // C) Despedir (Delegación de eventos en tabla principal)
    document.getElementById("cuerpoTabla").addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-delete")) {
            const index = e.target.dataset.index;
            
            if (confirm("¿Despedir a este empleado definitivamente?")) {
                gestor.despedir(index);
                renderPrincipal();
                // Limpiamos la tabla seniors por si acaso el eliminado estaba ahí
                document.getElementById("cuerpoSeniors").innerHTML = ""; 
            }
        }
    });

});