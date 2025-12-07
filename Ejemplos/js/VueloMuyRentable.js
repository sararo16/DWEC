const vuelos2 = new Vuelo();
//const calculo = new VueloMuyRentable();
class VueloMuyRentable {
    constructor() {
        this.codigoVuelo = vuelos2.codigo;
        this.ingresoEstimado = ingresoEstimado;
    }
    CalcularVuelo(vuelo) {//funcion para calcular el importe total del vuelo
        const importeTotal = vuelo.numPlazas*vuelo.importe;
        let categoria;
        if (importeTotal <10000) {
            categoria = 'Poco rentable';
        } else if (importeTotal >= 10000 && importeTotal <20000) {
            categoria = 'Peso normal';
        } else if(importeTotal >20000){
            categoria = 'Muy rentable';
            this.registrarVuelo(vuelo.codigoVuelo, importeTotal.toFixed(2));
        }
        console.log(importeTotal);
        return { ingresoEstimado: importeTotal.toFixed(2)};
    }
    //mostrar el vuelo
}
function calcularVuelo() {
    const tabla = document.getElementById('categoriasVuelos').querySelector('tbody');
    tabla.innerHTML = '';
    vuelos2.forEach(vuelo => {
        const resultado = VueloMuyRentable.CalcularVuelo(vuelo);
        const fila = `
            <tr>
                <td>${resultado.codigoVuelo}</td>
                <td>${resultado.ingresoEstimado}</td>
            </tr>
        `;
        tabla.innerHTML += fila;
    });
}