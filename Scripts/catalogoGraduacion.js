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
        var database = firebase.database();

        //Se consulta la coleccion "catalogo", para obtener ambos arreglos (portatitulo[], cinta[])
        var ref = database.ref('catalogo');
        ref.on('value', gotData, errData);

        //Funcion para obtener el JSON de la base de datos, para el parametro "catalogo"
        function gotData(data) {

            //Obtiene el objecto JSON, solamente con los datos de la tabla "catalogo"
            let arregloJson = data.val();

            //Para los ID (keys) del arreglo, se hace de la siguiente manera:
            // var keys = Object.keys(datosJSON);
            // console.log(keys);

            //Solo envia los dos arreglos: codigo y imagen.
            CargarCatalogo(arregloJson);
        }

        function errData(err) {
            console.error("Error al leer DB firebase: ->");
            console.error(err);
        }

    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}

function CargarCatalogo(arregloJson) {
    try {
        //Recorrido total del Json filtrado
        for (let item of arregloJson) {

            //Si existen items de portatitulos, se llenan los tags
            if (item.portatitulo.length > 0) {

                //Instancia del tag al que se le van a cargar los datos del Json
                //Por parametro, el nombre del ID del tag, en la pagina
                let resTag = document.querySelector('#resPortatitulos');
                resTag.innerHTML = '';

                for (let index of item.portatitulo) {
                    //Con comillas especiales, para mesclar con codigo HTML
                    resTag.innerHTML += `
                <tr>
                    <td class="text-center align-middle">${index.codigo}</td>
                    <td class="text-center w-50">
                        <a href="#" onclick="MostrarPopUp(this)">
                            <img src="${index.imagen}" class="img-fluid img-thumbnail" alt="${index.codigo}">
                        </a>
                    </td>
                </tr>`
                }
            }//FIN: IF

            if (item.cinta.length > 0) {

                //Instancia del tag al que se le van a cargar los datos del Json
                //Por parametro, el nombre del ID del tag, en la pagina de precios
                let resTag = document.querySelector('#resCintas');
                resTag.innerHTML = '';

                for (let index of item.cinta) {
                    resTag.innerHTML += `
                <tr>
                    <td class="text-center align-middle">${index.codigo}</td>
                    <td class="text-center w-50">
                    <a href="#" onclick="MostrarPopUp(this)">
                        <img src="${index.imagen}" class="img-fluid img-thumbnail" alt="${index.codigo}">
                    </a>
                </td>
                </tr>`
                }
            }//FIN: IF
        }//FIN: FOR = recorrido del JSON

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
                zeroRecords: "No se encontraron datos con tu busqueda",
                emptyTable: "No hay datos disponibles en la tabla.",
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

    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}//FIN: METODO = CargarCatalogo

//Esta funcion toma la imagen a la que se le hace un click,
//luego toma la etiqueta de imagen y le agrega al source, la imagen que se seleccionó.
//Finalmente muestra el modal.
//El modal tiene un boton para cerrar el modal.
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
}