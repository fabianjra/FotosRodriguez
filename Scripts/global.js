// $(document).ready(function () {

// });

//Constantes para los nombres de las paginas
const _index = 'index';
const _contacto = 'contacto';
const _preciosArticulos = 'preciosArticulos';

//Carga el Navbar y al momento despues de cargarla, ejecuta la funcion para marcar el Active correcto del Navbar
$('#agregarMasterNavbar').load('MasterNavbar.html', ObtenerPaginaActual);
$('#agregarMasterFooter').load('MasterFooter.html');

//ToggleClass agrega la clase si no la tiene, y si ya la tiene la remueve (como un tipo interruptor)
function clickBotonNavbar() {
    $(".navbar").toggleClass("colorNegro");
};

//Al realizar cualquier carga de pagina, se consulta el URL de la direccion actual
//y se obtiene solamente el nombre de la pagina, en base a este nombre, se asigna como
// actual, a la pagina correcta en el Navbar, como seleccion.
function ObtenerPaginaActual() {

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

    //Obtiene el nombre de la pagina, antes del .html (ejem: index)
    var nombreCorto = nombreConHTML.split('.')[0];

    AsignarNavbarPaginaActual(nombreCorto);
}


function AsignarNavbarPaginaActual(pNombrePagina) {

    //Recibe el nombre de la pagina actual, sin separadores, ni puntos ni .hmtl
    switch (pNombrePagina) {

        case _index:
            var elemento = document.getElementById("navbarItemInicio");
            elemento.classList.add("active");
            break;

        case _contacto:
            var elemento = document.getElementById("navbarItemContacto");
            elemento.classList.add("active");
            break;

        case _preciosArticulos:
            var elemento = document.getElementById("navbarItemPrecios");
            elemento.classList.add("active");
            break;

        //Si no se encuentra la pagina, asigna el active al inicio (esto en caso de ser solamente el URL del sitio. ejem: www.fotosrodriguez.com)
        default:
            var elemento = document.getElementById("navbarItemInicio");
            elemento.classList.add("active");
            break;
    }
};




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