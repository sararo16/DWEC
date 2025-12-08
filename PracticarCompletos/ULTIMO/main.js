//clase vuelo
class Vuelo{
    constructor(codigo, numPlazas, precio){
        this.codigo = codigo;   
        this.numPlazas = numPlazas;
        this.precio = precio;
    }


    //getters y setters
    set codigo (nuevoCodigo) {
        if (nuevoCodigo===this._codigo){
            alert("Codigo ya existe");
        } else if (nuevoCodigo.trim()===""){
            alert("Codigo no puede estar vacio");
        } else {
            this._codigo = nuevoCodigo;
        }
}

    get codigo() {
        return this._codigo;
    }

    set numPlazas (nuevoNumPlazas) {
        if(nuevoNumPlazas<1){
            alert("El numero de plazas debe ser mayor a cero");
        } else {
            this._numPlazas = nuevoNumPlazas;
        }
    }

    get numPlazas() {
        return this._numPlazas;
    }

    set precio (nuevoPrecio) {
        if(nuevoPrecio<1){
            alert("El precio debe ser mayor a cero");
        } else {
            this._precio = nuevoPrecio;
        }
    }

    get precio() {
        return this._precio;
    }
}

//clase vuelos muy rentables
class VueloMuyRentable{
     constructor(codigo, ingreso) {
        this.codigo = codigo;
        this.ingreso = ingreso;
    }
}

//arrays para almacenar los vuelos
const vuelos = [];
const vueloMuyRentable = [];


//FUNCIONES

//Funcion añadir vuelo
function addVuelo() {
    const codigo = document.getElementById("codigo").value.trim();
    const numPlazas = parseInt(document.getElementById("numPlazas").value);
    const importe = parseFloat(document.getElementById("importe").value);

    //validaciones
    if (codigo && !isNaN(numPlazas) && !isNaN(importe)) {
        const vueloExistente = vuelos.find(c => c.codigo===codigo);

        if(vueloExistente){
            alert(`Ya existe un vuelo con el codigo ${codigo}`)
        }else{
            if(numPlazas<1){
                alert("El número de plazas debe ser mayor que 1");
                return;
            }else if(importe<1){
                alert("El precio debe ser mayor que 1");
                return;
            }else{
                vuelos.push(new Vuelo(codigo, numPlazas, importe));
                alert(`Vuelo añadido: ${codigo}`);
                mostrarVuelos();
                clearInputs();
            }
            
        }
    } else {
        alert("Por favor, introduce datos válidos.");
    }
}


// Mostrar vuelos en la tabla
function mostrarVuelos() {
    const tbody = document.querySelector("#tablavuelos tbody");
    tbody.innerHTML = ""; // limpiar antes de volver a pintar

    vuelos.forEach(vuelo => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${vuelo.codigo}</td>
            <td>${vuelo.numPlazas}</td>
            <td>${vuelo.precio}</td>
            <td></td>
            <td></td>
        `;

        tbody.appendChild(fila);
    });
}


//Funcion modificar vuelo
function modificarVuelos(){
    const codigo = document.getElementById("codigo").value;
    const numPlazas = parseInt(document.getElementById("numPlazas").value);
    const importe = parseFloat(document.getElementById("importe").value);

    const vuelo = vuelos.find(c => c.codigo === codigo);
    if (vuelo) {
        if(numPlazas<1){
            alert("El número de plazas debe ser mayor que 1");
            return;
        }else if(importe<1){
            alert("El precio debe ser mayor que 1");
            return;
        }else{
            vuelo.numPlazas = numPlazas;
            vuelo.precio = importe;
            alert(`Vuelo modificado: ${codigo}`);
            mostrarVuelos();
            clearInputs();
        }
    } else {
        alert("Vuelo no encontrado.");
    }
}


// Calcular ingreso y rentabilidad
function calcular() {
    const tbody = document.querySelector("#tablavuelos tbody");
    tbody.innerHTML = "";

    const tbodyRentables = document.querySelector("#tablaMuyRentables tbody");
    tbodyRentables.innerHTML = "";

    //limpiar el array de vueloMuyRentable
    vueloMuyRentable.length=0;

    vuelos.forEach(vuelo => {
        const ingreso = vuelo.numPlazas * vuelo.precio;
        let rentabilidad = "";

        if (ingreso < 10000) {
            rentabilidad = "Poco rentable";
        } else if (ingreso >= 10000 && ingreso <= 20000) {
            rentabilidad = "Rentable";
        } else {
            rentabilidad = "Muy rentable";
        }

        // Pintar en tabla principal
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${vuelo.codigo}</td>
            <td>${vuelo.numPlazas}</td>
            <td>${vuelo.precio}</td>
            <td>${ingreso}</td>
            <td>${rentabilidad}</td>
        `;
        tbody.appendChild(fila);

        // Si es muy rentable, añadir al array y a la segunda tabla
        if (rentabilidad === "Muy rentable") {

            //crear objeto de la clase VueloMuyRentable
            const nuevoRentable = new VueloMuyRentable(vuelo.codigo, ingreso);
            vueloMuyRentable.push(nuevoRentable);

            const filaRentable = document.createElement("tr");
            filaRentable.innerHTML = `
                <td>${nuevoRentable.codigo}</td>
                <td>${vuelo.numPlazas}</td>
                <td>${nuevoRentable.ingreso}</td>
                <td>${vuelo.precio}</td>
            `;
            tbodyRentables.appendChild(filaRentable);
        }
       
    });
}


//Limpiar inputs
function clearInputs() {
    document.getElementById("codigo").value = "";
    document.getElementById("numPlazas").value = "";
    document.getElementById("importe").value = "";
}

// Eventos
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnAdd").addEventListener("click", addVuelo);
    document.getElementById("btnModify").addEventListener("click", modificarVuelos);
    document.getElementById("btnCalcular").addEventListener("click", calcular);
});