//Este archivo se carga solamente en la pagina de precios articulos, para cargar mediante un archivo JSON los precios
//de los articulos que se tienen ahi, y se cargan en una tabla HTML de la pagina de precios articulos.
$(document).ready(function () {
    IniciarFirebase();
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
        var database = firebase.database();

        //Se consulta la coleccion "precios", para obtener ambos arreglos (foto[], ratablo[])
        var ref = database.ref('precios');
        ref.on('value', gotData, errData);

        //Funcion para obtener el JSON de la base de datos, para el parametro "precios"
        function gotData(data) {

            //Obtiene el objecto JSON, solamente con los datos de la tabla "precios"
            let arregloJson = data.val();

            //Para los ID (keys) del arreglo, se hace de la siguiente manera:
            // var keys = Object.keys(datosJSON);
            // console.log(keys);

            //Solo envia los dos arreglos: fotos y retablos (ambos en la posicion 0 de la tabla 'precios').
            CargarPrecios(arregloJson);
        }

        function errData(err) {
            console.log("Error al leer DB firebase: ->");
            console.log(err);
        }

    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}//FIN: CredencialesFirebase

function CargarPrecios(arregloJson) {
    try {
        //Recorrido total del Json para obtener los precios de los articulos
        for (let item of arregloJson) {

            //Si existen precios de fotos, los llena en la tabla. Sino, se debe ocultar
            if (item.foto.length > 0) {

                //Instancia del tag al que se le van a cargar los datos del Json
                //Por parametro, el nombre del ID del tag, en la pagina de precios
                let resTag = document.querySelector('#resPreciosFotos');
                resTag.innerHTML = '';

                for (let index of item.foto) {
                    //Con comillas especiales, para mesclar con codigo HTML
                    resTag.innerHTML += `
                <tr>
                    <td class="text-center">${index.tamano}</td>
                    <td class="text-center">${uFormatoColon(index.precio)}</td>
                </tr>`
                }
            }//FIN: IF = Si existen items para los precios de las fotos

            if (item.retablo.length > 0) {

                //Instancia del tag al que se le van a cargar los datos del Json
                //Por parametro, el nombre del ID del tag, en la pagina de precios
                let resTag = document.querySelector('#resPreciosRetablos');
                resTag.innerHTML = '';

                for (let index of item.retablo) {
                    resTag.innerHTML += `
                <tr>
                    <td class="text-center">${index.tamano}</td>
                    <td class="text-center">${uFormatoColon(index.precio)}</td>
                </tr>`
                }
            }//FIN: IF = Si existen items para los precios de los retablos
        }//FIN: FOR = recorrido del JSON

    } catch (ex) {
        uEscribirError(arguments, ex);
    }
}//FIN: METODO = CargarPrecios



// ************************ SIN USO *********************** //

//Este metodo lee un archivo JSON, mediante XMLHttpRequest.
//Con un FOR se recorre cada arreglo del JSON, para asignarlo a los campos de la tabla en el HTML
function ConsultarPreciosArticulos() {

    const xhttp = new XMLHttpRequest();

    //1: Tipo de consulta
    //2: Nombre del archivo
    //3: Si es asincrono o no.
    xhttp.open('GET', '../preciosArticulos.json', true);

    xhttp.send();

    xhttp.onreadystatechange = function () {
        //Se valida que la consulta este finalizada
        if (this.readyState == 4 && this.status == 200) {

            //Convertir Texto a formato Json
            let arregloJson = JSON.parse(this.responseText);

            //Recorrido total del Json para obtener los precios de los articulos
            for (let item of arregloJson.precios) {

                //Si existen precios de fotos, los llena en la tabla. Sino, se debe ocultar
                if (item.foto.length > 0) {

                    //Instancia del tag al que se le van a cargar los datos del Json
                    //Por parametro, el nombre del ID del tag, en la pagina de precios
                    let resTag = document.querySelector('#resPreciosFotos');
                    resTag.innerHTML = '';

                    for (let index of item.foto) {
                        //Con comillas especiales, para mesclar con codigo HTML
                        resTag.innerHTML += `
                            <tr>
                                <td class="text-center">${index.tamano}</td>
                                <td class="text-center">¢${index.precio}</td>
                            </tr>`
                    }
                }//FIN: IF = Si existen items para los precios de las fotos

                if (item.retablo.length > 0) {

                    //Instancia del tag al que se le van a cargar los datos del Json
                    //Por parametro, el nombre del ID del tag, en la pagina de precios
                    let resTag = document.querySelector('#resPreciosRetablos');
                    resTag.innerHTML = '';

                    for (let index of item.retablo) {
                        resTag.innerHTML += `
                            <tr>
                                <td class="text-center">${index.tamano}</td>
                                <td class="text-center">¢${index.precio}</td>
                            </tr>`
                    }
                }//FIN: IF = Si existen items para los precios de los retablos
            }//FIN: FOR = recorrido del JSON
        }//FIN: Result 200
    }//FIN: onreadystatechange
}//FIN: Function: ConsultarPreciosArticulos