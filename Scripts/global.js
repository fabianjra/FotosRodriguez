$(document).ready(function () {

    // $('#agregarMasterNavbar').load('MasterNavbar.html', AsignarPaginaActual);

    $('#agregarMasterNavbar').load('MasterNavbar.html');
    $('#agregarMasterFooter').load('MasterFooter.html');
});

//ToggleClass agrega la clase si no la tiene, y si ya la tiene la remueve (como un tipo interruptor)
function clickBotonNavbar() {
    $(".navbar").toggleClass("colorNegro");
};














//Lee las variables contenidas en el "GET URL", y las retorna en un arreglo
// function GetQueryString() {
//     var vars = [], hash;
//     var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

//     for (var i = 0; i < hashes.length; i++) {
//         hash = hashes[i].split('=');
//         vars.push(hash[0]);
//         vars[hash[0]] = hash[1];
//     }
//     return vars;
// };

// function AsignarPaginaActual() {

//     var ActualID = GetQueryString()["p"];

//     switch (ActualID) {
//         case '0':
//             var elemento = document.getElementById("navbarItemInicio");
//             elemento.classList.add("active");
//             break;

//         case '1':
//             var elemento = document.getElementById("navbarItemContacto");
//             elemento.classList.add("active");
//             break;

//         default:
//             var elemento = document.getElementById("navbarItemInicio");
//             elemento.classList.add("active");
//             break;
//     }
// };