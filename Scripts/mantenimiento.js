//Nombre de constantes: nombre de colecciones (padre de tablas)
const COLECCION_CATALOGO = 'catalogo';

$(document).ready(function () {
    ConsultaUsarioActivo();

    //Cargas de la BD.
    IniciarFirebase();
});

//FUNCION: inicializa la carga de datos de la base de datos.
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
        var ref = database.ref(COLECCION_CATALOGO);
        ref.on('value', gotData, errData);

        //Funcion para obtener el JSON de la base de datos, para el parametro "catalogo"
        function gotData(data) {

            //Obtiene el objecto JSON, solamente con los datos de la tabla "catalogo"
            let arregloJson = data.val();

            //Para los ID (keys) del arreglo, se hace de la siguiente manera:
            // for (let item of arregloJson) {
            //     var keys = Object.keys(item.portatituloMayores);
            //     console.log(keys);
            // }

            //Solo envia los dos arreglos: codigo y imagen.
            // CargarCatalogo(arregloJson); //F: Agregar la carga de las tablas
        }

        function errData(err) {
            console.error("Error al leer DB firebase: ->");
            console.error(err);
        }

    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}

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
                let uid = user.uid;
                let providerData = user.providerData;
                //Can use the vars for wharever you want.

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