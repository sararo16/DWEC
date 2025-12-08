// Definición de la clase Vuelo
export class Vuelo {
    constructor(codigo, plazas, importe) {
        this._codigo = codigo;
        this._plazas = parseInt(plazas);   // Conversión de tipos (Unidad 2.4)
        this._importe = parseFloat(importe); 
    }

    // Getters y Setters (Requisito para el 10)
    get codigo() { return this._codigo; }
    set codigo(val) { this._codigo = val; }

    get plazas() { return this._plazas; }
    set plazas(val) { this._plazas = parseInt(val); }

    get importe() { return this._importe; }
    set importe(val) { this._importe = parseFloat(val); }

    // Método de negocio
    calcularIngreso() {
        return this._plazas * this._importe;
    }
}

// Definición de la clase VueloMuyRentable
export class VueloMuyRentable {
    constructor(codigo, ingresoEstimado) {
        this._codigo = codigo;
        this._ingresoEstimado = ingresoEstimado;
    }

    get codigo() { return this._codigo; }
    get ingresoEstimado() { return this._ingresoEstimado; }
}