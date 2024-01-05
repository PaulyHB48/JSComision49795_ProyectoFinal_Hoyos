/*
Comisión 49795 JavaScript

PROYECTO FINAL

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
const email = document.getElementById('correo');
const selectRuta = document.getElementById('ruta');
const enviarSolicitud = document.getElementById('sol-servicio');
const enviarReporte = document.getElementById('enviar');
const vaciarTabla = document.getElementById('vaciar');
let formSolicitud = document.getElementById('form-sol-servicio');
let tableFill = document.getElementById('items');

// Función para cargar las rutas a una lista desplegable a través de un archivo JSON local
function cargarRutasDropdwn() {
    // Utilizamos una petición fetch para obtener los datos del archivo JSON local
    fetch('rutas.json')
        .then(response => response.json())
        .then(data => {
            rutasTransporte = data;
            rutasTransporte.forEach((rutaT) => {
                let optionDropdownRutas = document.createElement('option');
                optionDropdownRutas.textContent = `(${rutaT.ruta}): ${rutaT.descripcion} --> $${rutaT.precio}`;
                optionDropdownRutas.value = rutaT.precio;
                selectRuta.appendChild(optionDropdownRutas);
            });
        })
        .catch(error => console.error('Error al cargar las rutas:', error));
}

// Función para registrar un nuevo servicio
function registrarServicio() {
    let rutaSeleccionada = rutasTransporte.find(ruta => ruta.precio === +selectRuta.value);
    let newServicio = new Servicios(empresa.value, nameContacto.value, numContacto.value, +numUsuarios.value, email.value, rutaSeleccionada.ruta, rutaSeleccionada.precio);
    if (numUsuarios.value > 0 && numUsuarios.value < 5) {
        console.log(newServicio);
        servicios.push(newServicio);
    } else {
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

    if (empresa.value !== "" && nameContacto.value !== "" && numContacto.value !== "" && numUsuarios.value > 0 && numUsuarios.value < 5 && email.value !== "" && selectRuta.value !== "") {

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

        enviarFormulario();

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
    let sumaPrecios = 0;
    bodyTabla.innerHTML = ``; //* Iniciar el body de la tabla vacio
    servicios.forEach((item, index) => {
        bodyTabla.innerHTML = bodyTabla.innerHTML +
            `<tr>
                <th>${index + 1}</th>
                <td>${item.empresa}</td>
                <td>${item.nombreContact}</td>
                <td>${item.numeroContact}</td>
                <td>${item.numeroUsuarios}</td>
                <td>${item.correo}</td>
                <td>${item.seleccionRuta}</td>    
                <td>$${item.precio}</td>               

            </tr>
        `;

        sumaPrecios += item.precio; // Suma el precio del servicio actual a la suma total


    });
    // Agregar fila de suma de precios al final
    bodyTabla.innerHTML += `
            <tr> 
                <td colspan="7">TOTAL SERVICIOS SOLICITADOS $</td>
                <td id="suma-precios">$${sumaPrecios}</td>
            </tr>
        `;

}

// Función para enviar el formulario
function enviarFormulario() {

    // Valores del formulario
    const empresaValor = empresa.value;
    const nameContactoValor = nameContacto.value;
    const numContactoValor = numContacto.value;
    const numUsuariosValor = numUsuarios.value;
    const emailValor = email.value;
    const rutaSeleccionadaValor = selectRuta.options[selectRuta.selectedIndex].text;
    const precioServicioValor = selectRuta.value;

    // Cuerpo del mensaje
    const cuerpoMensaje = `
        Nombre de la Empresa: ${empresaValor}
        Nombre de Contacto: ${nameContactoValor}
        Número de Contacto: ${numContactoValor}
        Número de Usuarios: ${numUsuariosValor}
        Correo Electrónico: ${emailValor}
        Ruta Seleccionada: ${rutaSeleccionadaValor}
        Precio del Servicio: $${precioServicioValor}
    `;

    const correoDestino = emailValor;

    fetch('https://formspree.io/f/xwkgknzz', {
        method: 'POST',
        body: JSON.stringify({
            to: correoDestino,
            subject: 'Gracias por utilizar APP Servicios, reporte servicio de transporte solicitado',
            body: cuerpoMensaje,
            replyto: correoDestino,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log('Solicitud enviada correctamente:', data);
            Toastify({
                text: "¡Solicitud enviada al correo registrado!",
                duration: 2000,
                newWindow: true,
                close: true,
                gravity: "bottom",
                position: "right",
                stopOnFocus: true,
            }).showToast();
        })
        .catch(error => {
            console.error('Error al enviar la solicitud:', error);
            Toastify({
                text: "¡Error al enviar la solicitud!",
                duration: 2000,
                newWindow: true,
                close: true,
                gravity: "bottom",
                position: "right",
                stopOnFocus: true,
            }).showToast();
        });

}

// Evento para vaciar la tabla
vaciarTabla.addEventListener('click', (eventovaciar) => {
    eventovaciar.preventDefault(); //*Para evitar que la pagina se refresque al presionar el btn

    tableFill.innerHTML = "";
    servicios = [];

})
