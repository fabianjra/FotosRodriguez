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

        //Se comenta, porque esta provocando error.
        /// firebaseDB.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");

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
                                    <td id="${item.codigo}" class="text-center w-50">
                                        <a title="click para ver en grande" onclick="MostrarPopUp(this)">
                                            <img src="${item.imagen}" class="img-fluid img-thumbnail cursorPointer" alt="${item.codigo}">
                                        </a>
                                    </td>
                                </tr>`

                            //Obtener el nodo sobre el cual esta actualmente en el recorrdido.
                            let codigoArticulo = `${item.codigo}`;
                            let codigoArticuloFormato = codigoArticulo.replace(/\s/g, '\\ '); // QuerySelector no funciona si el "#ID" contiene espacios. se reemplazan por su equivalente.
                            let tdNodo = document.querySelector("#" + codigoArticuloFormato);
                            //let tdNodo = document.getElementById(codigoArticulo); -> geyElementById funciona solo para lo que ya esta creado. (no sirve en caliente)

                            //Busca el nodo DIV que contiene el encabezado de la tabla.
                            if (tdNodo != null && tdNodo != undefined) {

                                //Agregar al nodo de la imagen, el data-encabezado, para guardar el encabezado al que pertenece
                                let aNodo = tdNodo.firstElementChild;
                                if (aNodo != null && aNodo != undefined) {
                                    var imgNodo = aNodo.firstElementChild; //Se crea "var" para ser utilizada abajo.
                                }

                                let trNodo = tdNodo.parentElement; //Variable para seguir subiendo de nivel en los nodos

                                if (trNodo != null && trNodo != undefined) {
                                    let tBodyNodo = trNodo.parentElement;

                                    if (tBodyNodo != null && tBodyNodo != undefined) {
                                        let tableNodo = tBodyNodo.parentElement;

                                        if (tableNodo != null && tableNodo != undefined) {

                                            let divNodo = tableNodo.parentElement;

                                            if (divNodo != null && divNodo != undefined) {
                                                let nodoEncabezado = divNodo.firstElementChild;
                                                let encabezado = nodoEncabezado.innerHTML;

                                                //Set el atributo a la imagen, para que cada item tenga identificado a que nodo pertenece.
                                                if (imgNodo != null && imgNodo != undefined) {
                                                    imgNodo.setAttribute('data-encabezado', encabezado);
                                                }
                                            }
                                        }
                                    }
                                }
                            }//FIN: Ifs validar nodos vacios.

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

            //Limita la cantidad de items visible en la paginacion a 5, para no hacer mas amplia la pantalla.
            $.fn.DataTable.ext.pager.numbers_length = 5;

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
                        first: ">>",
                        previous: "<",
                        next: ">",
                        last: ">>"
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
*/
function MostrarPopUp(e) {
    try {
        //Esta funcion evita que la pantalla se mueva hacia el TOP, cuando se hacer click en una
        //imagen y se muestra el Modal (evento ajax).
        // event.preventDefault(); //-> Se debe utilizar, solamente si el enlace tiene una referencia vacia. EJEM: href="#"

        //Toma el valor del tag "alt" y lo coloca en el texto del POPUP. (el texto del alt tag, es igual al codigo del articulo, valor obtenido de firebase).
        $('.tituloIncrustado').text("Código: " + $(e).find('img').attr('alt'));
        $('.imagenIncrustada').attr('src', $(e).find('img').attr('src'));

        document.querySelector('.imagenIncrustada').setAttribute('alt', $(e).find('img').attr('alt')); //Asigna el codigo del articulo, al atributo de la imagen "alt".
        document.querySelector('.imagenIncrustada').setAttribute('data-encabezado', $(e).find('img').attr('data-encabezado')); //Asigna el atributo que guarda el encabezado.

        $('#modalImagen').modal('show');

    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}//FIN: MostrarPopUp

//Escribe un mensaje en Analytics, cuando se haga un click en la zona de enviar mensaje por Email.
function SolicitarCatalogoEmail() {
    try {
        let itemID = document.querySelector('.imagenIncrustada').getAttribute('alt');
        let itemEncabezado = document.querySelector('.imagenIncrustada').getAttribute('data-encabezado');

        let asunto = "Solicitid de artículo -> Sección: " + itemEncabezado + ". ID: " + itemID;
        let mensaje = "Hola, quisiera solicitar el artículo: " + itemID + ", de la sección: " + itemEncabezado + ".";
        let url = "mailto:fotos-rodriguez@hotmail.com?subject=" + asunto + "&body=" + mensaje;
        window.location.href = url;

        uEscribirEventoAccion("Click solicitud catalogo gruadacion email; ID:" + itemID + "; Ecabezado:" + itemEncabezado)
    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}//FIN: SolicitarCatalogoEmail

//Escribe un mensaje en Analytics, cuando se haga un click en la zona de enviar mensaje por whatsapp.
function SolicitarCatalogoWhatsapp() {
    try {
        let itemID = document.querySelector('.imagenIncrustada').getAttribute('alt');
        let itemEncabezado = document.querySelector('.imagenIncrustada').getAttribute('data-encabezado');
        let mensaje = "Hola, quisiera solicitar el artículo: *" + itemID + "*, de la sección: *" + itemEncabezado + "*.";

        let numTelefono = "50689788992";

        /*The \s meta character in JavaScript regular expressions matches any whitespace character: spaces, tabs, newlines and Unicode spaces.
        And the g flag tells JavaScript to replace it multiple times. If you miss it, it will only replace the first occurrence of the white space*/
        let mensajeFormato = mensaje.replace(/\s/g, '%20');

        let url = "https://wa.me/" + numTelefono + "?text=" + mensajeFormato;
        window.open(url, '_blank');

        uEscribirEventoAccion("Click solicitud catalogo gruadacion whatsapp; ID:" + itemID + "; Ecabezado:" + itemEncabezado);
    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}//FIN: SolicitarCatalogoWhatsapp