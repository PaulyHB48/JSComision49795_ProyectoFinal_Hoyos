/*
Comisión 49795 JavaScript

Pre-Entrega 3

Maria Paulina Hoyos Burgos
*/

/*
Consigna:
Una empresa de transporte llamada APP SERVICIOS necesita crear una aplicación para ir capturando los servicios requeridos por los usuarios, allí presentar un listado de opciones de rutas

Una vez el usuario define: Nombre empresa, Nombre de contacto, Número de contacto, número de pasajeros, y seleccionar la ruta de una lista desplegable, se genera un reporte confirmando el agendamiento de su transporte

MEJORA FUTURA: Se solicitará fecha y hora y se organizará el archivo según fecha y hora del servicios.
*/

///Captura elementos del DOM
let servicios = [];
let valorServiciosCliente = [];

const empresa = document.getElementById('empresa');
const nameContacto = document.getElementById('name-contacto');
const numContacto = document.getElementById('num-contacto');
const numUsuarios = document.getElementById('num-usuarios');
const selectRuta = document.getElementById('ruta');
const enviarSolicitud = document.getElementById('sol-servicio');
const enviarReporte = document.getElementById('enviar');
const vaciarTabla = document.getElementById('vaciar');
let formSolicitud = document.getElementById('form-sol-servicio');
let tableFill = document.getElementById('items');


// Objeto rutas de transporte
let rutasTransporte = [new Ruta("MDE-JMC/JMC-MDE", "Transporte entre Medellin y el aeropuerto JMC o viceversa", 90000),
new Ruta("ENV-JMC/JMC-ENV", "Transporte entre Envigado y el aeropuerto JMC o viceversa", 95000),
new Ruta("SAB-JMC/JMC-SAB", "Transporte entre Sabaneta y el aeropuerto JMC o viceversa", 100000),
new Ruta("BEL-JMC/JMC-BEL", "Transporte entre Bello y el aeropuerto JMC o viceversa", 105000),
];

// Guardando los items del objeto rutasTransporte en el localStorage
localStorage.setItem('rutas', JSON.stringify(rutasTransporte));

// Función para cargar rutas en dropdown "SELECCIONE LA RUTA"
function cargarRutasDropdwn() {
    rutasTransporte = JSON.parse(localStorage.getItem('rutas'));
    rutasTransporte.forEach((rutaT, index) => {
        let optionDropdownRutas = document.createElement('option');
        optionDropdownRutas.textContent = `(${rutaT.ruta}): ${rutaT.descripcion} --> $${rutaT.precio}`;
        index = optionDropdownRutas.value;
        selectRuta.appendChild(optionDropdownRutas);
    });
}

// Función para registrar un nuevo servicio
function registrarServicio() {
    let newServicio = new Servicios(empresa.value, nameContacto.value, numContacto.value, +numUsuarios.value, selectRuta.value);
    if (numUsuarios.value >0 && numUsuarios.value<5){
        console.log(newServicio);
        servicios.push(newServicio);
    }else{
        Swal.fire({
            position: "center",
            icon: "error",
            title: "¡Cantidad de usuario inválido!",
            showConfirmButton: false,
            timer: 2000
        });

    }    

}

// Evento para registrar servicio o detectara si el formulario no está completo
enviarSolicitud.addEventListener('click', (evento) => {
    evento.preventDefault(); //*Para evitar que la pagina se refresque al presionar el btn

    if (empresa.value !== "" && nameContacto.value !== "" && numContacto.value !== "" && numUsuarios.value >0 && numUsuarios.value<5 && selectRuta.value !== "") {

        registrarServicio();

        Toastify({
            text: "¡Servicio registrado existosamente!",
            duration: 2000,
            newWindow: true,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
        }).showToast();

        cleanForm(formSolicitud);
        reporteServicios();

    } else {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "¡Formulario incompleto, todos los campos son requeridos!",
            showConfirmButton: false,
            timer: 2000
        });

    }

})

// Función para limpiar el formulario
function cleanForm(form) {
    form.reset(); //* Para limpiar el formulario
}

cargarRutasDropdwn();

// Función para dibujar la tabla
function reporteServicios() {
    const bodyTabla = document.getElementById("items");
    bodyTabla.innerHTML = ``; //* Iniciar el body de la tabla vacio
    servicios.forEach((item, index) => {
        bodyTabla.innerHTML = bodyTabla.innerHTML +
            `<tr>
                <th>${index + 1}</th>
                <td>${item.empresa}</td>
                <td>${item.nombreContact}</td>
                <td>${item.numeroContact}</td>
                <td>${item.numeroUsuarios}</td>
                <td>${item.seleccionRuta}</td>                        

            </tr>
        `;

    });
}

// Evento para enviar el reporte a un correo solicitado al dar click en enviar
enviarReporte.addEventListener('click', (eventoenviar) => {
    eventoenviar.preventDefault(); //*Para evitar que la pagina se refresque al presionar el btn

    Swal.fire({
        title: 'Login de Usuario',
        text: 'Bienvenido a la pagina X',
        inputLabel: 'Ingrese email',
        inputPlaceholder: 'pepe@pepe.com',
        input: 'email',
        confirmButtonText: 'Enviar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#FF0000'
    })

    tableFill.innerHTML = "";
    servicios = [];

})

// Evento para vaciar la tabla
vaciarTabla.addEventListener('click', (eventovaciar) => {
    eventovaciar.preventDefault(); //*Para evitar que la pagina se refresque al presionar el btn

    tableFill.innerHTML = "";
    servicios = [];

})


//* MEJORA FUTURA, A MEDIDA QUE SE VA GENERANDO PARA FILA DE LA TABLA, IR GENERANDO UN ARRAY CON LOS VALORES PARA HACER UN REDUCE Y DAR EL TOTAL DE LOS SERVICIOS