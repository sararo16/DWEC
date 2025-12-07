// 1. DEFINICIÓN DE LA CLASE
class RegistroPracticas {
    constructor(empresa, cif, alumno, dni, ciclo, anioFin) {
        // Datos de Empresa
        this.empresa = empresa;
        this.cif = cif;
        // Datos de Alumno
        this.alumno = alumno;
        this.dni = dni;
        this.ciclo = ciclo;
        this.anioFin = anioFin;
    }

    // Método extra para mostrar la info bonita
    obtenerResumen() {
        return ` ${this.alumno} (${this.dni}) | ${this.ciclo} - ${this.anioFin} | 🏢 ${this.empresa}`;
    }
}

// 2. BASE DE DATOS (Array)
let listado = [];

// 3. FUNCIÓN DE AYUDA (Para escribir en la pantalla negra)
function log(texto) {
    const pantalla = document.getElementById('resultado');
    pantalla.innerHTML += `> ${texto}<br>`;
    pantalla.scrollTop = pantalla.scrollHeight;
}

// --------------------------------------------------------
// LÓGICA DE NEGOCIO (Altas, Bajas, Búsquedas)
// --------------------------------------------------------

function altaLogica(emp, cif, alum, dni, ciclo, anio) {
    // Validar duplicados por DNI
    if (listado.find(r => r.dni === dni)) {
        log(` Error: El alumno con DNI ${dni} ya está registrado.`);
        return;
    }

    const nuevoRegistro = new RegistroPracticas(emp, cif, alum, dni, ciclo, anio);
    listado.push(nuevoRegistro);
    log(`✅ Alta correcta: ${alum} en ${emp}.`);
}

function bajaLogica(dni) {
    const cantidadInicial = listado.length;
    // Filtramos para quitar al que tenga ese DNI
    listado = listado.filter(r => r.dni !== dni);

    if (listado.length < cantidadInicial) {
        log(`Registro con DNI ${dni} eliminado.`);
    } else {
        log(`No se encontró ningún alumno con DNI ${dni}.`);
    }
}

// BÚSQUEDA POR CICLO
function buscarPorCicloLogica(ciclo) {
    log(`Buscando alumnos del ciclo: ${ciclo}...`);
    // Filter devuelve un array con TODOS los que coincidan
    const resultados = listado.filter(r => r.ciclo === ciclo);

    if (resultados.length > 0) {
        resultados.forEach(r => log(r.obtenerResumen()));
    } else {
        log("   No hay alumnos en este ciclo.");
    }
    log("--------------------------------");
}

// BÚSQUEDA POR AÑO
function buscarPorAnioLogica(anio) {
    log(`Buscando graduados del año: ${anio}...`);
    const resultados = listado.filter(r => r.anioFin == anio);

    if (resultados.length > 0) {
        resultados.forEach(r => log(r.obtenerResumen()));
    } else {
        log("   No hay alumnos de ese año.");
    }
    log("--------------------------------");
}

// --------------------------------------------------------
// PUENTE CON EL HTML (Botones)
// --------------------------------------------------------

function btnAlta() {
    // Recogemos todos los valores
    let emp = document.getElementById('empresa').value;
    let cif = document.getElementById('cif').value;
    let alu = document.getElementById('alumno').value;
    let dni = document.getElementById('dni').value;
    let cic = document.getElementById('ciclo').value;
    let ani = document.getElementById('anio').value;

    if (emp === "" || alu === "" || dni === "") {
        log("Rellena al menos Empresa, Alumno y DNI.");
        return;
    }

    altaLogica(emp, cif, alu, dni, cic, ani);

    // Limpiar campos clave
    document.getElementById('alumno').value = "";
    document.getElementById('dni').value = "";
}

function btnBaja() {
    let dni = document.getElementById('bajaDni').value;
    bajaLogica(dni);
}

function btnBuscarCiclo() {
    let ciclo = document.getElementById('buscarCiclo').value;
    buscarPorCicloLogica(ciclo);
}

function btnBuscarAnio() {
    let anio = document.getElementById('buscarAnio').value;
    buscarPorAnioLogica(anio);
}