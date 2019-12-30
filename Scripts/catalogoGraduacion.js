// $(document).ready(function () {

// });

//Esta funcion toma la imagen a la que se le hace un click,
//luego toma la etiqueta de imagen y le agrega al source, la imagen que se seleccionó.
//Finalmente muestra el modal.
//El modal tiene un boton para cerrar el modal.
$(function () {
    $('.mostrarImagenPopUp').on('click', function ($e) {

        //Esta funcion evita que la pantalla se mueva hacia el TOP, cuando se hacer click en una
        //imagen y se muestra el Modal.
        $e.preventDefault();

        $('.tituloIncrustado').text("Código: " + $(this).find('img').attr('alt'));
        $('.imagenIncrustada').attr('src', $(this).find('img').attr('src'));
        $('#modalImagen').modal('show');
    })
});