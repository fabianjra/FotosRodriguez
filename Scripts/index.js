$(document).ready(function () {
    try {
        window.onload = $('body').addClass('loadingPage').removeClass('opactidadCero');
    } catch (ex) {
        uEscribirError(arguments, ex);
    }
});