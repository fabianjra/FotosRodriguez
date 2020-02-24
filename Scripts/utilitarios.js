// $(document).ready(function () {

// });

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

    let funcName = pArgumento.callee.toString();
    funcName = funcName.substr('function '.length);
    funcName = funcName.substr(0, funcName.indexOf('('));

    let mensajeConsola = "ERROR CATCH; " +"NAVEGADOR: " + uObtenerNavegador() + "; METODO: " + funcName + "; MENSAJE: " + pEx.message;

    console.error(mensajeConsola);

    //Envia el error a Goolge Analytics
    let mensajeAnalytics = uObtenerNavegador() + "; " + pEx.message;

    ga('send', {
        hitType: 'event',
        eventCategory: 'EXCEPTION',
        eventAction: funcName,
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