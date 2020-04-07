// $(document).ready(function () {

// });

//Global site tag (gtag.js) - Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'UA-153083935-1');


//Carga de Goolge Analytics para el envio de errores, mediante eventos.
(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date(); a = s.createElement(o),
        m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-153083935-1', 'auto');
ga('send', 'pageview');

//PARAMS:
//pValor: un numero entero sin formato, para devolverlo con formato en colon.
//FUNCION: Obtiene el formato de CR y convierte el valor a formato con comas entre decimales y espacio entre miles.
//RETURN: Valor con formato en string
function uFormatoColon(pValor) {

    try {
        const formatoColon = new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currencyDisplay: 'symbol',
            currency: 'CRC'
        });

        let valorFormato = formatoColon.format(pValor);

        return valorFormato;

    } catch (ex) {
        uEscribirError(arguments, ex);
        return '0';
    }
}

//FUNCION: Quita los espacion extremos a un strimg que se reciba como parametro.
//RETURN: String recibido sin espacios a los extremos.
function uTrim(texto) {
    return texto.replace(/^\s+|\s+$/gm, '');
}

//PARAMS:
//pArgumento: para sacar el nombre de la funcion donde se esté utilizando el try (script de las funciones utilizadas).
//pEX: Mensaje de error.
//FUNCION: Escribe el mensaje de error en el log.
function uEscribirError(pArgumento, pEx) {

    let dispositivo = uObtenerDispositivo();
    let navegador = uObtenerNavegador();
    let nombrePagina = uRetornarPaginaActual();

    let funcName = pArgumento.callee.toString();
    funcName = funcName.substr('function '.length);
    funcName = funcName.substr(0, funcName.indexOf('('));

    //Only console log
    let mensajeConsola = "ERROR CATCH| DISPOSITIVO: " + dispositivo + "| NAVEGADOR: " + navegador + "| PAGINA: " + nombrePagina + "| METODO: " + funcName + "| MENSAJE: " + pEx;
    console.error(mensajeConsola);

    //Envia el error a Goolge Analytics
    let mensajeAnalytics = dispositivo + "| " + navegador + "| " + funcName + "| " + pEx.message;
    ga('send', {
        hitType: 'event',
        eventCategory: 'EXCEPTION',
        eventAction: nombrePagina,
        eventLabel: mensajeAnalytics
    });
}

//FUNCION: Consulta el navegador basandose en una lista ya preestablecida
//RETURN: Nombre del navegador en formato string
function uObtenerNavegador() {

    let browserName = '';

    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
        browserName = 'Opera';
    }
    else if (navigator.userAgent.indexOf("Chrome") != -1) {
        browserName = 'Chrome';
    }
    else if (navigator.userAgent.indexOf("Safari") != -1) {
        browserName = 'Safari';
    }
    else if (navigator.userAgent.indexOf("Firefox") != -1) {
        browserName = 'Firefox';
    }
    else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) { //IF IE > 10
        browserName = 'IE';
    }
    else {
        browserName = 'Desconocido';
    }

    return browserName;
}

//FUNCION: Carga las credenciales para la cuenta "fabianjradev@gmail.com".
//RETURN: Objeto con los datos de las credenciales cargadas manualmente en esta funcion.
function uCargarCredencialesFirebase() {
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyBC8DV_tZW6w6ZfhSu_7pl8ak0ANYE73II",
        authDomain: "fotosrodriguez-c0702.firebaseapp.com",
        databaseURL: "https://fotosrodriguez-c0702.firebaseio.com",
        projectId: "fotosrodriguez-c0702",
        storageBucket: "fotosrodriguez-c0702.appspot.com",
        messagingSenderId: "400822982170",
        appId: "1:400822982170:web:cba598a454f9947c4263a3",
        measurementId: "G-EYJBXJ68QN"
    };
    return firebaseConfig;
}

//Al realizar cualquier carga de pagina, se consulta el URL de la direccion actual
//y se obtiene solamente el nombre de la pagina, en base a este nombre, se asigna como
// actual, a la pagina correcta en el Navbar, como seleccion.
function uRetornarPaginaActual() {
    try {
        var nombrePagina = "InicializadaNull";

        var segmento = window.location.pathname.split('/');
        var borrar = [];

        for (let i = 0; i < borrar.length; i++) {
            if (segmento[i].length < 1) {
                borrar.push(i);
            }
        }

        for (let i = 0; i < borrar.length; i++) {
            segmento.splice(i, 1);
        }

        //Obtiene el nombre de la pagina, junto con el .html y todo lo que contenga despues del ultimo slash "/" (ejem: index.html, o: index.html?p=0)
        var nombreConHTML = segmento[segmento.length - 1];

        //Obtiene el nombre de la pagina, antes del .html (ejem: "index")
        nombrePagina = nombreConHTML.split('.')[0];

        if (nombrePagina == "" || nombrePagina == null) {
            nombrePagina = "index";
        }

        return nombrePagina;

    } catch (ex) {
        uEscribirError(arguments, ex);
    }
};

//FUNCION: Llamando a esta funcion, se escribe un evento en Analytics.
function uEscribirEventoAccion(pMensaje) {
    let dispositivo = uObtenerDispositivo();
    let navegador = uObtenerNavegador();
    let nombrePagina = uRetornarPaginaActual();

    let mensajeAnalytics = dispositivo + "| " + navegador + "| " + pMensaje;

    ga('send', {
        hitType: 'event',
        eventCategory: 'ACCION',
        eventAction: nombrePagina,
        eventLabel: mensajeAnalytics,
        hitCallback: function () {
            //Only console log
            let mensajeConsola = "ACCION| DISPOSITIVO: " + dispositivo + "| NAVEGADOR: " + navegador + "| PAGINA: " + nombrePagina + "| MENSAJE: " + pMensaje;
            console.log("%c" + mensajeConsola, "color:green");
        }
    });
}

//FUNCION: Consulta el dispositivo basandose en una lista ya preestablecida
//RETURN: Nombre del dispositivo en formato string
function uObtenerDispositivo() {

    let device = "dispositivo desconocido";

    const ua = {
        "Generic Linux": /Linux/i,
        "Android": /Android/i,
        "BlackBerry": /BlackBerry/i,
        "Bluebird": /EF500/i,
        "Chrome OS": /CrOS/i,
        "Datalogic": /DL-AXIS/i,
        "Honeywell": /CT50/i,
        "iPad": /iPad/i,
        "iPhone": /iPhone/i,
        "iPod": /iPod/i,
        "macOS": /Macintosh/i,
        "Windows": /IEMobile|Windows/i,
        "Zebra": /TC70|TC55/i,
    }

    Object.keys(ua).map(v => navigator.userAgent.match(ua[v]) && (device = v));

    return device;
}

//PARAMS:
//pContenido: Contenido que va a tener el archivo.
//pNombreArchivo: Nombre que va a llevar el archivo (no incluir extension aqui).
//pExtension: Nombre de la extension (sin el punto al inicio de la extension).
//FUNCION: Descarga un archivo a la computadora, de texto plano, con codificacion UTF-8 (acualmente funciona de esta manera en chrome).
function uDescargarArchivo(pContenido, pNombreArchivo, pExtension) {
    try {
        var a = document.createElement("a");
        var file = new Blob([pContenido], { encoding: "UTF-8", type: "text/plain;charset=UTF-8" });

        a.href = URL.createObjectURL(file);
        a.download = pNombreArchivo + '.' + pExtension;

        a.click();
    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}


//PARAMS:
//pSeparadorFecha: Signo para separar el dia, mes y año.
//pSeparadorHora: Signo para separar la hora, minutos y segundos.
//FUNCION: Arma la fecha actual, para convertirla en una sola cadena string.
//         Por defecto, separa la fecha y la hora con un guion abajo.
//RETURN: Fecha y hora armada en formato de Costa Rica "dd-MM-YY || HH.mm.ss" (la hora es 24 horas).
function uObtenerFechaHoraActual(pSeparadorFecha, pSeparadorHora) {
    try {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        var hour = today.getHours();
        var minutes = today.getMinutes();
        var seconds = today.getSeconds();

        today = dd + pSeparadorFecha + mm + pSeparadorFecha + yyyy + '_' + hour + pSeparadorHora + minutes + pSeparadorHora + seconds;

        return today
    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}