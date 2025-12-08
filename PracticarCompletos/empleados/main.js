// CLASES
class Empleado {
    constructor(dni, sueldoBase, antiguedad) {
        this.dni = dni;
        this.sueldoBase = sueldoBase;
        this.antiguedad = antiguedad;
    }

    set dni(nuevoDni) {
        if (!nuevoDni || nuevoDni.trim() === "") alert("El DNI no puede estar vacío");
        else this._dni = nuevoDni;
    }
    get dni() { return this._dni; }

    set sueldoBase(nuevoSueldo) {
        if (nuevoSueldo < 0) alert("El sueldo no puede ser negativo");
        else this._sueldoBase = nuevoSueldo;
    }
    get sueldoBase() { return this._sueldoBase; }

    set antiguedad(nuevaAnt) {
        if (nuevaAnt < 0) alert("La antigüedad no puede ser negativa");
        else this._antiguedad = nuevaAnt;
    }
    get antiguedad() { return this._antiguedad; }
}

class EmpleadoVIP {
    constructor(dni, sueldoFinal, bono) {
        this.dni = dni;
        this.sueldoFinal = sueldoFinal;
        this.bono = bono;
    }
}

// ARRAYS
const empleados = [];
const empleadosVIP = [];

// FUNCIONES

function addEmpleado() {
    const dni = document.getElementById("dni").value.trim();
    const sueldo = parseFloat(document.getElementById("sueldoBase").value);
    const ant = parseInt(document.getElementById("antiguedad").value);

    // Validar existencia
    const existe = empleados.find(e => e.dni === dni);

    if (dni && !isNaN(sueldo) && !isNaN(ant)) {
        if (existe) {
            alert("Ya existe un empleado con ese DNI");
        } else if (sueldo < 0 || ant < 0) {
            alert("Los valores numéricos deben ser positivos");
        } else {
            empleados.push(new Empleado(dni, sueldo, ant));
            alert("Empleado añadido");
            mostrarEmpleados();
            limpiarInputs();
        }
    } else {
        alert("Por favor rellena todos los campos correctamente");
    }
}

function modificarEmpleado() {
    const dni = document.getElementById("dni").value.trim();
    const sueldo = parseFloat(document.getElementById("sueldoBase").value);
    const ant = parseInt(document.getElementById("antiguedad").value);

    const empleadoEncontrado = empleados.find(e => e.dni === dni);

    if (empleadoEncontrado) {
        if (sueldo >= 0 && ant >= 0) {
            empleadoEncontrado.sueldoBase = sueldo;
            empleadoEncontrado.antiguedad = ant;
            alert(`Empleado ${dni} modificado`);
            mostrarEmpleados(); // Refrescar tabla
            limpiarInputs();
        } else {
            alert("Datos numéricos inválidos");
        }
    } else {
        alert("No se encontró el empleado con ese DNI para modificar");
    }
}

function mostrarEmpleados() {
    const tbody = document.querySelector("#tablaEmpleados tbody");
    tbody.innerHTML = "";

    empleados.forEach(e => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${e.dni}</td>
            <td>${e.sueldoBase}</td>
            <td>${e.antiguedad}</td>
            <td>-</td>
            <td>-</td>
        `;
        tbody.appendChild(tr);
    });
}

function calcularNominas() {
    const tbody = document.querySelector("#tablaEmpleados tbody");
    tbody.innerHTML = "";
    
    const tbodyVIP = document.querySelector("#tablaVIP tbody");
    tbodyVIP.innerHTML = "";
    
    // Vaciar array secundario
    empleadosVIP.length = 0;

    empleados.forEach(e => {
        // Lógica: 100 euros extra por año de antigüedad
        const bono = e.antiguedad * 100;
        const sueldoFinal = e.sueldoBase + bono;
        
        let categoria = "Normal";

        // Si gana más de 2000 es VIP
        if (sueldoFinal > 2000) {
            categoria = "VIP";
            empleadosVIP.push(new EmpleadoVIP(e.dni, sueldoFinal, bono));

            // Pintar en tabla VIP
            const trVIP = document.createElement("tr");
            trVIP.innerHTML = `
                <td>${e.dni}</td>
                <td>${sueldoFinal} €</td>
                <td>${bono} €</td>
            `;
            tbodyVIP.appendChild(trVIP);
        }

        // Pintar en tabla General con los cálculos
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${e.dni}</td>
            <td>${e.sueldoBase}</td>
            <td>${e.antiguedad}</td>
            <td>${sueldoFinal} €</td>
            <td>${categoria}</td>
        `;
        tbody.appendChild(tr);
    });
}

function limpiarInputs() {
    document.getElementById("dni").value = "";
    document.getElementById("sueldoBase").value = "";
    document.getElementById("antiguedad").value = "";
}

// EVENTOS
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnAdd").addEventListener("click", addEmpleado);
    document.getElementById("btnModify").addEventListener("click", modificarEmpleado);
    document.getElementById("btnCalcular").addEventListener("click", calcularNominas);
});