// Array multidimensional (Array de Arrays)
let alumnos = [
    ["Ana", 22, "Madrid", "M"],
    ["Luis", 25, "Barcelona", "H"],
    ["Maria", 20, "Sevilla", "M"]
];

// Prueba de PUSH: Añadimos un alumno nuevo (un array completo)
alumnos.push(["Pedro", 23, "Valencia", "H"]);
console.log("Después de push:", alumnos);

// Prueba de POP: Eliminamos al último (Pedro)
let alumnoEliminado = alumnos.pop();
console.log("Alumno eliminado:", alumnoEliminado);