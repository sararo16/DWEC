// ==========================================
// 1. CLASE SOCIO (Modelo de Datos)
// ==========================================
class Socio {
    constructor(dni, nombre, modalidad, cuota) {
        this._dni = dni;
        this._nombre = nombre;
        this._modalidad = modalidad;
        this._cuota = parseFloat(cuota);
    }

    // Getters (Para cumplir con la encapsulación)
    get dni() { return this._dni; }
    get nombre() { return this._nombre; }
    get modalidad() { return this._modalidad; }
    get cuota() { return this._cuota; }

    // Método para determinar si es Premium (Lógica de negocio en la clase)
    esPremium() {
        return this._cuota >= 40;
    }
}

// ==========================================
// 2. CLASE GESTOR (Controlador de la App)
// ==========================================
class GestorGimnasio {
    constructor() {
        // Cargar del localStorage al iniciar
        const datos = JSON.parse(localStorage.getItem("misSocios")) || [];
        
        // Mapear: Convertimos los objetos planos (JSON) en instancias reales de Socio
        // Esto permite usar el método .esPremium() después.
        this.socios = datos.map(d => new Socio(d._dni, d._nombre, d._modalidad, d._cuota));
    }

    agregarSocio(nuevoSocio) {
        this.socios.push(nuevoSocio);
        this.guardar();
    }

    eliminarSocio(indice) {
        this.socios.splice(indice, 1);
        this.guardar();
    }

    existeDNI(dniBuscado) {
        // Devuelve true si encuentra algún socio con ese DNI
        return this.socios.some(s => s.dni === dniBuscado);
    }

    calcularTotal() {
        // Suma todas las cuotas usando reduce (o un bucle for clásico)
        return this.socios.reduce((total, s) => total + s.cuota, 0);
    }

    guardar() {
        localStorage.setItem("misSocios", JSON.stringify(this.socios));
    }
}

// ==========================================
// 3. INTERFAZ Y EVENTOS (Separación Total)
// ==========================================

// Instancia única del gestor
const miGimnasio = new GestorGimnasio();

// Función para Pintar (Renderizar)
function actualizarVista() {
    const tbody = document.getElementById("cuerpoTabla");
    tbody.innerHTML = ""; // Limpiar tabla

    miGimnasio.socios.forEach((socio, index) => {
        // Usamos el método de la clase Socio para saber el color
        const clase = socio.esPremium() ? "fila-premium" : "";
        
        // Creamos la fila HTML
        // IMPORTANTE: data-index="${index}" nos sirve para saber qué botón se pulsa
        tbody.innerHTML += `
            <tr class="${clase}">
                <td>${socio.dni}</td>
                <td>${socio.nombre}</td>
                <td>${socio.modalidad}</td>
                <td>${socio.cuota.toFixed(2)} €</td>
                <td>
                    <button class="btn-borrar" data-index="${index}">Dar de Baja</button>
                </td>
            </tr>
        `;
    });

    // Actualizar recaudación
    document.getElementById("totalRecaudacion").innerText = miGimnasio.calcularTotal().toFixed(2);
}

// ==========================================
// 4. LISTENERS (Manejo de Eventos)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Cargar la tabla al entrar
    actualizarVista();

    // 2. Evento del Formulario (Añadir)
    document.getElementById("formGimnasio").addEventListener("submit", (e) => {
        e.preventDefault();

        const dni = document.getElementById("dni").value.trim().toUpperCase();
        const nombre = document.getElementById("nombre").value;
        const modalidad = document.getElementById("modalidad").value;
        const cuota = document.getElementById("cuota").value;

        // Validaciones
        if (miGimnasio.existeDNI(dni)) {
            alert("⚠️ Error: Ya existe un socio con el DNI " + dni);
            return; 
        }

        if (parseFloat(cuota) < 0) {
            alert("⚠️ Error: La cuota no puede ser negativa.");
            return;
        }

        // Crear y Añadir
        const nuevo = new Socio(dni, nombre, modalidad, cuota);
        miGimnasio.agregarSocio(nuevo);
        
        actualizarVista();
        e.target.reset(); // Limpiar formulario
    });

    // 3. Evento Delegado (Borrar)
    // Escuchamos clicks en toda la tabla, pero solo actuamos si es el botón de borrar
    document.getElementById("cuerpoTabla").addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-borrar")) {
            // Leemos el índice guardado en el atributo data-index
            const index = e.target.dataset.index;
            
            if(confirm("¿Estás seguro de dar de baja a este socio?")) {
                miGimnasio.eliminarSocio(index);
                actualizarVista();
            }
        }
    });

});