// ==========================================
// 1. CLASE MODELO (DATOS)
// ==========================================
class Producto {
    constructor(nombre, precio, stock) {
        this._nombre = nombre;
        this._precio = parseFloat(precio);
        this._stock = parseInt(stock);
    }

    // Getters (Encapsulación)
    get nombre() { return this._nombre; }
    get precio() { return this._precio; }
    get stock() { return this._stock; }

    // --- Lógica de Negocio ---

    // Calcula cuánto vale todo el stock de este producto
    calcularValorTotal() {
        return this._precio * this._stock;
    }

    // Devuelve true si el stock es crítico (< 5)
    esStockBajo() {
        return this._stock < 5;
    }
}

// ==========================================
// 2. CLASE GESTORA (CONTROLADOR)
// ==========================================
class GestorTienda {
    constructor() {
        // 1. Cargar datos crudos del LocalStorage
        const datosJSON = JSON.parse(localStorage.getItem("datosTienda")) || [];
        
        // 2. REINSTANCIAR (CRÍTICO PARA EXAMEN)
        // Convertimos los objetos planos (JSON) en instancias reales de 'Producto'.
        // Si no hacemos esto, .calcularValorTotal() daría error al recargar la página.
        this.inventario = datosJSON.map(d => 
            new Producto(d._nombre, d._precio, d._stock)
        );
    }

    agregarProducto(nuevoProducto) {
        this.inventario.push(nuevoProducto);
        this.guardar();
    }

    eliminarProducto(indice) {
        this.inventario.splice(indice, 1);
        this.guardar();
    }

    // Calcula el valor total de TODOS los productos en el almacén
    calcularTotalAlmacen() {
        return this.inventario.reduce((total, prod) => total + prod.calcularValorTotal(), 0);
    }

    guardar() {
        localStorage.setItem("datosTienda", JSON.stringify(this.inventario));
    }
}

// ==========================================
// 3. INTERFAZ Y DOM
// ==========================================

const gestor = new GestorTienda();

function render() {
    const tbody = document.getElementById("cuerpoTabla");
    tbody.innerHTML = ""; // Limpiar tabla

    gestor.inventario.forEach((prod, index) => {
        const valorTotal = prod.calcularValorTotal();
        const stockBajo = prod.esStockBajo();

        // Lógica visual basada en el modelo
        const claseCSS = stockBajo ? "stock-bajo" : "stock-bien";
        const aviso = stockBajo ? "<br><small>⚠️ ¡Reponer Stock!</small>" : "";

        // Generar fila HTML
        // IMPORTANTE: Usamos data-index para el botón borrar
        const fila = `
            <tr class="${claseCSS}">
                <td>${prod.nombre} ${aviso}</td>
                <td>${prod.precio.toFixed(2)} €</td>
                <td>${prod.stock} uds.</td>
                <td>${valorTotal.toFixed(2)} €</td>
                <td>
                    <button class="btn-borrar" data-index="${index}">Eliminar</button>
                </td>
            </tr>
        `;
        
        tbody.innerHTML += fila;
    });

    // Actualizar estadística global
    document.getElementById("totalAlmacen").innerText = gestor.calcularTotalAlmacen().toFixed(2);
}

// ==========================================
// 4. LISTENERS (EVENTOS)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    
    // A) Carga Inicial
    render();

    // B) Formulario Añadir
    document.getElementById("formularioProducto").addEventListener("submit", (e) => {
        e.preventDefault();

        const nom = document.getElementById("nombre").value;
        const pre = document.getElementById("precio").value;
        const sto = document.getElementById("stock").value;

        // Validación simple
        if (pre < 0 || sto < 0) {
            alert("⚠️ El precio y el stock no pueden ser negativos.");
            return;
        }

        const nuevo = new Producto(nom, pre, sto);
        gestor.agregarProducto(nuevo);
        
        render(); // Repintar
        e.target.reset(); // Limpiar inputs
    });

    // C) Evento Delegado: Borrar
    // Ponemos el "oído" en el cuerpo de la tabla, no en cada botón.
    document.getElementById("cuerpoTabla").addEventListener("click", (e) => {
        
        // Verificamos si el click fue en un botón de borrar
        if (e.target.classList.contains("btn-borrar")) {
            const index = e.target.dataset.index;
            
            if (confirm("¿Eliminar este producto del inventario?")) {
                gestor.eliminarProducto(index);
                render();
            }
        }
    });

});