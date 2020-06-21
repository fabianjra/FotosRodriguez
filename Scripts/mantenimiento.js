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

$(document).ready(function () {
    ConsultaUsarioActivo();

    //Cargas de la BD.
    IniciarFirebase();
});

//FUNCION: Consulta las credenciales del usuario activo.
function ConsultaUsarioActivo() {
    try {
        var existeUserActivo = false;

        let firebaseConfig = uCargarCredencialesFirebase();

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        //If user is no active, go to the initial page
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                let displayName = user.displayName;
                let email = user.email;
                let emailVerified = user.emailVerified;
                let photoURL = user.photoURL;
                let isAnonymous = user.isAnonymous;
                let uid = user.uid; //Id del usuario
                let providerData = user.providerData;

                //Asigna el email del usuario logueado al label en pantalla.
                document.getElementById("lblNombreUsuario").innerHTML = "<b>Usuario:</b> " + email;

                existeUserActivo = true;
            } else {
                // User is signed out.
                window.location = "iniciarsesion.html";
            }
        });

        return Boolean(existeUserActivo);
    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}

//Consulta la BD almacenada en Firebase y la descarga como un archivo Json de una sola hilera.
//Se llama mediante el click del boton de la pagina de descargar copia de seguridad.
function DescargarDB() {
    try {
        //Permite descargar la BD solamente si existe un usuario activo.
        let existeUsuarioActivo = Boolean(ConsultaUsarioActivo);

        if (existeUsuarioActivo) {

            let rootRef = firebase.database().ref(); // Ref to database root

            rootRef.once("value", function (snapshot) {
                var stringJsonDB = JSON.stringify(snapshot.val());

                let fechaActual = uObtenerFechaHoraActual('-', '.');
                let nombreArchivo = "RespaldoFotosRodriguez_" + fechaActual;

                uDescargarArchivo(stringJsonDB, nombreArchivo, 'json');

                let mensajeEvento = "Se descargo un respaldo de la BD";
                uEscribirEventoAccion(mensajeEvento)
            });
        }
    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}//FIN: DescargarDB

//FUNCION: Borra la "Bases de datos indexadas", para que no siga almacenando la sesion activa del usuario.
//         Despues de borrar la BDIndex, redirige al login.
function CerrarSesion() {
    try {
        localStorage.clear();
        sessionStorage.clear();

        window.indexedDB.databases().then((r) => {
            for (var i = 0; i < r.length; i++) window.indexedDB.deleteDatabase(r[i].name);
        }).then(() => {
            // User is signed out.
            window.location = "iniciarsesion.html";
        });

    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}//FIN: CerrarSesion

//FUNCION: inicializa la carga de datos de la base de datos.
//Carga los codigos y los URLs de las imagenes, mediante JSON en firebase
function IniciarFirebase() {
    try {
        var firebaseConfig = uCargarCredencialesFirebase();

        // Initialize Firebase, en caso de que no este ya actualmente inicializado.
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        //Instancia de la conexion a la base de datos
        var firebaseDB = firebase.database().ref(COLECCION_CATALOGO);

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

                        //contador para cada item de cada tabla. ejem: porta -> 0,1,2... || cintas -> 0,1,2...
                        let contadorPorTabla = 0;

                        //recorrer la tabla por cada fila.
                        tabla.forEach(function (fila) {

                            //Obtiene la fila, como un arreglo de JSON con los valores.
                            let item = fila.val();

                            //Instancia del tag al que se le van a cargar los datos del Json
                            //Por parametro, el nombre del ID del tag, en la pagina de precios
                            let resTag = document.querySelector(itemListaTabla.id);

                            //Se convierte el objecto del item JSON a string, para almacenarlo en el boton como "data-objecto"
                            let objetoItemString = encodeURIComponent(JSON.stringify(item));

                            //Con comillas especiales, para mesclar con codigo HTML
                            resTag.innerHTML += `
                                <tr>
                                    <td class="text-center align-middle">${item.codigo}</td>

                                    <td class="text-center">
                                        <a href="#" onclick="MostrarPopUp(this)">
                                            <img id="imagenPortatitulo" src="${item.imagen}" class="img-fluid img-thumbnail" alt="${item.codigo}">
                                        </a>
                                    </td>
                                    
                                    <td class="text-center align-middle">
                                        <button class="btn btn-info btn-warning"
                                        data-index="${contadorPorTabla}" data-tabla="${itemListaTabla.nombre}" data-objeto="${objetoItemString}"
                                        onclick="ModificarPortatitulo(this)">Modificar</button>
                                    </td>

                                    <td class="text-center align-middle">
                                        <button class="btn btn-info btn-danger">Eliminar</button>
                                    </td>
                                </tr>`

                            //Se suma uno al contador, para que al siguiente item, se le asigne correctamente el index que le corresponde.
                            contadorPorTabla++;

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

            IniciarDataTable();

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

function IniciarDataTable() {

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
                first: "Primero",
                previous: "Anterior",
                next: "Siguiente",
                last: "Ultimo"
            },
            aria: {
                sortAscending: ": active para ordenar la columna en orden ascendente",
                sortDescending: ": active para ordenar la columna en orden descendente"
            },
        },
        lengthMenu: [[5, 10, 20, -1], [5, 10, 20, "Todos"]]
    });
}

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

//FUNCION: Escucha el click del boton de modificar de las tablas.
function ModificarPortatitulo(pBoton) {
    try {
        //Se obtiene el String del objeto seleccionado, se decodifica y se parsea a JSON para ser manipulable.
        let objectoString = pBoton.getAttribute('data-objeto');
        let objetoItem = JSON.parse(decodeURIComponent(objectoString));

        let urlItem = objetoItem.imagen;
        let codigoItem = objetoItem.codigo;

        //Se obtiene el index del item y la tabla a la que pertenece.
        let indexItem = pBoton.getAttribute('data-index');
        let tablaItem = pBoton.getAttribute('data-tabla');

        // console.log(objetoItem);
        // console.log(indexItem);
        // console.log(tablaItem);

        //Asigna al PopUp, los textos del item seleccionado.
        $('#lblCodigoItemTitulo').text("Código: " + codigoItem);

        $('#txtCodigoItem').val(codigoItem);
        $('#txtUrlItem').val(urlItem);
        $('#modalModificar').modal('show');

        //Se borra el atributo "data-" para volver a ser asignado.
        //Se asigna el objeto al boton de aceptar, como un string (originalmente obtenido).
        document.querySelector('#btnModificarAceptar').removeAttribute('data-objeto');
        document.querySelector('#btnModificarAceptar').setAttribute('data-objeto', objectoString);

        document.querySelector('#btnModificarAceptar').removeAttribute('data-index');
        document.querySelector('#btnModificarAceptar').setAttribute('data-index', indexItem);

        document.querySelector('#btnModificarAceptar').removeAttribute('data-tabla');
        document.querySelector('#btnModificarAceptar').setAttribute('data-tabla', tablaItem);


        // var ref = firebase.database().ref('catalogo/portatituloMayores');

        // ref.on('value', function (snapshot) {
        //     snapshot.forEach(function (childSnapshot) {
        //         var childData = childSnapshot.val();

        //         console.log(childData);
        //     });
        // })



        // var leadsRef = firebase.database().ref(COLECCION_CATALOGO);

        // leadsRef.on('value', function (snapshot) {
        //     snapshot.forEach(function (childSnapshot) {
        //         var childData = childSnapshot.val();

        //         console.log(childData);
        //     });
        // });






        // let codigo = "PC-01";

        // firebase.database().ref(COLECCION_CATALOGO).child("portatituloMayores").orderByChild("codigo").equalTo("PC-01").once("value", function (snapshot) {
        //     snapshot.forEach(function (childSnapshot) {

        //         console.log(childSnapshot.val());

        //         var cellNum = childSnapshot.val().CellNum;

        //         console.log(cellNum);
        //     });
        // });








    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}//FIN: ModificarPortatitulo

//Escucha al boton de aceptar modificar del modal, al seleccionar un item para modificarlo.
function ModificarAceptarItem(pBoton) {
    try {

        //document.getElementById('lblError').value = ""; //F: TODO

        let txtCodigo = document.getElementById('txtCodigoItem').value;
        let txtUrlImagen = document.getElementById('txtUrlItem').value;

        //Validar que el codigo o el url de la imagen, no esten vacios.
        if (uTrim(txtCodigo) == "" || uTrim(txtUrlImagen) == "") {
            //document.getElementById('lblError').innerHTML = "Se deben ingresar los campos"; //F: TODO
        } else {

            //Otra forma de obtner el valor de "data-"
            //const ejemplo = pBoton.dataset.objeto;

            //Se obtiene el String del objeto seleccionado, se decodifica y se parsea a JSON para ser manipulable.
            let objectoString = pBoton.getAttribute('data-objeto');
            let objetoItem = JSON.parse(decodeURIComponent(objectoString));

            let urlItem = objetoItem.imagen;
            let codigoItem = objetoItem.codigo;

            //Se obtiene el index del item y la tabla a la que pertenece.
            let indexItem = pBoton.getAttribute('data-index');
            let tablaItem = pBoton.getAttribute('data-tabla');

            var ref = firebase.database().ref(COLECCION_CATALOGO).child(tablaItem).child(indexItem);

            ref.on('value', function (item) {

                //Actualizar el item seleccionado
                item.ref.update({
                    codigo: txtCodigo,
                    imagen: txtUrlImagen
                })
            },
                function (errorObject) {
                    console.log("No se pudo actualizar el item seleccionado: " + errorObject.code);
                });

            // ref.once('value')
            //     .then(function (items) {
            //         console.log(items.val());
            //     })




            // ref.once('value', (snapshot) => {
            //     const updates = {};
            //     snapshot.forEach((child) => {
            //         const userKey = child.key;
            //         const userObject = child.val();
            //         updates[`${userKey}/fieldWhichYouWantToUpdate`] = `Field Value you want it to set to`;
            //         firebase.database().ref('/users/').update(updates);
            //     });
            // })

        }//FIN IF: Validar que el codigo o el url de la imagen, no esten vacios.
    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}

// ************************ SIN USO *********************** //

function CargarCatalogoViejo(arregloJson) {
    try {
        //Recorrido total del Json filtrado
        for (let item of arregloJson) {

            //Carga de portatituloMayores, se llenan los tags
            if (item.portatituloMayores != null) {
                if (item.portatituloMayores.length > 0) {

                    //Instancia del tag al que se le van a cargar los datos del Json
                    //Por parametro, el nombre del ID del tag, en la pagina
                    let resTag = document.querySelector('#resPortatitulosMayores');
                    resTag.innerHTML = '';

                    for (let index of item.portatituloMayores) {
                        //Con comillas especiales, para mesclar con codigo HTML
                        resTag.innerHTML += `
                    <tr>
                        <td class="text-center align-middle">${index.codigo}</td>
                        <td class="text-center">
                            <a href="#" onclick="MostrarPopUp(this)">
                                <img id="imagenPortatitulo" src="${index.imagen}" class="img-fluid img-thumbnail" alt="${index.codigo}">
                            </a>
                        </td>
                        <td class="text-center align-middle">
                        <button class="btn btn-info btn-warning" data-url="${index.imagen}" data-codigo="${index.codigo}" data-objeto="${index}" onclick="ModificarPortatitulo(this)">Modificar</button>
                        </td>

                        <td class="text-center align-middle">
                        <button class="btn btn-info btn-danger">Eliminar</button>
                        </td>
                    </tr>`
                    }
                }
            }//FIN: IF

            //Carga de portatituloMenores, se llenan los tags
            // if (item.portatituloMenores != null) {
            //     if (item.portatituloMenores.length > 0) {

            //         //Instancia del tag al que se le van a cargar los datos del Json
            //         //Por parametro, el nombre del ID del tag, en la pagina
            //         let resTag = document.querySelector('#resPortatitulosMenores');
            //         resTag.innerHTML = '';

            //         for (let index of item.portatituloMenores) {
            //             //Con comillas especiales, para mesclar con codigo HTML
            //             resTag.innerHTML += `
            //     <tr>
            //         <td class="text-center align-middle">${index.codigo}</td>
            //         <td class="text-center w-50">
            //             <a href="#" onclick="MostrarPopUp(this)">
            //                 <img src="${index.imagen}" class="img-fluid img-thumbnail" alt="${index.codigo}">
            //             </a>
            //         </td>
            //     </tr>`
            //         }
            //     }
            // }//FIN: IF

            //Carga de cintas mayores.
            if (item.cintaMayores != null) {
                if (item.cintaMayores.length > 0) {

                    //Instancia del tag al que se le van a cargar los datos del Json
                    //Por parametro, el nombre del ID del tag, en la pagina de precios
                    let resTag = document.querySelector('#resCintasMayores');
                    resTag.innerHTML = '';

                    for (let index of item.cintaMayores) {
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
                }
            }//FIN: IF

            //Carga de cintas menores.
            if (item.cintaMenores != null) {
                if (item.cintaMenores.length > 0) {

                    //Instancia del tag al que se le van a cargar los datos del Json
                    //Por parametro, el nombre del ID del tag, en la pagina de precios
                    let resTag = document.querySelector('#resCintasMenores');
                    resTag.innerHTML = '';

                    for (let index of item.cintaMenores) {
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
                }
            }//FIN: IF

            //Carga de cintas Estola.
            if (item.cintaEstola != null) {
                if (item.cintaEstola.length > 0) {

                    //Instancia del tag al que se le van a cargar los datos del Json
                    //Por parametro, el nombre del ID del tag, en la pagina de precios
                    let resTag = document.querySelector('#resCintasEstola');
                    resTag.innerHTML = '';

                    for (let index of item.cintaEstola) {
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
                }
            }//FIN: IF

            //Carga de diarios.
            if (item.diario != null) {
                if (item.diario.length > 0) {

                    //Instancia del tag al que se le van a cargar los datos del Json
                    //Por parametro, el nombre del ID del tag, en la pagina de precios
                    let resTag = document.querySelector('#resDiarios');
                    resTag.innerHTML = '';

                    for (let index of item.diario) {
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
                }
            }//FIN: IF

            //Carga de invitaciones.
            if (item.invitacion != null) {
                if (item.invitacion.length > 0) {

                    //Instancia del tag al que se le van a cargar los datos del Json
                    //Por parametro, el nombre del ID del tag, en la pagina de precios
                    let resTag = document.querySelector('#resInvitaciones');
                    resTag.innerHTML = '';

                    for (let index of item.invitacion) {
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
                }
            }//FIN: IF

            //Carga de invitaciones.
            if (item.banderin != null) {
                if (item.banderin.length > 0) {

                    //Instancia del tag al que se le van a cargar los datos del Json
                    //Por parametro, el nombre del ID del tag, en la pagina de precios
                    let resTag = document.querySelector('#resBanderines');
                    resTag.innerHTML = '';

                    for (let index of item.banderin) {
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

    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}//FIN: METODO = CargarCatalogo