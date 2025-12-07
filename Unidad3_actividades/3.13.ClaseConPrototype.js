
//definimos la clase
class Alumno{
    constructor (nombre,nota1,nota2,nota3){
        this.nombre=nombre;
        this.nota1=nota1;
        this.nota2=nota2;
        this.nota3=nota3;
    }
}

let listaAlumnos=[];

//añadimos la funcion al prototipo para que todos los alumnos peudan calcular su propia media automaticamente
Alumno.prototype.getNotaMedia=function(){
    let media=(this.nota1+this.nota2+this.nota3/3);
    return parseFloat(media.toFixed(2)); //redondeamos a dos decimales
};

//funcion para añdir aluumnos
function agregarAlumno(nombre, n1, n2, n3){
    const nuevoAlumno=new Alumno (nombre,n1,n2,n3);
    listaAlumnos.push(nuevoAlumno);
    console.log(`Alumno ${nombre} añadido.`);
}

//funcion para eliminar alumno por nombre
function eliminarAlumno(){
    const longuitudInicial=listaAlumnos.length;

    //filtramos el array para dejar fuera al que coincida con el nombre
    listaAlumnos=listaAlumnos.filter(alumno=> alumno.nombre !==nombre);
    if (listaAlumnos.length < longitudInicial) {
        console.log(`Alumno ${nombre} eliminado.`);
    } else {
        console.log(` No se encontró al alumno ${nombre}.`);
    }
}
//mostrar array ordenado
function mostrarAlumnos(ordenarPor = 'nombre') {
    // Creamos una copia del array [...listaAlumnos] para no modificar el original al ordenar
    let copiaAlumnos = [...listaAlumnos];

    if (ordenarPor === 'nombre') {
        // Orden alfabético
        copiaAlumnos.sort((a, b) => a.nombre.localeCompare(b.nombre));
        console.log("--- Lista Ordenada por NOMBRE ---");
    } else if (ordenarPor === 'media') {
        // Orden numérico descendente (de mayor nota a menor)
        copiaAlumnos.sort((a, b) => b.getNotaMedia() - a.getNotaMedia());
        console.log("--- Lista Ordenada por NOTA MEDIA ---");
    }

    // Mostramos los resultados en tabla para facilitar la lectura
    const datosParaMostrar = copiaAlumnos.map(alumno => ({
        Nombre: alumno.nombre,
        Notas: `${alumno.nota1}, ${alumno.nota2}, ${alumno.nota3}`,
        Media: alumno.getNotaMedia() // Usamos la propiedad del prototipo
    }));

    console.table(datosParaMostrar);
}


// EJECUCIÓN DE PRUEBA

console.log("--- INICIO DEL PROGRAMA ---");

// 1. Añadimos alumnos
agregarAlumno("Carlos", 5, 6, 7);
agregarAlumno("Ana", 9, 10, 9);
agregarAlumno("Beatriz", 6, 5, 4);
agregarAlumno("David", 8, 8, 8);

// 2. Mostramos ordenados por nombre
mostrarAlumnos('nombre');

// 3. Mostramos ordenados por media (usando el prototype)
mostrarAlumnos('media');

// 4. Eliminamos un alumno
eliminarAlumno("Beatriz");

// 5. Verificamos que se eliminó
mostrarAlumnos('nombre');

