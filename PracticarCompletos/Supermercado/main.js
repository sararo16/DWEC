// CLASES
class Producto {
    constructor(codigo, precio, cantidad) {
        this.codigo = codigo;
        this.precio = precio;
        this.cantidad = cantidad;
    }

    set codigo(c) {
        if(c.trim() === "") alert("Código vacío");
        else this._codigo = c;
    }
    get codigo() { return this._codigo; }

    set precio(p) {
        if(p <= 0) alert("El precio debe ser mayor a 0");
        else this._precio = p;
    }
    get precio() { return this._precio; }

    set cantidad(c) {
        if(c < 0) alert("La cantidad no puede ser negativa");
        else this._cantidad = c;
    }
    get cantidad() { return this._cantidad; }
}

class ProductoCritico {
    constructor(codigo, cantidad, faltante) {
        this.codigo = codigo;
        this.cantidad = cantidad;
        this.faltante = faltante;
    }
}

// ARRAYS
const inventario = [];
const criticos = [];

// FUNCIONES

function addProducto() {
    const cod = document.getElementById("codigo").value.trim();
    const prec = parseFloat(document.getElementById("precio").value);
    const cant = parseInt(document.getElementById("cantidad").value);

    // Validación básica
    if (cod && !isNaN(prec) && !isNaN(cant)) {
        const existe = inventario.find(p => p.codigo === cod);
        
        if (existe) {
            alert("Error: Código de producto repetido.");
        } else if (prec <= 0 || cant < 0) {
            alert("Error: Revisa precio o cantidad.");
        } else {
            inventario.push(new Producto(cod, prec, cant));
            alert("Producto guardado.");
            mostrarInventario();
            limpiarInputs();
        }
    } else {
        alert("Faltan datos.");
    }
}

function modificarProducto() {
    const cod = document.getElementById("codigo").value.trim();
    const prec = parseFloat(document.getElementById("precio").value);
    const cant = parseInt(document.getElementById("cantidad").value);

    const prod = inventario.find(p => p.codigo === cod);

    if (prod) {
        if(prec > 0 && cant >= 0) {
            prod.precio = prec;
            prod.cantidad = cant;
            alert("Producto actualizado.");
            mostrarInventario();
            limpiarInputs();
        } else {
            alert("Valores numéricos incorrectos.");
        }
    } else {
        alert("Producto no encontrado.");
    }
}

function mostrarInventario() {
    const tbody = document.querySelector("#tablaInventario tbody");
    tbody.innerHTML = "";

    inventario.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p.codigo}</td>
            <td>${p.precio} €</td>
            <td>${p.cantidad}</td>
            <td>-</td>
            <td>-</td>
        `;
        tbody.appendChild(tr);
    });
}

function calcularStock() {
    const tbody = document.querySelector("#tablaInventario tbody");
    tbody.innerHTML = "";

    const tbodyCrit = document.querySelector("#tablaCriticos tbody");
    tbodyCrit.innerHTML = "";
    
    criticos.length = 0; // Limpiar array secundario

    inventario.forEach(p => {
        const valorTotal = p.precio * p.cantidad;
        let estado = "OK";

        // Si hay menos de 5 unidades, es CRÍTICO
        if (p.cantidad < 5) {
            estado = "CRÍTICO";
            // Calculamos cuántas faltan para llegar a un stock ideal de 10
            const faltan = 10 - p.cantidad;
            
            criticos.push(new ProductoCritico(p.codigo, p.cantidad, faltan));

            // Pintar tabla Críticos
            const trC = document.createElement("tr");
            trC.innerHTML = `
                <td>${p.codigo}</td>
                <td>${p.cantidad}</td>
                <td>${faltan}</td>
            `;
            tbodyCrit.appendChild(trC);
        }

        // Pintar tabla General con resultados
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p.codigo}</td>
            <td>${p.precio} €</td>
            <td>${p.cantidad}</td>
            <td>${valorTotal} €</td>
            <td>${estado}</td>
        `;
        tbody.appendChild(tr);
    });
}

function limpiarInputs() {
    document.getElementById("codigo").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("cantidad").value = "";
}

// EVENTOS
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnAdd").addEventListener("click", addProducto);
    document.getElementById("btnModify").addEventListener("click", modificarProducto);
    document.getElementById("btnCalcular").addEventListener("click", calcularStock);
});