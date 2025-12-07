
//añadimos el metodo al prototipo de array
Array.prototype.eliminarEn=function(posicion){

    //comprobamos si la posicion es valida para evitar errores
    if (posicion >=0 && posicion<this.length){
        //splice (posicion,cantidad)elimina elementos
        this.splice(posicion,1);
        console.log(`Elemento en posición ${posicion} eliminado.`);
    }else{
         console.log(`Error: La posicion no existe`);

    }
};

let animales=["caballo","Perro", "gato"];

console.log ("Antes:", animales);

animales.eliminarEn(1);

console.log ("despues:",animales);

animales.eliminarEn(30); //no exixtse