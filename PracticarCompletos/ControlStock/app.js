
// Clase Producto: Representa el producto base (similar a Vuelo)
class Producto {
    constructor(codigo, nombre, precio, stock) {
        this._codigo = codigo;
        this._nombre = nombre;
        this._precio = parseFloat(precio);
        this._stock = parseInt(stock);
    }

    // Getters
    get codigo() { return this._codigo; }
    get nombre() { return this._nombre; }
    get precio() { return this._precio; }
    get stock() { return this._stock; }
    
    // Setter para Stock (lo que se modifica)
    set stock(nuevoStock) {
        this._stock = parseInt(nuevoStock);
    }

    // Método para calcular el valor total de este producto
    calcularValor() {
        return this._precio * this._stock;
    }
}

// Clase ProductoPocoStock (Similar a VueloMuyRentable, pero al revés: stock < 5)
// Usamos esta segunda clase para cumplir con el requisito de dos clases.
class ProductoPocoStock {
    constructor(codigo, stockActual) {
        this.codigo = codigo;
        this.stockActual = stockActual;
    }
}


// --- 2. COLECCIONES EN MEMORIA ---

const inventario = []; // Colección de Productos
const stockBajo = [];   // Colección de ProductosPocoStock

// --- 3. FUNCIONES DE LÓGICA Y RENDERIZADO ---

/**
 * Pinta la tabla HTML del inventario y gestiona la colección stockBajo.
 */
function pintarInventario() {
    const tbody = document.getElementById("tablaCuerpo");
    tbody.innerHTML = "";
    
    // Limpiamos la lista de bajo stock para recalcularla
    stockBajo.length = 0; 

    inventario.forEach(prod => {
        const valor = prod.calcularValor();
        
        // Lógica de Estado (Similar a Rentable / Poco Rentable)
        const ES_POCO_STOCK = prod.stock < 5;
        let estadoClase = ES_POCO_STOCK ? "alerta-stock" : "ok-stock";
        let textoEstado = ES_POCO_STOCK ? "⚠️ BAJO MÍNIMOS" : "✅ Correcto";

        // Gestión de la segunda colección (stockBajo)
        if (ES_POCO_STOCK) {
            stockBajo.push(new ProductoPocoStock(prod.codigo, prod.stock));
        }

        tbody.innerHTML += `
            <tr>
                <td>${prod.codigo}</td>
                <td>${prod.nombre}</td>
                <td>${prod.precio.toFixed(2)} €</td>
                <td>${prod.stock}</td>
                <td>${valor.toFixed(2)} €</td>
                <td class="${estadoClase}">${textoEstado}</td>
            </tr>
        `;
    });
}

/**
 * Calcula y muestra el valor total del almacén.
 */
function calcularValorTotal() {
    let total = inventario.reduce((acc, p) => acc + p.calcularValor(), 0);
    document.getElementById("tituloTotal").innerText = 
        `Valor Total Inventario: ${total.toFixed(2)} € (Productos con stock bajo: ${stockBajo.length})`;
}


// --- 4. MANEJO DE EVENTOS (Separación total) ---

// Ejecutar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    
    // A) Añadir Producto
    document.getElementById("formAdd").addEventListener("submit", function(e) {
        e.preventDefault();
        
        const cod = document.getElementById("cod").value.trim();
        const nom = document.getElementById("nom").value.trim();
        const pre = document.getElementById("pre").value;
        const stk = document.getElementById("stk").value;

        // Validaciones (Código único, Stock y Precio > 0)
        if(inventario.find(p => p.codigo === cod)){
            alert("Error: Ese código de producto ya existe.");
            return;
        }
        if(parseFloat(pre) <= 0 || parseInt(stk) < 0) { // El stock puede ser 0
            alert("Error: El precio debe ser mayor que 0 y el stock no puede ser negativo.");
            return;
        }

        inventario.push(new Producto(cod, nom, pre, stk));
        pintarInventario();
        calcularValorTotal();
        this.reset();
    });

    // B) Modificar Stock
    document.getElementById("formMod").addEventListener("submit", function(e) {
        e.preventDefault();
        
        const busqueda = document.getElementById("modCod").value.trim();
        const nuevoStock = document.getElementById("modStk").value;

        // Validación
        if(parseInt(nuevoStock) < 0) {
            alert("Error: El nuevo stock no puede ser negativo.");
            return;
        }

        const productoEncontrado = inventario.find(p => p.codigo === busqueda);

        if (productoEncontrado) {
            // USAMOS EL SETTER definido en la clase Producto
            productoEncontrado.stock = nuevoStock; 
            
            alert(`Stock de ${productoEncontrado.nombre} actualizado a ${productoEncontrado.stock}`);
            
            // Repintar para reflejar los cambios en la tabla y en la lista de bajo stock
            pintarInventario(); 
            calcularValorTotal();
        } else {
            alert("Error: Producto no encontrado con ese código.");
        }
        this.reset();
    });

    // C) Calcular Valor Total
    document.getElementById("btnCalcular").addEventListener("click", calcularValorTotal);
});