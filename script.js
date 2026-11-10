//DATOS BASE

const id = 'silvia-calendario'
const url_guardar = `https://datos.cursoweb.tech/guardar.php?dest=${id}`
const url_leer = `https://datos.cursoweb.tech/leer.php?dest=${id}`
const usuario = "labora"
const password = "Cl4v3$"
const credenciales = btoa(`${usuario}:${password}`)



//variables


let date = new Date();
let day = new Date().getDate();
let month = new Date().getMonth() + 1;

let meses = document.querySelectorAll('tbody');
const DIALOG = document.getElementById('add_event');
const DIALOG2 = document.getElementById('edit_event');


let modal = false;




for (let i = 0; i < meses.length; i++) {
    let num_mes = '';
    if (meses[i].id == 'mes_1') {
        num_mes = '01';
    } else if (meses[i].id == 'mes_2') {
        num_mes = '02';
    } else if (meses[i].id == 'mes_3') {
        num_mes = '03';
    } else if (meses[i].id == 'mes_4') {
        num_mes = '04';
    } else if (meses[i].id == 'mes_5') {
        num_mes = '05';
    } else if (meses[i].id == 'mes_6') {
        num_mes = '06';
    } else if (meses[i].id == 'mes_7') {
        num_mes = '07';
    } else if (meses[i].id == 'mes_8') {
        num_mes = '08';
    } else if (meses[i].id == 'mes_9') {
        num_mes = '09';
    } else if (meses[i].id == 'mes_10') {
        num_mes = '10';
    } else if (meses[i].id == 'mes_11') {
        num_mes = '11';
    } else if (meses[i].id == 'mes_12') {
        num_mes = '12';
    }

    let dias = document.querySelectorAll(`#${meses[i].id} td`)
    for (const dia of dias) {
        if (dia.textContent.length == 1) {
            dia.dataset.fecha = `2026-${num_mes}-0${dia.textContent}`
        } else if (dia.textContent.length == 2) {
            dia.dataset.fecha = `2026-${num_mes}-${dia.textContent}`
        }
        if (dia.dataset.fecha) {
            dia.onclick = () => mostrarAgenda(dia)
        }

        if (parseInt(num_mes) == month && parseInt(dia.textContent) == day) {
            dia.style.backgroundColor = 'darkslategray'
            dia.style.color = 'white'
        }
    }

}



//FUNCIONES


//enviar info

async function enviaDatos(datos) {
    try {
        const res = await fetch(url_guardar, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${credenciales}`
            },
            body: JSON.stringify(datos)
        })
        if (!res.ok) {
            throw new Error('Error en la conexión')
        }
        const data = await res.json()
        console.log(data)
        await leerDatos()
    } catch (error) {
        console.error("Error:", error)
    }
}

//leer datos del servidor
async function leerDatos() {
    //iniciamos la petición de datos dentro de un control de errores
    try {
        const res = await fetch(url_leer)
        if (!res.ok) {
            throw new Error('No se ha podido conectar')
        }
        //accedemos a los datos en el formato que necesitamos
        calendario.length = 0;
        calendario.push(... await res.json())
        console.log(calendario)
    } catch (error) {
        console.error('ojo', error)
    }
}




function crearAgenda(dia) {
    // let pantalla = document.createElement('div')
    // pantalla.style.width = '100vw'
    // pantalla.style.height = '100%'
    // pantalla.style.position = 'absolute'
    // pantalla.style.top = '0'
    // pantalla.style.backgroundColor = 'blue'
    // pantalla.style.left = '0'
    // pantalla.style.backgroundColor = 'blue'
    let div = document.createElement('div');
    div.className = 'agenda';
    div.onclick = (event) => {
        event.stopPropagation();
    }
    div.style.display = 'none';
    let event_list = document.createElement('ul');
    event_list.className = 'lista-eventos';
    let new_event = document.createElement('button')
    new_event.textContent = 'Crea nuevo evento';
    new_event.setAttribute('id', 'btn_new')
    let close = document.createElement('button')
    close.innerHTML = '<span class="fa-solid fa-xmark"></span>'
    close.setAttribute('id', 'btn_cerrar')
    close.setAttribute('title', 'Cerrar agenda')
    div.append(event_list, new_event, close)
    new_event.onclick = () => showDialog(dia);
    close.onclick = closeAgenda;
    dia.append(div);
    // document.querySelector('.contenedor').append(pantalla)
}

function closeAgenda() {
    if (this.parentNode.querySelector('.lista-eventos').innerHTML == '') {
        this.parentNode.remove();
    } else {
        this.parentNode.style.display = 'none'
    }
    modal = false
}

function mostrarAgenda(dia) {
    if (modal) {
        return
    }
    if (dia.querySelector('.agenda')) {
        dia.querySelector('.agenda').style.display = 'flex'
        modal = true
    } else {
        showDialog(dia);
    }
}


//PINTAR AGENDA

const dias = document.querySelectorAll('td')

async function checkCalendar() {
    await leerDatos()

    if (calendario.length != 0) {
        pintaAgenda();
    }
}

function pintaAgenda() {
    for (const dia of dias) {
        const saved_agenda = dia.querySelector('.agenda');
        const eventos = calendario.filter((evento) => evento.fecha === dia.dataset.fecha)
        if (eventos.length == 0) {
            if (saved_agenda) {
                saved_agenda.remove();
            }
            if (dia.querySelector('.notif-evento')) {
                dia.querySelector('.notif-evento').remove()
            }
            modal = false
        }
        if (eventos.length !== 0) {
            if (!dia.querySelector('.agenda')) {
                crearAgenda(dia)
            }
            const agenda = dia.querySelector('.agenda');
            const lista = dia.querySelector('.lista-eventos')

            agenda.dataset.cantidad = eventos.length;
            lista.innerHTML = '';

            if (!dia.querySelector('td>span')) {
                const span = document.createElement('span');
                span.className = 'notif-evento'
                dia.append(span)
            }
            dia.querySelector('.notif-evento').textContent = agenda.dataset.cantidad;

            for (const evento of eventos) {
                let li = document.createElement('li')
                li.className = 'lista-elemento'
                li.textContent = evento.titulo
                let div = document.createElement('div')
                div.className = 'fila'
                let btn_info = document.createElement('span');
                let btn_borrar = document.createElement('span');
                let btn_editar = document.createElement('span');
                btn_borrar.style.cursor = 'pointer'
                btn_editar.style.cursor = 'pointer'
                btn_info.style.cursor = 'pointer'
                btn_info.setAttribute('title', 'Información del evento')
                btn_editar.setAttribute('title', 'Editar evento')
                btn_borrar.setAttribute('title', 'Borrar evento')
                btn_info.className = 'fa-solid fa-info'
                btn_editar.className = 'fa-solid fa-pen-to-square'
                btn_borrar.className = 'fa-solid fa-trash-can'

                btn_info.onclick = () => showInfo(evento)
                btn_editar.onclick = () => showDialogEdit(evento)
                btn_borrar.onclick = () => borraEvento(evento)

                div.append(btn_info, btn_editar, btn_borrar)
                li.append(div)
                dia.querySelector('.lista-eventos').append(li)
            }
        }
    }
}


checkCalendar()

/////  PARTE DE CREACION DE EVENTOS

const TITLE_DATE = document.getElementById('title-date')
const IN_EVENT_NAME = document.getElementById('in_event_name')
const IN_DATE = document.getElementById('in_date')
const IN_DESCRIPCION = document.getElementById('in_descripcion')
const BTN_EVENT = document.getElementById('btn_event')
const BTN_CANCELAR = document.getElementById('btn_cancelar')

const ID_GUARDADO = document.getElementById('id_evento')
const TITLE_DATE2 = document.getElementById('title-date2')
const IN_EVENT_NAME2 = document.getElementById('in_event_name2')
const IN_DATE2 = document.getElementById('in_date2')
const IN_DESCRIPCION2 = document.getElementById('in_descripcion2')
const BTN_CONFIRM = document.getElementById('btn_confirmar')
const BTN_CANCELAR2 = document.getElementById('btn_cancelar2')

const DIALOG_INFO = document.getElementById('show_event')
const TITLE_EVENT = document.getElementById('title-event');
const INFO_FECHA = document.getElementById('info_fecha')
const INFO_DESCRIP = document.getElementById('info_descripcion')
const BTN_EDITAR = document.getElementById('btn_editar')
const BTN_BORRAR = document.getElementById('btn_borrar')
const BTN_CANCELAR3 = document.getElementById('btn_cancelar3')

let calendario = []



function showDialog(dia) {
    TITLE_DATE.textContent = `Añade evento para el día ${dia.dataset.fecha}`;
    IN_DATE.value = dia.dataset.fecha;
    IN_DATE.disabled = true;
    IN_EVENT_NAME.value = '';
    IN_DESCRIPCION.value = ''
    IN_EVENT_NAME.style.borderColor = '';
    DIALOG.showModal()
}

async function createEvent() {
    let id = Math.random().toString(36).substring(2, 10);
    if (IN_EVENT_NAME.value == '') {
        IN_EVENT_NAME.style.borderColor = 'crimson';
        IN_EVENT_NAME.style.borderRadius = 'crimson';
        return
    }
    let cita = {
        id: id,
        fecha: IN_DATE.value,
        titulo: IN_EVENT_NAME.value,
        nota: IN_DESCRIPCION.value
    };

    // calendario.push(cita)

    DIALOG.close()

    await enviaDatos(cita);

    pintaAgenda()
}

async function editEvento() {
    const index = calendario.findIndex((objeto) => ID_GUARDADO.value === objeto.id);
    const obj = {
        actualizar: index,
        id: ID_GUARDADO.value,
        fecha: IN_DATE2.value,
        titulo: IN_EVENT_NAME2.value,
        nota: IN_DESCRIPCION2.value
    }
    DIALOG2.close()
    await enviaDatos(obj)

    pintaAgenda()
}


function showDialogEdit(evento) {
    TITLE_DATE2.textContent = `Modifica el evento`;
    ID_GUARDADO.value = evento.id
    IN_DATE2.value = evento.fecha;
    IN_EVENT_NAME2.value = evento.titulo;
    IN_DESCRIPCION2.value = evento.nota;
    DIALOG2.showModal()
}


function showInfo(evento) {
    DIALOG_INFO.showModal();

    TITLE_EVENT.textContent = evento.titulo;
    INFO_FECHA.textContent = evento.fecha;
    INFO_DESCRIP.textContent = evento.nota


    BTN_EDITAR.onclick = () => {
        showDialogEdit(evento)
        DIALOG_INFO.close()
    }
    BTN_BORRAR.onclick = () => {
        borraEvento(evento)
        DIALOG_INFO.close()
    }
    BTN_CANCELAR3.onclick = () => DIALOG_INFO.close()
}



async function borraEvento(evento) {
    const index = calendario.findIndex((objeto) => evento.id === objeto.id)
    const obj = {
        eliminar: index
    }
    await enviaDatos(obj);
    pintaAgenda();
}



BTN_EVENT.onclick = createEvent;
BTN_CANCELAR.onclick = () => DIALOG.close();
BTN_CONFIRM.onclick = editEvento;
BTN_CANCELAR2.onclick = () => DIALOG2.close();