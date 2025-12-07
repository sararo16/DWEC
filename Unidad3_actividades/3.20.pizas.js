
//array con tres pizzas
let pizzas=["carbonara", "barbacoa", "margarita"];

//añadimos dos nuevas con push (añade al final)
pizzas.push("Cuatro quesos", "Hawaiana");

//mostramos los resultados
console.log(`Número total de pizzas: ${pizzas.length}`)
console.log("Variedades disponibles: " + pizzas.join(", "));