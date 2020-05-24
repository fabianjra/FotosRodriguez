//Nombre de constantes = nombre de colecciones (tablas).
const COLECCION_CATALOGO = 'catalogo';
const TABLA_PORTATITULO_MAYORES = 'portatituloMayores';
const TABLA_PORTATITULO_MENORES = 'portatituloMenores';
const TABLA_CINTA_MAYORES = 'cintaMayores';
const TABLA_CINTA_MENORES = 'cintaMenores';
const TABLA_CINTA_ESTOLA = 'cintaEstola';
const TABLA_DIARIO = 'diario';
const TABLA_BANDERIN = 'banderin';
const TABLA_INVITACION = 'invitacion';

//ID de las tablas.
const ID_TABLA_PORTATITULO_MAYORES = '#resPortatitulosMayores';
const ID_TABLA_PORTATITULO_MENORES = '#resPortatitulosMenores';
const ID_TABLA_CINTA_MAYORES = '#resCintasMayores';
const ID_TABLA_CINTA_MENORES = '#resCintasMenores';
const ID_TABLA_CINTA_ESTOLA = '#resCintasEstola';
const ID_TABLA_DIARIO = '#resDiarios';
const ID_TABLA_BANDERIN = '#resBanderines';
const ID_TABLA_INVITACION = '#resInvitaciones';

//Carga los codigos y los URLs de las imagenes, mediante JSON en firebase
$(document).ready(function () {
    IniciarFirebase();
});

function IniciarFirebase() {
    try {
        var firebaseConfig = uCargarCredencialesFirebase();

        // Initialize Firebase, en caso de que no este ya actualmente inicializado.
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        //Instancia de la conexion a la base de datos
        var firebaseDB = firebase.database().ref(COLECCION_CATALOGO);

        firebaseDB.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");

        CargarCatalogo(firebaseDB);

        //(antiguo) Para los ID (keys) del arreglo, se hace de la siguiente manera:
        // for (let item of arregloJson) {
        //     var keys = Object.keys(item.portatituloMayores);
        //     console.log(keys);
        // }

    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}//FIN: IniciarFirebase

//Se llanan las tablas
function CargarCatalogo(pFirebaseDB) {
    try {
        /*
        Se llena la lista con los nombres de las tablas y sus correspondientes ID en el HTML.
        NOTA: Esta lista debe coincidir con las constantes declaradas al inicio de este .JS, ya que corresponde
        a la cantidad total de filas en la BD de Firebase y a la cantidad de tablas en el HTML.
        */
        var listaTablas = [
            { nombre: TABLA_PORTATITULO_MAYORES, id: ID_TABLA_PORTATITULO_MAYORES },
            { nombre: TABLA_PORTATITULO_MENORES, id: ID_TABLA_PORTATITULO_MENORES },
            { nombre: TABLA_CINTA_MAYORES, id: ID_TABLA_CINTA_MAYORES },
            { nombre: TABLA_CINTA_MENORES, id: ID_TABLA_CINTA_MENORES },
            { nombre: TABLA_CINTA_ESTOLA, id: ID_TABLA_CINTA_ESTOLA },
            { nombre: TABLA_DIARIO, id: ID_TABLA_DIARIO },
            { nombre: TABLA_BANDERIN, id: ID_TABLA_BANDERIN },
            { nombre: TABLA_INVITACION, id: ID_TABLA_INVITACION }
        ];

        //Lectura de datos de la tabla padre (catalogo).
        pFirebaseDB.on('value', function (tablaCatalogo) {

            //Recorrer la lista para asignar a cada tabla de HTML su correspondiente dato de cada fila de la DB.
            for (let i = 0; i < listaTablas.length; i++) {

                //Item que se recorre en el indice actual.
                let itemListaTabla = listaTablas[i];

                //Instancia la tabla con "child", para solo accedeer a las filas de la tabla.
                let tabla = tablaCatalogo.child(itemListaTabla.nombre);

                //Validar que la tabla tenga datos
                if (tabla != null && tabla != undefined) {
                    if (tabla.val() != null && tabla.val().length > 0) {

                        //recorrer la tabla por cada fila.
                        tabla.forEach(function (fila) {

                            //Obtiene la fila, como un arreglo de JSON con los valores.
                            let item = fila.val();

                            //Instancia del tag al que se le van a cargar los datos del Json
                            //Por parametro, el nombre del ID del tag, en la pagina de precios
                            let resTag = document.querySelector(itemListaTabla.id);

                            //Con comillas especiales, para mesclar con codigo HTML
                            resTag.innerHTML += `
                                <tr>
                                    <td class="text-center align-middle">${item.codigo}</td>
                                    <td class="text-center w-50">
                                        <a href="#" onclick="MostrarPopUp(this)">
                                            <img src="${item.imagen}" class="img-fluid img-thumbnail" alt="${item.codigo}">
                                        </a>
                                    </td>
                                </tr>`
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

            //Agrega la función de datatable a la tabla.
            $('.tablaCatalogoDB').DataTable({
                language: {
                    processing: "procesando...",
                    search: "Buscar&nbsp;:",
                    lengthMenu: "Mostrar: _MENU_",
                    info: "Item _START_ al _END_ de _TOTAL_",
                    infoEmpty: "No existen datos",
                    infoFiltered: "(_MAX_ encontrados)",
                    infoPostFix: "",
                    loadingRecords: "Cargando...",
                    zeroRecords: "No se encontraron datos",
                    emptyTable: "No hay datos disponibles.",
                    paginate: {
                        first: "Primero",
                        previous: "Anterior",
                        next: "Siguiente",
                        last: "Ultimo"
                    },
                    aria: {
                        sortAscending: ": active para ordenar la columna en orden ascendente",
                        sortDescending: ": active para ordenar la columna en orden descendente"
                    }
                },
                lengthMenu: [[5, 10, 20, -1], [5, 10, 20, "Todos"]]
            });

            //Centra el NAV de paginacion (quita la clase de columna para los md)
            //Recorre la cantidad de tablas que hay, para removerle a cada una el elemento de info (cantidad de elementos en la tabla).
            let cantidadTablas = document.getElementsByClassName('dataTables_wrapper').length;
            for (let i = 0; i < cantidadTablas; i++) {
                $('#DataTables_Table_' + i + '_wrapper').children().eq(2).children().eq(0).remove();
                $('#DataTables_Table_' + i + '_wrapper').children().eq(2).children().eq(0).removeClass('col-md-7');
            }

            //*********** SIN USO, SE DEBE HACER CON BOTON ***********//
            //Sube el scroll en caso de cambiar de pagina
            // $('.tablaScrollUp').on('page.dt', function () {
            //     $('html, body').animate({
            //         scrollTop: $(".dataTables_wrapper").offset().top
            //     }, 'slow');
            // });

        });//FIN: pFirebaseDB.on (lectura de tabla padre, Catalogo).

    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}//FIN: METODO = CargarCatalogo

/*
Esta funcion toma la imagen a la que se le hace un click,
luego toma la etiqueta de imagen y le agrega al source, la imagen que se seleccionó.
Finalmente muestra el modal.
El modal tiene un boton para cerrar el modal.
*/
function MostrarPopUp(e) {
    try {
        //Esta funcion evita que la pantalla se mueva hacia el TOP, cuando se hacer click en una
        //imagen y se muestra el Modal (evento ajax).
        event.preventDefault();

        //Toma el valor del tag "alt" y lo coloca en el texto del POPUP. (el texto del alt tag, es igual al codigo, valor obtenido de firebase).
        $('.tituloIncrustado').text("Código: " + $(e).find('img').attr('alt'));
        $('.imagenIncrustada').attr('src', $(e).find('img').attr('src'));
        $('#modalImagen').modal('show');

    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}//FIN: MostrarPopUp