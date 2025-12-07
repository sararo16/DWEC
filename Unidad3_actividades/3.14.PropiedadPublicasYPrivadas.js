
//definimos la clase
class persona {
    #edad;
    #IdInterno;
    pais="España";
    
    constructor (nombre,edad){
        this.nombre=nombre;
        this.#edad=edad; //indicamos que es privada
    }  


get edad(){ return this.#edad;} //lee la edad, es privada

//si la edad esta en unrango se actualiza
set edad(nuevaEdad){
    if (nuevaEdad >0 && nuevaEdad<120){
        this.#edad=nuevaEdad;
        console.log(`Edad actualizada a ${nuevaEdad}`);

    }else{
        console.log("Error: La edad debe ser un número realista.");
    }
}

//metodo privado:solo la propia clase puede usarlo
#generarFicha(){
    return `ID: ${this.#IdInterno} | ${this.nombre} | ${this.#edad} años`;
}

//metodo publico: todos pueden usarlo
motrarInformacion(){
    //desde aqui si podemos llamar al metodo privado
    const ficha=this.#generarFicha();
    console.log("--- INFORMACIÓN PÚBLICA ---");
    console.log(ficha);
    console.log(`País: ${this.pais}`);
}
}

