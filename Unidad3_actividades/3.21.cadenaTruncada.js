
//definimos metodo truncar en el prototipo de string
String.prototype.truncar=function(longitud,indicador="..."){
    if (this.length>longitud){
        //cortamos desde el inicio (0) hasta la longitud deseada y añadimos el indicador
        return this.substring(0,longitud) + indicador ;
    }
    return this.toString(); //si es corta se devuelve tal cual
};

//prueba
let texto="En un lugar de la mancha, cuyo nombre no quiero acordarme";

console.log(texto.truncar(20, "[...]"));