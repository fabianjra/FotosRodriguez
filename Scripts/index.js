$(document).ready(function () {
    try {
        window.onload = $('body').addClass('loadingPage').removeClass('opactidadCero');
    } catch (ex) {
        uEscribirError(arguments, ex);
    }
});

//Escribe un mensaje en Analytics, cuando se haga un click en la zona de enviar mensaje por whatsapp.
function ClickWhatsApp() {
    try {
        let mensaje = "Click enviar mensaje Whastsapp";
        uEscribirEventoAccion(mensaje)
    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}

//Escribe un mensaje en Analytics, cuando se haga un click en la zona de enviar mensaje por Email.
function ClickEmail() {
    try {
        let mensaje = "Click enviar mensaje correo electronico";
        uEscribirEventoAccion(mensaje)
    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}

//Escribe un mensaje en Analytics, cuando se haga un click en la zona de ver ubicacion.
function ClickUbicacion() {
    try {
        let mensaje = "Click ver zona de ubicacion";
        uEscribirEventoAccion(mensaje)
    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}