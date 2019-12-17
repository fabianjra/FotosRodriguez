$(document).ready(function () {

    ConsultarPreciosArticulos();

});

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
                }

                if (item.retablo.length > 0) {

                    //Instancia del tag al que se le van a cargar los datos del Json
                    let resTag = document.querySelector('#resPreciosRetablos');
                    resTag.innerHTML = '';

                    for (let index of item.retablo) {
                        resTag.innerHTML += `
                            <tr>
                                <td class="text-center">${index.tamano}</td>
                                <td class="text-center">¢${index.precio}</td>
                            </tr>`
                    }
                }
            }

        }








    }
}