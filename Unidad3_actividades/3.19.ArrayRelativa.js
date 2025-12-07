
//creamos el array vacio
let numeros=[];


//usamos un bucle para recorrerlo
for (let i=0;i<10;i++){
    //i es la posicion relativa actual, guardamos i dentro del array
    numeros.push(i);
}

//mostramos el resultado
console.log("----ARRAY RESULTANTE----");
console.table(numeros);