//definir la clase

class coche {
    constructor(marca,modelo,año) {
        this.marca = marca;
        this.modelo = modelo;
        this.año = año;
        
    }

}

//creamos los cuatro coches
const coche1= new coche ("volkswagen", "Golf", "2015");
const coche2=new coche ("Audi" , "A4", "2014");
const coche3=new coche ("Audi", "TT", "2010");
const coche4=new coche ("Skoda","Octavia", "2014");

//agrupamos en un array
const concesionario=[coche1,coche2,coche3,coche4];

