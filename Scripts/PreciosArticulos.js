//Nombre de constantes = nombre de colecciones (tabla)
const COLECCION_PRECIOS = 'precios';
const TABLA_FOTO = 'foto';
const TABLA_RETABLO = 'retablo';
const TABLA_OTROS = 'otros';
const TABLA_EVENTOS = 'eventos';
const TABLA_IMAGENES_ARTICULOS = 'imagenes_articulos';

//ID de las tablas.
const ID_TABLA_FOTO = '#resPreciosFotos';
const ID_TABLA_RETABLO = '#resPreciosRetablos';
const ID_TABLA_OTROS = '#resPreciosOtros';
const ID_TABLA_EVENTOS = '#resPreciosEventos';
const ID_TABLA_IMAGENES_ARTICULOS = '#resImagenesArticulos';

//Este archivo se carga solamente en la pagina de precios articulos, para cargar mediante un archivo JSON los precios
//de los articulos que se tienen ahi, y se cargan en una tabla HTML de la pagina de precios articulos.
$(document).ready(function () {
    IniciarFirebase();

    //Cargar la pagina cuando es via TAB (algun item del combo de articulos del NavBar)
    CargarTab();
});

//FUNCION: Accion a realizar cuando ya se hayan cargado todos los elementos de la pagina.
$(window).on('load', function () {
    //Envia la pagina al TOP.
    window.scrollTo(0, 0); // values are x,y-offset
});

//Consulta la base de datos de Firebase, donde estan
//almacenados los precios de los articulos
function IniciarFirebase() {
    try {
        var firebaseConfig = uCargarCredencialesFirebase();

        // Initialize Firebase, en caso de que no este ya actualmente inicializado.
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        //Instancia de la conexion a la base de datos
        //Se consulta la coleccion "precios", para obtener ambos arreglos (foto[], ratablo[])
        var firebaseDB = firebase.database().ref(COLECCION_PRECIOS);

        CargarPrecios(firebaseDB);

    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}//FIN: CredencialesFirebase

function CargarPrecios(pFirebaseDB) {
    try {
        /*
        Se llena la lista con los nombres de las tablas y sus correspondientes ID en el HTML.
        NOTA: Esta lista debe coincidir con las constantes declaradas al inicio de este .JS, ya que corresponde
        a la cantidad total de filas en la BD de Firebase y a la cantidad de tablas en el HTML.
        */
        var listaTablas = [
            { nombre: TABLA_FOTO, id: ID_TABLA_FOTO },
            { nombre: TABLA_RETABLO, id: ID_TABLA_RETABLO },
            { nombre: TABLA_OTROS, id: ID_TABLA_OTROS },
            { nombre: TABLA_EVENTOS, id: ID_TABLA_EVENTOS },
            { nombre: TABLA_IMAGENES_ARTICULOS, id: ID_TABLA_IMAGENES_ARTICULOS }
        ];

        //Lectura de datos de la tabla Precios (padre).
        pFirebaseDB.on('value', function (tablaPrecios) {

            //Recorrer la lista para asignar a cada tabla de HTML su correspondiente dato de cada fila de la DB.
            for (let i = 0; i < listaTablas.length; i++) {

                //Item que se recorre en el indice actual.
                let itemListaTabla = listaTablas[i];

                //Instancia la tabla con "child", para solo acceder a las filas de la tabla.
                let tabla = tablaPrecios.child(itemListaTabla.nombre);

                //Validar que la tabla tenga datos
                if (tabla != null && tabla != undefined) {
                    if (tabla.val() != null && tabla.val().length > 0) {

                        //recorrer la tabla.
                        tabla.forEach(function (fila) {

                            //Obtiene el nombre de la tabla, para cargarla en dependencia a cuantos items contenga.
                            let nombreTabla = itemListaTabla.nombre;

                            //Obtiene la fila, como un arreglo de JSON con los valores.
                            //EJEM: item = {precio: "1500", descripcion: "4x6"}
                            let item = fila.val();

                            //Validar la tabla que debe cargar. (la generica "else", es la carga generica, solo descripcion y precio).
                            if (nombreTabla == TABLA_EVENTOS) {
                                //Si es un item de eventos, lo carga en una tabla con 3 columnas
                                let resTag = document.querySelector(itemListaTabla.id);

                                resTag.innerHTML += `
                                <tr>
                                    <td class="text-center align-middle pt-3 pb-3">${item.nombre}</td>
                                    <td class="text-center align-middle pt-3 pb-3">${uFormatoColonNoDecimales(item.precio)}</td>
                                    <td class="text-left pt-3 pb-3">${item.descripcion}</td>
                                </tr>`

                            } else if (nombreTabla == TABLA_IMAGENES_ARTICULOS) {

                                let resTag = document.querySelector(itemListaTabla.id);

                                //Con comillas especiales, para mesclar con codigo HTML
                                resTag.innerHTML += `
                                <tr>
                                    <td class="text-center align-middle">${item.nombre}</td>
                                    <td class="text-center w-50">
                                    <a>
                                        <img src="${item.url_imagen}" class="img-fluid img-thumbnail" alt="${item.url_imagen}">
                                    </a>
                                </td>
                                </tr>`

                            } else {
                                //Instancia del tag al que se le van a cargar los datos del Json
                                //Por parametro, el nombre del ID del tag, en la pagina de precios
                                let resTag = document.querySelector(itemListaTabla.id);

                                //Con comillas especiales, para mesclar con codigo HTML
                                resTag.innerHTML += `
                                <tr>
                                    <td class="text-center">${item.descripcion}</td>
                                    <td class="text-center">${uFormatoColonNoDecimales(item.precio)}</td>
                                </tr>`
                            }

                        });//FIN: FOREACH = recorrido de la tabla.
                    } else {
                        let resTag = document.querySelector(itemListaTabla.id);
                        resTag.innerHTML += '<tr><td class="text-center" colspan="2">No hay datos disponibles</td></tr>';
                    }//FIN: IF > 0.
                } else {
                    let resTag = document.querySelector(itemListaTabla.id);
                    resTag.innerHTML += '<tr><td class="text-center" colspan="2">No hay datos disponibles</td></tr>';
                }//FIN: IF != null.

            }//FIN: FOR listaTablas.

        });//FIN: pFirebaseDB.on (lectura de tabla de precios).

    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}//FIN: METODO = CargarPrecios

function CargarTab() {
    // Javascript to enable link to tab
    var hash = document.location.hash;
    var prefix = "tab_";
    if (hash) {
        $('.nav-tabs a[href="' + hash.replace(prefix, "") + '"]').tab('show');
    }

    // Change hash for page-reload
    $('.nav-tabs a').on('shown', function (e) {
        window.location.hash = e.target.hash.replace("#", "#" + prefix);
    });
}//FIN: CargarTab()