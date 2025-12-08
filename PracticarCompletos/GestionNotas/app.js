// ==========================================
// 1. CLASE ALUMNO (MODELO)
// ==========================================
class Alumno {
    constructor(dni, nombre, teorica, practica) {
        this._dni = dni;
        this._nombre = nombre;
        this._teorica = parseFloat(teorica);
        this._practica = parseFloat(practica);
    }

    // Getters para encapsulación (Nota 10 en Tipos de datos)
    get dni() { return this._dni; }
    get nombre() { return this._nombre; }
    get teorica() { return this._teorica; }
    get practica() { return this._practica; }

    // Lógica de Negocio 1: Promedio (Se calcula al pedirlo)
    get promedio() {
        return (this._teorica + this._practica) / 2;
    }

    // Lógica de Negocio 2: Estado (Booleano)
    esAprobado() {
        return this.promedio >= 5;
    }

    // Lógica de Negocio 3: Estado (Texto)
    getEstadoTexto() {
        return this.esAprobado() ? "Aprobado" : "Suspenso";
    }
}

// ==========================================
// 2. CLASE GESTORA (CONTROLADOR)
// ==========================================
class GestorAlumnos {
    constructor() {
        // 1. Leer JSON de LocalStorage
        const datosJSON = JSON.parse(localStorage.getItem("misAlumnos")) || [];
        
        // 2. REINSTANCIAR: Convertir objetos planos de vuelta a Alumno
        // Esto es crucial para que los métodos como .promedio funcionen al cargar
        this.lista = datosJSON.map(d => 
            new Alumno(d._dni, d._nombre, d._teorica, d._practica)
        );
    }

    agregar(nuevoAlumno) {
        this.lista.push(nuevoAlumno);
        this.guardar();
    }

    eliminar(indice) {
        this.lista.splice(indice, 1);
        this.guardar();
    }

    existeDNI(dniBuscado) {
        return this.lista.some(a => a.dni === dniBuscado);
    }

    contarAprobados() {
        // Usamos filter para obtener solo los aprobados y luego contamos la longitud
        return this.lista.filter(a => a.esAprobado()).length;
    }

    guardar() {
        // Usamos JSON.stringify, guardando los datos internos (las propiedades _privadas)
        localStorage.setItem("misAlumnos", JSON.stringify(this.lista));
    }
}

// ==========================================
// 3. INTERFAZ Y EVENTOS
// ==========================================

const gestor = new GestorAlumnos();

function actualizarVista() {
    const tbody = document.getElementById("cuerpoTabla"); 
    tbody.innerHTML = ""; // Limpiar tabla

    gestor.lista.forEach((item, index) => {
        // Lógica visual basada en el método de la clase Alumno
        const claseFila = item.esAprobado() ? "aprobado" : "suspenso";
        
        // Generación de la fila
        const fila = `
            <tr class="${claseFila}">
                <td>${item.dni}</td>
                <td>${item.nombre}</td>
                <td>${item.promedio.toFixed(1)}</td>
                <td>${item.getEstadoTexto()}</td>
                <td>
                    <button class="btn-borrar" data-index="${index}">Eliminar</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });

    // Actualizar el contador de aprobados
    document.getElementById("totalAprobados").innerText = gestor.contarAprobados();
}

// Escuchar eventos una vez que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inicialización
    actualizarVista();

    // 2. Evento Añadir (Formulario Submit)
    document.getElementById('formAñadir').addEventListener('submit', (e) => {
        e.preventDefault(); 

        const d = document.getElementById("dni").value.trim().toUpperCase();
        const n = document.getElementById("nombre").value;
        const t = document.getElementById("teorica").value;
        const p = document.getElementById("practica").value;

        // Validaciones
        if (gestor.existeDNI(d)) {
            alert("⚠️ Error: Ya existe un alumno con ese DNI.");
            return;
        }

        const nuevoAlumno = new Alumno(d, n, t, p);
        gestor.agregar(nuevoAlumno);
        
        actualizarVista(); 
        e.target.reset(); // Limpiar formulario
    });

    // 3. Evento Delegado (Eliminar)
    // Escuchamos el clic en la tabla padre (cuerpoTabla)
    document.getElementById("cuerpoTabla").addEventListener('click', (e) => {
        // Verificamos que el clic venga del botón con clase 'btn-borrar'
        if (e.target.classList.contains("btn-borrar")) {
            // Obtenemos el índice del atributo de datos
            const index = e.target.dataset.index;
            
            if(confirm("¿Borrar alumno?")) {
                gestor.eliminar(index);
                actualizarVista();
            }
        }
    });
});