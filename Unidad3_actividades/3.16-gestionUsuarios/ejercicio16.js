// 1. CLASE Y ARRAY (Tu lógica)
class Persona {
    constructor(usuario, clave, pregunta, respuesta) {
        this.usuario = usuario;
        this.clave = clave;
        this.pregunta = pregunta;
        this.respuesta = respuesta;
    }
}

let listadoPersonas = [];

// 2. FUNCIÓN PARA ESCRIBIR EN EL HTML 
function log(texto) {
    const pantalla = document.getElementById('pantalla');
    pantalla.innerHTML += `> ${texto}<br>`;
    pantalla.scrollTop = pantalla.scrollHeight; // Bajar scroll automáticamente
}

// 3. FUNCIONES LÓGICAS
function altaLogica(user, pass, preg, resp) {
    // Validar que no exista
    if (listadoPersonas.find(p => p.usuario === user)) {
        log(`❌ Error: El usuario ${user} ya existe.`);
        return;
    }
    const nueva = new Persona(user, pass, preg, resp);
    listadoPersonas.push(nueva);
    log(`✅ Usuario ${user} creado.`);
}

function bajaLogica(user) {
    const inicio = listadoPersonas.length;
    listadoPersonas = listadoPersonas.filter(p => p.usuario !== user);
    
    if (listadoPersonas.length < inicio) {
        log(`Usuario ${user} eliminado.`);
    } else {
        log(`No se encontró a ${user}.`);
    }
}

function consultarLogica(user) {
    const encontrado = listadoPersonas.find(p => p.usuario === user);
    if (encontrado) {
        log(`<b>Ficha:</b> ${encontrado.usuario} | Clave: ${encontrado.clave}`);
    } else {
        log(`Usuario ${user} no encontrado.`);
    }
}

// 4. FUNCIONES DE INTERFAZ (Botones)

function btnAlta() {
    // Cogemos los valores de los inputs del HTML
    let u = document.getElementById('inpUsuario').value;
    let c = document.getElementById('inpClave').value;
    let p = document.getElementById('inpPregunta').value;
    let r = document.getElementById('inpRespuesta').value;

    if(u === "") { log(" Escribe un usuario."); return; }
    
    altaLogica(u, c, p, r);
    
    // Limpiamos los inputs
    document.getElementById('inpUsuario').value = "";
    document.getElementById('inpClave').value = "";
}

function btnBaja() {
    let u = document.getElementById('inpBusqueda').value;
    bajaLogica(u);
}

function btnConsultar() {
    let u = document.getElementById('inpBusqueda').value;
    consultarLogica(u);
}

function btnListar() {
    log("--- LISTADO COMPLETO ---");
    listadoPersonas.forEach(p => {
        log(`👤 ${p.usuario}`);
    });
    log("----------------------");
}
