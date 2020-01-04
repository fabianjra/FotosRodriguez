// $(document).ready(function () {

// });

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

//PARAMS:
//pArgumento: para sacar el nombre de la funcion donde se esté utilizando el try (script de las funciones utilizadas).
//pEX: Mensaje de error.
//FUNCION: Escribe el mensaje de error en el log.
function uEscribirError(pArgumento, pEx) {

    let funcName = pArgumento.callee.toString();
    funcName = funcName.substr('function '.length);
    funcName = funcName.substr(0, funcName.indexOf('('));

    console.error("ERROR CATCH; NAVEGADOR: " + uObtenerNavegador() + "; METODO: " + funcName + "; MENSAJE: " + pEx.message);
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