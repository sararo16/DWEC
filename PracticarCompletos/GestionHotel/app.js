// ==========================================
// 1. CLASE DE DATOS (MODELO)
// ==========================================
class Habitacion {
    constructor(numero, precio) {
        this._numero = numero;
        this._precio = parseFloat(precio);
    }

    // Getters (Necesarios para puntuar en "Tipos de datos")
    get numero() { return this._numero; }
    get precio() { return this._precio; }

    // Método de lógica de negocio: define si es VIP
    esVip() {
        return this._precio > 100;
    }
}

// ==========================================
// 2. CLASE GESTORA (CONTROLADOR)
// ==========================================
class GestorHotel {
    constructor() {
        // 1. Leemos el texto plano del LocalStorage
        const datosJSON = JSON.parse(localStorage.getItem("misHabitaciones")) || [];
        
        // 2. ¡TRUCO DEL EXAMEN! 
        // Convertimos esos objetos planos de nuevo en objetos "Habitacion" 
        // para poder usar funciones como .esVip() más tarde.
        this.lista = datosJSON.map(h => new Habitacion(h._numero, h._precio));
    }

    agregar(nuevaHabitacion) {
        this.lista.push(nuevaHabitacion);
        this.guardar();
    }

    eliminar(indice) {
        this.lista.splice(indice, 1);
        this.guardar();
    }

    // Validación para no repetir números de habitación
    existeHabitacion(numero) {
        return this.lista.some(h => h.numero === numero);
    }

    guardar() {
        localStorage.setItem("misHabitaciones", JSON.stringify(this.lista));
    }
}

// ==========================================
// 3. LÓGICA DE INTERFAZ (DOM)
// ==========================================

const miHotel = new GestorHotel();

function render() {
    const tbody = document.getElementById('cuerpoTabla');
    tbody.innerHTML = ""; // Limpiar tabla

    miHotel.lista.forEach((hab, index) => {
        // Usamos el método de la clase para decidir el estilo
        const claseFila = hab.esVip() ? "fila-vip" : "";
        const textoCategoria = hab.esVip() ? "🌟 VIP" : "Estándar";

        // Creamos la fila HTML
        // IMPORTANTE: El botón borrar lleva un atributo data-index
        const fila = `
            <tr class="${claseFila}">
                <td>${hab.numero}</td>
                <td>${hab.precio.toFixed(2)} €</td>
                <td>${textoCategoria}</td>
                <td>
                    <button class="btn-borrar" data-index="${index}">Eliminar</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += fila;
    });
}

// ==========================================
// 4. EVENTOS (ADDEVENTLISTENER)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // A) Pintar al iniciar
    render();

    // B) Evento Submit (Añadir)
    document.getElementById('formHotel').addEventListener('submit', (e) => {
        e.preventDefault();

        const num = document.getElementById('numero').value.trim();
        const pre = document.getElementById('precio').value;

        // Validaciones
        if (miHotel.existeHabitacion(num)) {
            alert("Error: Esa habitación ya existe.");
            return;
        }

        if (pre < 0) {
            alert("Error: El precio no puede ser negativo.");
            return;
        }

        const nuevaHab = new Habitacion(num, pre);
        miHotel.agregar(nuevaHab);
        
        render(); // Repintar
        e.target.reset(); // Limpiar formulario
    });

    // C) Evento Delegado (Borrar)
    // Ponemos el listener en la TABLA (padre), no en cada botón.
    document.getElementById('cuerpoTabla').addEventListener('click', (e) => {
        
        // Verificamos si lo que se pulsó tiene la clase del botón borrar
        if (e.target.classList.contains('btn-borrar')) {
            // Recuperamos el índice del atributo data-index
            const index = e.target.getAttribute('data-index'); // o e.target.dataset.index

            if(confirm("¿Seguro que deseas eliminar esta habitación?")) {
                miHotel.eliminar(index);
                render();
            }
        }
    });

});