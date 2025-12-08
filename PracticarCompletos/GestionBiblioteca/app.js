// ==========================================
// 1. CLASE DE DATOS (MODELO INDIVIDUAL)
// ==========================================
class Libro {
    constructor(titulo, autor, paginas, prestado = false) {
        this._titulo = titulo;
        this._autor = autor;
        this._paginas = parseInt(paginas);
        this._prestado = prestado;
    }

    // Getters y Setters (Para el 10 en "Tipos de datos")
    get titulo() { return this._titulo; }
    get autor() { return this._autor; }
    get paginas() { return this._paginas; }
    
    get prestado() { return this._prestado; }
    set prestado(estado) { this._prestado = estado; }

    // Método de utilidad para invertir el estado
    toggleEstado() {
        this._prestado = !this._prestado;
    }
}

// ==========================================
// 2. CLASE GESTORA (CONTROLADOR DE LA COLECCIÓN)
// ==========================================
class GestorBiblioteca {
    constructor() {
        // Al instanciar, intentamos cargar del LocalStorage
        const datosGuardados = JSON.parse(localStorage.getItem("misLibros")) || [];
        
        // Convertimos los objetos planos guardados en instancias reales de 'Libro'
        // Esto es vital para poder usar los métodos como .toggleEstado() después
        this.coleccion = datosGuardados.map(l => new Libro(l._titulo, l._autor, l._paginas, l._prestado));
    }

    agregarLibro(libro) {
        this.coleccion.push(libro);
        this.guardar();
    }

    eliminarLibro(indice) {
        this.coleccion.splice(indice, 1);
        this.guardar();
    }

    cambiarEstadoLibro(indice) {
        this.coleccion[indice].toggleEstado();
        this.guardar();
    }

    obtenerEstadisticas() {
        const totalLibros = this.coleccion.length;
        // .reduce es una forma elegante de sumar, pero un forEach también valdría
        const totalPaginas = this.coleccion.reduce((acc, libro) => acc + libro.paginas, 0);
        return { totalLibros, totalPaginas };
    }

    guardar() {
        localStorage.setItem("misLibros", JSON.stringify(this.coleccion));
    }
}

// ==========================================
// 3. LÓGICA DE INTERFAZ (DOM)
// ==========================================

// Instanciamos el gestor
const miBiblioteca = new GestorBiblioteca();

// Función para pintar la tabla
function render() {
    const tbody = document.getElementById("cuerpoTabla");
    tbody.innerHTML = ""; // Limpiar tabla

    miBiblioteca.coleccion.forEach((libro, index) => {
        // Lógica visual
        const claseFila = libro.prestado ? "estado-prestado" : "estado-disponible";
        const textoEstado = libro.prestado ? "Prestado" : "Disponible";
        const textoBoton = libro.prestado ? "Devolver" : "Prestar";

        // Creamos la fila. 
        // IMPORTANTE: Añadimos atributos data-index en los botones para saber qué libro tocar
        const fila = `
            <tr class="${claseFila}">
                <td><b>${libro.titulo}</b></td>
                <td>${libro.autor}</td>
                <td>${libro.paginas}</td>
                <td>${textoEstado}</td>
                <td>
                    <button class="btn-amarillo btn-accion-estado" data-index="${index}">
                        ${textoBoton}
                    </button>
                    <button class="btn-rojo btn-accion-eliminar" data-index="${index}">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });

    // Actualizar contadores
    const stats = miBiblioteca.obtenerEstadisticas();
    document.getElementById("totalLibros").innerText = stats.totalLibros;
    document.getElementById("totalPaginas").innerText = stats.totalPaginas;
}

// ==========================================
// 4. EVENTOS (ADDEVENTLISTENER)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Pintamos nada más cargar la página
    render();

    // A) Evento SUBMIT del Formulario
    document.getElementById("formBiblioteca").addEventListener("submit", (e) => {
        e.preventDefault();
        
        const titulo = document.getElementById("titulo").value;
        const autor = document.getElementById("autor").value;
        const paginas = document.getElementById("paginas").value;

        const nuevoLibro = new Libro(titulo, autor, paginas);
        miBiblioteca.agregarLibro(nuevoLibro);
        
        render(); // Repintar
        e.target.reset(); // Limpiar inputs
    });

    // B) Evento DELEGADO en la Tabla (Para botones Eliminar/Cambiar)
    // Usamos esto porque los botones se crean dinámicamente y no existen al iniciar la página.
    document.getElementById("cuerpoTabla").addEventListener("click", (e) => {
        
        // Obtenemos el índice guardado en el atributo data-index
        const index = e.target.getAttribute("data-index");

        // 1. Si click en Eliminar
        if (e.target.classList.contains("btn-accion-eliminar")) {
            if(confirm("¿Seguro que quieres borrar este libro?")) {
                miBiblioteca.eliminarLibro(index);
                render();
            }
        }

        // 2. Si click en Cambiar Estado
        if (e.target.classList.contains("btn-accion-estado")) {
            miBiblioteca.cambiarEstadoLibro(index);
            render();
        }
    });

});