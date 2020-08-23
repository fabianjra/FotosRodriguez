$(document).ready(function () {
    //Se carga la configuración de google Analytics, de manera global para cada pagina
    CargarGoolgeAnalytics();
});

//Funcion que consulta la pagina para enviarla a google Analytics.
function CargarGoolgeAnalytics() {
    try {
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());

        gtag('config', 'UA-153083935-1');
    } catch (ex) {
        uEscribirError(arguments, ex);
    }
};

//Constantes para los nombres de las paginas
const PAG_INDEX = 'index';
const PAG_CONTACTO = 'contacto';
const PAG_PRECIOS_ARTICULOS = 'preciosarticulos';
const PAG_CATALOGO_GRADUACION = 'catalogograduacion';

//Mantenimiento
const PAG_MANTENIMIENTO = 'mantenimiento';
const PAG_INICIAR_SESION = 'iniciarsesion';

//FIN: Constantes

//Carga el Navbar y al momento despues de cargarla, ejecuta la funcion para marcar el Active correcto del Navbar
$('#agregarMasterNavbar').load('MasterNavbar.html', ObtenerPaginaActual);
$('#agregarMasterFooter').load('MasterFooter.html');

//Al realizar cualquier carga de pagina, se consulta el URL de la direccion actual
//y se obtiene solamente el nombre de la pagina, en base a este nombre, se asigna como
// actual, a la pagina correcta en el Navbar, como seleccion.
function ObtenerPaginaActual() {
    try {
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
        var nombreCorto = nombreConHTML.split('.')[0];

        AsignarNavbarPaginaActual(nombreCorto);

    } catch (ex) {
        uEscribirError(arguments, ex);
    }
};

//Asinga el active en el navbar, al enlace de la pagina actual.
function AsignarNavbarPaginaActual(pNombrePagina) {

    //Recibe el nombre de la pagina actual, sin separadores, ni puntos ni .hmtl
    switch (pNombrePagina) {

        case PAG_INDEX:
            var elemento = document.getElementById("navbarItemInicio");
            elemento.classList.add("active");
            break;

        case PAG_CONTACTO:
            var elemento = document.getElementById("navbarItemContacto");
            elemento.classList.add("active");
            break;

        case PAG_PRECIOS_ARTICULOS:
            var elemento = document.getElementById("navbarItemPrecios");
            elemento.classList.add("active");
            break;

        case PAG_CATALOGO_GRADUACION:
            var elemento = document.getElementById("navbarItemCatalogoGraduacion");
            elemento.classList.add("active");
            break;

        //Para ambas paginas iniciar sesion y Mantenimiento, se deja activo el mismo item del NavBar.
        case PAG_MANTENIMIENTO:
        case PAG_INICIAR_SESION:
            var elemento = document.getElementById("navbarItemIniciarSesion");
            elemento.classList.add("active");
            break;

        //Si no se encuentra la pagina, asigna el active al inicio (esto en caso de ser solamente el URL del sitio. ejem: www.fotosrodriguez.com)
        default:
            var elemento = document.getElementById("navbarItemInicio");
            elemento.classList.add("active");
            break;
    }
};

// ********************** FUNCIONES DEL NAVBAR Y FOOTER ********************* //

//ToggleClass agrega la clase si no la tiene, y si ya la tiene la remueve (como un tipo interruptor)
function clickBotonNavbar() {
    $(".navbar").toggleClass("colorNegro");
};

// ************************ REDIRECCION A ENLACES EXTERNOS *********************** //

function ClickFacebook(pUbicacion) {
    try {
        let url = "https://www.facebook.com/fotosguapiles/";
        window.open(url, '_blank');

        let mensaje = "Click ver pagina Facebook en: " + pUbicacion;
        uEscribirEventoAccion(mensaje)
    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}

function ClickWhatsappGeneral() {
    try {
        let numTelefono = "50689788992";
        let mensaje = "Hola, estoy interesado en información sobre fotos y productos";

        /*The \s meta character in JavaScript regular expressions matches any whitespace character: spaces, tabs, newlines and Unicode spaces.
        And the g flag tells JavaScript to replace it multiple times. If you miss it, it will only replace the first occurrence of the white space*/
        let mensajeFormato = mensaje.replace(/\s/g, '%20');

        let url = "https://wa.me/" + numTelefono + "?text=" + mensajeFormato;
        window.open(url, '_blank');

        uEscribirEventoAccion( "Click enviar mensaje Whastsapp general")
    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}

function ClickEmailGeneral() {
    try {
        let mensaje = "Hola, quisiera obtener información sobre fotos";
        let asunto = "Información sobre fotos";
        let url = "mailto:fotos-rodriguez@hotmail.com?subject=" + asunto + "&body=" + mensaje;
        window.location.href = url;

        uEscribirEventoAccion("Click enviar mensaje por Email general")
    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}

function ClickUbicacionGeneral() {
    try {
        let url = "https://goo.gl/maps/gzoDQn9V5NYZFXKy6";
        window.open(url, '_blank');

        uEscribirEventoAccion("Click ver ubicacion general")
    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}


// ************************ SIN USO *********************** //

//Lee las variables contenidas en el "GET URL" (QueryString), y las retorna en un arreglo
function GetQueryString() {

    var variables = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        variables.push(hash[0]);
        variables[hash[0]] = hash[1];
    }
    return variables;
};